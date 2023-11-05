/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {Block} from '../block.js';
import {IGofuncModel} from './i_gofunc_model.js';
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.gofuncs.IGofuncBlock');

/** The interface for a block which models a procedure. */
export interface IGofuncBlock {
  getGofuncModel(): IGofuncModel;
  doGofuncUpdate(): void;
  isGofuncDef(): boolean;
}

/** A type guard which checks if the given block is a procedure block. */
export function isGofuncBlock(
  block: Block | IGofuncBlock
): block is IGofuncBlock {
  return (
    (block as IGofuncBlock).getGofuncModel !== undefined &&
    (block as IGofuncBlock).doGofuncUpdate !== undefined &&
    (block as IGofuncBlock).isGofuncDef !== undefined
  );
}
