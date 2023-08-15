/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Ajax calls to the GoFmt Server python program.
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('GoFmtServer');

export class GoFmtServer {

  constructor() {
    console.log("GO FMT SERVER CONSTRUCTED");
  };

  /**
   * Reads JSON data from the server and forwards formatted JavaScript object.
   * @param {!string} url Location for the JSON data.
   * @param {!Function} callback Callback with JSON object or null for error.
   */
  getJson(url, callback) {
    this.sendRequest(url, 'GET', 'application/json', null, callback);
  };


  /**
   * Sends JSON data to the GoFmtServer.
   * @param {!string} url Requestor URL.
   * @param {!string} json JSON string.
   * @param {!Function} callback Request callback function.
   */
  postJson(url, json, callback) {
    this.sendRequest(url, 'POST', 'application/octet-stream', json, callback);
  };

  /**
   * Sends a request to the Ardubloockly Server that returns a JSON response.
   * @param {!string} url Requestor URL.
   * @param {!string} method HTTP method.
   * @param {!string} contentType HTTP content type.
   * @param {string} jsonObjSend JavaScript object to be parsed into JSON to send.
   * @param {!Function} cb Request callback function, takes a single input for a
   *     parsed JSON object.
   */
  sendRequest(
    url, method, contentType, jsonObjSend, cb) {
    var request = this.createRequest();

    // The data received is JSON, so it needs to be converted into the right
    // format to be displayed in the page.
    var onReady = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          var jsonObjReceived = null;
          try {
            jsonObjReceived = JSON.parse(request.responseText);
          } catch (e) {
            console.error('Incorrectly formatted JSON data from ' + url);
            throw e;
          }
          cb(jsonObjReceived);
        } else {
          // return a null element which will be dealt with in the front end
          cb(null);
        }
      }
    };

    try {
      request.open(method, url, false);
      request.setRequestHeader('Content-type', contentType);
      request.onreadystatechange = onReady;
      request.send(jsonObjSend);
    } catch (e) {
      // Nullify callback to indicate error
      cb(null);
      throw e;
    }
  };

  /** @return {XMLHttpRequest} An XML HTTP Request multi-browser compatible. */
  createRequest() {
    var request = null;
    try {
      // Firefox, Chrome, IE7+, Opera, Safari
      request = new XMLHttpRequest();
    } catch (e) {
      // IE6 and earlier
      try {
        request = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        try {
          request = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
          throw 'Your browser does not support AJAX. You will not be able to' +
          'use all of GoFmt features.';
          // request = null;
        }
      }
    }
    return request;
  };

  toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }
  
  fromBinary(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }
}
