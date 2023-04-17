/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';
goog.modulede('Blockly.Gopherbot');
const { goGenerator: Go } = goog.require('Blockly.Go');

const {TinyGo} = goog.require('Blockly.TinyGo');
/**
 * A dictionary of the block definitions provided by this module.
 * @type {!Object<string, !BlockDefinition>}
 */
const blocks = createBlockDefinitionsFromJsonArray([
    // Block for boolean data type: true and false.
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
exports.blocks = blocks;


Go['gopherbot_antenna'] = function (block) {
    TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    TinyGo.addVariable('gopherbot_antenna', 'var antenna *gopherbot.AntennaDevice');
    TinyGo.addDeclaration('gopherbot_antenna', 'antenna = gopherbot.Antenna()');
    const state = block.getFieldValue('STATE');
    const code = 'antenna.' + state + '()\n';
    return code;
};
Go['gopherbot_visor'] = function (block) {
    TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    TinyGo.addVariable('gopherbot_visor', 'var visor *gopherbot.VisorDevice');
    TinyGo.addDeclaration('gopherbot_visor', 'visor = gopherbot.Visor()');
    const mode = block.getFieldValue('MODE');
    const code = 'visor.' + mode + '()\n';
    return code;
};
Go['gopherbot_button'] = function (block) {
    TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    const btn = block.getFieldValue('BUTTON');
    if (btn == "LEFT") {
        TinyGo.addVariable('gopherbot_btn_left', 'var btnLeft *gopherbot.ButtonDevice');
        TinyGo.addDeclaration('gopherbot_btn_left', 'btnLeft = gopherbot.LeftButton()');
        return ['btnLeft.Pushed()', Go.ORDER_NONE];
    }
    TinyGo.addVariable('gopherbot_btn_right', 'var btnRight *gopherbot.ButtonDevice');
    TinyGo.addDeclaration('gopherbot_btn_right', 'btnRight = gopherbot.RightButton()');
    return ['btnRight.Pushed()', Go.ORDER_NONE];
};
Go['gopherbot_backpack'] = function (block) {
    TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    TinyGo.addVariable('gopherbot_backpack', 'var backpack *gopherbot.BackpackDevice');
    TinyGo.addDeclaration('gopherbot_backpack', 'backpack = gopherbot.Backpack()');
    const mode = block.getFieldValue('MODE');
    const code = 'backpack.' + mode + '()\n';
    return code;
};
Go['gopherbot_backpack_alternate'] = function (block) {
    TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    TinyGo.addVariable('gopherbot_backpack', 'var backpack *gopherbot.BackpackDevice');
    TinyGo.addDeclaration('gopherbot_backpack', 'backpack = gopherbot.Backpack()');
    const code = 'backpack.Alternate(' + TinyGo.HexToRgbA(block.getFieldValue('COLOR1')) + ', ' + TinyGo.HexToRgbA(block.getFieldValue('COLOR2')) + ')\n';
    return code;
};
Go['gopherbot_speaker'] = function (block) {
    TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    TinyGo.addVariable('gopherbot_speaker', 'var speaker *gopherbot.SpeakerDevice');
    TinyGo.addDeclaration('gopherbot_speaker', 'speaker = gopherbot.Speaker()');
    const mode = block.getFieldValue('MODE');
    const code = 'speaker.' + mode + '()\n';
    return code;
};
TinyGo.HexToRgbA = function (hex) {
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
//# sourceMappingURL=gopherbot.js.map