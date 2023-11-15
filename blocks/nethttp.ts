/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.NetHTTP');

import * as Extensions from '../core/extensions.js';
import type { FieldDropdown } from '../core/field_dropdown.js';
import * as xmlUtils from '../core/utils/xml.js';
import type { Block } from '../core/block.js';
import {
    createBlockDefinitionsFromJsonArray,
    defineBlocks,
} from '../core/common.js';
import '../core/field_dropdown.js';
import '../core/field_label.js';
import '../core/field_number.js';
import '../core/field_variable.js';


export const blocks = createBlockDefinitionsFromJsonArray([
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
    {
        "type": "nethttp_fermyon_init",
        "message0": "%2 On init do %1",
        "args0": [
            {
                "type": "input_statement",
                "name": "GR0",
            },
            {
                "type": "field_image",
                "src": "./img/fermyon_spin.png",
                "width": 32,
                "height": 32,
            },
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "style": "loop_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_fermyon_newkv",
        "message0": "%2 Create KV data-store with name %1",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
            },
            {
                "type": "field_image",
                "src": "./img/fermyon_spin.png",
                "width": 32,
                "height": 32,
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "loop_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_fermyon_kvget",
        "message0": "%2 Get key %1 from KV data-store",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
            },
            {
                "type": "field_image",
                "src": "./img/fermyon_spin.png",
                "width": 32,
                "height": 32,
            },
        ],
        "output": "String",
        "style": "loop_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "nethttp_fermyon_kvput",
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
                "src": "./img/fermyon_spin.png",
                "width": 32,
                "height": 32,
            },
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "style": "loop_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
]);

defineBlocks(blocks);