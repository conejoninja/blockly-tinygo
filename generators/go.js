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

goog.require('Blockly.Types');
const {Generator} = goog.require('Blockly.Generator');
goog.require('Blockly.utils.string');
goog.require('GoFmtServer');
goog.require('Blockly.libraryBlocks.TinyGo');
goog.require('Blockly.Names');


/**
 * Go code generator.
 * @type {!Blockly.Generator}
 */
Go = new Generator('Go');
Go.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Go.addReservedWords(
    // https://golang.org/ref/spec#Keywords
    'break,default,func,interface,select' +
    'case,defer,go,map,struct' +
    'chan,else,goto,package,switch' +
    'const,fallthrough,if,range,type' +
    'continue,for,import,return,var'
);

/**
 * Order of operation ENUMs.
 * http://Go.net/manual/en/language.operators.precedence.Go
 */
Go.ORDER_ATOMIC = 0;             // 0 "" ...
Go.ORDER_CLONE = 1;              // clone
Go.ORDER_NEW = 1;                // new
Go.ORDER_MEMBER = 2.1;           // []
Go.ORDER_FUNCTION_CALL = 2.2;    // ()
Go.ORDER_POWER = 3;              // **
Go.ORDER_INCREMENT = 4;          // ++
Go.ORDER_DECREMENT = 4;          // --
Go.ORDER_BITWISE_NOT = 4;        // ~
Go.ORDER_CAST = 4;               // (int) (float) (string) (array) ...
Go.ORDER_SUPPRESS_ERROR = 4;     // @
Go.ORDER_INSTANCEOF = 5;         // instanceof
Go.ORDER_LOGICAL_NOT = 6;        // !
Go.ORDER_UNARY_PLUS = 7.1;       // +
Go.ORDER_UNARY_NEGATION = 7.2;   // -
Go.ORDER_MULTIPLICATION = 8.1;   // *
Go.ORDER_DIVISION = 8.2;         // /
Go.ORDER_MODULUS = 8.3;          // %
Go.ORDER_ADDITION = 9.1;         // +
Go.ORDER_SUBTRACTION = 9.2;      // -
Go.ORDER_STRING_CONCAT = 9.3;    // .
Go.ORDER_BITWISE_SHIFT = 10;     // << >>
Go.ORDER_RELATIONAL = 11;        // < <= > >=
Go.ORDER_EQUALITY = 12;          // == != === !== <> <=>
Go.ORDER_REFERENCE = 13;         // &
Go.ORDER_BITWISE_AND = 13;       // &
Go.ORDER_BITWISE_XOR = 14;       // ^
Go.ORDER_BITWISE_OR = 15;        // |
Go.ORDER_LOGICAL_AND = 16;       // &&
Go.ORDER_LOGICAL_OR = 17;        // ||
Go.ORDER_IF_NULL = 18;           // ??
Go.ORDER_CONDITIONAL = 19;       // ?:
Go.ORDER_ASSIGNMENT = 20;        // = += -= *= /= %= <<= >>= ...
Go.ORDER_LOGICAL_AND_WEAK = 21;  // and
Go.ORDER_LOGICAL_XOR = 22;       // xor
Go.ORDER_LOGICAL_OR_WEAK = 23;   // or
Go.ORDER_COMMA = 24;             // ,
Go.ORDER_NONE = 99;              // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Go.ORDER_OVERRIDES = [
    // (foo()).bar() -> foo().bar()
    // (foo())[0] -> foo()[0]
    [Go.ORDER_MEMBER, Go.ORDER_FUNCTION_CALL],
    // (foo[0])[1] -> foo[0][1]
    // (foo.bar).baz -> foo.bar.baz
    [Go.ORDER_MEMBER, Go.ORDER_MEMBER],
    // !(!foo) -> !!foo
    [Go.ORDER_LOGICAL_NOT, Go.ORDER_LOGICAL_NOT],
    // a * (b * c) -> a * b * c
    [Go.ORDER_MULTIPLICATION, Go.ORDER_MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Go.ORDER_ADDITION, Go.ORDER_ADDITION],
    // a && (b && c) -> a && b && c
    [Go.ORDER_LOGICAL_AND, Go.ORDER_LOGICAL_AND],
    // a || (b || c) -> a || b || c
    [Go.ORDER_LOGICAL_OR, Go.ORDER_LOGICAL_OR]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Go.init = function (workspace) {
    Go.variables_ = Object.create(null);


    // Create a dictionary of definitions to be printed before the code.
    Go.definitions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions).
    Go.functionNames_ = Object.create(null);

    if (!Go.variableDB_) {
        Go.variableDB_ =
            new Blockly.Names(Go.RESERVED_WORDS_, '');
    } else {
        Go.variableDB_.reset();
    }

    Go.variableDB_.setVariableMap(workspace.getVariableMap());

    var defvars = [];
    // Add developer variables (not created or named by the user).
    var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
    for (var i = 0; i < devVarList.length; i++) {
        defvars.push(Go.variableDB_.getName(devVarList[i],
            Blockly.Names.DEVELOPER_VARIABLE_TYPE) + '');
    }

    // Add user variables, but only ones that are being used.
    var variables = Blockly.Variables.allUsedVarModels(workspace);
    for (var i = 0, variable; variable = variables[i]; i++) {
        defvars.push(Go.variableDB_.getName(variable.getId(),
            Blockly.VARIABLE_CATEGORY_NAME) + '');
    }

    // Iterate through to capture all blocks types and set the function arguments
    var varsWithTypes = Go.StaticTyping.collectVarsWithTypes(workspace);
    Go.StaticTyping.setProcedureArgs(workspace, varsWithTypes);
    // Set variable declarations with their Go type in the defines dictionary
    for (let varName in varsWithTypes) {
        let vName = "xXx";
        for (let v in variables) {
            if (variables[v].id_ == varName) {
                vName = variables[v].name;
                break;
            }
        }
        Go.addVariable(varName,
            'var ' + vName + ' ' + Go.getGoType_(varsWithTypes[varName]));
    }

    Blockly.TinyGo.init(workspace);

};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Go.finish = function (code) {
    var defvars = [];
    for (var i in Go.variables_) {
        defvars.push(Go.variables_[i]);
    }

    for (var i in Blockly.TinyGo.variables_) {
        defvars.push(Blockly.TinyGo.variables_[i]);
    }

    // Declare all of the variables.
    let variables = defvars.join('\n');


    defvars = [];
    for (var i in Blockly.TinyGo.pins_) {
        defvars.push(Blockly.TinyGo.pins_[i]);
    }

    code = variables + '\n\nfunc main() {\n' + defvars.join('\n') + '\n' + code + '}';

    // Convert the definitions dictionary into a list.
    var definitions = [];
    for (var name in Go.definitions_) {
        definitions.push(Go.definitions_[name]);
    }

    defvars = [];
    for (var i in Blockly.TinyGo.imports_) {
        defvars.push('"' + Blockly.TinyGo.imports_[i] + '"');
    }
    let importsStr = '';
    if (defvars.length > 0) {
        importsStr = 'import(\n' + defvars.join('\n\n') + '\n)';
    }

    // Clean up temporary data.
    delete Go.definitions_;
    delete Go.functionNames_;
    Go.variableDB_.reset();
    code = 'package main\n\n' + importsStr + '\n\n' + code + '\n' + definitions.join('\n');
    let dataCode = '';
    GoFmtServer.postJson('http://localhost:8737/api/fmt', code, function (data) {
        dataCode = data.code;
    });
    return dataCode;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Go.scrubNakedValue = function (line) {
    return line + '\n';
};

/**
 * Encode a string as a properly escaped Go string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Go string.
 * @private
 */
Go.quote_ = function (string) {
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
 * @private
 */
Go.multiline_quote_ = function (string) {
    return '`' + string + '\n`';
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
Go.scrub_ = function (block, code, opt_thisOnly) {
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        if (comment) {
            comment = Blockly.utils.string.wrap(comment,
                Go.COMMENT_WRAP - 3);
            commentCode += Go.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments.
        // Don't collect comments for nested statements.
        for (var i = 0; i < block.inputList.length; i++) {
            if (block.inputList[i].type == Blockly.INPUT_VALUE) {
                var childBlock = block.inputList[i].connection.targetBlock();
                if (childBlock) {
                    comment = Go.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += Go.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = opt_thisOnly ? '' : Go.blockToCode(nextBlock);
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
Go.getAdjusted = function (block, atId, opt_delta, opt_negate,
                                   opt_order) {
    var delta = opt_delta || 0;
    var order = opt_order || Go.ORDER_NONE;
    if (block.workspace.options.oneBasedIndex) {
        delta--;
    }
    var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
    if (delta > 0) {
        var at = Go.valueToCode(block, atId,
            Go.ORDER_ADDITION) || defaultAtIndex;
    } else if (delta < 0) {
        var at = Go.valueToCode(block, atId,
            Go.ORDER_SUBTRACTION) || defaultAtIndex;
    } else if (opt_negate) {
        var at = Go.valueToCode(block, atId,
            Go.ORDER_UNARY_NEGATION) || defaultAtIndex;
    } else {
        var at = Go.valueToCode(block, atId, order) ||
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
            var innerOrder = Go.ORDER_ADDITION;
        } else if (delta < 0) {
            at = at + ' - ' + -delta;
            var innerOrder = Go.ORDER_SUBTRACTION;
        }
        if (opt_negate) {
            if (delta) {
                at = '-(' + at + ')';
            } else {
                at = '-' + at;
            }
            var innerOrder = Go.ORDER_UNARY_NEGATION;
        }
        innerOrder = Math.floor(innerOrder);
        order = Math.floor(order);
        if (innerOrder && order >= innerOrder) {
            at = '(' + at + ')';
        }
    }
    return at;
};

Go.getGoType_ = function (typeBlockly) {
    console.log("TYPEBLOCKLY", typeBlockly, Blockly.Types.COLOUR);
    if (typeBlockly == undefined) {
        return 'Invalid Blockly Type';
    }
    switch (typeBlockly) {
        case Blockly.Types.SHORT_NUMBER.typeId:
            return 'uint8';
        case Blockly.Types.NUMBER.typeId:
            return 'int32';
        case Blockly.Types.LARGE_NUMBER.typeId:
            return 'int64';
        case Blockly.Types.DECIMAL.typeId:
            return 'float32';
        case Blockly.Types.TEXT.typeId:
            return 'string';
        case Blockly.Types.STRING.typeId:
            return 'string';
        case Blockly.Types.CHARACTER.typeId:
            return 'byte';
        case Blockly.Types.BOOLEAN.typeId:
            return 'bool';
        case Blockly.Types.NULL.typeId:
            return 'nil';
        case Blockly.Types.COLOUR:
            return 'color.RGBA'
        case Blockly.Types.CHILD_BLOCK_MISSING.typeId:
            // If no block connected default to int, change for easier debugging
            //return 'ChildBlockMissing';
            return 'int32';
        default:
            return 'Invalid Blockly Type';
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
Go.addVariable = function (varName, code, overwrite) {
    console.log("ADD VARIABLE", varName, code, overwrite);
    var overwritten = false;
    if (overwrite || (Go.variables_[varName] === undefined)) {
        Go.variables_[varName] = code;
        overwritten = true;
    }
    return overwritten;
};
