/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Go for variable blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.module('Blockly.Go.variables');

const Go = goog.require('Blockly.Go');


Go['variables_get'] = function(block) {
    // Variable getter.
    var code = Go.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME);
    return [code, Go.ORDER_ATOMIC];
};

Go['variables_set'] = function(block) {
    // Variable setter.
    var argument0 = Go.valueToCode(block, 'VALUE',
            Go.ORDER_ASSIGNMENT) || '0';
    var varName = Go.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return varName + ' = ' + argument0 + '\n';
};
