/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the test 2 blocks.
 */
'use strict';

goog.provide('Blockly.TinyGo');

goog.require('Blockly.Go');
goog.require('Blockly.Types');

Blockly.TinyGo.init = function(workspace) {
Blockly.TinyGo.variables_ = [];
Blockly.TinyGo.pins_ = [];
Blockly.TinyGo.imports_ = [];
};

Blockly.TinyGo.configurePin = function(id, pinNumber, mode) {
  Blockly.TinyGo.variables_[id] = 'const '+id+' = machine.Pin('+pinNumber+')';
  Blockly.TinyGo.pins_[id] = id+'.Configure(machine.PinConfig{Mode: machine.Pin'+mode+'})';
  Blockly.TinyGo.imports_['machine'] = 'machine';
}

Blockly.Blocks['tinygo_led'] = {
  /**
   * Grove LED module block definition.
   * @this Blockly.Block
   */
  init: function() {

    var connectorIo = [];
  for (var i = 0; i < 14; i++) {
    connectorIo.push(['D' + i.toString(), i.toString()]);
  }
  
    this.setHelpUrl('http://www.seeedstudio.com/wiki/Grove_-_LED');
    this.setColour(180);
    this.appendValueInput('STATE')
        .appendField(new Blockly.FieldImage(
            '../blocks/img/led.png', 32, 32))
        .appendField("LED on pin")
        .appendField(new Blockly.FieldDropdown(connectorIo), 'PINNUMBER')
        .setCheck(Blockly.Types.LEDSTATE.checkList);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Tooltip LED");
  },
  /**
   * Updates the content of the the pin related fields.
   * @this Blockly.Block
   */
  updateFields: function() {
    Blockly.Arduino.Boards.refreshBlockFieldDropdown(
        this, 'PINNUMBER', 'groveDigital');
  },
  /**
   * Returns a list with the connector used pins. For this block just the first.
   * @this Blockly.Block
   * @return {!Array<string>} List of used pins by this block.
   */
  connectorPinUsage: function() {
    return [this.getFieldValue('PINNUMBER')];
  }
};

Blockly.Go['tinygo_led'] = function(block) {
  var pins = block.connectorPinUsage();
  var stateOutput = Blockly.Go.valueToCode(
      block, 'STATE', Blockly.Go.ORDER_ATOMIC) || false;

  //Blockly.Go.reservePin(
    //  block, pins[0], Blockly.Go.PinTypes.GROVE_LED, 'this Grove module');

  Blockly.TinyGo.configurePin('ledPin' + pins[0], pins[0], 'Output');
  console.log(stateOutput,stateOutput=='true');
  if(stateOutput=='true') {
    return 'ledPin' + pins[0] + '.High()\n';
  }
  return 'ledPin' + pins[0] + '.Low()\n';
};


Blockly.Types.LEDSTATE = new Blockly.Type({
  typeId: 'LedState',
  typeMsgName: 'ARD_TYPE_BOOL',
  compatibleTypes: []
});



Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for boolean data type: true and false.
  {
    "type": "tinygo_led_state",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BOOL",
        "options": [
          ["HIGH", "TRUE"],
          ["LOW", "FALSE"]
        ]
      }
    ],
    "output": "LedState",
    "style": "logic_blocks",
    "tooltip": "tooltip",
    "helpUrl": "helpurl"
  },
]);

Blockly.Go['tinygo_led_state'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Go.ORDER_ATOMIC];
};
