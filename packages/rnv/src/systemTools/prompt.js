import chalk from 'chalk';
import inquirer from 'inquirer';
import { logWarning, logTask, rnvStatus, logEnd, logToSummary } from './logger';
import Config from '../config';

const highlight = chalk.grey.bold;

export const inquirerPrompt = async (params) => {
    const c = Config.getConfig();
    if (c.program.ci) {
        throw params.logMessage || params.warningMessage || '--ci option does not allow prompts';
    }
    if (params.logMessage) logWarning(params.logMessage);
    const result = await inquirer.prompt(params);
    return result;
};

export const generateOptions = (inputData, isMultiChoice = false, mapping, renderMethod) => {
    let asString = '';
    const valuesAsObject = {};
    const valuesAsArray = [];
    const keysAsObject = {};
    const keysAsArray = [];
    const isArray = Array.isArray(inputData);

    const output = {};
    const renderer = renderMethod || _generateOptionString;
    if (isArray) {
        inputData.map((v, i) => {
            asString += renderer(i, v, mapping, v);
            valuesAsArray.push(v);
            if (!mapping) keysAsArray.push(v);
            if (!mapping) valuesAsObject[v] = v;
        });
    } else {
        let i = 0;
        for (const k in inputData) {
            const v = inputData[k];
            asString += renderer(i, v, mapping, k);
            keysAsArray.push(k);
            keysAsObject[k] = true;
            valuesAsObject[k] = v;
            valuesAsArray.push(v);
            i++;
        }
    }
    output.keysAsArray = keysAsArray.sort(_sort);
    output.valuesAsArray = valuesAsArray.sort(_sort);
    output.keysAsObject = keysAsObject;
    output.valuesAsObject = valuesAsObject;
    output.asString = asString;
    return output;
};

const _sort = (a, b) => {
    let aStr = '';
    let bStr = '';
    if (typeof a === 'string') {
        aStr = a.toLowerCase();
        bStr = b.toLowerCase();
    } else {
        if (a && a.name) aStr = a.name.toLowerCase();
        if (b && b.name) bStr = b.name.toLowerCase();
    }

    let com = 0;
    if (aStr > bStr) {
        com = 1;
    } else if (aStr < bStr) {
        com = -1;
    }
    return com;
};

const _generateOptionString = (i, obj, mapping, defaultVal) => ` [${highlight(i + 1)}]> ${highlight(mapping ? '' : defaultVal)} \n`;
