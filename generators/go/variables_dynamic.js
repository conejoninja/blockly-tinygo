/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Go for dynamic variable blocks.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.module('Blockly.Go.variablesDynamic');

const {goGenerator: Go} = goog.require('Blockly.Go');
/** @suppress {extraRequire} */
goog.require('Blockly.Go.variables');


// Go is dynamically typed.
Go['variables_get_dynamic'] = Go['variables_get'];
Go['variables_set_dynamic'] = Go['variables_set'];
