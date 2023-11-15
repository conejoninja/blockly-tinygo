/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.NetHTTP');

import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';

export function nethttp_handlefunc(block, generator) {
    generator.addImport('nethttp', 'net/http');
    const route = block.getFieldValue('ROUTE');

    let code = '';
    const branchCode = generator.statementToCode(block, 'GR0');

    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = '\nhttp.HandleFunc("' + route + '", func(w http.ResponseWriter, req *http.Request) {\n' + branchCode + '\n})\n';
    } else {
        code = '\nhttp.HandleFunc("' + route + '", ' + branchCode + ')\n';
    }

    return code;
};

export function nethttp_write_response(block, generator) {
    generator.addImport('nethttp', 'net/http');
    var msg = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return '\nw.Write([]byte(' + msg + '))\n';
};

export function nethttp_cf_newkv(block, generator) {
    generator.addImport('github.com/syumai/workers/cloudflare', 'github.com/syumai/workers/cloudflare');
    var msg = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return '\nkv, _ := cloudflare.NewKVNamespace(' + msg + ')\n';
};

export function nethttp_cf_kvgetstring(block, generator) {
    generator.addImport('github.com/syumai/workers/cloudflare', 'github.com/syumai/workers/cloudflare');
    var msg = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return 'kv.GetString(' + msg + ', nil)\n';
};

export function nethttp_cf_kvputstring(block, generator) {
    generator.addImport('github.com/syumai/workers/cloudflare', 'github.com/syumai/workers/cloudflare');
    var key = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    var value = generator.valueToCode(block, 'TEXT2',
        Order.NONE) || '\'\'';

    return 'kv.PutString(' + key + ', ' + value + ', nil)\n';
};


export function nethttp_cf_serve(block, generator) {
    generator.addImport('github.com/syumai/workers', 'github.com/syumai/workers');

    return '\nworkers.Serve(nil)\n';
};


export function nethttp_fermyon_init(block, generator) {
    generator.addImport('nethttp', 'net/http');
    generator.addImport('github.com/fermyon/spin/sdk/go/v2/http', 'spinhttp "github.com/fermyon/spin/sdk/go/v2/http"');
    const route = block.getFieldValue('ROUTE');

    let code = '';
    const branchCode = generator.statementToCode(block, 'GR0');

    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = '}\n func init() {\nspinhttp.Handle(func(w http.ResponseWriter, req *http.Request) {\n' + branchCode + '\n})\n}\nfunc empty() {\n';
    } else {
        code = '\nspinhttp.Handle(' + branchCode + ')\n';
    }

    return code;
};

export function nethttp_fermyon_newkv(block, generator) {
    generator.addImport('github.com/fermyon/spin/sdk/go/v2/kv', 'github.com/fermyon/spin/sdk/go/v2/kv');
    var msg = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return '\nstore, err := kv.OpenStore(' + msg + ')\nif err != nil {\nhttp.Error(w, err.Error(), http.StatusInternalServerError)\nreturn\n}\ndefer store.Close()\n';
};

export function nethttp_fermyon_kvget(block, generator) {
    generator.addImport('github.com/fermyon/spin/sdk/go/v2/kv', 'github.com/fermyon/spin/sdk/go/v2/kv');
    var msg = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return ['func() (string) {\n v, err := store.Get(' + msg + ')\nif err != nil {\nreturn "0"\n}\nreturn string(v)\n}()\n', 0];
};

export function nethttp_fermyon_kvput(block, generator) {
    generator.addImport('github.com/fermyon/spin/sdk/go/v2/kv', 'github.com/fermyon/spin/sdk/go/v2/kv');
    var key = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    var value = generator.valueToCode(block, 'TEXT2',
        Order.NONE) || '\'\'';

    return 'store.Set(' + key + ', []byte(' + value + '))\n';
};

