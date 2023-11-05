/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IGofuncModel} from './i_gofunc_model.js';

export interface IGofuncMap extends Map<string, IGofuncModel> {
  /**
   * Adds the given GofuncModel to the map of procedure models, so that
   * blocks can find it.
   */
  add(proc: IGofuncModel): this;

  /** Returns all of the procedures stored in this map. */
  getGofuncs(): IGofuncModel[];
}
