/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Go.Gofuncs');

import * as Variables from '../../core/variables.js';
import {NameType} from '../../core/names.js';
import {Order} from './go_generator.js';


export function gofuncs_defreturn(block, generator) {
    let def = block.getGofuncDef();
    let funcStr = 'func '+def[0]+'(';
    if(def[1].length>0) {
        let args = [];
        for(let i=0;i<def[1].length;i++) {
            args.push(def[1][i].name+' '+gofuncs_getGoType(def[1][i].type));
        }
        funcStr += args.join(', ');
    }
    funcStr += ')';
    let returnValue  = '';
    if(def[2].length>0) {
        let args = [];
        for(let i=0;i<def[2].length;i++) {
            args.push(def[2][i].name+' '+gofuncs_getGoType(def[2][i].type));
        }
        funcStr += ' ('+args.join(', ')+')';
        returnValue = 'return\n';
    }
    funcStr +=' {\n';


    const globals = [];
  const workspace = block.workspace;
  const usedVariables = Variables.allUsedVarModels(workspace) || [];
  for (let i = 0, variable; variable = usedVariables[i]; i++) {
    const varName = variable.name;
    if (block.getVars().indexOf(varName) === -1) {
      globals.push(generator.nameDB_.getName(varName, NameType.VARIABLE));
    }
  }
  // Add developer variables.
  const devVarList = Variables.allDeveloperVariables(workspace);
  console.log("VARIABLES", devVarList, globals);
  for (let i = 0; i < devVarList.length; i++) {
    globals.push(
        generator.nameDB_.getName(
          devVarList[i], NameType.DEVELOPER_VARIABLE));
  }
  const globalStr = '';
      /*globals.length ?
      generator.INDENT + 'var ' + globals.join(', ') + '\n' : '';*/

  const funcName =
      generator.nameDB_.getName(
        block.getFieldValue('NAME'), NameType.PROCEDURE);
  let xfix1 = '';
  if (generator.STATEMENT_PREFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_PREFIX, block);
  }
  if (generator.STATEMENT_SUFFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = generator.prefixLines(xfix1, generator.INDENT);
  }
  let loopTrap = '';
  if (generator.INFINITE_LOOP_TRAP) {
    loopTrap = generator.prefixLines(
        generator.injectId(generator.INFINITE_LOOP_TRAP, block),
        generator.INDENT);
  }
  const branch = generator.statementToCode(block, 'STACK');
  /*let returnValue = generator.valueToCode(block, 'RETURN', Order.NONE) || '';
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = generator.INDENT + 'return ' + returnValue + '\n';
  }*/

  let code = funcStr + globalStr + xfix1 + loopTrap + branch + returnValue + '\n}\n';
    //return funcStr;
    code = generator.scrub_(block, code);
    // Add % so as not to collide with helper functions in definitions list.
    generator.definitions_['%' + funcName] = code;
    return null;
};


export function gofuncs_callnoreturn(block, generator) {
  let code =  gofuncs_callreturn(block, generator);
  return code[0]+'\n';
}

export function gofuncs_callreturn(block, generator) {
    const funcName =
      generator.nameDB_.getName(
        block.getFieldValue('NAME'), NameType.PROCEDURE);
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'null';
  }
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, Order.FUNCTION_CALL];
};


export function gofuncs_getGoType(typeBlockly) {
  console.log("TYPE", typeBlockly);
  if (typeBlockly == undefined) {
    return 'Invalid Blockly Type';
  }
  switch (typeBlockly) {
    case 'Number':
      return 'int32';
    default:
      return typeBlockly.toLowerCase();
  }
};