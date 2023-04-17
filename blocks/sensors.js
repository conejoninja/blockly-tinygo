/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';
goog.module('Blockly.Sensors');
const { createBlockDefinitionsFromJsonArray, defineBlocks } = goog.require('Blockly.common');
const { goGenerator: Go } = goog.require('Blockly.Go');

/**
 * A dictionary of the block definitions provided by this module.
 * @type {!Object<string, !BlockDefinition>}
 */
const blocks = createBlockDefinitionsFromJsonArray([
    // Block for boolean data type: true and false.
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
exports.blocks = blocks;


Go['sensors_ds18b20_readtemperature'] = function (block) {
    Go.addImport('machine', 'machine');
    Go.addImport('tinygo.org/x/drivers/1-wire', 'wire "tinygo.org/x/drivers/1-wire"');
    Go.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    Go.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    return 'sensors_ds18b20.ReadTemperature()\n';
};
Go['sensors_ds18b20_requesttemperature'] = function (block) {
    Go.addImport('machine', 'machine');
    Go.addImport('tinygo.org/x/drivers/1-wire', 'wire "tinygo.org/x/drivers/1-wire"');
    Go.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    Go.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    return '_ = sensors_ds18b20.RequestTemperature()\n';
};
Go['sensors_ds18b20_configure'] = function (block) {
    Go.addImport('machine', 'machine');
    Go.addImport('tinygo.org/x/drivers/1-wire', 'wire "tinygo.org/x/drivers/1-wire"');
    Go.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    Go.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    const pin = block.getFieldValue('PIN');
    return 'sensors_ds18b20 = ds18b20.New(wire.New(machine.' + pin + '))\n';
};

// Register provided blocks.
defineBlocks(blocks);
//# sourceMappingURL=sensors.js.map