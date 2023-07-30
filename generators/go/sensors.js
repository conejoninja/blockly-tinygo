/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.Sensors');

import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';

export function sensors_ds18b20_readtemperature(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/1-wire', 'wire "tinygo.org/x/drivers/1-wire"');
    generator.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    generator.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    return 'sensors_ds18b20.ReadTemperature()\n';
};
export function sensors_ds18b20_requesttemperature(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/1-wire', 'wire "tinygo.org/x/drivers/1-wire"');
    generator.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    generator.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    return '_ = sensors_ds18b20.RequestTemperature()\n';
};
export function sensors_ds18b20_configure(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/1-wire', 'wire "tinygo.org/x/drivers/1-wire"');
    generator.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    generator.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    const pin = block.getFieldValue('PIN');
    return 'sensors_ds18b20 = ds18b20.New(wire.New(machine.' + pin + '))\n';
};