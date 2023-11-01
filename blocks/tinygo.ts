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
  }
]);


defineBlocks(blocks);