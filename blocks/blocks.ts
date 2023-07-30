/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks');

import * as colour from './colour.js';
import * as lists from './lists.js';
import * as logic from './logic.js';
import * as loops from './loops.js';
import * as math from './math.js';
import * as procedures from './procedures.js';
import * as texts from './text.js';
import * as variables from './variables.js';
import * as variablesDynamic from './variables_dynamic.js';
import type {BlockDefinition} from '../core/blocks.js';

import * as TinyGo from './tinygo.js';
import * as GopherBadge from './gopherbadge.js';
import * as GopherBot from './gopherbot.js';
import * as Gopherino from './gopherino.js';
import * as NetHTTP from './nethttp.js';
import * as Sensors from './sensors.js';

export {
  colour,
  lists,
  loops,
  math,
  procedures,
  texts,
  variables,
  variablesDynamic,
  TinyGo,
  GopherBadge,
  GopherBot,
  Gopherino,
  NetHTTP,
  Sensors
};

/**
 * A dictionary of the block definitions provided by all the
 * Blockly.libraryBlocks.* modules.
 */
export const blocks: {[key: string]: BlockDefinition} = Object.assign(
  {},
  colour.blocks,
  lists.blocks,
  logic.blocks,
  loops.blocks,
  math.blocks,
  procedures.blocks,
  variables.blocks,
  variablesDynamic.blocks
);
