/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.NetHTTP');

import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';

export function nethttp_handlefunc(block, generator) {
    generatorimports_['nethttp'] = 'net/http';
    const route = block.getFieldValue('ROUTE');

    let code = '';
    const branchCode = generatorstatementToCode(block, 'GR0');

    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = '\nhttp.HandleFunc("' + route + '", func(w http.ResponseWriter, req *http.Request) {\n' + branchCode + '\n})\n';
    } else {
        code = '\nhttp.HandleFunc("' + route + '", ' + branchCode + ')\n';
    }

    return code;
};

export function nethttp_write_response(block, generator) {
    generatorimports_['nethttp'] = 'net/http';
    var msg = generatorvalueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return '\nw.Write([]byte(' + msg + '))\n';
};

export function nethttp_cf_newkv(block, generator) {
    generatorimports_['github.com/syumai/workers/cloudflare'] = 'github.com/syumai/workers/cloudflare';
    var msg = generatorvalueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return '\nkv, _ := cloudflare.NewKVNamespace(' + msg + ')\n';
};

export function nethttp_cf_kvgetstring(block, generator) {
    generatorimports_['github.com/syumai/workers/cloudflare'] = 'github.com/syumai/workers/cloudflare';
    var msg = generatorvalueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    return 'kv.GetString(' + msg + ', nil)\n';
};

export function nethttp_cf_kvputstring(block, generator) {
    generatorimports_['github.com/syumai/workers/cloudflare'] = 'github.com/syumai/workers/cloudflare';
    var key = generatorvalueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';

    var value = generatorvalueToCode(block, 'TEXT2',
        Order.NONE) || '\'\'';

    return 'kv.PutString(' + key + ', ' + value + ', nil)\n';
};


export function nethttp_cf_serve(block, generator) {
    generatorimports_['github.com/syumai/workers'] = 'github.com/syumai/workers';

    return '\nworkers.Serve(nil)\n';
};