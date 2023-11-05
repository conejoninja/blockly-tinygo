/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IParameterModel} from '../interfaces/i_parameter_model.js';
import {IGofuncModel} from '../interfaces/i_gofunc_model.js';
import type {ISerializer} from '../interfaces/i_serializer.js';
import * as priorities from './priorities.js';
import type {Workspace} from '../workspace.js';

/**
 * Representation of a gofunc data model.
 */
export interface State {
  // TODO: This should also handle enabled.
  id: string;
  name: string;
  returnTypes: string[] | null;
  parameters?: ParameterState[];
}

/**
 * Representation of a parameter data model.
 */
export interface ParameterState {
  id: string;
  name: string;
  types?: string[];
}

/**
 * A newable signature for an IGofuncModel.
 *
 * Refer to
 * https://www.typescriptlang.org/docs/handbook/2/generics.html#using-class-types-in-generics
 * for what is going on with this.
 */
type GofuncModelConstructor<GofuncModel extends IGofuncModel> = new (
  workspace: Workspace,
  name: string,
  id: string
) => GofuncModel;

/**
 * A newable signature for an IParameterModel.
 *
 * Refer to
 * https://www.typescriptlang.org/docs/handbook/2/generics.html#using-class-types-in-generics
 * for what is going on with this.
 */
type ParameterModelConstructor<ParameterModel extends IParameterModel> = new (
  workspace: Workspace,
  name: string,
  id: string
) => ParameterModel;

/**
 * Serializes the given IGofuncModel to JSON.
 *
 * @internal
 */
export function saveGofunc(proc: IGofuncModel): State {
  const state: State = {
    id: proc.getId(),
    name: proc.getName(),
    returnTypes: proc.getReturnTypes(),
  };
  if (!proc.getParameters().length) return state;
  state.parameters = proc.getParameters().map((param: any) => saveParameter(param));
  return state;
}

/**
 * Serializes the given IParameterModel to JSON.
 *
 * @internal
 */
export function saveParameter(param: IParameterModel): ParameterState {
  const state: ParameterState = {
    id: param.getId(),
    name: param.getName(),
  };
  if (!param.getTypes().length) return state;
  state.types = param.getTypes();
  return state;
}

/**
 * Deserializes the given gofunc model State from JSON.
 *
 * @internal
 */
export function loadGofunc<
  GofuncModel extends IGofuncModel,
  ParameterModel extends IParameterModel
>(
  gofuncModelClass: GofuncModelConstructor<GofuncModel>,
  parameterModelClass: ParameterModelConstructor<ParameterModel>,
  state: State,
  workspace: Workspace
): GofuncModel {
  console.log("LOAD GOFUNC", state.parameters);
  const proc = new gofuncModelClass(
    workspace,
    state.name,
    state.id
  ).setReturnTypes(state.returnTypes);
  if (!state.parameters) return proc;
  for (const [index, param] of state.parameters.entries()) {
    proc.insertParameter(
      loadParameter(parameterModelClass, param, workspace),
      index
    );
  }
  return proc;
}

/**
 * Deserializes the given ParameterState from JSON.
 *
 * @internal
 */
export function loadParameter<ParameterModel extends IParameterModel>(
  parameterModelClass: ParameterModelConstructor<ParameterModel>,
  state: ParameterState,
  workspace: Workspace
): ParameterModel {
  console.log("LOAD PARAM GOFUNC", state);
  const model = new parameterModelClass(workspace, state.name, state.id);
  if (state.types) model.setTypes(state.types);
  return model;
}

/** Serializer for saving and loading gofunc state. */
export class GofuncSerializer<
  GofuncModel extends IGofuncModel,
  ParameterModel extends IParameterModel
> implements ISerializer
{
  public priority = priorities.PROCEDURES;

  /**
   * Constructs the gofunc serializer.
   *
   * Example usage:
   *   new GofuncSerializer(MyGofuncModelClass, MyParameterModelClass)
   *
   * @param gofuncModelClass The class (implementing IGofuncModel) that
   *     you want this serializer to deserialize.
   * @param parameterModelClass The class (implementing IParameterModel) that
   *     you want this serializer to deserialize.
   */
  constructor(
    private readonly gofuncModelClass: GofuncModelConstructor<GofuncModel>,
    private readonly parameterModelClass: ParameterModelConstructor<ParameterModel>
  ) {}

  /** Serializes the gofunc models of the given workspace. */
  save(workspace: Workspace): State[] | null {
    const save = workspace
      .getGofuncMap()
      .getGofuncs()
      .map((proc:any) => saveGofunc(proc));
    return save.length ? save : null;
  }

  /**
   * Deserializes the gofuncs models defined by the given state into the
   * workspace.
   */
  load(state: State[], workspace: Workspace) {
    console.log("LOADA SOMETHIGN")
    const map = workspace.getGofuncMap();
    console.log("LOADA SOMETHIGN MAP", map);
    for (const procState of state) {
      map.add(
        loadGofunc(
          this.gofuncModelClass,
          this.parameterModelClass,
          procState,
          workspace
        )
      );
    }
  }

  /** Disposes of any gofunc models that exist on the workspace. */
  clear(workspace: Workspace) {
    workspace.getGofuncMap().clear();
  }
}
