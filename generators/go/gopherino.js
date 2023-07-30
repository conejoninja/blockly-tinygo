/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.Gopherino');

import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';

export function gopherino_move(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addVariable('i2c', 'var i2c = machine.I2C0');
    generator.addDeclaration('i2c', 'i2c.Configure(machine.I2CConfig{Frequency: machine.TWI_FREQ_100KHZ})');
    generator.addImport('gopherino_motor', 'github.com/conejoninja/gopherino/motor');
    generator.addVariable('gopherino_motor', 'var gopherino_motor *motor.Device');
    generator.addDeclaration('gopherino_motor', 'gopherino_motor = motor.New(i2c)\ngopherino_motor.Configure()');
    const direction = block.getFieldValue('DIRECTION');
    return 'gopherino_motor.' + direction + '()\n';
};
export function gopherino_hcsr04_readdistance(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('gopherino_hcsr04', 'tinygo.org/x/drivers/hcsr04');
    generator.addVariable('gopherino_hcsr04', 'var gopherino_hcsr04 hcsr04.Device');
    generator.addDeclaration('gopherino_hcsr04', 'gopherino_hcsr04 = hcsr04.New(machine.P1, machine.P2)\ngopherino_hcsr04.Configure()');
    return ['gopherino_hcsr04.ReadDistance()\n', 0];
};