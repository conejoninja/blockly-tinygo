/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';
goog.module('Blockly.TinyGo');
const { createBlockDefinitionsFromJsonArray, defineBlocks } = goog.require('Blockly.common');
const { goGenerator: Go } = goog.require('Blockly.Go');


const blocks = createBlockDefinitionsFromJsonArray([
    // Block for boolean data type: true and false.
    {
        "type": "tinygo_led_state",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BOOL",
                "options": [
                    ["HIGH", "TRUE"],
                    ["LOW", "FALSE"],
                ],
            },
        ],
        "output": "LedState",
        "style": "logic_blocks",
        "tooltip": "tooltip",
        "helpUrl": "helpurl",
    },
    {
        "type": "tinygo_led_complete",
        "message0": "%3 set LED %1 to %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "PIN",
                "options": [
                    [
                        "D0",
                        "0",
                    ],
                    [
                        "D1",
                        "1",
                    ],
                    [
                        "D2",
                        "2",
                    ],
                    [
                        "D3",
                        "3",
                    ],
                    [
                        "D4",
                        "4",
                    ],
                    [
                        "D5",
                        "5",
                    ],
                    [
                        "D6",
                        "6",
                    ],
                    [
                        "D7",
                        "7",
                    ],
                    [
                        "D8",
                        "8",
                    ],
                    [
                        "D9",
                        "9",
                    ],
                    [
                        "D10",
                        "10",
                    ],
                    [
                        "D11",
                        "11",
                    ],
                    [
                        "D12",
                        "12",
                    ],
                    [
                        "D13",
                        "13",
                        "machine.D13",
                    ],
                ],
            },
            {
                "type": "field_dropdown",
                "name": "STATE",
                "options": [
                    [
                        "HIGH",
                        "High",
                    ],
                    [
                        "LOW",
                        "Low",
                    ],
                ],
            },
            {
                "type": "field_image",
                "src": "../blocks/img/led.png",
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
        "type": "tinygo_goroutine",
        "message0": "go routine %1",
        "args0": [
            {
                "type": "input_statement",
                "name": "GR0",
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "tinygo_readdata",
        "message0": "read data, return tuple2",
        "output": "Tuple2",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "tinygo_time_sleep",
        "message0": "sleep %1 %2",
        "args0": [
            {
                "type": "field_number",
                "name": "AMOUNT",
                "value": 500,
                "min": 0,
            },
            {
                "type": "field_dropdown",
                "name": "UNIT",
                "options": [
                    [
                        "Milliseconds",
                        "time.Millisecond",
                    ],
                    [
                        "Microseconds",
                        "time.Microseconds",
                    ],
                    [
                        "Seconds",
                        "time.Second",
                    ],
                ],
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
        "type": "tinygo_strconv_atoi",
        "message0": "Convert string %1 to number",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
                'check': 'String',
            },
        ],
        "inputsInline": true,
        "output": "Tuple2",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
    {
        "type": "tinygo_strconv_itoa",
        "message0": "Convert number %1 to string",
        'args0': [
            {
                'type': 'input_value',
                'name': 'TEXT',
                'check': 'Number',
            },
        ],
        "inputsInline": true,
        "output": "String",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"],
    },
]);
exports.blocks = blocks;


Blockly.Blocks['tinygo_led'] = {
    init: function () {
        const connectorIo = [];
        for (let i = 0; i < 14; i++) {
            connectorIo.push(['D' + i.toString(), i.toString()]);
        }
        this.setHelpUrl('http://www.seeedstudio.com/wiki/Grove_-_LED');
        this.setColour(180);
        this.appendValueInput('STATE')
            .appendField(new Blockly.FieldImage('../blocks/img/led.png', 32, 32))
            .appendField("LED on pin")
            .appendField(new Blockly.FieldDropdown(connectorIo), 'PINNUMBER')
            .setCheck('ledstate');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Tooltip LED");
    },
    updateFields: function () {
    },
    connectorPinUsage: function () {
        return [this.getFieldValue('PINNUMBER')];
    },
};
Go['tinygo_led'] = function (block) {
    const pins = block.connectorPinUsage();
    const stateOutput = Go.valueToCode(block, 'STATE', Go.ORDER_ATOMIC) || false;

    Go.configurePin('ledPin' + pins[0], pins[0], 'Output');
    if (stateOutput == 'true') {
        return 'ledPin' + pins[0] + '.High()\n';
    }
    return 'ledPin' + pins[0] + '.Low()\n';
};

Go['tinygo_led_state'] = function (block) {
    const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return [code, Go.ORDER_ATOMIC];
};
Go['tinygo_goroutine'] = function (block) {
    let code = '';
    const branchCode = Go.statementToCode(block, 'GR0');
    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = 'go func() {\n' + branchCode + '}()\n';
    }
    else {
        code = 'go ' + branchCode;
    }
    return code;
};
Go['tinygo_time_sleep'] = function (block) {
    Go.imports_['time'] = 'time';
    const amount = block.getFieldValue('AMOUNT');
    const unit = block.getFieldValue('UNIT');
    const code = 'time.Sleep(' + amount + ' * ' + unit + ')\n';
    return code;
};
Go['tinygo_led_complete'] = function (block) {
    const state = block.getFieldValue('STATE');
    const pin = block.getFieldValue('PIN');
    Go.configurePin('ledPin' + pin, 'machine.D' + pin, 'Output');
    return 'ledPin' + pin + '.' + state + '()\n';
};
Go['tinygo_readdata'] = function (block) {
    console.log("THIS WAS CALLED");
    const code = 'ReadData()\n';
    return code;
};
Blockly.Blocks['tinygo_tuple2'] = {
    init: function () {
        this.setColour(180);
        this.appendValueInput('TUPLE2')
            .appendField("Set ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR1')
            .appendField(", ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR2')
            .appendField("= ")
            .setCheck("Tuple2");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Tuple 2");
    },
    updateFields: function () {
    },
    getVariableNames: function () {
        return [this.getFieldValue('VAR1'), this.getFieldValue('VAR2')];
    },
};
Go['tinygo_tuple2'] = function (block) {
    const vars = block.getVariableNames();
    const fnCode = Go.statementToCode(block, 'TUPLE2');
    return vars[0] + ', ' + vars[1] + ' = ' + fnCode + '\n';
};


Blockly.Blocks['tinygo_tuple3'] = {
    init: function () {
        this.setColour(180);
        this.appendValueInput('TUPLE3')
            .appendField("Set ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR1')
            .appendField(", ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR2')
            .appendField(", ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR3')
            .appendField("= ")
            .setCheck("Tuple3");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Tuple 3");
    },
    updateFields: function () {
    },
    getVariableNames: function () {
        return [this.getFieldValue('VAR1'), this.getFieldValue('VAR2'), this.getFieldValue('VAR3')];
    },
};
Go['tinygo_tuple3'] = function (block) {
    const vars = block.getVariableNames();
    const fnCode = Go.statementToCode(block, 'TUPLE3');
    return vars[0] + ', ' + vars[1] + ', ' + vars[2] + ' = ' + fnCode + '\n';
};

Blockly.Blocks['tinygo_tuple4'] = {
    init: function () {
        this.setColour(180);
        this.appendValueInput('TUPLE2')
            .appendField("Set ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR1')
            .appendField(", ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR2')
            .appendField(", ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR3')
            .appendField(", ")
            .appendField(new Blockly.FieldTextInput('_'), 'VAR4')
            .appendField("= ")
            .setCheck("Tuple4");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Tuple 4");
    },
    updateFields: function () {
    },
    getVariableNames: function () {
        return [this.getFieldValue('VAR1'), this.getFieldValue('VAR2'), this.getFieldValue('VAR3'), this.getFieldValue('VAR4')];
    },
};
Go['tinygo_tuple4'] = function (block) {
    const vars = block.getVariableNames();
    const fnCode = Go.statementToCode(block, 'TUPLE4');
    return vars[0] + ', ' + vars[1] + ', ' + vars[2] + ', ' + vars[3] + ' = ' + fnCode + '\n';
};


Go['tinygo_strconv_atoi'] = function (block) {
    Go.imports_['strconv'] = 'strconv';
    var msg = Go.valueToCode(block, 'TEXT', Go.ORDER_NONE) || '\'\'';
    return 'func() (int32, error){\ni, err := strconv.Atoi(' + msg + ')\nreturn int32(i), err\n	}()';
};
Go['tinygo_strconv_itoa'] = function (block) {
    Go.imports_['strconv'] = 'strconv';
    var msg = Go.valueToCode(block, 'TEXT', Go.ORDER_NONE) || '\'\'';
    return ['strconv.Itoa(int(' + msg + '))', 0];
};

// Register provided blocks.
defineBlocks(blocks);
//# sourceMappingURL=tinygo.js.map