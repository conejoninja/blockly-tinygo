/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

goog.provide('Blockly.Go.TinyGo');

goog.require('Blockly.Go');


Blockly.Go['tinygo_led_state'] = function(block) {
    const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return [code, Blockly.TinyGo.ORDER_ATOMIC];
};


Blockly.Go['tinygo_goroutine'] = function(block) {
    let code = '';
    const branchCode = Blockly.TinyGo.statementToCode(block, 'GR0');

    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = 'go func() {\n' + branchCode + '}()\n';
    } else {
        code = 'go ' + branchCode;
    }

    return code;
};

Blockly.Go['tinygo_time_sleep'] = function(block) {
    Blockly.TinyGo.imports_['time'] = 'time';
    const amount = block.getFieldValue('AMOUNT');
    const unit = block.getFieldValue('UNIT');
    const code = 'time.Sleep(' + amount + ' * ' + unit + ')\n';
    return code;
};

Blockly.Go['tinygo_led_complete'] = function(block) {
    const state = block.getFieldValue('STATE');
    const pin = block.getFieldValue('PIN');
    Blockly.TinyGo.configurePin('ledPin' + pin, 'machine.D' + pin, 'Output');

    return 'ledPin' + pin + '.' + state + '()\n';
};
