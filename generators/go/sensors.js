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
    generator.addImport('tinygo.org/x/drivers/onewire', '"tinygo.org/x/drivers/onewire"');
    generator.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    generator.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    return 'func () (tmp int32, err error) { \nfor _, romid := range romIDs {\ntmp, err = sensors_ds18b20.ReadTemperature(romid)\nbreak\n}\nreturn\n}()\n';
};
export function sensors_ds18b20_requesttemperature(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/onewire', '"tinygo.org/x/drivers/onewire"');
    generator.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    generator.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    return 'for _, romid := range romIDs {\nsensors_ds18b20.RequestTemperature(romid)\n}\n';
};
export function sensors_ds18b20_configure(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/onewire', '"tinygo.org/x/drivers/onewire"');
    generator.addImport('tinygo.org/x/drivers/ds18b20', 'tinygo.org/x/drivers/ds18b20');
    generator.addVariable('sensors_ds18b20', 'var sensors_ds18b20 ds18b20.Device');
    const pin = block.getFieldValue('PIN');
    return 'ow := onewire.New(machine.' + pin + ')\nromIDs, err := ow.Search(onewire.SEARCH_ROM)\nif err != nil {\nprintln(err)\n}\nsensors_ds18b20 := ds18b20.New(ow)\n';
};

export function sensors_sth4x_readtemperature(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/sht4x', 'tinygo.org/x/drivers/sht4x');
    generator.addVariable('sensors_sht4x', 'var sensors_sht4x sht4x.Device');
    generator.addDeclaration('gopherbadge_i2c', 'machine.I2C0.Configure(machine.I2CConfig{})\nsensors_sht4x = sht4x.New(machine.I2C0)\n');
    return 'sensors_sht4x.ReadTemperatureHumidity()\n';
};
export function sensors_sth4x_configure(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/sht4x', 'tinygo.org/x/drivers/sht4x');
    generator.addVariable('sensors_sht4x', 'var sensors_sht4x sht4x.Device');
    return '\nsensors_sht4x = sht4x.New(machine.I2C0)\n';
};