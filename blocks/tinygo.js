/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';

goog.provide('Blockly.TinyGo');

goog.require('Blockly.Types');

Blockly.TinyGo.init = function(workspace) {
    Blockly.TinyGo.variables_ = [];
    Blockly.TinyGo.pins_ = [];
    Blockly.TinyGo.imports_ = [];
};

Blockly.TinyGo.addImport = function(id, path) {
    Blockly.TinyGo.imports_[id] = path;
};

Blockly.TinyGo.addVariable = function(id, variable) {
    Blockly.TinyGo.variables_[id] = variable;
};

Blockly.TinyGo.addDeclaration = function(id, data) {
    Blockly.TinyGo.pins_[id] = data;
};

Blockly.TinyGo.configurePin = function(id, pinNumber, mode) {
    Blockly.TinyGo.variables_[id] = 'const ' + id + ' = machine.Pin(' + pinNumber + ')';
    Blockly.TinyGo.pins_[id] = id + '.Configure(machine.PinConfig{Mode: machine.Pin' + mode + '})';
    Blockly.TinyGo.imports_['machine'] = 'machine';
};

