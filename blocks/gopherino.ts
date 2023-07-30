/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.Gopherino');

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
        "type": "gopherino_move",
        "message0": "%2 Move %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    [
                        "Forward",
                        "Forward",
                    ],
                    [
                        "Backward",
                        "Backward",
                    ],
                    [
                        "Right",
                        "Right",
                    ],
                    [
                        "Left",
                        "Left",
                    ],
                    [
                        "Spin right",
                        "SpinRight",
                    ],
                    [
                        "Spin left",
                        "SpinLeft",
                    ],
                    [
                        "Stop",
                        "Stop",
                    ],
                ],
            },
            {
                "type": "field_image",
                "src": "./img/gopherino.png",
                "width": 32,
                "height": 32,
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "",
        "helpUrl": "",
    },
    {
        "type": "gopherino_hcsr04_readdistance",
        "message0": "%1 HC-SR04 read distance",
        "args0": [
            {
                "type": "field_image",
                "src": "./img/hcsr04.png",
                "width": 32,
                "height": 32,
            },
        ],
        "output": "Number",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
]);

defineBlocks(blocks);