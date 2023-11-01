/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.Gofuncs');

// Unused import preserved for side-effects. Remove if unneeded.
import './events/events_block_change.js';

import type {Block} from './block.js';
import type {BlockSvg} from './block_svg.js';
import {Blocks} from './blocks.js';
import * as common from './common.js';
import type {Abstract} from './events/events_abstract.js';
import type {BubbleOpen} from './events/events_bubble_open.js';
import * as eventUtils from './events/utils.js';
import {Field, UnattachedFieldError} from './field.js';
import {Msg} from './msg.js';
import {Names} from './names.js';
import {IParameterModel} from './interfaces/i_parameter_model.js';
import {IGofuncMap} from './interfaces/i_gofunc_map.js';
import {IGofuncModel} from './interfaces/i_gofunc_model.js';
import {
  IGofuncBlock,
  isGofuncBlock,
} from './interfaces/i_gofunc_block.js';
import {
  isLegacyGofuncCallBlock,
  isLegacyGofuncDefBlock,
  GofuncBlock,
  GofuncTuple,
} from './interfaces/i_legacy_gofunc_blocks.js';
import {ObservableGofuncMap} from './observable_gofunc_map.js';
import * as utilsXml from './utils/xml.js';
import * as Variables from './variables.js';
import type {Workspace} from './workspace.js';
import type {WorkspaceSvg} from './workspace_svg.js';
import {MutatorIcon} from './icons.js';
import type {VariableModel} from '../core/variable_model.js';


/**
 * String for use in the "custom" attribute of a category in toolbox XML.
 * This string indicates that the category should be dynamically populated with
 * gofunc blocks.
 * See also Blockly.Variables.CATEGORY_NAME and
 * Blockly.VariablesDynamic.CATEGORY_NAME.
 */
export const CATEGORY_NAME = 'GOFUNC';

/**
 * The default argument for a gofuncs_mutatorarg block.
 */
export const DEFAULT_ARG = 'x';

/**
 * Find all user-created gofunc definitions in a workspace.
 *
 * @param root Root workspace.
 * @returns Pair of arrays, the first contains gofuncs without return
 *     variables, the second with. Each gofunc is defined by a three-element
 *     list of name, parameter list, and return value boolean.
 */
export function allGofuncs(
  root: Workspace
): GofuncTuple[] {
  const gofuncsReturn: GofuncTuple[] = root
    .getGofuncMap()
    .getGofuncs()
    .filter((p) => !!p.getReturnTypes())
    .map((p) => [
      p.getName(),
      //p.getParameters().map((pa) => pa.getName()),
      [],
      [],
      true,
    ]);
  root.getBlocksByType('gofuncs_defreturn', false).forEach((b) => {
    if (!isGofuncBlock(b) && isLegacyGofuncDefBlock(b)) {
      gofuncsReturn.push(b.getGofuncDef());
    }
  });
  gofuncsReturn.sort(procTupleComparator);
  console.log("ALL GOFUNCS", gofuncsReturn);
  return gofuncsReturn;
}

/**
 * Comparison function for case-insensitive sorting of the first element of
 * a tuple.
 *
 * @param ta First tuple.
 * @param tb Second tuple.
 * @returns -1, 0, or 1 to signify greater than, equality, or less than.
 */
function procTupleComparator(ta: GofuncTuple, tb: GofuncTuple): number {
  return ta[0].localeCompare(tb[0], undefined, {sensitivity: 'base'});
}

/**
 * Ensure two identically-named gofuncs don't exist.
 * Take the proposed gofunc name, and return a legal name i.e. one that
 * is not empty and doesn't collide with other gofuncs.
 *
 * @param name Proposed gofunc name.
 * @param block Block to disambiguate.
 * @returns Non-colliding name.
 */
export function findLegalName(name: string, block: Block): string {
  if (block.isInFlyout) {
    // Flyouts can have multiple gofuncs called 'do something'.
    return name;
  }
  name = name || Msg['UNNAMED_KEY'] || 'unnamed';
  while (!isLegalName(name, block.workspace, block)) {
    // Collision with another gofunc.
    const r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      name += '2';
    } else {
      name = r[1] + (parseInt(r[2]) + 1);
    }
  }
  return name;
}
/**
 * Does this gofunc have a legal name?  Illegal names include names of
 * gofuncs already defined.
 *
 * @param name The questionable name.
 * @param workspace The workspace to scan for collisions.
 * @param opt_exclude Optional block to exclude from comparisons (one doesn't
 *     want to collide with oneself).
 * @returns True if the name is legal.
 */
function isLegalName(
  name: string,
  workspace: Workspace,
  opt_exclude?: Block
): boolean {
  return !isNameUsed(name, workspace, opt_exclude);
}

/**
 * Return if the given name is already a gofunc name.
 *
 * @param name The questionable name.
 * @param workspace The workspace to scan for collisions.
 * @param opt_exclude Optional block to exclude from comparisons (one doesn't
 *     want to collide with oneself).
 * @returns True if the name is used, otherwise return false.
 */
export function isNameUsed(
  name: string,
  workspace: Workspace,
  opt_exclude?: Block
): boolean {
  for (const block of workspace.getAllBlocks(false)) {
    if (block === opt_exclude) continue;

    if (
      isLegacyGofuncDefBlock(block) &&
      Names.equals(block.getGofuncDef()[0], name)
    ) {
      return true;
    }
  }

  const excludeModel =
    opt_exclude && isGofuncBlock(opt_exclude)
      ? opt_exclude?.getGofuncModel()
      : undefined;
  for (const model of workspace.getGofuncMap().getGofuncs()) {
    if (model === excludeModel) continue;
    if (Names.equals(model.getName(), name)) return true;
  }
  return false;
}

/**
 * Rename a gofunc.  Called by the editable field.
 *
 * @param name The proposed new name.
 * @returns The accepted name.
 */
export function rename(this: Field, name: string): string {
  const block = this.getSourceBlock();
  if (!block) {
    throw new UnattachedFieldError();
  }

  // Strip leading and trailing whitespace.  Beyond this, all names are legal.
  name = name.trim();
  const legalName = findLegalName(name, block);
  if (isGofuncBlock(block) && !block.isInsertionMarker()) {
    block.getGofuncModel().setName(legalName);
  }
  const oldName = this.getValue();
  if (oldName !== name && oldName !== legalName) {
    // Rename any callers.
    const blocks = block.workspace.getAllBlocks(false);
    for (let i = 0; i < blocks.length; i++) {
      // Assume it is a gofunc so we can check.
      const gofuncBlock = blocks[i] as unknown as GofuncBlock;
      if (gofuncBlock.renameGofunc) {
        gofuncBlock.renameGofunc(oldName as string, legalName);
      }
    }
  }
  return legalName;
}

/**
 * Construct the blocks required by the flyout for the gofunc category.
 *
 * @param workspace The workspace containing gofuncs.
 * @returns Array of XML block elements.
 */
export function flyoutCategory(workspace: WorkspaceSvg): Element[] {
  const xmlList = [];  
  if (Blocks['gofuncs_defreturn']) {
    // <block type="gofuncs_defreturn" gap="16">
    //     <field name="NAME">do something</field>
    // </block>
    const block = utilsXml.createElement('block');
    block.setAttribute('type', 'gofuncs_defreturn');
    block.setAttribute('gap', '16');
    const nameField = utilsXml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(
      utilsXml.createTextNode(Msg['PROCEDURES_DEFRETURN_PROCEDURE'])
    );
    block.appendChild(nameField);
    xmlList.push(block);
  }

  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', '24');
  }

  /**
   * Add items to xmlList for each listed gofunc.
   *
   * @param gofuncList A list of gofuncs, each of which is defined by a
   *     three-element list of name, parameter list, and return value boolean.
   * @param templateName The type of the block to generate.
   */
  function populateGofuncs(
    gofuncList: [string, VariableModel[], VariableModel[], boolean][]
  ) {
    for (let i = 0; i < gofuncList.length; i++) {
      console.log("POPULATE GO FUNCS", gofuncList[i], gofuncList[i][1]);
      const name = gofuncList[i][0];
      const inputs = gofuncList[i][1];
      const outputs = gofuncList[i][2];
      // <block type="gofuncs_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x"></arg>
      //   </mutation>
      // </block>
      const block = utilsXml.createElement('block');
      if(outputs!=undefined && outputs.length>0) {
        block.setAttribute('type', 'gofuncs_callreturn');
      } else {
        block.setAttribute('type', 'gofuncs_callnoreturn');
      }
      block.setAttribute('gap', '16');
      const mutation = utilsXml.createElement('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      if(inputs!=undefined) {
      for (let j = 0; j < inputs.length; j++) {
        const arg = utilsXml.createElement('arg');
        arg.setAttribute('name', inputs[j].name);
        mutation.appendChild(arg);
      }
    }
      xmlList.push(block);
    }
  }

  const gfs = allGofuncs(workspace);
  console.log("TUPLE", gfs);
  //populateGofuncs(tuple[0], 'gofuncs_callnoreturn');
  populateGofuncs(gfs);
  console.log("XML LIST", xmlList);
  return xmlList;
}

/**
 * Updates the gofunc mutator's flyout so that the arg block is not a
 * duplicate of another arg.
 *
 * @param workspace The gofunc mutator's workspace. This workspace's flyout
 *     is what is being updated.
 */
function updateMutatorFlyout(workspace: WorkspaceSvg) {
  const usedNames = [];
  const blocks = workspace.getBlocksByType('gofuncs_mutatorarg', false);
  for (let i = 0, block; (block = blocks[i]); i++) {
    usedNames.push(block.getFieldValue('NAME'));
  }

  const xmlElement = utilsXml.createElement('xml');
  const argBlock = utilsXml.createElement('block');
  argBlock.setAttribute('type', 'gofuncs_mutatorarg');
  const nameField = utilsXml.createElement('field');
  nameField.setAttribute('name', 'NAME');
  const argValue = Variables.generateUniqueNameFromOptions(
    DEFAULT_ARG,
    usedNames
  );
  const fieldContent = utilsXml.createTextNode(argValue);

  nameField.appendChild(fieldContent);
  argBlock.appendChild(nameField);
  xmlElement.appendChild(argBlock);

  workspace.updateToolbox(xmlElement);
}

/**
 * Listens for when a gofunc mutator is opened. Then it triggers a flyout
 * update and adds a mutator change listener to the mutator workspace.
 *
 * @param e The event that triggered this listener.
 * @internal
 */
export function mutatorOpenListener(e: Abstract) {
  if (e.type !== eventUtils.BUBBLE_OPEN) {
    return;
  }
  const bubbleEvent = e as BubbleOpen;
  if (
    !(bubbleEvent.bubbleType === 'mutator' && bubbleEvent.isOpen) ||
    !bubbleEvent.blockId
  ) {
    return;
  }
  const workspaceId = bubbleEvent.workspaceId;
  const block = common
    .getWorkspaceById(workspaceId)!
    .getBlockById(bubbleEvent.blockId) as BlockSvg;
  const type = block.type;
  if (type !== 'gofuncs_defnoreturn' && type !== 'gofuncs_defreturn') {
    return;
  }
  const workspace = (
    block.getIcon(MutatorIcon.TYPE) as MutatorIcon
  ).getWorkspace()!;
  updateMutatorFlyout(workspace);
  workspace.addChangeListener(mutatorChangeListener);
}
/**
 * Listens for changes in a gofunc mutator and triggers flyout updates when
 * necessary.
 *
 * @param e The event that triggered this listener.
 */
function mutatorChangeListener(e: Abstract) {
  if (
    e.type !== eventUtils.BLOCK_CREATE &&
    e.type !== eventUtils.BLOCK_DELETE &&
    e.type !== eventUtils.BLOCK_CHANGE &&
    e.type !== eventUtils.BLOCK_FIELD_INTERMEDIATE_CHANGE
  ) {
    return;
  }
  const workspaceId = e.workspaceId as string;
  const workspace = common.getWorkspaceById(workspaceId) as WorkspaceSvg;
  updateMutatorFlyout(workspace);
}

/**
 * Find all the callers of a named gofunc.
 *
 * @param name Name of gofunc.
 * @param workspace The workspace to find callers in.
 * @returns Array of caller blocks.
 */
export function getCallers(name: string, workspace: Workspace): Block[] {
  return workspace.getAllBlocks(false).filter((block) => {
    return (
      blockIsModernCallerFor(block, name) ||
      (isLegacyGofuncCallBlock(block) &&
        Names.equals(block.getGofuncCall(), name))
    );
  });
}

/**
 * @returns True if the given block is a modern-style caller block of the given
 *     gofunc name.
 */
function blockIsModernCallerFor(block: Block, procName: string): boolean {
  return (
    isGofuncBlock(block) &&
    !block.isGofuncDef() &&
    block.getGofuncModel() &&
    Names.equals(block.getGofuncModel().getName(), procName)
  );
}

/**
 * When a gofunc definition changes its parameters, find and edit all its
 * callers.
 *
 * @param defBlock Gofunc definition block.
 */
export function mutateCallers(defBlock: Block) {
  const oldRecordUndo = eventUtils.getRecordUndo();
  const gofuncBlock = defBlock as unknown as GofuncBlock;
  const name = gofuncBlock.getGofuncDef()[0];
  const xmlElement = defBlock.mutationToDom!(true);
  const callers = getCallers(name, defBlock.workspace);
  for (let i = 0, caller; (caller = callers[i]); i++) {
    const oldMutationDom = caller.mutationToDom!();
    const oldMutation = oldMutationDom && utilsXml.domToText(oldMutationDom);
    if (caller.domToMutation) {
      caller.domToMutation(xmlElement);
    }
    const newMutationDom = caller.mutationToDom!();
    const newMutation = newMutationDom && utilsXml.domToText(newMutationDom);
    if (oldMutation !== newMutation) {
      // Fire a mutation on every caller block.  But don't record this as an
      // undo action since it is deterministically tied to the gofunc's
      // definition mutation.
      eventUtils.setRecordUndo(false);
      eventUtils.fire(
        new (eventUtils.get(eventUtils.BLOCK_CHANGE))(
          caller,
          'mutation',
          null,
          oldMutation,
          newMutation
        )
      );
      eventUtils.setRecordUndo(oldRecordUndo);
    }
  }
}

/**
 * Find the definition block for the named gofunc.
 *
 * @param name Name of gofunc.
 * @param workspace The workspace to search.
 * @returns The gofunc definition block, or null not found.
 */
export function getDefinition(
  name: string,
  workspace: Workspace
): Block | null {
  // Do not assume gofunc is a top block. Some languages allow nested
  // gofuncs. Also do not assume it is one of the built-in blocks. Only
  // rely on isGofuncDef and getGofuncDef.
  for (const block of workspace.getAllBlocks(false)) {
    if (
      isGofuncBlock(block) &&
      block.isGofuncDef() &&
      Names.equals(block.getGofuncModel().getName(), name)
    ) {
      return block;
    }
    if (
      isLegacyGofuncDefBlock(block) &&
      Names.equals(block.getGofuncDef()[0], name)
    ) {
      return block;
    }
  }
  return null;
}

export {
  ObservableGofuncMap,
  IParameterModel,
  IGofuncBlock,
  isGofuncBlock,
  IGofuncMap,
  IGofuncModel,
  GofuncTuple,
};
