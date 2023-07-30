/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.GopherBot');

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
        "type": "gopherbot_antenna",
        "message0": "antenna %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "STATE",
                "options": [
                    [
                        "ON",
                        "On",
                    ],
                    [
                        "OFF",
                        "Off",
                    ],
                    [
                        "BLINK",
                        "Blink",
                    ],
                ],
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    },
    {
        "type": "gopherbot_visor",
        "message0": "visor mode %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    [
                        "RED",
                        "Red",
                    ],
                    [
                        "GREEN",
                        "Green",
                    ],
                    [
                        "BLUE",
                        "Blue",
                    ],
                    [
                        "CYLON",
                        "Cylon",
                    ],
                    [
                        "XMAS",
                        "Xmas",
                    ],
                ],
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    },
    {
        "type": "gopherbot_button",
        "message0": "button %1 is pushed",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BUTTON",
                "options": [
                    [
                        "LEFT",
                        "LEFT",
                    ],
                    [
                        "RIGHT",
                        "RIGHT",
                    ],
                ],
            },
        ],
        "output": "Boolean",
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    },
    {
        "type": "gopherbot_backpack",
        "message0": "backpack mode %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    [
                        "RED",
                        "Red",
                    ],
                    [
                        "GREEN",
                        "Green",
                    ],
                    [
                        "BLUE",
                        "Blue",
                    ],
                    [
                        "CYLON",
                        "Cylon",
                    ],
                    [
                        "XMAS",
                        "Xmas",
                    ],
                ],
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    }, {
        "type": "gopherbot_backpack",
        "message0": "backpack mode %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    [
                        "RED",
                        "Red",
                    ],
                    [
                        "GREEN",
                        "Green",
                    ],
                    [
                        "BLUE",
                        "Blue",
                    ],
                    [
                        "CYLON",
                        "Cylon",
                    ],
                    [
                        "XMAS",
                        "Xmas",
                    ],
                ],
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    },
    {
        "type": "gopherbot_backpack_alternate",
        "lastDummyAlign0": "RIGHT",
        "message0": "backpack alternate %1 %2",
        "args0": [
            {
                "type": "field_colour",
                "name": "COLOR1",
                "colour": "#ff0000",
            },
            {
                "type": "field_colour",
                "name": "COLOR2",
                "colour": "#00ff00",
            },
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    },
    {
        "type": "gopherbot_speaker",
        "message0": "speaker makes %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    [
                        "BLEEP",
                        "Bleep",
                    ],
                    [
                        "BLOOP",
                        "Bloop",
                    ],
                    [
                        "BLIP",
                        "Blip",
                    ],
                ],
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": "",
    },
]);

defineBlocks(blocks);