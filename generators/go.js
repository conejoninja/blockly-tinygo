/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Complete helper functions for generating Go for
 *     blocks.  This is the entrypoint for go_compressed.js.
 * @suppress {extraRequire}
 */

import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.all');

import {GoGenerator} from './go/go_generator.js';
import * as colour from './go/colour.js';
import * as lists from './go/lists.js';
import * as logic from './go/logic.js';
import * as loops from './go/loops.js';
import * as math from './go/math.js';
import * as procedures from './go/procedures.js';
import * as text from './go/text.js';
import * as variables from './go/variables.js';
import * as variablesDynamic from './go/variables_dynamic.js';

import * as TinyGo from './go/tinygo.js';
import * as GopherBadge from './go/gopherbadge.js';
import * as GopherBot from './go/gopherbot.js';
import * as Gopherino from './go/gopherino.js';
import * as NetHTTP from './go/nethttp.js';
import * as Sensors from './go/sensors.js';
import * as Gofuncs from './go/gofuncs.js';

export * from './go/go_generator.js';

/**
 * Go code generator instance.
 * @type {!GoGenerator}
 */
export const goGenerator = new GoGenerator();

// Install per-block-type generator functions:
Object.assign(
  goGenerator.forBlock,
  colour, lists, logic, loops, math, procedures,
  text, variables, variablesDynamic,
  TinyGo, GopherBadge, GopherBot, Gopherino, NetHTTP, Sensors, Gofuncs
);
