/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Go for list blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */

/**
 * Lists in Go are known to break when non-variables are passed into blocks
 * that require a list. Go, unlike other languages, passes arrays as reference
 * value instead of value so we are unable to support it to the extent we can
 * for the other languages.
 * For example, a ternary operator with two arrays will return the array by
 * value and that cannot be passed into any of the built-in array functions for
 * Go (because only variables can be passed by reference).
 * ex:  end(true ? list1 : list2)
 */
'use strict';

goog.module('Blockly.Go.lists');

const { goGenerator: Go } = goog.require('Blockly.Go');


Go['lists_create_empty'] = function (block) {
  // Create an empty list.
  return ['array()', Go.ORDER_FUNCTION_CALL];
};

Go['lists_create_with'] = function (block) {
  // Create a list with any number of elements of any type.
  var code = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    code[i] = Go.valueToCode(block, 'ADD' + i,
      Go.ORDER_COMMA) || 'nil';
  }
  code = 'array(' + code.join(', ') + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_create_with_string'] = function (block) {
  // Create a list with any number of elements of any type.
  var code = new Array(block.itemCount_);
  let emptylist = true;
  for (var i = 0; i < block.itemCount_; i++) {
    code[i] = Go.valueToCode(block, 'ADD' + i,
      Go.ORDER_COMMA) || 'nil';
    if (code[i] != 'nil') {
      emptylist = false;
    }
  }
  if (emptylist) {
    code = 'make([]string, ' + block.itemCount_ + ')';
  } else {
    code = '[' + block.itemCount_ + ']string{' + code.join(', ') + '}';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_create_with_color'] = function (block) {
  // Create a list with any number of elements of any type.
  var code = new Array(block.itemCount_);
  let emptylist = true;
  for (var i = 0; i < block.itemCount_; i++) {
    code[i] = Go.HexToRgbA(Go.valueToCode(block, 'ADD' + i,
      Go.ORDER_COMMA) || 'nil');
      if (code[i] != 'nil') {
        emptylist = false;
      }
    }
  if (emptylist) {
    code = 'make([]color.RGBA, ' + block.itemCount_ + ')';
  } else {
    code = '[' + block.itemCount_ + ']color.RGBA{' + code.join(', ') + '}';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_create_with_number'] = function (block) {
  // Create a list with any number of elements of any type.
  var code = new Array(block.itemCount_);
  let emptylist = true;
  for (var i = 0; i < block.itemCount_; i++) {
    code[i] = Go.valueToCode(block, 'ADD' + i,
      Go.ORDER_COMMA) || 'nil';
      if (code[i] != 'nil') {
        emptylist = false;
      }
    }
  if (emptylist) {
    code = 'make([]int32, ' + block.itemCount_ + ')';
  } else {
    code = '[' + block.itemCount_ + ']int32{' + code.join(', ') + '}';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_repeat'] = function (block) {
  // Create a list with one element repeated.
  var functionName = Go.provideFunction_(
    'lists_repeat',
    ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
      '($value, $count) {',
      '  $array = array();',
      '  for ($index = 0; $index < $count; $index++) {',
      '    $array[] = $value;',
      '  }',
      '  return $array;',
      '}']);
  var element = Go.valueToCode(block, 'ITEM',
    Go.ORDER_COMMA) || 'null';
  var repeatCount = Go.valueToCode(block, 'NUM',
    Go.ORDER_COMMA) || '0';
  var code = functionName + '(' + element + ', ' + repeatCount + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_length'] = function (block) {
  // String or array length.
  var functionName = Go.provideFunction_(
    'length',
    ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ + '($value) {',
      '  if (is_string($value)) {',
      '    return strlen($value);',
      '  } else {',
      '    return count($value);',
      '  }',
      '}']);
  var list = Go.valueToCode(block, 'VALUE',
    Go.ORDER_NONE) || '\'\'';
  return [functionName + '(' + list + ')', Go.ORDER_FUNCTION_CALL];
};

Go['lists_isEmpty'] = function (block) {
  // Is the string null or array empty?
  var argument0 = Go.valueToCode(block, 'VALUE',
    Go.ORDER_FUNCTION_CALL) || 'array()';
  return ['empty(' + argument0 + ')', Go.ORDER_FUNCTION_CALL];
};

Go['lists_indexOf'] = function (block) {
  // Find an item in the list.
  var argument0 = Go.valueToCode(block, 'FIND',
    Go.ORDER_NONE) || '\'\'';
  var argument1 = Go.valueToCode(block, 'VALUE',
    Go.ORDER_MEMBER) || '[]';
  if (block.workspace.options.oneBasedIndex) {
    var errorIndex = ' 0';
    var indexAdjustment = ' + 1';
  } else {
    var errorIndex = ' -1';
    var indexAdjustment = '';
  }
  if (block.getFieldValue('END') == 'FIRST') {
    // indexOf
    var functionName = Go.provideFunction_(
      'indexOf',
      ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
        '($haystack, $needle) {',
        '  for ($index = 0; $index < count($haystack); $index++) {',
      '    if ($haystack[$index] == $needle) return $index' +
      indexAdjustment + ';',
        '  }',
      '  return ' + errorIndex + ';',
        '}']);
  } else {
    // lastIndexOf
    var functionName = Go.provideFunction_(
      'lastIndexOf',
      ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
        '($haystack, $needle) {',
      '  $last = ' + errorIndex + ';',
        '  for ($index = 0; $index < count($haystack); $index++) {',
      '    if ($haystack[$index] == $needle) $last = $index' +
      indexAdjustment + ';',
        '  }',
        '  return $last;',
        '}']);
  }

  var code = functionName + '(' + argument1 + ', ' + argument0 + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_getIndex'] = function (block) {
  // Get element at index.
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  switch (where) {
    case 'FIRST':
      if (mode == 'GET') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_MEMBER) || 'array()';
        var code = list + '[0]';
        return [code, Go.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_NONE) || 'array()';
        var code = 'array_shift(' + list + ')';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_NONE) || 'array()';
        return 'array_shift(' + list + ')\n';
      }
      break;
    case 'LAST':
      if (mode == 'GET') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_NONE) || 'array()';
        var code = 'end(' + list + ')';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'GET_REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_NONE) || 'array()';
        var code = 'array_pop(' + list + ')';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_NONE) || 'array()';
        return 'array_pop(' + list + ')\n';
      }
      break;
    case 'FROM_START':
      var at = Go.getAdjusted(block, 'AT');
      if (mode == 'GET') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_MEMBER) || 'array()';
        var code = list + '[' + at + ']';
        return [code, Go.ORDER_MEMBER];
      } else if (mode == 'GET_REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_COMMA) || 'array()';
        var code = 'array_splice(' + list + ', ' + at + ', 1)[0]';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_COMMA) || 'array()';
        return 'array_splice(' + list + ', ' + at + ', 1)\n';
      }
      break;
    case 'FROM_END':
      if (mode == 'GET') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_COMMA) || 'array()';
        var at = Go.getAdjusted(block, 'AT', 1, true);
        var code = 'array_slice(' + list + ', ' + at + ', 1)[0]';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'GET_REMOVE' || mode == 'REMOVE') {
        var list = Go.valueToCode(block, 'VALUE',
          Go.ORDER_NONE) || 'array()';
        var at = Go.getAdjusted(block, 'AT', 1, false,
          Go.ORDER_SUBTRACTION);
        code = 'array_splice(' + list +
          ', count(' + list + ') - ' + at + ', 1)[0]';
        if (mode == 'GET_REMOVE') {
          return [code, Go.ORDER_FUNCTION_CALL];
        } else if (mode == 'REMOVE') {
          return code + '\n';
        }
      }
      break;
    case 'RANDOM':
      var list = Go.valueToCode(block, 'VALUE',
        Go.ORDER_NONE) || 'array()';
      if (mode == 'GET') {
        var functionName = Go.provideFunction_(
          'lists_get_random_item',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '($list) {',
            '  return $list[rand(0,count($list)-1)];',
            '}']);
        code = functionName + '(' + list + ')';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'GET_REMOVE') {
        var functionName = Go.provideFunction_(
          'lists_get_remove_random_item',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '(&$list) {',
            '  $x = rand(0,count($list)-1);',
            '  unset($list[$x]);',
            '  return array_values($list);',
            '}']);
        code = functionName + '(' + list + ')';
        return [code, Go.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        var functionName = Go.provideFunction_(
          'lists_remove_random_item',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '(&$list) {',
            '  unset($list[rand(0,count($list)-1)]);',
            '}']);
        return functionName + '(' + list + ')\n';
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
};

Go['lists_setIndex'] = function (block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var value = Go.valueToCode(block, 'TO',
    Go.ORDER_ASSIGNMENT) || 'null';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\$\w+$/)) {
      return '';
    }
    var listVar = Go.variableDB_.getDistinctName(
      'tmp_list', Blockly.VARIABLE_CATEGORY_NAME);
    var code = listVar + ' = &' + list + '\n';
    list = listVar;
    return code;
  }
  switch (where) {
    case 'FIRST':
      if (mode == 'SET') {
        var list = Go.valueToCode(block, 'LIST',
          Go.ORDER_MEMBER) || 'array()';
        return list + '[0] = ' + value + '\n';
      } else if (mode == 'INSERT') {
        var list = Go.valueToCode(block, 'LIST',
          Go.ORDER_COMMA) || 'array()';
        return 'array_unshift(' + list + ', ' + value + ')\n';
      }
      break;
    case 'LAST':
      var list = Go.valueToCode(block, 'LIST',
        Go.ORDER_COMMA) || 'array()';
      if (mode == 'SET') {
        var functionName = Go.provideFunction_(
          'lists_set_last_item',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '(&$list, $value) {',
            '  $list[count($list) - 1] = $value;',
            '}']);
        return functionName + '(' + list + ', ' + value + ')\n';
      } else if (mode == 'INSERT') {
        return 'array_push(' + list + ', ' + value + ')\n';
      }
      break;
    case 'FROM_START':
      var at = Go.getAdjusted(block, 'AT');
      if (mode == 'SET') {
        var list = Go.valueToCode(block, 'LIST',
          Go.ORDER_MEMBER) || 'array()';
        return list + '[' + at + '] = ' + value + '\n';
      } else if (mode == 'INSERT') {
        var list = Go.valueToCode(block, 'LIST',
          Go.ORDER_COMMA) || 'array()';
        return 'array_splice(' + list + ', ' + at + ', 0, ' + value + ')\n';
      }
      break;
    case 'FROM_END':
      var list = Go.valueToCode(block, 'LIST',
        Go.ORDER_COMMA) || 'array()';
      var at = Go.getAdjusted(block, 'AT', 1);
      if (mode == 'SET') {
        var functionName = Go.provideFunction_(
          'lists_set_from_end',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '(&$list, $at, $value) {',
            '  $list[count($list) - $at] = $value;',
            '}']);
        return functionName + '(' + list + ', ' + at + ', ' + value + ')\n';
      } else if (mode == 'INSERT') {
        var functionName = Go.provideFunction_(
          'lists_insert_from_end',
          ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
            '(&$list, $at, $value) {',
            '  return array_splice($list, count($list) - $at, 0, $value);',
            '}']);
        return functionName + '(' + list + ', ' + at + ', ' + value + ')\n';
      }
      break;
    case 'RANDOM':
      var list = Go.valueToCode(block, 'LIST',
        Go.ORDER_REFERENCE) || 'array()';
      var code = cacheList();
      var xVar = Go.variableDB_.getDistinctName(
        'tmp_x', Blockly.VARIABLE_CATEGORY_NAME);
      code += xVar + ' = rand(0, count(' + list + ')-1)\n';
      if (mode == 'SET') {
        code += list + '[' + xVar + '] = ' + value + '\n';
        return code;
      } else if (mode == 'INSERT') {
        code += 'array_splice(' + list + ', ' + xVar + ', 0, ' + value +
          ')\n';
        return code;
      }
      break;
  }
  throw Error('Unhandled combination (lists_setIndex).');
};

Go['lists_getSublist'] = function (block) {
  // Get sublist.
  var list = Go.valueToCode(block, 'LIST',
    Go.ORDER_COMMA) || 'array()';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = list;
  } else if (list.match(/^\$\w+$/) ||
    (where1 != 'FROM_END' && where2 == 'FROM_START')) {
    // If the list is a simple value or doesn't require a call for length, don't
    // generate a helper function.
    switch (where1) {
      case 'FROM_START':
        var at1 = Go.getAdjusted(block, 'AT1');
        break;
      case 'FROM_END':
        var at1 = Go.getAdjusted(block, 'AT1', 1, false,
          Go.ORDER_SUBTRACTION);
        at1 = 'count(' + list + ') - ' + at1;
        break;
      case 'FIRST':
        var at1 = '0';
        break;
      default:
        throw Error('Unhandled option (lists_getSublist).');
    }
    switch (where2) {
      case 'FROM_START':
        var at2 = Go.getAdjusted(block, 'AT2', 0, false,
          Go.ORDER_SUBTRACTION);
        var length = at2 + ' - ';
        if (Blockly.isNumber(String(at1)) || String(at1).match(/^\(.+\)$/)) {
          length += at1;
        } else {
          length += '(' + at1 + ')';
        }
        length += ' + 1';
        break;
      case 'FROM_END':
        var at2 = Go.getAdjusted(block, 'AT2', 0, false,
          Go.ORDER_SUBTRACTION);
        var length = 'count(' + list + ') - ' + at2 + ' - ';
        if (Blockly.isNumber(String(at1)) || String(at1).match(/^\(.+\)$/)) {
          length += at1;
        } else {
          length += '(' + at1 + ')';
        }
        break;
      case 'LAST':
        var length = 'count(' + list + ') - ';
        if (Blockly.isNumber(String(at1)) || String(at1).match(/^\(.+\)$/)) {
          length += at1;
        } else {
          length += '(' + at1 + ')';
        }
        break;
      default:
        throw Error('Unhandled option (lists_getSublist).');
    }
    code = 'array_slice(' + list + ', ' + at1 + ', ' + length + ')';
  } else {
    var at1 = Go.getAdjusted(block, 'AT1');
    var at2 = Go.getAdjusted(block, 'AT2');
    var functionName = Go.provideFunction_(
      'lists_get_sublist',
      ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
        '($list, $where1, $at1, $where2, $at2) {',
        '  if ($where1 == \'FROM_END\') {',
        '    $at1 = count($list) - 1 - $at1;',
        '  } else if ($where1 == \'FIRST\') {',
        '    $at1 = 0;',
        '  } else if ($where1 != \'FROM_START\') {',
        '    throw new Exception(\'Unhandled option (lists_get_sublist).\');',
        '  }',
        '  $length = 0;',
        '  if ($where2 == \'FROM_START\') {',
        '    $length = $at2 - $at1 + 1;',
        '  } else if ($where2 == \'FROM_END\') {',
        '    $length = count($list) - $at1 - $at2;',
        '  } else if ($where2 == \'LAST\') {',
        '    $length = count($list) - $at1;',
        '  } else {',
        '    throw new Exception(\'Unhandled option (lists_get_sublist).\');',
        '  }',
        '  return array_slice($list, $at1, $length);',
        '}']);
    var code = functionName + '(' + list + ', \'' +
      where1 + '\', ' + at1 + ', \'' + where2 + '\', ' + at2 + ')';
  }
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_sort'] = function (block) {
  // Block for sorting a list.
  var listCode = Go.valueToCode(block, 'LIST',
    Go.ORDER_COMMA) || 'array()';
  var direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
  var type = block.getFieldValue('TYPE');
  var functionName = Go.provideFunction_(
    'lists_sort',
    ['func ' + Go.FUNCTION_NAME_PLACEHOLDER_ +
      '($list, $type, $direction) {',
      '  $sortCmpFuncs = array(',
      '    "NUMERIC" => "strnatcasecmp",',
      '    "TEXT" => "strcmp",',
      '    "IGNORE_CASE" => "strcasecmp"',
      '  );',
      '  $sortCmp = $sortCmpFuncs[$type];',
      '  $list2 = $list;', // Clone list.
      '  usort($list2, $sortCmp);',
      '  if ($direction == -1) {',
      '    $list2 = array_reverse($list2);',
      '  }',
      '  return $list2;',
      '}']);
  var sortCode = functionName +
    '(' + listCode + ', "' + type + '", ' + direction + ')';
  return [sortCode, Go.ORDER_FUNCTION_CALL];
};

Go['lists_split'] = function (block) {
  // Block for splitting text into a list, or joining a list into text.
  var value_input = Go.valueToCode(block, 'INPUT',
    Go.ORDER_COMMA);
  var value_delim = Go.valueToCode(block, 'DELIM',
    Go.ORDER_COMMA) || '\'\'';
  var mode = block.getFieldValue('MODE');
  if (mode == 'SPLIT') {
    if (!value_input) {
      value_input = '\'\'';
    }
    var functionName = 'explode';
  } else if (mode == 'JOIN') {
    if (!value_input) {
      value_input = 'array()';
    }
    var functionName = 'implode';
  } else {
    throw Error('Unknown mode: ' + mode);
  }
  var code = functionName + '(' + value_delim + ', ' + value_input + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};

Go['lists_reverse'] = function (block) {
  // Block for reversing a list.
  var list = Go.valueToCode(block, 'LIST',
    Go.ORDER_COMMA) || '[]';
  var code = 'array_reverse(' + list + ')';
  return [code, Go.ORDER_FUNCTION_CALL];
};
