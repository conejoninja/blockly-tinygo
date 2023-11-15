/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.TinyGo');

import { NameType } from '../../core/names.js';
import { Order } from './go_generator.js';

export function tinygo_led_complete(block, generator) {
    const state = block.getFieldValue('STATE');
    const pin = block.getFieldValue('PIN');
    generator.configurePin('ledPin' + pin, 'machine.D' + pin, 'Output');
    return 'ledPin' + pin + '.' + state + '()\n';
};

export function tinygo_led(block, generator) {
    const pins = block.connectorPinUsage();
    const stateOutput = generator.valueToCode(block, 'STATE', Order.ATOMIC) || false;

    generator.configurePin('ledPin' + pins[0], pins[0], 'Output');
    if (stateOutput == 'true') {
        return 'ledPin' + pins[0] + '.High()\n';
    }
    return 'ledPin' + pins[0] + '.Low()\n';
};

export function tinygo_led_state(block, generator) {
    const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return [code, Order.ATOMIC];
};
export function tinygo_goroutine(block, generator) {
    let code = '';
    const branchCode = generator.statementToCode(block, 'GR0');
    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = 'go func() {\n' + branchCode + '}()\n';
    }
    else {
        code = 'go ' + branchCode;
    }
    return code;
};
export function tinygo_time_sleep(block, generator) {
    generator.imports_['time'] = 'time';
    const amount = block.getFieldValue('AMOUNT');
    const unit = block.getFieldValue('UNIT');
    const code = 'time.Sleep(' + amount + ' * ' + unit + ')\n';
    return code;
};

export function tinygo_readdata(block, generator) {
    const code = 'ReadData()\n';
    return code;
};


export function tinygo_tuple2(block, generator) {
    const fnCode = generator.statementToCode(block, 'TUPLE2');
    return block.getFieldValue('VAR1') + ', ' + block.getFieldValue('VAR2') + ' = ' + fnCode + '\n';
};


export function tinygo_tuple3(block, generator) {
    const fnCode = generator.statementToCode(block, 'TUPLE3');
    return block.getFieldValue('VAR1') + ', ' + block.getFieldValue('VAR2') + ', ' + block.getFieldValue('VAR3') + ' = ' + fnCode + '\n';
};


export function tinygo_tuple4(block, generator) {
    const fnCode = generator.statementToCode(block, 'TUPLE4');
    return block.getFieldValue('VAR1') + ', ' + block.getFieldValue('VAR2') + ', ' + block.getFieldValue('VAR3') + ', ' + block.getFieldValue('VAR4') + ' = ' + fnCode + '\n';
};


export function tinygo_strconv_atoi(block, generator) {
    generator.imports_['strconv'] = 'strconv';
    var msg = generator.valueToCode(block, 'TEXT', Order.NONE) || '\'\'';
    return 'func() (int32, error){\ni, err := strconv.Atoi(' + msg + ')\nreturn int32(i), err\n	}()';
};
export function tinygo_strconv_itoa(block, generator) {
    generator.imports_['strconv'] = 'strconv';
    var msg = generator.valueToCode(block, 'TEXT', Order.NONE) || '\'\'';
    return ['strconv.Itoa(int(' + msg + '))', 0];
};

export function tinygo_print(block, generator) {
    // Print statement.
    const msg = generator.valueToCode(block, 'TEXT', Order.NONE) || "\"\"";
    generator.addImport('fmt', 'fmt');

    return 'println(' + msg + ')\n';
};

export function tinygo_defer(block, generator) {
    let code = '';
    const branchCode = generator.statementToCode(block, 'GR0');
    const lines = branchCode.split('\n');
    if (lines.length > 2) {
        code = 'defer func() {\n' + branchCode + '}()\n';
    }
    else {
        code = 'defer ' + branchCode;
    }
    return code;
};