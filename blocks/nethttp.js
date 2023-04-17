/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';

goog.module('Blockly.NetHTTP');

const {createBlockDefinitionsFromJsonArray, defineBlocks} = goog.require('Blockly.common');
const { goGenerator: Go } = goog.require('Blockly.Go');


const blocks = createBlockDefinitionsFromJsonArray([
    // Block for boolean data type: true and false.
    {
        "type": "nethttp_handlefunc",
        "message0": "On route %1 do %2",
        "args0": [
            {
                "type": "field_input",
                "name": "ROUTE",
                "text": "/",
            },
            {
                "type": "input_statement",
                "name": "GR0",
            },
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_write_response",
        "message0": "Respond with %1",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_cf_newkv",
        "message0": "%2 Create KV data-store with name %1",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
            },
            {
                "type": "field_image",
                "src": "./img/cloudflare.png",
                "width": 32,
                "height": 32,
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "cf_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_cf_kvgetstring",
        "message0": "%2 Get key %1 from KV data-store",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
            },
            {
                "type": "field_image",
                "src": "./img/cloudflare.png",
                "width": 32,
                "height": 32,
            },
        ],
        "output": "Tuple2",
        "style": "cf_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_cf_kvputstring",
        "message0": "%3 Put key %1 with value %2",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
            },
            {
                'type': 'input_value',
                'name': 'TEXT2',
            },
            {
                "type": "field_image",
                "src": "./img/cloudflare.png",
                "width": 32,
                "height": 32,
            },
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "style": "cf_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_cf_serve",
        "message0": "%1 Start server",
        'args0': [
            {
                "type": "field_image",
                "src": "./img/cloudflare.png",
                "width": 32,
                "height": 32,
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "cf_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
]);
exports.blocks = blocks;

Go['nethttp_handlefunc'] = function (block) {
    Go.imports_['nethttp'] = 'net/http';
    const route = block.getFieldValue('ROUTE');

    let code = '';
    const branchCode = Go.statementToCode(block, 'GR0');

    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = '\nhttp.HandleFunc("' + route + '", func(w http.ResponseWriter, req *http.Request) {\n' + branchCode + '\n})\n';
    } else {
        code = '\nhttp.HandleFunc("' + route + '", ' + branchCode + ')\n';
    }

    return code;
};

Go['nethttp_write_response'] = function (block) {
    Go.imports_['nethttp'] = 'net/http';
    var msg = Go.valueToCode(block, 'TEXT',
        Go.ORDER_NONE) || '\'\'';

    return '\nw.Write([]byte(' + msg + '))\n';
};

Go['nethttp_cf_newkv'] = function (block) {
    Go.imports_['github.com/syumai/workers/cloudflare'] = 'github.com/syumai/workers/cloudflare';
    var msg = Go.valueToCode(block, 'TEXT',
        Go.ORDER_NONE) || '\'\'';

    return '\nkv, _ := cloudflare.NewKVNamespace(' + msg + ')\n';
};

Go['nethttp_cf_kvgetstring'] = function (block) {
    Go.imports_['github.com/syumai/workers/cloudflare'] = 'github.com/syumai/workers/cloudflare';
    var msg = Go.valueToCode(block, 'TEXT',
        Go.ORDER_NONE) || '\'\'';

    return 'kv.GetString(' + msg + ', nil)\n';
};

Go['nethttp_cf_kvputstring'] = function (block) {
    Go.imports_['github.com/syumai/workers/cloudflare'] = 'github.com/syumai/workers/cloudflare';
    var key = Go.valueToCode(block, 'TEXT',
        Go.ORDER_NONE) || '\'\'';

    var value = Go.valueToCode(block, 'TEXT2',
        Go.ORDER_NONE) || '\'\'';

    return 'kv.PutString(' + key + ', ' + value + ', nil)\n';
};


Go['nethttp_cf_serve'] = function (block) {
    Go.imports_['github.com/syumai/workers'] = 'github.com/syumai/workers';

    return '\nworkers.Serve(nil)\n';
};

// Register provided blocks.
defineBlocks(blocks);
//# sourceMappingURL=nethttp.js.map