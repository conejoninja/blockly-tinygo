/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.GopherBot');

import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';

export function gopherbot_antenna(block, generator) {
    generator.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    generator.addVariable('gopherbot_antenna', 'var antenna *gopherbot.AntennaDevice');
    generator.addDeclaration('gopherbot_antenna', 'antenna = gopherbot.Antenna()');
    const state = block.getFieldValue('STATE');
    const code = 'antenna.' + state + '()\n';
    return code;
};
export function gopherbot_visor(block, generator) {
    generator.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    generator.addVariable('gopherbot_visor', 'var visor *gopherbot.VisorDevice');
    generator.addDeclaration('gopherbot_visor', 'visor = gopherbot.Visor()');
    const mode = block.getFieldValue('MODE');
    const code = 'visor.' + mode + '()\n';
    return code;
};
export function gopherbot_button(block, generator) {
    generator.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    const btn = block.getFieldValue('BUTTON');
    if (btn == "LEFT") {
        generator.addVariable('gopherbot_btn_left', 'var btnLeft *gopherbot.ButtonDevice');
        generator.addDeclaration('gopherbot_btn_left', 'btnLeft = gopherbot.LeftButton()');
        return ['btnLeft.Pushed()', Order.NONE];
    }
    generator.addVariable('gopherbot_btn_right', 'var btnRight *gopherbot.ButtonDevice');
    generator.addDeclaration('gopherbot_btn_right', 'btnRight = gopherbot.RightButton()');
    return ['btnRight.Pushed()', Order.NONE];
};
export function gopherbot_backpack(block, generator) {
    generator.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    generator.addVariable('gopherbot_backpack', 'var backpack *gopherbot.BackpackDevice');
    generator.addDeclaration('gopherbot_backpack', 'backpack = gopherbot.Backpack()');
    const mode = block.getFieldValue('MODE');
    const code = 'backpack.' + mode + '()\n';
    return code;
};
export function gopherbot_backpack_alternate(block, generator) {
    generator.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    generator.addVariable('gopherbot_backpack', 'var backpack *gopherbot.BackpackDevice');
    generator.addDeclaration('gopherbot_backpack', 'backpack = gopherbot.Backpack()');
    const code = 'backpack.Alternate(' + generator.HexToRgbA(block.getFieldValue('COLOR1')) + ', ' + generator.HexToRgbA(block.getFieldValue('COLOR2')) + ')\n';
    return code;
};
export function gopherbot_speaker(block, generator) {
    generator.addImport('gopherbot', 'github.com/hybridgroup/gopherbot');
    generator.addVariable('gopherbot_speaker', 'var speaker *gopherbot.SpeakerDevice');
    generator.addDeclaration('gopherbot_speaker', 'speaker = gopherbot.Speaker()');
    const mode = block.getFieldValue('MODE');
    const code = 'speaker.' + mode + '()\n';
    return code;
};
export function HexToRgbA(hex) {
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
};