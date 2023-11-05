/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.gofuncs');

import * as ContextMenu from '../core/contextmenu.js';
import * as Events from '../core/events/events.js';
import * as Gofuncs from '../core/gofuncs.js';
import * as Variables from '../core/variables.js';
import * as Xml from '../core/xml.js';
import * as fieldRegistry from '../core/field_registry.js';
import * as xmlUtils from '../core/utils/xml.js';
import type {Abstract as AbstractEvent} from '../core/events/events_abstract.js';
import {Align} from '../core/inputs/input.js';
import type {Block} from '../core/block.js';
import type {BlockSvg} from '../core/block_svg.js';
import type {BlockCreate} from '../core/events/events_block_create.js';
import type {BlockChange} from '../core/events/events_block_change.js';
import type {BlockDefinition} from '../core/blocks.js';
import type {Connection} from '../core/connection.js';
import type {
  ContextMenuOption,
  LegacyContextMenuOption,
} from '../core/contextmenu_registry.js';
import {FieldCheckbox} from '../core/field_checkbox.js';
import {FieldLabel} from '../core/field_label.js';
import {FieldTextInput} from '../core/field_textinput.js';
import {Msg} from '../core/msg.js';
import {MutatorIcon as Mutator} from '../core/icons/mutator_icon.js';
import {Names} from '../core/names.js';
import type {VariableModel} from '../core/variable_model.js';
import type {Workspace} from '../core/workspace.js';
import type {WorkspaceSvg} from '../core/workspace_svg.js';
import {config} from '../core/config.js';
import {
  createBlockDefinitionsFromJsonArray,
  defineBlocks,
} from '../core/common.js';
import '../core/icons/comment_icon.js';
import '../core/icons/warning_icon.js';

/** A dictionary of the block definitions provided by this module. */
//export const blocks: {[key: string]: BlockDefinition} = {};

export const blocks = createBlockDefinitionsFromJsonArray([
  {
    'type': 'gofunc_input',
    'message0': 'name: %1 type: %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
        'text': 'x',
        'check': 'String',
      },
      {
        'type': 'field_input',
        'name': 'TYPE',
        'text': 'Number',
        'check': 'String',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'procedure_blocks',
    'helpUrl': '',
    'suppressPrefixSuffix': true,
  },
  {
    'type': 'gofunc_output',
    'message0': 'return name: %1 type: %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
        'text': 'x',
        'check': 'String',
      },
      {
        'type': 'field_input',
        'name': 'TYPE',
        'text': 'Number',
        'check': 'String',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 345,
    'helpUrl': '',
    'suppressPrefixSuffix': true,
  },
  {
    'type': 'gofunc_blank',
    "message0": "Inputs: %1 Outputs: %2",
    "args0": [
      {
        "type": "input_statement",
        "name": "INPUT",
      },
      {
        "type": "input_statement",
        "name": "OUTPUT",
      }
    ],
    'style': 'procedure_blocks',
    'helpUrl': '',
    'suppressPrefixSuffix': true,
  },
]);

/** Type of a block using the GOFUNC_DEF_COMMON mixin. */
type GofuncBlock = Block & GofuncMixin;
interface GofuncMixin extends GofuncMixinType {
  arguments_: string[];
  argumentVarModels_: VariableModel[];
  callType_: string;
  paramIds_: string[];
  hasStatements_: boolean;
  statementConnection_: Connection | null;
  inputNames_: string[];
  inputTypes_: string[];
  outputNames_: string[];
  outputTypes_: string[];
  inputVarModels_: VariableModel[];
  outputVarModels_: VariableModel[];
}
type GofuncMixinType = typeof GOFUNC_DEF_COMMON;

/** Extra state for serialising gofunc blocks. */
type GofuncExtraState = {
  params?: Array<{name: string; id: string}>;
  params_i?: Array<{name: string; id: string, type: string}>;
  params_o?: Array<{name: string; id: string, type: string}>;
  hasStatements: boolean;
};

/**
 * Common properties for the gofunc_defnoreturn and
 * gofunc_defreturn blocks.
 */
const GOFUNC_DEF_COMMON = { 
  /**
   * Add or remove the statement block from this function definition.
   *
   * @param hasStatements True if a statement block is needed.
   */
  setStatements_: function (this: GofuncBlock, hasStatements: boolean) {
    if (this.hasStatements_ === hasStatements) {
      return;
    }
    if (hasStatements) {
      this.appendStatementInput('STACK').appendField(
        Msg['PROCEDURES_DEFNORETURN_DO']
      );
      if (this.getInput('RETURN')) {
        this.moveInputBefore('STACK', 'RETURN');
      }
    } else {
      this.removeInput('STACK', true);
    }
    this.hasStatements_ = hasStatements;
  },
  /**
   * Update the display of parameters for this gofunc definition block.
   *
   * @internal
   */
  updateParams_: function (this: GofuncBlock) {
    // Merge the arguments into a human-readable list.
    console.log("UIPDATE PARAMS", this.inputVarModels_, this.outputVarModels_, this.argumentVarModels_);
    let paramString = '';
    if (this.inputNames_.length) {
      var args = [];
      for(let i=0;i<this.inputNames_.length;i++) {
        args.push(this.inputNames_[i]+" "+this.inputTypes_[i]);
      }
      paramString =
        Msg['PROCEDURES_BEFORE_PARAMS'] + ' ' + args.join(', ');
    }

    let returnString = '';
    if (this.outputNames_.length) {
      var args = [];
      for(let i=0;i<this.outputNames_.length;i++) {
        args.push(this.outputNames_[i]+" "+this.outputTypes_[i]);
      }
      returnString = 'return ' + args.join(', ');
    }
    console.log("UPDATE PARAMS", this.inputNames_, this.outputNames_);
    // The params field is deterministic based on the mutation,
    // no need to fire a change event.
    Events.disable();
    try {
      this.setFieldValue(paramString, 'PARAMS');
      this.setFieldValue(returnString, 'RETURNS');
    } finally {
      Events.enable();
    }
  },
  /**
   * Create XML to represent the argument inputs.
   * Backwards compatible serialization implementation.
   *
   * @param opt_paramIds If true include the IDs of the parameter
   *     quarks.  Used by Gofuncs.mutateCallers for reconnection.
   * @returns  XML storage element.
   */
  mutationToDom: function (
    this: GofuncBlock,
    opt_paramIds: boolean
  ): Element {
    const container = xmlUtils.createElement('mutation');
    if (opt_paramIds) {
      container.setAttribute('name', this.getFieldValue('NAME'));
    }
    console.log("MUTATION TO DOM (BLOCK)", this.inputVarModels_, this.outputVarModels_, this.argumentVarModels_);
    for (let i = 0; i < this.argumentVarModels_.length; i++) {
      const parameter = xmlUtils.createElement('arg');
      const argModel = this.argumentVarModels_[i];
      parameter.setAttribute('name', argModel.name);
      parameter.setAttribute('varid', argModel.getId());
      if (opt_paramIds && this.paramIds_) {
        parameter.setAttribute('paramId', this.paramIds_[i]);
      }
      container.appendChild(parameter);
    }

    // Save whether the statement input is visible.
    if (!this.hasStatements_) {
      container.setAttribute('statements', 'false');
    }
    return container;
  },
  /**
   * Parse XML to restore the argument inputs.
   * Backwards compatible serialization implementation.
   *
   * @param xmlElement XML storage element.
   */
  domToMutation: function (this: GofuncBlock, xmlElement: Element) {
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
      console.log("BLOCK DOM TO MUTATION", childNode.nodeName);
      if (childNode.nodeName.toLowerCase() === 'arg') {
        const childElement = childNode as Element;
        const varName = childElement.getAttribute('name')!;
        const varId =
          childElement.getAttribute('varid') ||
          childElement.getAttribute('varId');
        this.arguments_.push(varName);
        const variable = Variables.getOrCreateVariablePackage(
          this.workspace,
          varId,
          varName,
          ''
        );
        if (variable !== null) {
          this.argumentVarModels_.push(variable);
          console.log("D2Mx", this.argumentVarModels_, variable);
        } else {
          console.log(
            `Failed to create a variable named "${varName}", ignoring.`
          );
        }
      }
    }
    this.updateParams_();
    Gofuncs.mutateCallers(this);

    // Show or hide the statement input.
    this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   *
   * @returns The state of this block, eg the parameters and statements.
   */
  saveExtraState: function (this: GofuncBlock): GofuncExtraState | null {
    console.log("SAVE EXTRA STATE (BLOCK)", this.inputVarModels_, this.outputVarModels_, this.argumentVarModels_);
    const state = Object.create(null);
    if (this.inputVarModels_!=undefined && this.inputVarModels_.length) {
      state['params_i'] = [];
      for (let i = 0; i < this.inputVarModels_.length; i++) {
        state['params_i'].push({
          // We don't need to serialize the name, but just in case we decide
          // to separate params from variables.
          'name': this.inputVarModels_[i].name,
          'type': this.inputVarModels_[i].type,
          'id': this.inputVarModels_[i].getId(),
        });
      }
    }
    if (this.outputVarModels_!=undefined && this.outputVarModels_.length) {
      state['params_o'] = [];
      for (let i = 0; i < this.outputVarModels_.length; i++) {
        state['params_o'].push({
          // We don't need to serialize the name, but just in case we decide
          // to separate params from variables.
          'name': this.outputVarModels_[i].name,
          'type': this.outputVarModels_[i].type,
          'id': this.outputVarModels_[i].getId(),
        });
      }
    }
    if (!this.hasStatements_) {
      state['hasStatements'] = false;
    }
    return state;
  },
  /**
   * Applies the given state to this block.
   *
   * @param state The state to apply to this block, eg the parameters
   *     and statements.
   */
  loadExtraState: function (this: GofuncBlock, state: GofuncExtraState) {
    this.inputNames_ = [];
    this.inputTypes_ = [];
    this.inputVarModels_ = [];

    this.outputNames_ = [];
    this.outputTypes_ = [];
    this.outputVarModels_ = [];
    if (state['params_i']) {
      for (let i = 0; i < state['params_i'].length; i++) {
        const param = state['params_i'][i];
        const variable = Variables.getOrCreateVariablePackage(
          this.workspace,
          param['id'],
          param['name'],
          ''
        );
        variable.type = param['type'];
        this.inputNames_.push(variable.name);
        this.inputTypes_.push(variable.type);
        this.inputVarModels_.push(variable);
      }
    }
    if (state['params_o']) {
      for (let i = 0; i < state['params_o'].length; i++) {
        const param = state['params_o'][i];
        const variable = Variables.getOrCreateVariablePackage(
          this.workspace,
          param['id'],
          param['name'],
          ''
        );
        variable.type = param['type'];
        this.outputNames_.push(variable.name);
        this.outputTypes_.push(variable.type);
        this.outputVarModels_.push(variable);
      }
    }
    this.updateParams_();
    Gofuncs.mutateCallers(this);
    this.setStatements_(state['hasStatements'] === false ? false : true);
  },
  /**
   * Populate the mutator's dialog with this block's components.
   *
   * @param  workspace Mutator's workspace.
   * @returns Root block in mutator.
   */
  decompose: function (
    this: GofuncBlock,
    workspace: Workspace
  ): ContainerBlock {
    console.log("DE-COMPOSE");

    /*
     * Creates the following XML:
     * <block type="gofuncs_mutatorcontainer">
     *   <statement name="STACK">
     *     <block type="gofuncs_mutatorarg">
     *       <field name="NAME">arg1_name</field>
     *       <next>etc...</next>
     *     </block>
     *   </statement>
     * </block>
     */

    /*const containerBlockNode = xmlUtils.createElement('block');
    containerBlockNode.setAttribute('type', 'gofuncs_mutatorcontainer');
    const statementNode = xmlUtils.createElement('statement');
    statementNode.setAttribute('name', 'STACK');
    containerBlockNode.appendChild(statementNode);

    let node = statementNode;
    for (let i = 0; i < this.arguments_.length; i++) {
      const argBlockNode = xmlUtils.createElement('block');
      argBlockNode.setAttribute('type', 'gofuncs_mutatorarg');
      const fieldNode = xmlUtils.createElement('field');
      fieldNode.setAttribute('name', 'NAME');
      const argumentName = xmlUtils.createTextNode(this.arguments_[i]);
      fieldNode.appendChild(argumentName);
      argBlockNode.appendChild(fieldNode);
      const nextNode = xmlUtils.createElement('next');
      argBlockNode.appendChild(nextNode);

      node.appendChild(argBlockNode);
      node = nextNode;
    }

    const containerBlock = Xml.domToBlock(
      containerBlockNode,
      workspace
    ) as ContainerBlock;*/

    const containerBlock = workspace.newBlock('gofunc_blank') as ContainerBlock;
    (containerBlock as BlockSvg).initSvg();

    let connection = containerBlock.inputList[0].connection!;
    for (let i = 0; i < this.inputNames_.length; i++) {
      const inputsBlock = workspace.newBlock('gofuncs_mutatorarg');
      inputsBlock.setFieldValue(this.inputNames_[i], 'NAME');
      inputsBlock.setFieldValue(this.inputTypes_[i], 'TYPE');
      (inputsBlock as BlockSvg).initSvg();
      connection.connect(inputsBlock.previousConnection!);
      connection = inputsBlock.nextConnection!;
    }
    connection = containerBlock.inputList[1].connection!;
    for (let i = 0; i < this.outputNames_.length; i++) {
      const outputsBlock = workspace.newBlock('gofuncs_mutatorarg');
      outputsBlock.setFieldValue(this.outputNames_[i], 'NAME');
      outputsBlock.setFieldValue(this.outputTypes_[i], 'TYPE');
      (outputsBlock as BlockSvg).initSvg();
      connection.connect(outputsBlock.previousConnection!);
      connection = outputsBlock.nextConnection!;
    }

    /*if (this.type === 'gofuncs_defreturn') {
      containerBlock.setFieldValue(this.hasStatements_, 'STATEMENTS');
    } else {
      containerBlock.removeInput('STATEMENT_INPUT');
    }*/

    // Initialize gofunc's callers with blank IDs.
    Gofuncs.mutateCallers(this);
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   *
   * @param containerBlock Root block in mutator.
   */
  compose: function (this: GofuncBlock, containerBlock: ContainerBlock) {
    console.log("COMPOSE");

    this.inputNames_ = [];
    this.inputTypes_ = [];
    this.outputNames_ = [];
    this.outputTypes_ = [];

    this.arguments_ = [];
    this.inputVarModels_ = [];
    this.outputVarModels_ = [];

    let paramBlock = containerBlock.getInputTargetBlock('INPUT');
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      console.log("PARAM BLOCK", paramBlock, paramBlock.type);
      if (paramBlock.type == 'gofuncs_mutatorarg') {
        const varName = paramBlock.getFieldValue('NAME');
        const varType = paramBlock.getFieldValue('TYPE');
        this.inputNames_.push(varName);
        this.inputTypes_.push(varType);

        const variable = this.workspace.getVariable(varName, '')!;
        variable.type = varType;
        this.inputVarModels_.push(variable);
      }
      paramBlock =
        paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();

    }

    paramBlock = containerBlock.getInputTargetBlock('OUTPUT');
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      console.log("PARAM BLOCK - OUTPUT", paramBlock, paramBlock.type);
      if (paramBlock.type == 'gofuncs_mutatorarg') {
        const varName = paramBlock.getFieldValue('NAME');
        const varType = paramBlock.getFieldValue('TYPE');
        this.outputNames_.push(varName);
        this.outputTypes_.push(varType);

        const variable = this.workspace.getVariable(varName, '')!;
        variable.type = varType;
        this.outputVarModels_.push(variable);

      }
      paramBlock =
        paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();

    }
    const inputsStatementConnections: Array<Connection | null> = [null];
    let outputsStatementConnection: Array<Connection | null> = [null];
    
    this.updateParams_();
    Gofuncs.mutateCallers(this);

  },
  /**
   * Return all variables referenced by this block.
   *
   * @returns List of variable names.
   */
  getVars: function (this: GofuncBlock): string[] {
    return this.arguments_;
  },

  getInputs: function (this: GofuncBlock): string[] {
    return this.inputNames_;
  },

  getOutputs: function (this: GofuncBlock): string[] {
    return this.outputNames_;
  },
  /**
   * Return all variables referenced by this block.
   *
   * @returns List of variable models.
   */
  getVarModels: function (this: GofuncBlock): VariableModel[] {
    return this.argumentVarModels_;
  },
  /**
   * Notification that a variable is renaming.
   * If the ID matches one of this block's variables, rename it.
   *
   * @param oldId ID of variable to rename.
   * @param newId ID of new variable.  May be the same as oldId, but
   *     with an updated name.  Guaranteed to be the same type as the
   *     old variable.
   */
  renameVarById: function (
    this: GofuncBlock & BlockSvg,
    oldId: string,
    newId: string
  ) {
    const oldVariable = this.workspace.getVariableById(oldId)!;
    if (oldVariable.type !== '') {
      // Gofunc arguments always have the empty type.
      return;
    }
    const oldName = oldVariable.name;
    const newVar = this.workspace.getVariableById(newId)!;

    let change = false;
    for (let i = 0; i < this.argumentVarModels_.length; i++) {
      if (this.argumentVarModels_[i].getId() === oldId) {
        this.arguments_[i] = newVar.name;
        this.argumentVarModels_[i] = newVar;
        change = true;
      }
    }
    if (change) {
      this.displayRenamedVar_(oldName, newVar.name);
      Gofuncs.mutateCallers(this);
    }
  },
  /**
   * Notification that a variable is renaming but keeping the same ID.  If the
   * variable is in use on this block, rerender to show the new name.
   *
   * @param variable The variable being renamed.
   */
  updateVarName: function (
    this: GofuncBlock & BlockSvg,
    variable: VariableModel
  ) {
    const newName = variable.name;
    let change = false;
    let oldName;
    for (let i = 0; i < this.argumentVarModels_.length; i++) {
      if (this.argumentVarModels_[i].getId() === variable.getId()) {
        oldName = this.arguments_[i];
        this.arguments_[i] = newName;
        change = true;
      }
    }
    if (change) {
      this.displayRenamedVar_(oldName as string, newName);
      Gofuncs.mutateCallers(this);
    }
  },
  /**
   * Update the display to reflect a newly renamed argument.
   *
   * @internal
   * @param oldName The old display name of the argument.
   * @param newName The new display name of the argument.
   */
  displayRenamedVar_: function (
    this: GofuncBlock & BlockSvg,
    oldName: string,
    newName: string
  ) {
    this.updateParams_();
    // Update the mutator's variables if the mutator is open.
    const mutator = this.getIcon(Mutator.TYPE);
    if (mutator && mutator.bubbleIsVisible()) {
      const blocks = mutator.getWorkspace()!.getAllBlocks(false);
      for (let i = 0, block; (block = blocks[i]); i++) {
        if (
          block.type === 'gofuncs_mutatorarg' &&
          Names.equals(oldName, block.getFieldValue('NAME'))
        ) {
          block.setFieldValue(newName, 'NAME');
        }
      }
    }
  },
  /**
   * Add custom menu options to this block's context menu.
   *
   * @param options List of menu options to add to.
   */
  customContextMenu: function (
    this: GofuncBlock,
    options: Array<ContextMenuOption | LegacyContextMenuOption>
  ) {
    if (this.isInFlyout) {
      return;
    }
    // Add option to create caller.
    const name = this.getFieldValue('NAME');
    const xmlMutation = xmlUtils.createElement('mutation');
    xmlMutation.setAttribute('name', name);
    for (let i = 0; i < this.arguments_.length; i++) {
      const xmlArg = xmlUtils.createElement('arg');
      xmlArg.setAttribute('name', this.arguments_[i]);
      xmlMutation.appendChild(xmlArg);
    }
    const xmlBlock = xmlUtils.createElement('block');
    xmlBlock.setAttribute('type', (this as AnyDuringMigration).callType_);
    xmlBlock.appendChild(xmlMutation);
    options.push({
      enabled: true,
      text: Msg['PROCEDURES_CREATE_DO'].replace('%1', name),
      callback: ContextMenu.callbackFactory(this, xmlBlock),
    });

    // Add options to create getters for each parameter.
    if (!this.isCollapsed()) {
      for (let i = 0; i < this.argumentVarModels_.length; i++) {
        const argVar = this.argumentVarModels_[i];
        const argXmlField = Variables.generateVariableFieldDom(argVar);
        const argXmlBlock = xmlUtils.createElement('block');
        argXmlBlock.setAttribute('type', 'variables_get');
        argXmlBlock.appendChild(argXmlField);
        options.push({
          enabled: true,
          text: Msg['VARIABLES_SET_CREATE_GET'].replace('%1', argVar.name),
          callback: ContextMenu.callbackFactory(this, argXmlBlock),
        });
      }
    }
  },
};


blocks['gofuncs_defreturn'] = {
  ...GOFUNC_DEF_COMMON,
  /**
   * Block for defining a gofunc with a return value.
   */
  init: function (this: GofuncBlock & BlockSvg) {
    const initName = Gofuncs.findLegalName('', this);
    const nameField = fieldRegistry.fromJson({
      type: 'field_input',
      text: initName,
    }) as FieldTextInput;
    nameField.setValidator(Gofuncs.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
      .appendField(Msg['PROCEDURES_DEFRETURN_TITLE'])
      .appendField(nameField, 'NAME')
      .appendField('', 'PARAMS');
    this.appendDummyInput('RETURN')
      .setAlign(Align.RIGHT)
      .appendField('', 'RETURNS');
    this.setMutator(new Mutator(['gofuncs_mutatorarg'], this));    
    this.setStyle('procedure_blocks');
    this.setTooltip(Msg['PROCEDURES_DEFRETURN_TOOLTIP']);
    this.setHelpUrl(Msg['PROCEDURES_DEFRETURN_HELPURL']);
    this.arguments_ = [];
    this.inputNames_ = [];
    this.inputTypes_ = [];
    this.outputNames_ = [];
    this.outputTypes_ = [];
    this.argumentVarModels_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;
  },
  /**
   * Return the signature of this gofunc definition.
   *
   * @returns Tuple containing three elements:
   *     - the name of the defined gofunc,
   *     - a list of all its arguments,
   *     - that it DOES have a return value.
   */
  getGofuncDef: function (this: GofuncBlock): [string, VariableModel[], VariableModel[], true] {
    console.log("GET GOFUNC DEF", this);
    return [this.getFieldValue('NAME'), this.inputVarModels_, this.outputVarModels_, true];
  },
  callType_: 'gofuncs_callreturn',
};

/** Type of a gofuncs_mutatorcontainer block. */
type ContainerBlock = Block & ContainerMixin;
interface ContainerMixin extends ContainerMixinType {}
type ContainerMixinType = typeof GOFUNCS_MUTATORCONTAINER;

const GOFUNCS_MUTATORCONTAINER = {
  /**
   * Mutator block for gofunc container.
   */
  init: function (this: ContainerBlock) {
    this.appendDummyInput().appendField(
      Msg['PROCEDURES_MUTATORCONTAINER_TITLE']
    );
    this.appendStatementInput('STACK');
    this.appendDummyInput('STATEMENT_INPUT')
      .appendField(Msg['PROCEDURES_ALLOW_STATEMENTS'])
      .appendField(
        fieldRegistry.fromJson({
          type: 'field_checkbox',
          checked: true,
        }) as FieldCheckbox,
        'STATEMENTS'
      );
    this.setStyle('procedure_blocks');
    this.setTooltip(Msg['PROCEDURES_MUTATORCONTAINER_TOOLTIP']);
    this.contextMenu = false;
  },
};
blocks['gofuncs_mutatorcontainer'] = GOFUNCS_MUTATORCONTAINER;

/** Type of a gofuncs_mutatorarg block. */
type ArgumentBlock = Block & ArgumentMixin;
interface ArgumentMixin extends ArgumentMixinType {}
type ArgumentMixinType = typeof GOFUNCS_MUTATORARGUMENT;

// TODO(#6920): This is kludgy.
type FieldTextInputForArgument = FieldTextInput & {
  oldShowEditorFn_(_e?: Event, quietInput?: boolean): void;
  createdVariables_: VariableModel[];
};

const GOFUNCS_MUTATORARGUMENT = {
  /**
   * Mutator block for gofunc argument.
   */
  init: function (this: ArgumentBlock) {
    const field = fieldRegistry.fromJson({
      type: 'field_input',
      text: Gofuncs.DEFAULT_ARG,
    }) as FieldTextInputForArgument;
    field.setValidator(this.validator_);
    // Hack: override showEditor to do just a little bit more work.
    // We don't have a good place to hook into the start of a text edit.
    field.oldShowEditorFn_ = (field as AnyDuringMigration).showEditor_;
    const newShowEditorFn = function (this: typeof field) {
      this.createdVariables_ = [];
      this.oldShowEditorFn_();
    };
    (field as AnyDuringMigration).showEditor_ = newShowEditorFn;

    const fieldtype = fieldRegistry.fromJson({
      type: 'field_input',
      text: 'Number',
    }) as FieldTextInputForArgument;

    this.appendDummyInput()
    .appendField('Name: ')
    .appendField(field, 'NAME')
    .appendField(' Type: ')
    .appendField(fieldtype, 'TYPE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setStyle('procedure_blocks');
    this.setTooltip(Msg['PROCEDURES_MUTATORARG_TOOLTIP']);
    this.contextMenu = false;

    // Create the default variable when we drag the block in from the flyout.
    // Have to do this after installing the field on the block.
    field.onFinishEditing_ = this.deleteIntermediateVars_;
    // Create an empty list so onFinishEditing_ has something to look at, even
    // though the editor was never opened.
    field.createdVariables_ = [];
    field.onFinishEditing_('x');

  },

  /**
   * Obtain a valid name for the gofunc argument. Create a variable if
   * necessary.
   * Merge runs of whitespace.  Strip leading and trailing whitespace.
   * Beyond this, all names are legal.
   *
   * @internal
   * @param varName User-supplied name.
   * @returns Valid name, or null if a name was not specified.
   */
  validator_: function (
    this: FieldTextInputForArgument,
    varName: string
  ): string | null {
    const sourceBlock = this.getSourceBlock()!;
    const outerWs = sourceBlock!.workspace.getRootWorkspace()!;
    varName = varName.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    if (!varName) {
      return null;
    }

    // Prevents duplicate parameter names in functions
    const workspace =
      (sourceBlock.workspace as WorkspaceSvg).targetWorkspace ||
      sourceBlock.workspace;
    const blocks = workspace.getAllBlocks(false);
    const caselessName = varName.toLowerCase();
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].id === this.getSourceBlock()!.id) {
        continue;
      }
      // Other blocks values may not be set yet when this is loaded.
      const otherVar = blocks[i].getFieldValue('NAME');
      if (otherVar && otherVar.toLowerCase() === caselessName) {
        return null;
      }
    }

    // Don't create variables for arg blocks that
    // only exist in the mutator's flyout.
    if (sourceBlock.isInFlyout) {
      return varName;
    }

    let model = outerWs.getVariable(varName, '');
    if (model && model.name !== varName) {
      // Rename the variable (case change)
      outerWs.renameVariableById(model.getId(), varName);
    }
    if (!model) {
      model = outerWs.createVariable(varName, '');
      if (model && this.createdVariables_) {
        this.createdVariables_.push(model);
      }
    }
    return varName;
  },

  /**
   * Called when focusing away from the text field.
   * Deletes all variables that were created as the user typed their intended
   * variable name.
   *
   * @internal
   * @param  newText The new variable name.
   */
  deleteIntermediateVars_: function (
    this: FieldTextInputForArgument,
    newText: string
  ) {
    const outerWs = this.getSourceBlock()!.workspace.getRootWorkspace();
    if (!outerWs) {
      return;
    }
    for (let i = 0; i < this.createdVariables_.length; i++) {
      const model = this.createdVariables_[i];
      if (model.name !== newText) {
        outerWs.deleteVariableById(model.getId());
      }
    }
  },
};
blocks['gofuncs_mutatorarg'] = GOFUNCS_MUTATORARGUMENT;

/** Type of a block using the GOFUNC_CALL_COMMON mixin. */
type CallBlock = Block & CallMixin;
interface CallMixin extends CallMixinType {
  argumentVarModels_: VariableModel[];
  arguments_: string[];
  defType_: string;
  quarkIds_: string[] | null;
  quarkConnections_: {[id: string]: Connection};
  previousEnabledState_: boolean;
  inputNames_: string[];
  inputTypes_: string[];
  outputNames_: string[];
  outputTypes_: string[];
}
type CallMixinType = typeof GOFUNC_CALL_COMMON;

/** Extra state for serialising call blocks. */
type CallExtraState = {
  name: string;
  params?: string[];
};

/**
 * Common properties for the gofunc_callnoreturn and
 * gofunc_callreturn blocks.
 */
const GOFUNC_CALL_COMMON = {
  /**
   * Returns the name of the gofunc this block calls.
   *
   * @returns Gofunc name.
   */
  getGofuncCall: function (this: CallBlock): string {
    // The NAME field is guaranteed to exist, null will never be returned.
    return this.getFieldValue('NAME');
  },
  /**
   * Notification that a gofunc is renaming.
   * If the name matches this block's gofunc, rename it.
   *
   * @param oldName Previous name of gofunc.
   * @param newName Renamed gofunc.
   */
  renameGofunc: function (
    this: CallBlock,
    oldName: string,
    newName: string
  ) {
    if (Names.equals(oldName, this.getGofuncCall())) {
      this.setFieldValue(newName, 'NAME');
      const baseMsg = this.outputConnection
        ? Msg['PROCEDURES_CALLRETURN_TOOLTIP']
        : Msg['PROCEDURES_CALLNORETURN_TOOLTIP'];
      this.setTooltip(baseMsg.replace('%1', newName));
    }
    console.log("RENAME", this, oldName, newName);
  },
  /**
   * Notification that the gofunc's parameters have changed.
   *
   * @internal
   * @param paramNames New param names, e.g. ['x', 'y', 'z'].
   * @param paramIds IDs of params (consistent for each parameter
   *     through the life of a mutator, regardless of param renaming),
   *     e.g. ['piua', 'f8b_', 'oi.o'].
   */
  setGofuncParameters_: function (
    this: CallBlock,
    paramNames: string[],
    paramIds: string[]
  ) {
    // Data structures:
    // this.arguments = ['x', 'y']
    //     Existing param names.
    // this.quarkConnections_ {piua: null, f8b_: Connection}
    //     Look-up of paramIds to connections plugged into the call block.
    // this.quarkIds_ = ['piua', 'f8b_']
    //     Existing param IDs.
    // Note that quarkConnections_ may include IDs that no longer exist, but
    // which might reappear if a param is reattached in the mutator.
    const defBlock = Gofuncs.getDefinition(
      this.getGofuncCall(),
      this.workspace
    );

    console.log("SET GOFUNC PARAMETERS", paramNames, paramIds);

    const mutatorIcon = defBlock && defBlock.getIcon(Mutator.TYPE);
    const mutatorOpen = mutatorIcon && mutatorIcon.bubbleIsVisible();
    if (!mutatorOpen) {
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    } else {
      // fix #6091 - this call could cause an error when outside if-else
      // expanding block while mutating prevents another error (ancient fix)
      this.setCollapsed(false);
    }
    // Test arguments (arrays of strings) for changes. '\n' is not a valid
    // argument name character, so it is a valid delimiter here.
    if (paramNames.join('\n') === this.arguments_.join('\n')) {
      // No change.
      this.quarkIds_ = paramIds;
      return;
    }
    if (paramIds.length !== paramNames.length) {
      throw RangeError('paramNames and paramIds must be the same length.');
    }
    if (!this.quarkIds_) {
      // Initialize tracking for this block.
      this.quarkConnections_ = {};
      this.quarkIds_ = [];
    }
    // Update the quarkConnections_ with existing connections.
    for (let i = 0; i < this.arguments_.length; i++) {
      const input = this.getInput('ARG' + i);
      if (input) {
        const connection = input.connection!.targetConnection!;
        this.quarkConnections_[this.quarkIds_[i]] = connection;
        if (
          mutatorOpen &&
          connection &&
          paramIds.indexOf(this.quarkIds_[i]) === -1
        ) {
          // This connection should no longer be attached to this block.
          connection.disconnect();
          connection.getSourceBlock().bumpNeighbours();
        }
      }
    }
    // Rebuild the block's arguments.
    this.arguments_ = ([] as string[]).concat(paramNames);
    // And rebuild the argument model list.
    this.argumentVarModels_ = [];
    for (let i = 0; i < this.arguments_.length; i++) {
      const variable = Variables.getOrCreateVariablePackage(
        this.workspace,
        null,
        this.arguments_[i],
        ''
      );
      this.argumentVarModels_.push(variable);
    }

    this.updateShape_();
    this.quarkIds_ = paramIds;
    // Reconnect any child blocks.
    if (this.quarkIds_) {
      for (let i = 0; i < this.arguments_.length; i++) {
        const quarkId: string = this.quarkIds_[i]; // TODO(#6920)
        if (quarkId in this.quarkConnections_) {
          // TODO(#6920): investigate claimed circular initialisers.
          const connection: Connection = this.quarkConnections_[quarkId];
          if (!connection?.reconnect(this, 'ARG' + i)) {
            // Block no longer exists or has been attached elsewhere.
            delete this.quarkConnections_[quarkId];
          }
        }
      }
    }
  },
  /**
   * Modify this block to have the correct number of arguments.
   *
   * @internal
   */
  updateShape_: function (this: CallBlock) {
    for (let i = 0; i < this.arguments_.length; i++) {
      const argField = this.getField('ARGNAME' + i);
      if (argField) {
        // Ensure argument name is up to date.
        // The argument name field is deterministic based on the mutation,
        // no need to fire a change event.
        Events.disable();
        try {
          argField.setValue(this.arguments_[i]);
        } finally {
          Events.enable();
        }
      } else {
        // Add new input.
        const newField = fieldRegistry.fromJson({
          type: 'field_label',
          text: this.arguments_[i],
        }) as FieldLabel;
        const input = this.appendValueInput('ARG' + i)
          .setAlign(Align.RIGHT)
          .appendField(newField, 'ARGNAME' + i);
        input.init();
      }
    }
    // Remove deleted inputs.
    for (let i = this.arguments_.length; this.getInput('ARG' + i); i++) {
      this.removeInput('ARG' + i);
    }
    // Add 'with:' if there are parameters, remove otherwise.
    const topRow = this.getInput('TOPROW');
    if (topRow) {
      if (this.arguments_.length) {
        if (!this.getField('WITH')) {
          topRow.appendField(Msg['PROCEDURES_CALL_BEFORE_PARAMS'], 'WITH');
          topRow.init();
        }
      } else {
        if (this.getField('WITH')) {
          topRow.removeField('WITH');
        }
      }
    }
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * Backwards compatible serialization implementation.
   *
   * @returns XML storage element.
   */
  mutationToDom: function (this: CallBlock): Element {
    const container = xmlUtils.createElement('mutation');
    container.setAttribute('name', this.getGofuncCall());
    for (let i = 0; i < this.arguments_.length; i++) {
      const parameter = xmlUtils.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * Backwards compatible serialization implementation.
   *
   * @param xmlElement XML storage element.
   */
  domToMutation: function (this: CallBlock, xmlElement: Element) {
    const name = xmlElement.getAttribute('name')!;
    console.log("DtoM rename", this.getGofuncCall());
    this.renameGofunc(this.getGofuncCall(), name);
    const args: string[] = [];
    const paramIds = [];
    for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
      console.log("D2M", childNode.nodeName);
      if (childNode.nodeName.toLowerCase() === 'arg') {
        args.push((childNode as Element).getAttribute('name')!);
        paramIds.push((childNode as Element).getAttribute('paramId')!);
      }
    }
    console.log("DOM TO MUTATION", args, paramIds);
    this.setGofuncParameters_(args, paramIds);
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   *
   * @returns The state of this block, ie the params and gofunc name.
   */
  saveExtraState: function (this: CallBlock): CallExtraState {
    const state = Object.create(null);
    state['name'] = this.getGofuncCall();
    if (this.arguments_.length) {
      state['params'] = this.arguments_;
    }
    return state;
  },
  /**
   * Applies the given state to this block.
   *
   * @param state The state to apply to this block, ie the params and
   *     gofunc name.
   */
  loadExtraState: function (this: CallBlock, state: CallExtraState) {
    console.log("loadExtraState", this.getGofuncCall());
    this.renameGofunc(this.getGofuncCall(), state['name']);
    const params = state['params'];
    if (params) {
      const ids: string[] = [];
      ids.length = params.length;
      ids.fill(null as unknown as string); // TODO(#6920)
      this.setGofuncParameters_(params, ids);
    }
  },
  /**
   * Return all variables referenced by this block.
   *
   * @returns List of variable names.
   */
  getVars: function (this: CallBlock): string[] {
    return this.arguments_;
  },
  /**
   * Return all variables referenced by this block.
   *
   * @returns List of variable models.
   */
  getVarModels: function (this: CallBlock): VariableModel[] {
    return this.argumentVarModels_;
  },
  /**
   * Gofunc calls cannot exist without the corresponding gofunc
   * definition.  Enforce this link whenever an event is fired.
   *
   * @param event Change event.
   */
  onchange: function (this: CallBlock, event: AbstractEvent) {
    if (!this.workspace || this.workspace.isFlyout) {
      // Block is deleted or is in a flyout.
      return;
    }
    if (!event.recordUndo) {
      // Events not generated by user. Skip handling.
      return;
    }
    if (
      event.type === Events.BLOCK_CREATE &&
      (event as BlockCreate).ids!.indexOf(this.id) !== -1
    ) {
      // Look for the case where a gofunc call was created (usually through
      // paste) and there is no matching definition.  In this case, create
      // an empty definition block with the correct signature.
      const name = this.getGofuncCall();
      let def = Gofuncs.getDefinition(name, this.workspace);
      let godef = def as GofuncBlock;
      console.log("ON XANGE", name, def, this.defType_, def?.type, JSON.stringify(godef?.getInputs()), JSON.stringify(this.arguments_), JSON.stringify(this.inputNames_))
      if (
        def &&
        (def.type !== this.defType_ ||
          JSON.stringify(godef.getInputs()) !== JSON.stringify(this.arguments_))
      ) {
        // The signatures don't match.
        def = null;
      }
      if (!def) {
        Events.setGroup(event.group);
        /**
         * Create matching definition block.
         * <xml xmlns="https://developers.google.com/blockly/xml">
         *   <block type="gofuncs_defreturn" x="10" y="20">
         *     <mutation name="test">
         *       <arg name="x"></arg>
         *     </mutation>
         *     <field name="NAME">test</field>
         *   </block>
         * </xml>
         */
        const xml = xmlUtils.createElement('xml');
        const block = xmlUtils.createElement('block');
        block.setAttribute('type', this.defType_);
        const xy = this.getRelativeToSurfaceXY();
        const x = xy.x + config.snapRadius * (this.RTL ? -1 : 1);
        const y = xy.y + config.snapRadius * 2;
        block.setAttribute('x', `${x}`);
        block.setAttribute('y', `${y}`);
        const mutation = this.mutationToDom();
        block.appendChild(mutation);
        const field = xmlUtils.createElement('field');
        field.setAttribute('name', 'NAME');
        const callName = this.getGofuncCall();
        const newName = Gofuncs.findLegalName(callName, this);
        console.log("ON CHANGEEE", callName, newName);
        if (callName !== newName) {
          this.renameGofunc(callName, newName);
        }
        field.appendChild(xmlUtils.createTextNode(callName));
        block.appendChild(field);
        xml.appendChild(block);
        Xml.domToWorkspace(xml, this.workspace);
        Events.setGroup(false);
      }
    } else if (event.type === Events.BLOCK_DELETE) {
      // Look for the case where a gofunc definition has been deleted,
      // leaving this block (a gofunc call) orphaned.  In this case, delete
      // the orphan.
      const name = this.getGofuncCall();
      const def = Gofuncs.getDefinition(name, this.workspace);
      if (!def) {
        Events.setGroup(event.group);
        this.dispose(true);
        Events.setGroup(false);
      }
    } else if (
      event.type === Events.BLOCK_CHANGE &&
      (event as BlockChange).element === 'disabled'
    ) {
      const blockChangeEvent = event as BlockChange;
      const name = this.getGofuncCall();
      const def = Gofuncs.getDefinition(name, this.workspace);
      if (def && def.id === blockChangeEvent.blockId) {
        // in most cases the old group should be ''
        const oldGroup = Events.getGroup();
        if (oldGroup) {
          // This should only be possible programmatically and may indicate a
          // problem with event grouping. If you see this message please
          // investigate. If the use ends up being valid we may need to reorder
          // events in the undo stack.
          console.log(
            'Saw an existing group while responding to a definition change'
          );
        }
        Events.setGroup(event.group);
        if (blockChangeEvent.newValue) {
          this.previousEnabledState_ = this.isEnabled();
          this.setEnabled(false);
        } else {
          this.setEnabled(this.previousEnabledState_);
        }
        Events.setGroup(oldGroup);
      }
    }
  },
  /**
   * Add menu option to find the definition block for this call.
   *
   * @param options List of menu options to add to.
   */
  customContextMenu: function (
    this: CallBlock,
    options: Array<ContextMenuOption | LegacyContextMenuOption>
  ) {
    if (!(this.workspace as WorkspaceSvg).isMovable()) {
      // If we center on the block and the workspace isn't movable we could
      // loose blocks at the edges of the workspace.
      return;
    }

    const name = this.getGofuncCall();
    const workspace = this.workspace;
    options.push({
      enabled: true,
      text: Msg['PROCEDURES_HIGHLIGHT_DEF'],
      callback: function () {
        const def = Gofuncs.getDefinition(name, workspace);
        if (def) {
          (workspace as WorkspaceSvg).centerOnBlock(def.id);
          (def as BlockSvg).select();
        }
      },
    });
  },
};


blocks['gofuncs_callreturn'] = {
  ...GOFUNC_CALL_COMMON,
  /**
   * Block for calling a gofunc with a return value.
   */
  init: function (this: CallBlock) {
    this.appendDummyInput('TOPROW').appendField('', 'NAME');
    // IF RETURN
    this.setOutput(true, null);
    // NO RETURN
    //this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);

    this.setStyle('procedure_blocks');
    // Tooltip is set in domToMutation.
    this.setHelpUrl(Msg['PROCEDURES_CALLRETURN_HELPURL']);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousEnabledState_ = true;
    this.inputNames_ = [];
    this.inputTypes_ = [];
    this.outputNames_ = [];
    this.outputTypes_ = [];
  },

  defType_: 'gofuncs_defreturn',
};


blocks['gofuncs_callnoreturn'] = {
  ...GOFUNC_CALL_COMMON,
  /**
   * Block for calling a gofunc with a return value.
   */
  init: function (this: CallBlock) {
    this.appendDummyInput('TOPROW').appendField('', 'NAME');
    // IF RETURN
    //this.setOutput(true, null);
    // NO RETURN
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setStyle('procedure_blocks');
    // Tooltip is set in domToMutation.
    this.setHelpUrl(Msg['PROCEDURES_CALLRETURN_HELPURL']);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousEnabledState_ = true;
    this.inputNames_ = [];
    this.inputTypes_ = [];
    this.outputNames_ = [];
    this.outputTypes_ = [];
  },

  defType_: 'gofuncs_defreturn',
};

// Register provided blocks.
defineBlocks(blocks);
