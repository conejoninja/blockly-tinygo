/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper functions for generating Go for blocks.
 * @author daarond@gmail.com (Daaron Dwyer)
 */
'use strict';

goog.provide('Blockly.Go');

goog.require('Blockly.Generator');
goog.require('Blockly.utils.string');


/**
 * Go code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Go = new Blockly.Generator('Go');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Go.addReservedWords(
        // http://Go.net/manual/en/reserved.keywords.Go
    '__halt_compiler,abstract,and,array,as,break,callable,case,catch,class,' +
    'clone,const,continue,declare,default,die,do,echo,else,elseif,empty,' +
    'enddeclare,endfor,endforeach,endif,endswitch,endwhile,eval,exit,extends,' +
    'final,for,foreach,function,global,goto,if,implements,include,' +
    'include_once,instanceof,insteadof,interface,isset,list,namespace,new,or,' +
    'print,private,protected,public,require,require_once,return,static,' +
    'switch,throw,trait,try,unset,use,var,while,xor,' +
        // http://Go.net/manual/en/reserved.constants.Go
    'Go_VERSION,Go_MAJOR_VERSION,Go_MINOR_VERSION,Go_RELEASE_VERSION,' +
    'Go_VERSION_ID,Go_EXTRA_VERSION,Go_ZTS,Go_DEBUG,Go_MAXPATHLEN,' +
    'Go_OS,Go_SAPI,Go_EOL,Go_INT_MAX,Go_INT_SIZE,DEFAULT_INCLUDE_PATH,' +
    'PEAR_INSTALL_DIR,PEAR_EXTENSION_DIR,Go_EXTENSION_DIR,Go_PREFIX,' +
    'Go_BINDIR,Go_BINARY,Go_MANDIR,Go_LIBDIR,Go_DATADIR,Go_SYSCONFDIR,' +
    'Go_LOCALSTATEDIR,Go_CONFIG_FILE_PATH,Go_CONFIG_FILE_SCAN_DIR,' +
    'Go_SHLIB_SUFFIX,E_ERROR,E_WARNING,E_PARSE,E_NOTICE,E_CORE_ERROR,' +
    'E_CORE_WARNING,E_COMPILE_ERROR,E_COMPILE_WARNING,E_USER_ERROR,' +
    'E_USER_WARNING,E_USER_NOTICE,E_DEPRECATED,E_USER_DEPRECATED,E_ALL,' +
    'E_STRICT,__COMPILER_HALT_OFFSET__,TRUE,FALSE,NULL,__CLASS__,__DIR__,' +
    '__FILE__,__FUNCTION__,__LINE__,__METHOD__,__NAMESPACE__,__TRAIT__'
);

/**
 * Order of operation ENUMs.
 * http://Go.net/manual/en/language.operators.precedence.Go
 */
Blockly.Go.ORDER_ATOMIC = 0;             // 0 "" ...
Blockly.Go.ORDER_CLONE = 1;              // clone
Blockly.Go.ORDER_NEW = 1;                // new
Blockly.Go.ORDER_MEMBER = 2.1;           // []
Blockly.Go.ORDER_FUNCTION_CALL = 2.2;    // ()
Blockly.Go.ORDER_POWER = 3;              // **
Blockly.Go.ORDER_INCREMENT = 4;          // ++
Blockly.Go.ORDER_DECREMENT = 4;          // --
Blockly.Go.ORDER_BITWISE_NOT = 4;        // ~
Blockly.Go.ORDER_CAST = 4;               // (int) (float) (string) (array) ...
Blockly.Go.ORDER_SUPPRESS_ERROR = 4;     // @
Blockly.Go.ORDER_INSTANCEOF = 5;         // instanceof
Blockly.Go.ORDER_LOGICAL_NOT = 6;        // !
Blockly.Go.ORDER_UNARY_PLUS = 7.1;       // +
Blockly.Go.ORDER_UNARY_NEGATION = 7.2;   // -
Blockly.Go.ORDER_MULTIPLICATION = 8.1;   // *
Blockly.Go.ORDER_DIVISION = 8.2;         // /
Blockly.Go.ORDER_MODULUS = 8.3;          // %
Blockly.Go.ORDER_ADDITION = 9.1;         // +
Blockly.Go.ORDER_SUBTRACTION = 9.2;      // -
Blockly.Go.ORDER_STRING_CONCAT = 9.3;    // .
Blockly.Go.ORDER_BITWISE_SHIFT = 10;     // << >>
Blockly.Go.ORDER_RELATIONAL = 11;        // < <= > >=
Blockly.Go.ORDER_EQUALITY = 12;          // == != === !== <> <=>
Blockly.Go.ORDER_REFERENCE = 13;         // &
Blockly.Go.ORDER_BITWISE_AND = 13;       // &
Blockly.Go.ORDER_BITWISE_XOR = 14;       // ^
Blockly.Go.ORDER_BITWISE_OR = 15;        // |
Blockly.Go.ORDER_LOGICAL_AND = 16;       // &&
Blockly.Go.ORDER_LOGICAL_OR = 17;        // ||
Blockly.Go.ORDER_IF_NULL = 18;           // ??
Blockly.Go.ORDER_CONDITIONAL = 19;       // ?:
Blockly.Go.ORDER_ASSIGNMENT = 20;        // = += -= *= /= %= <<= >>= ...
Blockly.Go.ORDER_LOGICAL_AND_WEAK = 21;  // and
Blockly.Go.ORDER_LOGICAL_XOR = 22;       // xor
Blockly.Go.ORDER_LOGICAL_OR_WEAK = 23;   // or
Blockly.Go.ORDER_COMMA = 24;             // ,
Blockly.Go.ORDER_NONE = 99;              // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.Go.ORDER_OVERRIDES = [
  // (foo()).bar() -> foo().bar()
  // (foo())[0] -> foo()[0]
  [Blockly.Go.ORDER_MEMBER, Blockly.Go.ORDER_FUNCTION_CALL],
  // (foo[0])[1] -> foo[0][1]
  // (foo.bar).baz -> foo.bar.baz
  [Blockly.Go.ORDER_MEMBER, Blockly.Go.ORDER_MEMBER],
  // !(!foo) -> !!foo
  [Blockly.Go.ORDER_LOGICAL_NOT, Blockly.Go.ORDER_LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [Blockly.Go.ORDER_MULTIPLICATION, Blockly.Go.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [Blockly.Go.ORDER_ADDITION, Blockly.Go.ORDER_ADDITION],
  // a && (b && c) -> a && b && c
  [Blockly.Go.ORDER_LOGICAL_AND, Blockly.Go.ORDER_LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [Blockly.Go.ORDER_LOGICAL_OR, Blockly.Go.ORDER_LOGICAL_OR]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Go.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Go.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Go.functionNames_ = Object.create(null);

  if (!Blockly.Go.variableDB_) {
    Blockly.Go.variableDB_ =
        new Blockly.Names(Blockly.Go.RESERVED_WORDS_, '$');
  } else {
    Blockly.Go.variableDB_.reset();
  }

  Blockly.Go.variableDB_.setVariableMap(workspace.getVariableMap());

  var defvars = [];
  // Add developer variables (not created or named by the user).
  var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    defvars.push(Blockly.Go.variableDB_.getName(devVarList[i],
        Blockly.Names.DEVELOPER_VARIABLE_TYPE) + ';');
  }

  // Add user variables, but only ones that are being used.
  var variables = Blockly.Variables.allUsedVarModels(workspace);
  for (var i = 0, variable; variable = variables[i]; i++) {
    defvars.push(Blockly.Go.variableDB_.getName(variable.getId(),
        Blockly.VARIABLE_CATEGORY_NAME) + ';');
  }

  // Declare all of the variables.
  Blockly.Go.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Go.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.Go.definitions_) {
    definitions.push(Blockly.Go.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Go.definitions_;
  delete Blockly.Go.functionNames_;
  Blockly.Go.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Go.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Go string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Go string.
 * @private
 */
Blockly.Go.quote_ = function(string) {
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Encode a string as a properly escaped multiline Go string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Go string.
 * @private
 */
Blockly.Go.multiline_quote_ = function(string) {
  return '<<<EOT\n' + string + '\nEOT';
};

/**
 * Common tasks for generating Go from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Go code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Go code with comments and subsequent blocks added.
 * @private
 */
Blockly.Go.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      comment = Blockly.utils.string.wrap(comment,
          Blockly.Go.COMMENT_WRAP - 3);
      commentCode += Blockly.Go.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Blockly.Go.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Go.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Blockly.Go.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.Go.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.Go.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.Go.valueToCode(block, atId,
            Blockly.Go.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.Go.valueToCode(block, atId,
            Blockly.Go.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.Go.valueToCode(block, atId,
            Blockly.Go.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.Go.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = Number(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.Go.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.Go.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.Go.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
