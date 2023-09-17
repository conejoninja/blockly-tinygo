/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.libraryBlocks.TinyGo');

import * as ContextMenu from '../core/contextmenu.js';
import * as Events from '../core/events/events.js';
import * as Procedures from '../core/procedures.js';
import * as Variables from '../core/variables.js';
import * as Extensions from '../core/extensions.js';
import type { FieldDropdown } from '../core/field_dropdown.js';
import * as Xml from '../core/xml.js';
import * as fieldRegistry from '../core/field_registry.js';
import * as xmlUtils from '../core/utils/xml.js';
import type { Abstract as AbstractEvent } from '../core/events/events_abstract.js';
import { Align } from '../core/inputs/input.js';
import type { Block } from '../core/block.js';
import type { BlockSvg } from '../core/block_svg.js';
import type { BlockCreate } from '../core/events/events_block_create.js';
import type { BlockChange } from '../core/events/events_block_change.js';
import type { BlockDefinition } from '../core/blocks.js';
import type { Connection } from '../core/connection.js';
import {Field, UnattachedFieldError} from '../core/field.js';
import type {
  ContextMenuOption,
  LegacyContextMenuOption,
} from '../core/contextmenu_registry.js'; import { Msg } from '../core/msg.js';
import type { Workspace } from '../core/workspace.js';
import type { WorkspaceSvg } from '../core/workspace_svg.js';
import {
  createBlockDefinitionsFromJsonArray,
  defineBlocks,
} from '../core/common.js';
import { FieldLabel } from '../core/field_label.js';
import { MutatorIcon as Mutator } from '../core/icons/mutator_icon.js';
import { Names } from '../core/names.js';
import type { VariableModel } from '../core/variable_model.js';
import { config } from '../core/config.js';
import '../core/field_dropdown.js';
import '../core/field_label.js';
import '../core/field_number.js';
import '../core/field_variable.js';


export const blocks = createBlockDefinitionsFromJsonArray([
  // Block for boolean data type: true and false.
  {
    "type": "tinygo_led",
    "message0": "%1 set LED %2 %3",
    "args0": [
      {
        "type": "field_image",
        "src": "./img/led.png",
        "width": 32,
        "height": 32,
      },
      {
        "type": "field_dropdown",
        "name": "PIN",
        "options": [
          [
            "D0",
            "0",
          ],
          [
            "D1",
            "1",
          ],
          [
            "D2",
            "2",
          ],
          [
            "D3",
            "3",
          ],
          [
            "D4",
            "4",
          ],
          [
            "D5",
            "5",
          ],
          [
            "D6",
            "6",
          ],
          [
            "D7",
            "7",
          ],
          [
            "D8",
            "8",
          ],
          [
            "D9",
            "9",
          ],
          [
            "D10",
            "10",
          ],
          [
            "D11",
            "11",
          ],
          [
            "D12",
            "12",
          ],
          [
            "D13",
            "13",
            "machine.D13",
          ],
        ],
      },
      {
        "type": "input_value",
        "name": "STATE",
        "check": "LedState"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": "",
  },
  {
    "type": "tinygo_led_state",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BOOL",
        "options": [
          ["HIGH", "TRUE"],
          ["LOW", "FALSE"],
        ],
      },
    ],
    "output": "LedState",
    "style": "logic_blocks",
    "tooltip": "tooltip",
    "helpUrl": "helpurl",
  },
  {
    "type": "tinygo_led_complete",
    "message0": "%3 set LED %1 to %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "PIN",
        "options": [
          [
            "D0",
            "0",
          ],
          [
            "D1",
            "1",
          ],
          [
            "D2",
            "2",
          ],
          [
            "D3",
            "3",
          ],
          [
            "D4",
            "4",
          ],
          [
            "D5",
            "5",
          ],
          [
            "D6",
            "6",
          ],
          [
            "D7",
            "7",
          ],
          [
            "D8",
            "8",
          ],
          [
            "D9",
            "9",
          ],
          [
            "D10",
            "10",
          ],
          [
            "D11",
            "11",
          ],
          [
            "D12",
            "12",
          ],
          [
            "D13",
            "13",
            "machine.D13",
          ],
        ],
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          [
            "HIGH",
            "High",
          ],
          [
            "LOW",
            "Low",
          ],
        ],
      },
      {
        "type": "field_image",
        "src": "./img/led.png",
        "width": 32,
        "height": 32,
      },
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180,
    "tooltip": "",
    "helpUrl": "",
  },
  {
    "type": "tinygo_goroutine",
    "message0": "go routine %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "GR0",
      },
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "logic_blocks",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "extensions": ["controls_if_tooltip"],
  },
  {
    "type": "tinygo_readdata",
    "message0": "read data, return tuple2",
    "output": "Tuple2",
    "style": "logic_blocks",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "extensions": ["controls_if_tooltip"],
  },
  {
    "type": "tinygo_time_sleep",
    "message0": "sleep %1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "AMOUNT",
        "value": 500,
        "min": 0,
      },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [
          [
            "Milliseconds",
            "time.Millisecond",
          ],
          [
            "Microseconds",
            "time.Microseconds",
          ],
          [
            "Seconds",
            "time.Second",
          ],
        ],
      },
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": "",
  },
  {
    "type": "tinygo_strconv_atoi",
    "message0": "Convert string %1 to number",
    'args0': [
      {
        'type': 'input_value',
        'name': 'TEXT',
        'check': 'String',
      },
    ],
    "inputsInline": true,
    "output": "Tuple2",
    "style": "logic_blocks",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "extensions": ["controls_if_tooltip"],
  },
  {
    "type": "tinygo_strconv_itoa",
    "message0": "Convert number %1 to string",
    'args0': [
      {
        'type': 'input_value',
        'name': 'TEXT',
        'check': 'Number',
      },
    ],
    "inputsInline": true,
    "output": "String",
    "style": "logic_blocks",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "extensions": ["controls_if_tooltip"],
  },
  {
    "type": "tinygo_tuple2",
    "message0": "Set  %1 , %2 =  %3",
    "args0": [
      {
        "type": "field_input",
        "name": "VAR1",
        "text": "_"
      },
      {
        "type": "field_input",
        "name": "VAR2",
        "text": "_"
      },
      {
        "type": "input_value",
        "name": "TUPLE2",
        "check": "Tuple2"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "tinygo_tuple3",
    "message0": "Set  %1 , %2 , %3 =  %4",
    "args0": [
      {
        "type": "field_input",
        "name": "VAR1",
        "text": "_"
      },
      {
        "type": "field_input",
        "name": "VAR2",
        "text": "_"
      },
      {
        "type": "field_input",
        "name": "VAR3",
        "text": "_"
      },
      {
        "type": "input_value",
        "name": "TUPLE3",
        "check": "Tuple3"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "tinygo_tuple4",
    "message0": "Set  %1 , %2 , %3 , %4 =  %5",
    "args0": [
      {
        "type": "field_input",
        "name": "VAR1",
        "text": "_"
      },
      {
        "type": "field_input",
        "name": "VAR2",
        "text": "_"
      },
      {
        "type": "field_input",
        "name": "VAR3",
        "text": "_"
      },
      {
        "type": "field_input",
        "name": "VAR4",
        "text": "_"
      },
      {
        "type": "input_value",
        "name": "TUPLE4",
        "check": "Tuple4"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    'type': 'tinygo_procedure',
    'message0': 'to %1 %2 %3 \n %4',
    'args0': [
      {
        'type': 'field_input',
        'text': 'do something',
        'name': 'NAME',
        'check': 'String',
      },
      {
        "type": "field_label_serializable",
        "name": "INPUT_LABEL",
        "text": ""
      },
      {
        "type": "input_statement",
        "name": "GR0",
      },
      {
        "type": "field_label_serializable",
        "name": "OUTPUT_LABEL",
        "text": ""
      }
    ],
    'style': 'procedure_blocks',
    'helpUrl': '',
    'suppressPrefixSuffix': true,
    'mutator': 'tinygo_procedure_mutator',
    "extensions": ["tinygo_procedure_rename",]

  },
  {
    'type': 'tinygo_procedure_input',
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
        'text': 'int32',
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
    'type': 'tinygo_procedure_output',
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
        'text': 'int32',
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
    'type': 'tinygo_procedure_blank',
    "message0": "Inputs: %1 Outputs: %2",
    "args0": [
      {
        "type": "input_statement",
        "name": "INPUT",
        "check": ["tinygo_procedure_input"]
      },
      {
        "type": "input_statement",
        "name": "OUTPUT",
        "check": ["tinygo_procedure_output"]
      }
    ],
    'style': 'procedure_blocks',
    'helpUrl': '',
    'suppressPrefixSuffix': true,
  },
]);

/** Type of a block that has TINYGO_PROCEDURE_MUTATOR_MIXIN */
type TinyGoProcedureBlock = Block & TinyGoProcedureMixin;
interface TinyGoProcedureMixin extends TinyGoProcedureMixinType {
  inputNames_: string[];
  inputTypes_: string[];
  outputNames_: string[];
  outputTypes_: string[];
}
type TinyGoProcedureMixinType = typeof TINYGO_PROCEDURE_MUTATOR_MIXIN;

// Types for quarks defined in JSON.
/** Type of a controls_if_if (if mutator container) block. */
interface TinyGoContainerBlock extends Block { }

/** Extra state for serialising controls_if blocks. */
type TinyGoProcedureExtraState = {
  outputsProcedureCount?: number;
  hasElse?: boolean;
};


/**
 * Mutator methods added to controls_if blocks.
 */
const TINYGO_PROCEDURE_MUTATOR_MIXIN = {

  inputsCount_: 0,
  outputsCount_: 0,

  mutationToDom: function (this: TinyGoProcedureBlock): Element | null {
    if (!this.inputsCount_ && !this.outputsCount_) {
      return null;
    }
    const container = xmlUtils.createElement('mutation');
    container.setAttribute('name', this.getProcedureCall());
    if (this.inputsCount_) {
      container.setAttribute('inputs', String(this.inputsCount_));
    }
    if (this.outputsCount_) {
      container.setAttribute('outputs', String(this.outputsCount_));
    }
    return container;
  },

  onchange: function (this: Block, event: AbstractEvent) {
    /*console.log("ONCHANGE", this.getFieldValue('VAR'), this.getFieldValue('NAME'), this.workspace.tinygo_procedures);
    const varName = this.getFieldValue('NAME');
    this.workspace.tinygo_procedures.push(varName);*/
  },

  domToMutation: function (this: TinyGoProcedureBlock, xmlElement: Element) {
    console.log("DOM TO MUTATION");
    const name = xmlElement.getAttribute('name')!;
    this.renameProcedure(this.getProcedureCall(), name);

    this.inputsCount_ = parseInt(xmlElement.getAttribute('inputs')!, 10) || 0;
    this.outputsCount_ = parseInt(xmlElement.getAttribute('outputs')!, 10) || 0;
    console.log("DOM TO MUTATION", this.inputsCount_, this.outputsCount_);
    this.rebuildShape_();
  },

  saveExtraState: function (this: TinyGoProcedureBlock): TinyGoProcedureExtraState | null {
    console.log("SAVE EXTRA STATE TINYGO");
    if (!this.inputsCount_ && !this.outputsCount_) {
      return null;
    }
    const state = Object.create(null);
    if (this.inputsCount_) {
      state['inputsCount'] = this.inputsCount_;
    }
    if (this.outputsCount_) {
      state['outputsCount'] = this.outputsCount_;
    }
    return state;
  },

  loadExtraState: function (this: TinyGoProcedureBlock, state: TinyGoProcedureExtraState) {
    console.log("LOAD EXTRA STATE TINYGO");
    this.inputsCount_ = 0; //state['inputsCount'] || 0;
    this.outputsCount_ = 0; //state['outputsCount'] ? 1 : 0;
    this.updateShape_();
  },

  decompose: function (this: TinyGoProcedureBlock, workspace: Workspace): TinyGoContainerBlock {
    console.log("DECOMPOSE TINYGO");
    const containerBlock = workspace.newBlock('tinygo_procedure_blank');
    (containerBlock as BlockSvg).initSvg();

    let connection = containerBlock.inputList[0].connection!;
    for (let i = 0; i < this.inputsCount_; i++) {
      const inputsBlock = workspace.newBlock('tinygo_procedure_input');
      inputsBlock.setFieldValue(this.inputNames_[i], 'NAME');
      inputsBlock.setFieldValue(this.inputTypes_[i], 'TYPE');
      (inputsBlock as BlockSvg).initSvg();
      connection.connect(inputsBlock.previousConnection!);
      connection = inputsBlock.nextConnection!;
    }
    connection = containerBlock.inputList[1].connection!;
    for (let i = 0; i < this.outputsCount_; i++) {
      const outputsBlock = workspace.newBlock('tinygo_procedure_output');
      outputsBlock.setFieldValue(this.outputNames_[i], 'NAME');
      outputsBlock.setFieldValue(this.outputTypes_[i], 'TYPE');
      (outputsBlock as BlockSvg).initSvg();
      connection.connect(outputsBlock.previousConnection!);
      connection = outputsBlock.nextConnection!;
    }
    return containerBlock;
  },

  compose: function (this: TinyGoProcedureBlock, containerBlock: TinyGoContainerBlock) {
    console.log("COMPOSE TINYGO");

    this.inputsCount_ = 0;
    this.outputsCount_ = 0;

    this.inputNames_ = [];
    this.inputTypes_ = [];
    this.outputNames_ = [];
    this.outputTypes_ = [];

    let paramBlock = containerBlock.getInputTargetBlock('INPUT');
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      if (paramBlock.type == 'tinygo_procedure_input') {
        const varName = paramBlock.getFieldValue('NAME');
        const varType = paramBlock.getFieldValue('TYPE');
        this.inputNames_.push(varName);
        this.inputTypes_.push(varType);
        this.inputsCount_++;
      }
      paramBlock =
        paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();

    }

    paramBlock = containerBlock.getInputTargetBlock('OUTPUT');
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      if (paramBlock.type == 'tinygo_procedure_output') {
        const varName = paramBlock.getFieldValue('NAME');
        const varType = paramBlock.getFieldValue('TYPE');
        this.outputNames_.push(varName);
        this.outputTypes_.push(varType);
        this.outputsCount_++;
      }
      paramBlock =
        paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();

    }
    const inputsStatementConnections: Array<Connection | null> = [null];
    let outputsStatementConnection: Array<Connection | null> = [null];
    this.updateShape_();
    this.reconnectChildBlocks_(
      inputsStatementConnections,
      outputsStatementConnection
    );
  },

  /**
   * Reconstructs the block with all child blocks attached.
   */
  rebuildShape_: function (this: TinyGoProcedureBlock) {
    const inputsStatementConnections: Array<Connection | null> = [null];
    const outputsStatementConnections: Array<Connection | null> = [null];

    for (let i = 1; this.getInput('INPUT' + i); i++) {
      const inputDo = this.getInput('INPUT' + i);
      console.log("REBUILD SHAPE", inputDo, this);
      inputsStatementConnections.push(inputDo!.connection!.targetConnection);
    }
    for (let i = 1; this.getInput('OUTPUT' + i); i++) {
      const outputDo = this.getInput('OUTPUT' + i);
      outputsStatementConnections.push(outputDo!.connection!.targetConnection);
    }
    this.updateShape_();
    this.reconnectChildBlocks_(
      inputsStatementConnections,
      outputsStatementConnections
    );
  },
  /**
   * Modify this block to have the correct number of inputs.
   *
   * @internal
   */
  updateShape_: function (this: TinyGoProcedureBlock) {
    console.log("UPDATE SHAPE TINYGO");
    let argsStr = "";
    let args = [];
    for (let i = 0; i < this.inputsCount_; i++) {
      args.push(this.inputNames_[i] + " " + this.inputTypes_[i]);
    }
    if (args.length > 0) {
      argsStr = "with (" + args.join(", ") + ")";
    }
    this.setFieldValue(argsStr, 'INPUT_LABEL');

    argsStr = "";
    args = [];
    for (let i = 0; i < this.outputsCount_; i++) {
      args.push(this.outputNames_[i] + " " + this.outputTypes_[i]);
    }
    if (args.length > 0) {
      argsStr = "return (" + args.join(", ") + ")";
    }
    this.setFieldValue(argsStr, 'OUTPUT_LABEL');
  },

  reconnectChildBlocks_: function (
    this: TinyGoProcedureBlock,
    inputsStatementConnections: Array<Connection | null>,
    outputsStatementConnections: Array<Connection | null>
  ) {
    for (let i = 1; i <= this.inputsCount_; i++) {
      inputsStatementConnections[i]?.reconnect(this, 'DO' + i);
    }
    for (let i = 1; i <= this.outputsCount_; i++) {
      outputsStatementConnections[i]?.reconnect(this, 'DO' + i);
    }
  },

  getProcedureCall: function (this: TinyGoProcedureBlock): string {
    // The NAME field is guaranteed to exist, null will never be returned.
    return this.getFieldValue('NAME');
  },

  renameProcedure: function (
    this: TinyGoProcedureBlock,
    oldName: string,
    newName: string
  ) {
    console.log("RENAME PROCEDURE TINY", oldName, newName);
    /*if (Names.import {Names} from '../core/names.js';
    equals(oldName, this.getProcedureCall())) {
        this.setFieldValue(newName, 'NAME');
        const baseMsg = this.outputConnection
            ? Msg['PROCEDURES_CALLRETURN_TOOLTIP']
            : Msg['PROCEDURES_CALLNORETURN_TOOLTIP'];
        this.setTooltip(baseMsg.replace('%1', newName));
    }*/
  },
};

Extensions.registerMutator(
  'tinygo_procedure_mutator',
  TINYGO_PROCEDURE_MUTATOR_MIXIN,
  null as unknown as undefined,
  ['tinygo_procedure_input', 'tinygo_procedure_output']
);

Extensions.register(
  'tinygo_procedure_rename',
  function (this: TinyGoProcedureBlock) {
    let field = this.getField('NAME');
    if (field != null) {
      field!.setValidator(function rename(this: Field, name: string): string {
        const block = this.getSourceBlock();
        if (!block) {
          throw new UnattachedFieldError();
        }
      
        // Strip leading and trailing whitespace.  Beyond this, all names are legal.
        name = name.trim();
        const legalName = Procedures.findLegalName(name, block);
        if (/*isProcedureBlock(block) &&*/ !block.isInsertionMarker()) {
          //block.getProcedureModel().setName(legalName);
        }
        const oldName = this.getValue();
        if (oldName !== name && oldName !== legalName) {
          // Rename any callers.
          const blocks = block.workspace.getAllBlocks(false);
          for (let i = 0; i < blocks.length; i++) {
            // Assume it is a procedure so we can check.
            const procedureBlock = blocks[i] as unknown as TinyGoProcedureBlock;
            if (procedureBlock.renameProcedure) {
              procedureBlock.renameProcedure(oldName as string, legalName);
            }
          }
        }
        return legalName;
      });
    }
  });


defineBlocks(blocks);