// Command playground runs a TinyGo compiler as an API that can be used from a
// web application.
package main

// This file implements the HTTP frontend.

import (
	"compress/gzip"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf16"
)

const (
	cacheTypeLocal = iota + 1 // Cache to a local directory
	cacheTypeGCS              // Google Cloud Storage
)

var (
	// The channel to submit compile jobs to.
	compilerChan chan compilerJob

	// The cache directory where cached wasm files are stored.
	cacheDir string

	// The cache type: local or Google Cloud Storage.
	cacheType int
)

func main() {
	// Create a build cache directory.
	userCacheDir, err := os.UserCacheDir()
	if err != nil {
		log.Fatalln("could not find temporary directory:", err)
	}
	cacheDir = filepath.Join(userCacheDir, "tinygo-playground")
	err = os.MkdirAll(cacheDir, 0777)
	if err != nil {
		log.Fatalln("could not create temporary directory:", err)
	}

	dir := flag.String("dir", ".", "which directory to serve from")
	cacheTypeFlag := flag.String("cache-type", "local", "cache type (local, gcs)")
	flag.Parse()

	switch *cacheTypeFlag {
	case "local":
		cacheType = cacheTypeLocal
	default:
		log.Fatalln("unrecognized cache type:", *cacheTypeFlag)
	}

	// Start the compiler goroutine in the background, that will serialize all
	// compile jobs.
	compilerChan = make(chan compilerJob)
	go backgroundCompiler(compilerChan)

	// Run the web server.
	http.HandleFunc("/api/fmt", handlerGofumpt)
	http.HandleFunc("/api/compile", handleCompile)
	http.Handle("/", addHeaders(http.FileServer(http.Dir(*dir))))
	fmt.Println("Server Up")
	log.Print("Serving " + *dir + " on http://localhost:18003")
	log.Fatal(http.ListenAndServe(":18003", nil))
	//log.Fatal(http.ListenAndServeTLS(":18003", "/etc/letsencrypt/live/configurator.gopherbadge.com/fullchain.pem", "/etc/letsencrypt/live/configurator.gopherbadge.com/privkey.pem", nil))
	fmt.Println("Server Down")
}

func addHeaders(fs http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Add headers that enable greater accuracy of performance.now() in
		// Firefox.
		w.Header().Add("Cross-Origin-Opener-Policy", "same-origin")
		w.Header().Add("Cross-Origin-Embedder-Policy", "require-corp")

		fs.ServeHTTP(w, r)
	}
}

// handleCompile handles the /api/compile API endpoint. It first tries to serve
// from a cache and if that fails, compiles the submitted source code directly.
func handleCompile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	var source []byte
	if strings.HasPrefix(r.Header.Get("Content-Type"), "text/plain") {
		// Read the source from the POST request.
		var err error
		source, err = ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusUnprocessableEntity)
			return
		}
	} else {
		// Read the source from a form parameter.
		source = []byte(r.FormValue("code"))
	}
	// Hash the source code, used for the build cache.
	sourceHashRaw := sha256.Sum256([]byte(source))
	sourceHash := toBinary(string(sourceHashRaw[:])) //hex.EncodeToString(sourceHashRaw[:])

	format := r.FormValue("format")
	switch format {
	case "", "wasm":
		// Run code in the browser.
		format = "wasm"
	case "elf", "hex", "uf2":
		// Build a firmware that can be flashed directly to a development board.
	default:
		// Unrecognized format. Disallow to be sure (might introduce security
		// issues otherwise).
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Attempt to serve directly from the directory with cached files.
	filename := filepath.Join(cacheDir, "build-"+r.FormValue("target")+"-"+sourceHash+"."+format)
	fp, err := os.Open(filename)
	if err == nil {
		// File was already cached! Serve it directly.
		defer fp.Close()
		sendCompiledResult(w, fp, format)
		return
	}

	// Create a new compiler job, which will be executed in a single goroutine
	// (to avoid overloading the system).
	job := compilerJob{
		Source:       source,
		SourceHash:   sourceHash,
		Target:       r.FormValue("target"),
		Format:       format,
		Context:      r.Context(),
		ResultFile:   make(chan string),
		ResultErrors: make(chan []byte),
	}
	// Send the job for execution.
	compilerChan <- job
	// See how well that went, when it finishes.
	select {
	case filename := <-job.ResultFile:
		// Succesful compilation.
		fp, err := os.Open(filename)
		if err != nil {
			log.Println("could not open compiled file:", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer fp.Close()
		sendCompiledResult(w, fp, format)
	case buf := <-job.ResultErrors:
		// Failed compilation.
		w.Write(buf)
	}
}

// sendCompiledResult streams a wasm file while gzipping it during transfer.
func sendCompiledResult(w http.ResponseWriter, fp *os.File, format string) {
	switch format {
	case "wasm":
		w.Header().Set("Content-Type", "application/wasm")
	default:
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Disposition", "attachment; filename=firmware."+format)
	}
	w.Header().Set("Content-Encoding", "gzip")
	gw := gzip.NewWriter(w)
	_, err := io.Copy(gw, fp)
	if err != nil {
		log.Println("could not read compiled file:", err)
		return
	}
	gw.Close()
}

func handlerInfo(w http.ResponseWriter, r *http.Request) {
	fmt.Println("INFO", r)
	fmt.Fprintf(w, jsonResponse("Server is up", 0, ""))
}

func handlerGofumpt(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	body, err := io.ReadAll(r.Body)
	if err != nil {
		report(err)
	}

	body = fromBinary(string(body))
	res, err := processInput(body, true)
	if err != nil {
		report(err)
	}
	fmt.Fprintf(w, jsonResponse("ok", 0, toBinary(res)))
}

func jsonResponse(msg string, err int, code string) string {
	var r Response
	r.Msg = msg
	r.Error = err
	r.Code = code
	j, _ := json.Marshal(r)
	return string(j)
}

func toBinary(input string) string {
	codeUnits := utf16.Encode([]rune(input))
	bytes := make([]byte, len(codeUnits)*2)
	for i, codeUnit := range codeUnits {
		bytes[i*2] = byte(codeUnit)
		bytes[i*2+1] = byte(codeUnit >> 8)
	}
	return base64.StdEncoding.EncodeToString(bytes)
}

func fromBinary(encoded string) []byte {
	bytes, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		panic(err)
	}

	codeUnits := make([]uint16, len(bytes)/2)
	for i := 0; i < len(codeUnits); i++ {
		codeUnits[i] = uint16(bytes[i*2]) | (uint16(bytes[i*2+1]) << 8)
	}

	return []byte(string(utf16.Decode(codeUnits)))
}
