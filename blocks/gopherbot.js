/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';

goog.provide('Blockly.Gopherbot');

goog.require('Blockly.Go');
goog.require('Blockly.TinyGo');
goog.require('Blockly.Types');



Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for boolean data type: true and false.  
  {
    "type": "gopherbot_antenna",
    "message0": "antenna %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          [
            "ON",
            "On"
          ],
          [
            "OFF",
            "Off"
          ],
          [
            "BLINK",
            "Blink"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "gopherbot_visor",
    "message0": "visor mode %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "MODE",
        "options": [
          [
            "RED",
            "Red"
          ],
          [
            "GREEN",
            "Green"
          ],
          [
            "BLUE",
            "Blue"
          ],
          [
            "CYLON",
            "Cylon"
          ],
          [
            "XMAS",
            "Xmas"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "gopherbot_button",
    "message0": "button %1 is pushed",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BUTTON",
        "options": [
          [
            "LEFT",
            "LEFT"
          ],
          [
            "RIGHT",
            "RIGHT"
          ]
        ]
      }
    ],
    "output": "Boolean",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
  
  
]);

Blockly.Go['gopherbot_antenna'] = function(block) {  
  Blockly.TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
  Blockly.TinyGo.addVariable('gopherbot_antenna', 'var antenna *gopherbot.AntennaDevice');
  Blockly.TinyGo.addDeclaration('gopherbot_antenna', 'antenna = gopherbot.Antenna()');

  var state = block.getFieldValue('STATE');
  var code = 'antenna.'+state+'()\n';
  return code; 
};

Blockly.Go['gopherbot_visor'] = function(block) {  
  Blockly.TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
  Blockly.TinyGo.addVariable('gopherbot_visor', 'var visor *gopherbot.VisorDevice');
  Blockly.TinyGo.addDeclaration('gopherbot_visor', 'visor = gopherbot.Visor()');

  var mode = block.getFieldValue('MODE');
  var code = 'visor.'+mode+'()\n';
  return code; 
};


Blockly.Go['gopherbot_button'] = function(block) {  
  Blockly.TinyGo.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
  var btn = block.getFieldValue('BUTTON');
  if(btn=="LEFT") {  
    Blockly.TinyGo.addVariable('gopherbot_btn_left', 'var btnLeft *gopherbot.ButtonDevice');
    Blockly.TinyGo.addDeclaration('gopherbot_btn_left', 'btnLeft = gopherbot.LeftButton()');
    return ['btnLeft.Pushed()', Blockly.Go.ORDER_NONE];
  }
  Blockly.TinyGo.addVariable('gopherbot_btn_right', 'var btnRight *gopherbot.ButtonDevice');
  Blockly.TinyGo.addDeclaration('gopherbot_btn_right', 'btnRight = gopherbot.RightButton()');
  return ['btnRight.Pushed()', Blockly.Go.ORDER_NONE];
};