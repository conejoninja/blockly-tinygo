/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Go for loop blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.Go.loops');

const Go = goog.require('Blockly.Go');


Go['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Go.valueToCode(block, 'TIMES',
        Go.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Go.statementToCode(block, 'DO');
  branch = Go.addLoopTrap(branch, block);
  var code = '';
  var loopVar = Go.variableDB_.getDistinctName(
      'count', Blockly.VARIABLE_CATEGORY_NAME);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    endVar = Go.variableDB_.getDistinctName(
        'repeat_end', Blockly.VARIABLE_CATEGORY_NAME);
    code += endVar + ' = ' + repeats + '\n';
  }
  code += 'for ' + loopVar + ' := 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++ {\n' +
      branch + '}\n';
  return code;
};

Go['controls_repeat'] = Go['controls_repeat_ext'];

Go['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Go.valueToCode(block, 'BOOL',
      until ? Go.ORDER_LOGICAL_NOT :
      Go.ORDER_NONE) || 'false';
  var branch = Go.statementToCode(block, 'DO');
  branch = Go.addLoopTrap(branch, block);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'for ' + argument0 + ' {\n' + branch + '}\n';
};

Go['controls_for'] = function(block) {
  // For loop.
  var variable0 = Go.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Go.valueToCode(block, 'FROM',
      Go.ORDER_ASSIGNMENT) || '0';
  var argument1 = Go.valueToCode(block, 'TO',
      Go.ORDER_ASSIGNMENT) || '0';
  var increment = Go.valueToCode(block, 'BY',
      Go.ORDER_ASSIGNMENT) || '1';
  var branch = Go.statementToCode(block, 'DO');
  branch = Go.addLoopTrap(branch, block);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = Number(argument0) <= Number(argument1);
    code = 'for ' + variable0 + ' := ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(Number(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ' {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Go.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.VARIABLE_CATEGORY_NAME);
      code += startVar + ' = ' + argument0 + '\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      endVar = Go.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.VARIABLE_CATEGORY_NAME);
      code += endVar + ' = ' + argument1 + '\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Go.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.VARIABLE_CATEGORY_NAME);
    code += incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + '\n';
    } else {
      code += 'math.Abs(' + increment + ')\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Go.INDENT + incVar + ' = -' + incVar + '\n';
    code += '}\n';
    code += 'for ' + variable0 + ' := ' + startVar + '; ' +
        incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + '; ' +
        variable0 + ' += ' + incVar + ' {\n' +
        branch + '}\n';
  }
  return code;
};

Go['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Go.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Go.valueToCode(block, 'LIST',
      Go.ORDER_ASSIGNMENT) || '[]';
  var branch = Go.statementToCode(block, 'DO');
  branch = Go.addLoopTrap(branch, block);
  var code = '';
  code += 'for _,' + variable0 + ' := range ' + argument0 +
      ' {\n' + branch + '}\n';
  return code;
};

Go['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  var xfix = '';
  if (Go.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Go.injectId(Go.STATEMENT_PREFIX, block);
  }
  if (Go.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Go.injectId(Go.STATEMENT_SUFFIX, block);
  }
  if (Go.STATEMENT_PREFIX) {
    var loop = Blockly.Constants.Loops
        .CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(block);
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Go.injectId(Go.STATEMENT_PREFIX, loop);
    }
  }
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return xfix + 'break\n';
    case 'CONTINUE':
      return xfix + 'continue\n';
  }
  throw Error('Unknown flow statement.');
};
