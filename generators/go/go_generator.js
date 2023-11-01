/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper functions for generating Go for blocks.
 * @suppress {checkTypes|globalThis}
 */

import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go');

import * as stringUtils from '../../core/utils/string.js';
// import type {Block} from '../../core/block.js';
import { CodeGenerator } from '../../core/generator.js';
import { Names } from '../../core/names.js';
// import type {Workspace} from '../../core/workspace.js';
import { inputTypes } from '../../core/inputs/input_types.js';
import { GoFmtServer } from './gofmt_server.js';


/**
 * Order of operation ENUMs.
 * http://php.net/manual/en/language.operators.precedence.php
 * @enum {number}
 */
export const Order = {
  ATOMIC: 0,             // 0 "" ...
  CLONE: 1,              // clone
  NEW: 1,                // new
  MEMBER: 2.1,           // []
  FUNCTION_CALL: 2.2,    // ()
  POWER: 3,              // **
  INCREMENT: 4,          // ++
  DECREMENT: 4,          // --
  BITWISE_NOT: 4,        // ~
  CAST: 4,               // (int) (float) (string) (array) ...
  SUPPRESS_ERROR: 4,     // @
  INSTANCEOF: 5,         // instanceof
  LOGICAL_NOT: 6,        // !
  UNARY_PLUS: 7.1,       // +
  UNARY_NEGATION: 7.2,   // -
  MULTIPLICATION: 8.1,   // *
  DIVISION: 8.2,         // /
  MODULUS: 8.3,          // %
  ADDITION: 9.1,         // +
  SUBTRACTION: 9.2,      // -
  STRING_CONCAT: 9.3,    // .
  BITWISE_SHIFT: 10,     // << >>
  RELATIONAL: 11,        // < <= > >=
  EQUALITY: 12,          // == != === !== <> <=>
  REFERENCE: 13,         // &
  BITWISE_AND: 13,       // &
  BITWISE_XOR: 14,       // ^
  BITWISE_OR: 15,        // |
  LOGICAL_AND: 16,       // &&
  LOGICAL_OR: 17,        // ||
  IF_NULL: 18,           // ??
  CONDITIONAL: 19,       // ?:
  ASSIGNMENT: 20,        // = += -= *= /= %= <<= >>= ...
  LOGICAL_AND_WEAK: 21,  // and
  LOGICAL_XOR: 22,       // xor
  LOGICAL_OR_WEAK: 23,   // or
  COMMA: 24,             // ,
  NONE: 99,              // (...)
};

export class GoGenerator extends CodeGenerator {
  variables_;
  pins_;
  imports_;
  /**
   * List of outer-inner pairings that do NOT require parentheses.
   * @type {!Array<!Array<number>>}
   */
  ORDER_OVERRIDES = [
    // (foo()).bar() -> foo().bar()
    // (foo())[0] -> foo()[0]
    [Order.MEMBER, Order.FUNCTION_CALL],
    // (foo[0])[1] -> foo[0][1]
    // (foo.bar).baz -> foo.bar.baz
    [Order.MEMBER, Order.MEMBER],
    // !(!foo) -> !!foo
    [Order.LOGICAL_NOT, Order.LOGICAL_NOT],
    // a * (b * c) -> a * b * c
    [Order.MULTIPLICATION, Order.MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Order.ADDITION, Order.ADDITION],
    // a && (b && c) -> a && b && c
    [Order.LOGICAL_AND, Order.LOGICAL_AND],
    // a || (b || c) -> a || b || c
    [Order.LOGICAL_OR, Order.LOGICAL_OR]
  ];

  constructor(name) {
    super(name ?? 'Go');
    this.isInitialized = false;

    // Copy Order values onto instance for backwards compatibility
    // while ensuring they are not part of the publically-advertised
    // API.
    //
    // TODO(#7085): deprecate these in due course.  (Could initially
    // replace data properties with get accessors that call
    // deprecate.warn().)
    for (const key in Order) {
      this['ORDER_' + key] = Order[key];
    }

    // List of illegal variable names.  This is not intended to be a
    // security feature.  Blockly is 100% client-side, so bypassing
    // this list is trivial.  This is intended to prevent users from
    // accidentally clobbering a built-in object or function.
    this.addReservedWords(
      // https://golang.org/ref/spec#Keywords
      'break,default,func,interface,select' +
      'case,defer,go,map,struct' +
      'chan,else,goto,package,switch' +
      'const,fallthrough,if,range,type' +
      'continue,for,import,return,var'
    );
  }

  /**
   * Initialise the database of variable names.
   * @param {!Workspace} workspace Workspace to generate code from.
   */
  init(workspace) {
    super.init(workspace);

    this.variables_ = Object.create(null);
    this.pins_ = Object.create(null);
    this.imports_ = Object.create(null);

    if (!this.nameDB_) {
      this.nameDB_ = new Names(this.RESERVED_WORDS_);
    } else {
      this.nameDB_.reset();
    }

    this.nameDB_.setVariableMap(workspace.getVariableMap());
    this.nameDB_.populateVariables(workspace);
    this.nameDB_.populateProcedures(workspace);
    this.nameDB_.populateGofuncs(workspace);

    const defvars = [];
    /*
    // Add developer variables (not created or named by the user).
    const devVarList = Variables.allDeveloperVariables(workspace);
    for (let i = 0; i < devVarList.length; i++) {
      defvars.push(devVarList[i]);
    }

    // Add user variables, but only ones that are being used.
    const variables = Variables.allUsedVarModels(workspace);
    for (let i = 0; i < variables.length; i++) {
      defvars.push(variables[i]);
    }*/

    // Set variable declarations with their Go type in the defines dictionary
    for (let i = 0; i < defvars.length; i++) {
      this.addVariable(defvars[i].name,
        'var ' + defvars[i].name + ' ' + this.getGoType(defvars[i].type));
    }
    this.isInitialized = true;
  };

  /**
   * Prepend the generated code with the variable definitions.
   * @param {string} code Generated code.
   * @return {string} Completed code.
   */
  finish(code) {
    var defvars = [];
    for (var i in this.variables_) {
      defvars.push(this.variables_[i]);
    }

    // Declare all of the variables.
    let variables = defvars.join('\n');


    defvars = [];
    for (var i in this.pins_) {
      defvars.push(this.pins_[i]);
    }

    code = variables + '\n\nfunc main() {\n' + defvars.join('\n') + '\n' + code + '}';

    // Convert the definitions dictionary into a list.
    var definitions = [];
    for (var name in this.definitions_) {
      definitions.push(this.definitions_[name]);
    }

    defvars = [];
    for (var i in this.imports_) {
      if (this.imports_[i].indexOf('"') == -1) {
        defvars.push('"' + this.imports_[i] + '"');
      } else {
        defvars.push(this.imports_[i]);
      }
    }
    let importsStr = '';
    if (defvars.length > 0) {
      importsStr = 'import(\n' + defvars.join('\n\n') + '\n)';
    }

    // Clean up temporary data.
    delete this.definitions_;
    delete this.functionNames_;
    code = 'package main\n\n' + importsStr + '\n\n' + code + '\n' + definitions.join('\n');
    let dataCode = '';
    let gfs = new GoFmtServer();
    console.log(code, "CODE", gfs.toBinary(code));
    //gfs.postJson('http://127.0.0.1:18003/api/fmt', gfs.toBinary(code), function (data) {
    gfs.postJson('https://configurator.gopherbadge.com:18003/api/fmt', gfs.toBinary(code), function (data) {
        console.log(data, data.code, "RESPONSE", gfs.fromBinary(data.code));
      dataCode = gfs.fromBinary(data.code);
    });
    return dataCode;
  };

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  A trailing semicolon is needed to make this legal.
   * @param {string} line Line of generated code.
   * @return {string} Legal line of code.
   */
  scrubNakedValue(line) {
    return line + ';\n';
  };

  /**
   * Encode a string as a properly escaped Go string, complete with
   * quotes.
   * @param {string} string Text to encode.
   * @return {string} Go string.
   * @protected
   */
  quote_(string) {
    string = string.replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\\n')
      .replace(/"/g, '\"');
    return '"' + string + '"';
  };

  /**
   * Encode a string as a properly escaped multiline Go string, complete with
   * quotes.
   * @param {string} string Text to encode.
   * @return {string} Go string.
   * @protected
   */
  multiline_quote_(string) {
    return '`' + string + '\n`';
  };

  /**
   * Common tasks for generating Go from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   * @param {!Block} block The current block.
   * @param {string} code The Go code created for this block.
   * @param {boolean=} opt_thisOnly True to generate code for only this
   *     statement.
   * @return {string} Go code with comments and subsequent blocks added.
   * @protected
   */
  scrub_(block, code, opt_thisOnly) {
    let commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      let comment = block.getCommentText();
      if (comment) {
        comment = stringUtils.wrap(comment, this.COMMENT_WRAP - 3);
        commentCode += this.prefixLines(comment, '// ') + '\n';
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let i = 0; i < block.inputList.length; i++) {
        if (block.inputList[i].type === inputTypes.VALUE) {
          const childBlock = block.inputList[i].connection.targetBlock();
          if (childBlock) {
            comment = this.allNestedComments(childBlock);
            if (comment) {
              commentCode += this.prefixLines(comment, '// ');
            }
          }
        }
      }
    }
    const nextBlock =
      block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  /**
   * Gets a property and adjusts the value while taking into account indexing.
   * @param {!Block} block The block.
   * @param {string} atId The property ID of the element to get.
   * @param {number=} opt_delta Value to add.
   * @param {boolean=} opt_negate Whether to negate the value.
   * @param {number=} opt_order The highest order acting on this value.
   * @return {string|number}
   */
  getAdjusted(block, atId, opt_delta, opt_negate, opt_order) {
    let delta = opt_delta || 0;
    let order = opt_order || this.ORDER_NONE;
    if (block.workspace.options.oneBasedIndex) {
      delta--;
    }
    let defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
    let outerOrder = order;
    let innerOrder;
    if (delta > 0) {
      outerOrder = this.ORDER_ADDITION;
      innerOrder = this.ORDER_ADDITION;
    } else if (delta < 0) {
      outerOrder = this.ORDER_SUBTRACTION;
      innerOrder = this.ORDER_SUBTRACTION;
    } else if (opt_negate) {
      outerOrder = this.ORDER_UNARY_NEGATION;
      innerOrder = this.ORDER_UNARY_NEGATION;
    }
    let at = this.valueToCode(block, atId, outerOrder) || defaultAtIndex;

    if (stringUtils.isNumber(at)) {
      // If the index is a naked number, adjust it right now.
      at = Number(at) + delta;
      if (opt_negate) {
        at = -at;
      }
    } else {
      // If the index is dynamic, adjust it in code.
      if (delta > 0) {
        at = at + ' + ' + delta;
      } else if (delta < 0) {
        at = at + ' - ' + -delta;
      }
      if (opt_negate) {
        if (delta) {
          at = '-(' + at + ')';
        } else {
          at = '-' + at;
        }
      }
      innerOrder = Math.floor(innerOrder);
      order = Math.floor(order);
      if (innerOrder && order >= innerOrder) {
        at = '(' + at + ')';
      }
    }
    return at;
  };



  getGoType(typeBlockly) {
    console.log("TYPE", typeBlockly);
    if (typeBlockly == undefined) {
      return 'Invalid Blockly Type';
    }
    switch (typeBlockly) {
      case 'Number':
        return 'int32';
      default:
        return typeBlockly.toLowerCase();
    }
  };

  /**
   * Adds a string of code to declare a variable globally to the sketch.
   * Only if overwrite option is set to true it will overwrite whatever
   * value the identifier held before.
   * @param {!string} varName The name of the variable to declare.
   * @param {!string} code Code to be added for the declaration.
   * @param {boolean=} overwrite Flag to ignore previously set value.
   * @return {!boolean} Indicates if the declaration overwrote a previous one.
   */
  addVariable(varName, code, overwrite) {
    var overwritten = false;
    if (overwrite || (this.variables_[varName] === undefined)) {
      this.variables_[varName] = code;
      overwritten = true;
    }
    return overwritten;
  };


  addImport(id, path) {
    this.imports_[id] = path;
  };

  addDeclaration(id, data) {
    this.pins_[id] = data;
  };

  configurePin(id, pinNumber, mode) {
    this.variables_[id] = 'const ' + id + ' = machine.Pin(' + pinNumber + ')';
    this.pins_[id] = id + '.Configure(machine.PinConfig{Mode: machine.Pin' + mode + '})';
    this.imports_['machine'] = 'machine';
  };

}
