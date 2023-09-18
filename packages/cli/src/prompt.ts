import inquirer from 'inquirer';
import { chalk, logWarning, logTask, logDebug, Context, PromptParams, PromptOptions, PromptRenderFn } from '@rnv/core';

export const inquirerPrompt = async (params: PromptParams): Promise<Record<string, any>> => {
    const c = Context.getContext();
    if (c.program?.yes) return {};

    const msg = params.logMessage || params.warningMessage || params.message;
    if (c.program?.ci) {
        if (
            Array.isArray(params.choices) &&
            typeof params.default !== 'undefined' &&
            params.choices.includes(params.default)
        ) {
            logDebug(`defaulting to choice '${params.default}' for prompt '${params.name}'`);

            if (params.name) return Promise.resolve({ [params.name]: params.default });
        }
        return Promise.reject(`--ci option does not allow prompts. question: ${msg}.`);
    }
    if (msg && params.logMessage) logTask(msg, chalk().grey);
    if (msg && params.warningMessage) logWarning(msg);

    // allow passing in just { type: 'prompt', ... } instead of { type: 'prompt', name: 'prompt', ... }
    const { type, name } = params;
    if (type === 'confirm' && !name) params.name = 'confirm';

    const resp = inquirer.prompt(params);
    return resp;
};

export const inquirerSeparator = () => {
    return new inquirer.Separator();
};

export const pressAnyKeyToContinue = () => {
    const params = {
        type: 'input',
        name: 'confirm',
        message: 'Press any key to continue',
    };
    return inquirer.prompt(params as any);
};

export const generateOptions = (
    inputData: any,
    isMultiChoice = false,
    mapping?: any,
    renderMethod?: PromptRenderFn
) => {
    logDebug('generateOptions', isMultiChoice);
    let asString = '';
    const valuesAsObject: Record<string, any> = {};
    const valuesAsArray: Array<any> = [];
    const keysAsObject: Record<string, any> = {};
    const keysAsArray: Array<any> = [];
    const optionsAsArray: Array<any> = [];
    const isArray = Array.isArray(inputData);

    const output: PromptOptions = {
        keysAsArray: [],
        valuesAsArray: [],
        keysAsObject: {},
        valuesAsObject: {},
        asString: '',
        optionsAsArray: [],
    };
    const renderer = renderMethod || _generateOptionString;
    if (isArray) {
        inputData.forEach((v, i) => {
            const rn = renderer(i, v, mapping, v);
            asString += rn;
            optionsAsArray.push(rn);
            valuesAsArray.push(v);
            if (!mapping) keysAsArray.push(v);
            if (!mapping) valuesAsObject[v] = v;
        });
    } else {
        let i = 0;
        Object.keys(inputData).forEach((k) => {
            const v = inputData[k];
            const rn = renderer(i, v, mapping, k);
            asString += rn;
            optionsAsArray.push(rn);
            keysAsArray.push(k);
            keysAsObject[k] = true;
            valuesAsObject[k] = v;
            valuesAsArray.push(v);
            i++;
        });
    }
    output.keysAsArray = keysAsArray.sort(_sort);
    output.valuesAsArray = valuesAsArray.sort(_sort);
    output.keysAsObject = keysAsObject;
    output.valuesAsObject = valuesAsObject;
    output.asString = asString;
    output.optionsAsArray = optionsAsArray;
    return output;
};

const _sort = (a: any, b: any) => {
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

const _generateOptionString = (i: number, _obj: any, mapping: any, defaultVal: string) =>
    ` [${chalk().bold.grey(i + 1)}]> ${chalk().bold.grey(mapping ? '' : defaultVal)} \n`;

export default {
    inquirerPrompt,
    generateOptions,
    pressAnyKeyToContinue,
    inquirerSeparator,
};
