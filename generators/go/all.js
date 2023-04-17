/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Complete helper functions for generating Go for
 *     blocks.  This is the entrypoint for php_compressed.js.
 * @suppress {extraRequire}
 */
'use strict';

goog.module('Blockly.Go.all');

const moduleExports = goog.require('Blockly.Go');
goog.require('Blockly.Go.colour');
goog.require('Blockly.Go.lists');
goog.require('Blockly.Go.logic');
goog.require('Blockly.Go.loops');
goog.require('Blockly.Go.math');
goog.require('Blockly.Go.procedures');
goog.require('Blockly.Go.texts');
goog.require('Blockly.Go.variables');
goog.require('Blockly.Go.variablesDynamic');

goog.require('Blockly.TinyGo');
goog.require('Blockly.Gopherino');
goog.require('Blockly.Gopherbot');
goog.require('Blockly.NetHTTP');
goog.require('Blockly.Sensors');

exports = moduleExports;