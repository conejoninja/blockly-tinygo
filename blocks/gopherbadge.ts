/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.GopherBadge');

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
    // Block for boolean data type: true and false.
    {
        "type": "gopherbadge_button_get",
        "message0": "%2 Get button %1 status",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BUTTON",
                "options": [
                    [
                        "Up",
                        "btnUp",
                    ],
                    [
                        "Down",
                        "btnDown",
                    ],
                    [
                        "Right",
                        "btnRight",
                    ],
                    [
                        "Left",
                        "btnLeft",
                    ],
                    [
                        "A",
                        "btnA",
                    ],
                    [
                        "B",
                        "btnB",
                    ],
                ],
            },
            {
                "type": "field_image",
                "src": "./img/gopherbadge_button.png",
                "width": 32,
                "height": 32,
            },
        ],
        "output": "Boolean",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "",
        "helpUrl": "",
    },
]);

defineBlocks(blocks);