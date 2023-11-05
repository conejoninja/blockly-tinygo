/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {VariableModel} from '../variable_model.js';

/**
 * Legacy means of representing a gofunc signature. The elements are
 * respectively: name, parameter names, and whether it has a return value.
 */
export type GofuncTuple = [string, VariableModel[], VariableModel[], boolean];

/**
 * Gofunc block type.
 *
 * @internal
 */
export interface GofuncBlock {
  getGofuncCall: () => string;
  renameGofunc: (p1: string, p2: string) => void;
  getGofuncDef: () => GofuncTuple;
}

/** @internal */
export interface LegacyGofuncDefBlock {
  getGofuncDef: () => GofuncTuple;
}

/** @internal */
export function isLegacyGofuncDefBlock(
  block: Object
): block is LegacyGofuncDefBlock {
  return (block as any).getGofuncDef !== undefined;
}

/** @internal */
export interface LegacyGofuncCallBlock {
  getGofuncCall: () => string;
  renameGofunc: (p1: string, p2: string) => void;
}

/** @internal */
export function isLegacyGofuncCallBlock(
  block: Object
): block is LegacyGofuncCallBlock {
  return (
    (block as any).getGofuncCall !== undefined &&
    (block as any).renameGofunc !== undefined
  );
}
