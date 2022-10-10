/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Go for text blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.module('Blockly.Go.texts');

const Go = goog.require('Blockly.Go');



Go['text'] = function(block) {
  // Text value.
  var code = Go.quote_(block.getFieldValue('TEXT'));
  return [code, Go.ORDER_ATOMIC];
};

Go['text_multiline'] = function(block) {
  // Text value.
  var code = Go.multiline_quote_(block.getFieldValue('TEXT'));
  return [code, Go.ORDER_ATOMIC];
};

Go['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  if (block.itemCount_ == 0) {
    return ['\'\'', Go.ORDER_ATOMIC];
  } else if (block.itemCount_ == 1) {
    var element = Go.valueToCode(block, 'ADD0',
        Go.ORDER_NONE) || '\'\'';
    var code = element;
    return [code, Go.ORDER_FUNCTION_CALL];
  } else if (block.itemCount_ == 2) {
    var element0 = Go.valueToCode(block, 'ADD0',
        Go.ORDER_ATOMIC) || '\'\'';
    var element1 = Go.valueToCode(block, 'ADD1',
        Go.ORDER_ATOMIC) || '\'\'';
    var code = element0 + ' . ' + element1;
    return [code, Go.ORDER_STRING_CONCAT];
  } else {
    var elements = new Array(block.itemCount_);
    for (var i = 0; i < block.itemCount_; i++) {
      elements[i] = Go.valueToCode(block, 'ADD' + i,
          Go.ORDER_COMMA) || '\'\'';
    }
    var code = 'strings.Join(\'\', []string{' + elements.join(',') + '})';
    return [code, Go.ORDER_FUNCTION_CALL];
  }
};

Go['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Go.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var value = Go.valueToCode(block, 'TEXT',
      Go.ORDER_ASSIGNMENT) || '\'\'';
  return varName + ' += ' + value + '\n';
};

Go['text_length'] = function(block) {
  var text = Go.valueToCode(block, 'VALUE',
      Go.ORDER_NONE) || '\'\'';
  return 'len(' + text + ')';
};

Go['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Go.valueToCode(block, 'VALUE',
      Go.ORDER_NONE) || '\'\'';
  return ['empty(' + text + ')', Go.ORDER_FUNCTION_CALL];
};

Go['text_indexOf'] = function(block) {
  // Search the text for a substring.
  var operator = block.getFieldValue('END') == 'FIRST' ?
      'strpos' : 'strrpos';
  var substring = Go.valueToCode(block, 'FIND',
      Go.ORDER_NONE) || '\'\'';
  var text = Go.valueToCode(block, 'VALUE',
      Go.ORDER_NONE) || '\'\'';
  if (block.workspace.options.oneBasedIndex) {
    var errorIndex = ' 0';
    var indexAdjustment = ' + 1';
  } else {
    var errorIndex = ' -1';
    var indexAdjustment = '';
  }
  var functionName = Go.provideFunction_(
      block.getFieldValue('END') == 'FIRST' ?
          'text_indexOf' : 'text_lastIndexOf',
      ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
          '($text, $search) {',
       '  $pos = ' + operator + '($text, $search)',
       '  return $pos === false ? ' + errorIndex + ' : $pos' +
          indexAdjustment + '',
       '}']);
  var code = functionName + '(' + text + ', ' + substring + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['text_charAt'] = function(block) {
  // Get letter at index.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var textOrder = (where == 'RANDOM') ? Go.ORDER_NONE :
      Go.ORDER_COMMA;
  var text = Go.valueToCode(block, 'VALUE', textOrder) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = 'substr(' + text + ', 0, 1)';
      return [code, Go.ORDER_FUNCTION_CALL];
    case 'LAST':
      var code = 'substr(' + text + ', -1)';
      return [code, Go.ORDER_FUNCTION_CALL];
    case 'FROM_START':
      var at = Go.getAdjusted(block, 'AT');
      var code = 'substr(' + text + ', ' + at + ', 1)';
      return [code, Go.ORDER_FUNCTION_CALL];
    case 'FROM_END':
      var at = Go.getAdjusted(block, 'AT', 1, true);
      var code = 'substr(' + text + ', ' + at + ', 1)';
      return [code, Go.ORDER_FUNCTION_CALL];
    case 'RANDOM':
      var functionName = Go.provideFunction_(
          'text_random_letter',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ + '($text) {',
           '  return $text[rand(0, strlen($text) - 1)]',
           '}']);
      code = functionName + '(' + text + ')';
      return [code, Go.ORDER_FUNCTION_CALL];
  }
  throw Error('Unhandled option (text_charAt).');
};

Go['text_getSubstring'] = function(block) {
  // Get substring.
  var text = Go.valueToCode(block, 'STRING',
      Go.ORDER_FUNCTION_CALL) || '\'\'';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = text;
  } else {
    var at1 = Go.getAdjusted(block, 'AT1');
    var at2 = Go.getAdjusted(block, 'AT2');
    var functionName = Go.provideFunction_(
        'text_get_substring',
        ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '($text, $where1, $at1, $where2, $at2) {',
         '  if ($where1 == \'FROM_END\') {',
         '    $at1 = strlen($text) - 1 - $at1',
         '  } else if ($where1 == \'FIRST\') {',
         '    $at1 = 0',
         '  } else if ($where1 != \'FROM_START\') {',
         '    throw new Exception(\'Unhandled option (text_get_substring).\')',
         '  }',
         '  $length = 0',
         '  if ($where2 == \'FROM_START\') {',
         '    $length = $at2 - $at1 + 1',
         '  } else if ($where2 == \'FROM_END\') {',
         '    $length = strlen($text) - $at1 - $at2',
         '  } else if ($where2 == \'LAST\') {',
         '    $length = strlen($text) - $at1',
         '  } else {',
         '    throw new Exception(\'Unhandled option (text_get_substring).\')',
         '  }',
         '  return substr($text, $at1, $length)',
         '}']);
    var code = functionName + '(' + text + ', \'' +
        where1 + '\', ' + at1 + ', \'' + where2 + '\', ' + at2 + ')';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['text_changeCase'] = function(block) {
  // Change capitalization.
  var text = Go.valueToCode(block, 'TEXT',
          Go.ORDER_NONE) || '\'\'';
  if (block.getFieldValue('CASE') == 'UPPERCASE') {
    var code = 'strtoupper(' + text + ')';
  } else if (block.getFieldValue('CASE') == 'LOWERCASE') {
    var code = 'strtolower(' + text + ')';
  } else if (block.getFieldValue('CASE') == 'TITLECASE') {
    var code = 'ucwords(strtolower(' + text + '))';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['text_trim'] = function(block) {
  // Trim spaces.
  var OPERATORS = {
    'LEFT': 'ltrim',
    'RIGHT': 'rtrim',
    'BOTH': 'trim'
  };
  var operator = OPERATORS[block.getFieldValue('MODE')];
  var text = Go.valueToCode(block, 'TEXT',
      Go.ORDER_NONE) || '\'\'';
  return [operator + '(' + text + ')', Go.ORDER_FUNCTION_CALL];
};

Go['text_print'] = function(block) {
  // Print statement.
  var msg = Go.valueToCode(block, 'TEXT',
      Go.ORDER_NONE) || '\'\'';
  return 'println(' + msg + ')\n';
};

Go['text_prompt_ext'] = function(block) {
  // Prompt function.
  if (block.getField('TEXT')) {
    // Internal message.
    var msg = Go.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    var msg = Go.valueToCode(block, 'TEXT',
        Go.ORDER_NONE) || '\'\'';
  }
  var code = 'readline(' + msg + ')';
  var toNumber = block.getFieldValue('TYPE') == 'NUMBER';
  if (toNumber) {
    code = 'floatval(' + code + ')';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['text_prompt'] = Go['text_prompt_ext'];

Go['text_count'] = function(block) {
  var text = Go.valueToCode(block, 'TEXT',
      Go.ORDER_MEMBER) || '\'\'';
  var sub = Go.valueToCode(block, 'SUB',
      Go.ORDER_NONE) || '\'\'';
  var code = 'strlen(' + sub + ') === 0'
    + ' ? strlen(' + text + ') + 1'
    + ' : substr_count(' + text + ', ' + sub + ')';
  return [code, Go.ORDER_CONDITIONAL];
};

Go['text_replace'] = function(block) {
  var text = Go.valueToCode(block, 'TEXT',
      Go.ORDER_MEMBER) || '\'\'';
  var from = Go.valueToCode(block, 'FROM',
      Go.ORDER_NONE) || '\'\'';
  var to = Go.valueToCode(block, 'TO',
      Go.ORDER_NONE) || '\'\'';
  var code = 'str_replace(' + from + ', ' + to + ', ' + text + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['text_reverse'] = function(block) {
  var text = Go.valueToCode(block, 'TEXT',
      Go.ORDER_MEMBER) || '\'\'';
  var code = 'strrev(' + text + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};
