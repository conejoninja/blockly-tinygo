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