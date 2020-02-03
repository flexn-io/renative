import chalk from 'chalk';
import inquirer from 'inquirer';
import { logWarning, logTask, rnvStatus, logEnd, logToSummary } from './logger';
import Config from '../config';

const highlight = chalk.grey.bold;

export const inquirerPrompt = async (params) => {
    const c = Config.getConfig();
    const msg = params.logMessage || params.warningMessage || params.message;
    if (c.program.ci) {
        throw new Error(`--ci option does not allow prompts: ${msg}`);
    }
    if (msg && params.logMessage) logTask(msg, chalk.grey);
    if (msg && params.warningMessage) logWarning(msg);

    // allow passing in just { type: 'prompt', ... } instead of { type: 'prompt', name: 'prompt', ... }
    const { type, name } = params;
    if (type === 'confirm' && !name) params.name = 'confirm';

    const result = await inquirer.prompt(params);
    return result;
};

export const generateOptions = (inputData, isMultiChoice = false, mapping, renderMethod) => {
    let asString = '';
    const valuesAsObject = {};
    const valuesAsArray = [];
    const keysAsObject = {};
    const keysAsArray = [];
    const optionsAsArray = [];
    const isArray = Array.isArray(inputData);

    const output = {};
    const renderer = renderMethod || _generateOptionString;
    if (isArray) {
        inputData.map((v, i) => {
            const rn = renderer(i, v, mapping, v);
            asString += rn;
            optionsAsArray.push(rn);
            valuesAsArray.push(v);
            if (!mapping) keysAsArray.push(v);
            if (!mapping) valuesAsObject[v] = v;
        });
    } else {
        let i = 0;
        for (const k in inputData) {
            const v = inputData[k];
            const rn = renderer(i, v, mapping, k);
            asString += rn;
            optionsAsArray.push(rn);
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
    output.optionsAsArray = optionsAsArray;
    return output;
};

const _sort = (a, b) => {
    let aStr = '';
    let bStr = '';
    if (typeof a === 'string') {
        // TODO: temp fix for weird issue when a/b are marked as string
        // but toLowerCase() is undefined. need to investigate
        aStr = a.toLowerCase ? a.toLowerCase() : a;
        bStr = b.toLowerCase ? b.toLowerCase() : b;
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
