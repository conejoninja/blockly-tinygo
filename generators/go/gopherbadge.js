/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.GopherBadge');

import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';

export function gopherbadge_button_get(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addVariable('gopherbadge_buttons', 'var btnA, btnB, btnUp, btnLeft, btnDown, btnRight machine.Pin');
    generator.addDeclaration('gopherbadge_buttons', 'btnA = machine.BUTTON_A\nbtnB = machine.BUTTON_B\nbtnUp = machine.BUTTON_UP\nbtnLeft = machine.BUTTON_LEFT\nbtnDown = machine.BUTTON_DOWN\nbtnRight = machine.BUTTON_RIGHT\nbtnA.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnB.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnUp.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnLeft.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnDown.Configure(machine.PinConfig{Mode: machine.PinInput})\nbtnRight.Configure(machine.PinConfig{Mode: machine.PinInput})');
    const button = block.getFieldValue('BUTTON');
    return button + '.Get()';
};


export function gopherbadge_fillscreen(block, generator) {
    generator.addImport('machine', 'machine');
    generator.addImport('tinygo.org/x/drivers/st7789', 'tinygo.org/x/drivers/st7789');
    generator.addVariable('gopherbadge_display', 'var display st7789.Device');
    generator.addDeclaration('gopherbadge_display', 'machine.SPI0.Configure(machine.SPIConfig{\nFrequency: 8000000,\nMode:      0,\n})\ndisplay = st7789.New(machine.SPI0,\nmachine.TFT_RST,\nmachine.TFT_WRX,\nmachine.TFT_CS,\nmachine.TFT_BACKLIGHT)\n\ndisplay.Configure(st7789.Config{\nRotation: st7789.ROTATION_270,\nHeight:   320,\n})\n');
    const color = block.getFieldValue('COLOR');
    console.log("COLOR", color);

    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
        c = color.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'display.FillScreen(color.RGBA{' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',255})';
    }

    return color;
};

/*Go.HexToRgbA = function (hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'color.RGBA{' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',255}';
    }
    throw new Error('Bad Hex');
};*/
