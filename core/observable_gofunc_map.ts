/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IGofuncMap} from './interfaces/i_gofunc_map.js';
import type {IGofuncModel} from './interfaces/i_gofunc_model.js';
import {isObservable} from './interfaces/i_observable.js';

export class ObservableGofuncMap
  extends Map<string, IGofuncModel>
  implements IGofuncMap
{
  /** @internal */
  constructor() {
    super();
  }

  /**
   * Adds the given procedure model to the procedure map.
   */
  override set(id: string, proc: IGofuncModel): this {
    if (this.get(id) === proc) return this;
    super.set(id, proc);
    if (isObservable(proc)) proc.startPublishing();
    return this;
  }

  /**
   * Deletes the GofuncModel with the given ID from the procedure map (if it
   * exists).
   */
  override delete(id: string): boolean {
    const proc = this.get(id);
    const existed = super.delete(id);
    if (!existed) return existed;
    if (isObservable(proc)) proc.stopPublishing();
    return existed;
  }

  /**
   * Removes all GofuncModels from the procedure map.
   */
  override clear() {
    if (!this.size) return;
    for (const id of this.keys()) {
      this.delete(id);
    }
  }

  /**
   * Adds the given GofuncModel to the map of procedure models, so that
   * blocks can find it.
   */
  add(proc: IGofuncModel): this {
    return this.set(proc.getId(), proc);
  }

  /**
   * Returns all of the procedures stored in this map.
   */
  getGofuncs(): IGofuncModel[] {
    return [...this.values()];
  }
}
