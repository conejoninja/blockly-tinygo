/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';
goog.module('Blockly.GopherBadge');
const { createBlockDefinitionsFromJsonArray, defineBlocks } = goog.require('Blockly.common');
const { goGenerator: Go } = goog.require('Blockly.Go');

const blocks = createBlockDefinitionsFromJsonArray([
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
exports.blocks = blocks;


Go['gopherbadge_button_get'] = function (block) {
    Go.addImport('machine', 'machine');
    Go.addVariable('gopherbadge_buttons', 'var btnA, btnB, btnUp, btnLeft, btnDown, btnRight machine.Pin');
    Go.addDeclaration('gopherbadge_buttons', 'btnA = machine.BUTTON_A\nbtnB = machine.BUTTON_B\nbtnUp = machine.BUTTON_UP\nbtnLeft = machine.BUTTON_LEFT\nbtnDown = machine.BUTTON_DOWN\nbtnRight = machine.BUTTON_RIGHT\nbtnA.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnB.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnUp.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnLeft.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnDown.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnRight.Configure(machine.PinConfig{Mode: machine.PinInput})');
    const button = block.getFieldValue('BUTTON');
    return button + '.Get()';
};

Go.HexToRgbA = function (hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'color.RGBA{' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',255}';
    }
    throw new Error('Bad Hex');
};

// Register provided blocks.
defineBlocks(blocks);
//# sourceMappingURL=gopherbadge.js.map