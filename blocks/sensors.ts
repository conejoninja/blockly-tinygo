/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.Sensors');

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
        "type": "sensors_ds18b20_readtemperature",
        "message0": "%1 DS18B20 read temperature",
        "args0": [
            {
                "type": "field_image",
                "src": "./img/ds18b20.png",
                "width": 32,
                "height": 32,
            },
        ],
        "output": "Tuple2",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "sensors_ds18b20_requesttemperature",
        "message0": "%1 DS18B20 request temperature",
        "args0": [
            {
                "type": "field_image",
                "src": "./img/ds18b20.png",
                "width": 32,
                "height": 32,
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "sensors_ds18b20_configure",
        "message0": "%2 Configure DS18B20 on pin %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "PIN",
                "options": [
                    [
                        "D0",
                        "D0",
                    ],
                    [
                        "D1",
                        "D1",
                    ],
                    [
                        "D2",
                        "D2",
                    ],
                    [
                        "D3",
                        "D3",
                    ],
                    [
                        "D4",
                        "D4",
                    ],
                    [
                        "D5",
                        "D5",
                    ],
                    [
                        "D6",
                        "D6",
                    ],
                    [
                        "D7",
                        "D7",
                    ],
                    [
                        "D8",
                        "D8",
                    ],
                    [
                        "D9",
                        "D9",
                    ],
                    [
                        "D10",
                        "D10",
                    ],
                    [
                        "D11",
                        "D11",
                    ],
                    [
                        "D12",
                        "D12",
                    ],
                    [
                        "D13",
                        "D13",
                        "machine.D13",
                    ],
                ],
            },
            {
                "type": "field_image",
                "src": "./img/ds18b20.png",
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
]);

defineBlocks(blocks);