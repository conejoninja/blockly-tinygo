/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @suppress {checkTypes}
 */

import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.variablesDynamic');

import * as ContextMenu from '../core/contextmenu.js';
import * as Extensions from '../core/extensions.js';
import * as Variables from '../core/variables.js';
import * as xml from '../core/utils/xml.js';
import {Abstract as AbstractEvent} from '../core/events/events_abstract.js';
import type {Block} from '../core/block.js';
import type {ContextMenuOption, LegacyContextMenuOption} from '../core/contextmenu_registry.js';
import {FieldVariable} from '../core/field_variable.js';
import {Msg} from '../core/msg.js';
import type {WorkspaceSvg} from '../core/workspace_svg.js';
import {createBlockDefinitionsFromJsonArray, defineBlocks} from '../core/common.js';
import '../core/field_label.js';


/**
 * A dictionary of the block definitions provided by this module.
 */
export const blocks = createBlockDefinitionsFromJsonArray([
  // Block for variable getter.
  {
    'type': 'variables_get_dynamic',
    'message0': '%1',
    'args0': [{
      'type': 'field_variable',
      'name': 'VAR',
      'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
    }],
    'output': null,
    'style': 'variable_dynamic_blocks',
    'helpUrl': '%{BKY_VARIABLES_GET_HELPURL}',
    'tooltip': '%{BKY_VARIABLES_GET_TOOLTIP}',
    'extensions': ['contextMenu_variableDynamicSetterGetter'],
  },
  // Block for variable setter.
  {
    'type': 'variables_set_dynamic',
    'message0': '%{BKY_VARIABLES_SET}',
    'args0': [
      {
        'type': 'field_variable',
        'name': 'VAR',
        'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'variable_dynamic_blocks',
    'tooltip': '%{BKY_VARIABLES_SET_TOOLTIP}',
    'helpUrl': '%{BKY_VARIABLES_SET_HELPURL}',
    'extensions': ['contextMenu_variableDynamicSetterGetter'],
  },
  {
    'type': 'variables_get_dynamic_list',
    'message0': 'from %1 index %2',
    'args0': [{
      'type': 'field_variable',
      'name': 'VAR',
      'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
    },
    {
      'type': 'field_input',
      'name': 'INDEX',
    }],
    'output': null,
    'style': 'variable_dynamic_blocks',
    'helpUrl': '%{BKY_VARIABLES_GET_HELPURL}',
    'tooltip': '%{BKY_VARIABLES_GET_TOOLTIP}',
    'extensions': ['contextMenu_variableDynamicSetterGetter'],
  },
  {
    'type': 'variables_set_dynamic_list',
    'message0': 'Set %1 index %2',
    'args0': [
      {
        'type': 'field_variable',
        'name': 'VAR',
        'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
      },
      {
        'type': 'field_input',
        'name': 'INDEX',
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'variable_dynamic_blocks',
    'tooltip': '%{BKY_VARIABLES_SET_TOOLTIP}',
    'helpUrl': '%{BKY_VARIABLES_SET_HELPURL}',
    'extensions': ['contextMenu_variableDynamicSetterGetter'],
  },
]);

/** Type of a block that has CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN */
type VariableBlock = Block&VariableMixin;
interface VariableMixin extends VariableMixinType {}
type VariableMixinType =
    typeof CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN;

/**
 * Mixin to add context menu items to create getter/setter blocks for this
 * setter/getter.
 * Used by blocks 'variables_set_dynamic' and 'variables_get_dynamic'.
 */
const CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN = {
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   *
   * @param options List of menu options to add to.
   */
  customContextMenu: function(
      this: VariableBlock,
      options: Array<ContextMenuOption|LegacyContextMenuOption>) {
    // Getter blocks have the option to create a setter block, and vice versa.
    if (!this.isInFlyout) {
      let oppositeType;
      let contextMenuMsg;
      const id = this.getFieldValue('VAR');
      const variableModel = this.workspace.getVariableById(id);
      const varType = variableModel!.type;
      if (this.type === 'variables_get_dynamic') {
        oppositeType = 'variables_set_dynamic';
        contextMenuMsg = Msg['VARIABLES_GET_CREATE_SET'];
      } else {
        oppositeType = 'variables_get_dynamic';
        contextMenuMsg = Msg['VARIABLES_SET_CREATE_GET'];
      }

      const name = this.getField('VAR')!.getText();
      const xmlField = xml.createElement('field');
      xmlField.setAttribute('name', 'VAR');
      xmlField.setAttribute('variabletype', varType);
      xmlField.appendChild(xml.createTextNode(name));
      const xmlBlock = xml.createElement('block');
      xmlBlock.setAttribute('type', oppositeType);
      xmlBlock.appendChild(xmlField);

      options.push({
        enabled: this.workspace.remainingCapacity() > 0,
        text: contextMenuMsg.replace('%1', name),
        callback: ContextMenu.callbackFactory(this, xmlBlock)
      });
    } else {
      if (this.type === 'variables_get_dynamic' ||
          this.type === 'variables_get_reporter_dynamic') {
        const renameOption = {
          text: Msg['RENAME_VARIABLE'],
          enabled: true,
          callback: renameOptionCallbackFactory(this),
        };
        const name = this.getField('VAR')!.getText();
        const deleteOption = {
          text: Msg['DELETE_VARIABLE'].replace('%1', name),
          enabled: true,
          callback: deleteOptionCallbackFactory(this),
        };
        options.unshift(renameOption);
        options.unshift(deleteOption);
      }
    }
  },
  /**
   * Called whenever anything on the workspace changes.
   * Set the connection type for this block.
   *
   * @param _e Change event.
   */
  onchange: function(this: VariableBlock, _e: AbstractEvent) {
    const id = this.getFieldValue('VAR');
    const variableModel = Variables.getVariable(this.workspace, id)!;
    if (this.type === 'variables_get_dynamic') {
      this.outputConnection!.setCheck(variableModel.type);
    } else {
      this.getInput('VALUE')!.connection!.setCheck(variableModel.type);
    }
  },
};

/**
 * Factory for callbacks for rename variable dropdown menu option
 * associated with a variable getter block.
 *
 * @param block The block with the variable to rename.
 * @returns A function that renames the variable.
 */
const renameOptionCallbackFactory = function(block: VariableBlock) {
  return function() {
    const workspace = block.workspace;
    const variableField = block.getField('VAR') as FieldVariable;
    const variable = variableField.getVariable()!;
    Variables.renameVariable(workspace, variable);
  };
};

/**
 * Factory for callbacks for delete variable dropdown menu option
 * associated with a variable getter block.
 *
 * @param block The block with the variable to delete.
 * @returns A function that deletes the variable.
 */
const deleteOptionCallbackFactory = function(block: VariableBlock) {
  return function() {
    const workspace = block.workspace;
    const variableField = block.getField('VAR') as FieldVariable;
    const variable = variableField.getVariable()!;
    workspace.deleteVariableById(variable.getId());
    (workspace as WorkspaceSvg).refreshToolboxSelection();
  };
};

Extensions.registerMixin(
    'contextMenu_variableDynamicSetterGetter',
    CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN);

// Register provided blocks.
defineBlocks(blocks);
