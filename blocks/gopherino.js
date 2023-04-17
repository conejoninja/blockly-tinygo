/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';
goog.module('Blockly.Gopherino');
const { createBlockDefinitionsFromJsonArray, defineBlocks } = goog.require('Blockly.common');
const { goGenerator: Go } = goog.require('Blockly.Go');

const blocks = createBlockDefinitionsFromJsonArray([
    // Block for boolean data type: true and false.
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
exports.blocks = blocks;


Go['gopherino_move'] = function (block) {
    Go.addImport('machine', 'machine');
    Go.addVariable('i2c', 'var i2c = machine.I2C0');
    Go.addDeclaration('i2c', 'i2c.Configure(machine.I2CConfig{Frequency: machine.TWI_FREQ_100KHZ})');
    Go.addImport('gopherino_motor', 'github.com/conejoninja/gopherino/motor');
    Go.addVariable('gopherino_motor', 'var gopherino_motor *motor.Device');
    Go.addDeclaration('gopherino_motor', 'gopherino_motor = motor.New(i2c)\ngopherino_motor.Configure()');
    const direction = block.getFieldValue('DIRECTION');
    return 'gopherino_motor.' + direction + '()\n';
};
Go['gopherino_hcsr04_readdistance'] = function (block) {
    Go.addImport('machine', 'machine');
    Go.addImport('gopherino_hcsr04', 'tinygo.org/x/drivers/hcsr04');
    Go.addVariable('gopherino_hcsr04', 'var gopherino_hcsr04 hcsr04.Device');
    Go.addDeclaration('gopherino_hcsr04', 'gopherino_hcsr04 = hcsr04.New(machine.P1, machine.P2)\ngopherino_hcsr04.Configure()');
    return ['gopherino_hcsr04.ReadDistance()\n', 0];
};

// Register provided blocks.
defineBlocks(blocks);
//# sourceMappingURL=gopherino.js.map