/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Go for logic blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.module('Blockly.Go.logic');

const Go = goog.require('Blockly.Go');


Go['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Go.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Go.injectId(Go.STATEMENT_PREFIX, block);
  }
  do {
    conditionCode = Go.valueToCode(block, 'IF' + n,
        Go.ORDER_NONE) || 'false';
    branchCode = Go.statementToCode(block, 'DO' + n);
    if (Go.STATEMENT_SUFFIX) {
      branchCode = Go.prefixLines(
          Go.injectId(Go.STATEMENT_SUFFIX, block),
          Go.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if ' + conditionCode + ' {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Go.STATEMENT_SUFFIX) {
    branchCode = Go.statementToCode(block, 'ELSE');
    if (Go.STATEMENT_SUFFIX) {
      branchCode = Go.prefixLines(
          Go.injectId(Go.STATEMENT_SUFFIX, block),
          Go.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Go['controls_ifelse'] = Go['controls_if'];

Go['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Go.ORDER_EQUALITY : Go.ORDER_RELATIONAL;
  var argument0 = Go.valueToCode(block, 'A', order) || '0';
  var argument1 = Go.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Go['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Go.ORDER_LOGICAL_AND :
      Go.ORDER_LOGICAL_OR;
  var argument0 = Go.valueToCode(block, 'A', order);
  var argument1 = Go.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Go['logic_negate'] = function(block) {
  // Negation.
  var order = Go.ORDER_LOGICAL_NOT;
  var argument0 = Go.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Go['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Go.ORDER_ATOMIC];
};

Go['logic_null'] = function(block) {
  // Null data type.
  return ['nil', Go.ORDER_ATOMIC];
};

Go['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Go.valueToCode(block, 'IF',
      Go.ORDER_CONDITIONAL) || 'false';
  var value_then = Go.valueToCode(block, 'THEN',
      Go.ORDER_CONDITIONAL) || 'nil';
  var value_else = Go.valueToCode(block, 'ELSE',
      Go.ORDER_CONDITIONAL) || 'nil';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Go.ORDER_CONDITIONAL];
};
