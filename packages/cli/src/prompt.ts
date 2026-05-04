import { confirm, input, select, checkbox, search, Separator } from '@inquirer/prompts';
import {
    chalk,
    logWarning,
    logTask,
    logDebug,
    PromptParams,
    PromptOptions,
    PromptRenderFn,
    getContext,
} from '@rnv/core';

export const inquirerPrompt = async (params: PromptParams): Promise<Record<string, any>> => {
    const c = getContext();

    if (c.program?.opts()?.yes) {
        const key = params.name || params.type;

        if (params.type === 'confirm') {
            return { [key]: true };
        }

        if (params.default) {
            return {
                [key]: typeof params.default === 'function' ? params.default() : params.default,
            };
        }
    }

    const msg = params.logMessage || params.warningMessage || params.message;
    if (c.program?.opts()?.ci) {
        if (
            Array.isArray(params.choices) &&
            typeof params.default !== 'undefined' &&
            params.choices.includes(params.default)
        ) {
            logDebug(`defaulting to choice '${params.default}' for prompt '${params.name}'`);

            if (params.name) return { [params.name]: params.default };
        }
        return Promise.reject(`--ci option does not allow prompts. question: ${msg}.`);
    }
    if (msg && params.logMessage) logTask(msg, chalk().grey);
    if (msg && params.warningMessage) logWarning(msg);

    const { type } = params;
    if (type === 'confirm' && !params.name) params.name = 'confirm';

    const promptKey = params.name || type;
    const message = params.message || '';
    const choices = (params.choices || []).map((c) => (typeof c === 'string' ? { value: c } : c));

    let value: any;

    switch (type) {
        case 'confirm':
            value = await confirm({
                message,
                default: typeof params.default === 'boolean' ? params.default : undefined,
            });
            break;
        case 'list':
        case 'rawlist':
            value = await select({
                message,
                choices,
                default: params.default,
                pageSize: params.pageSize,
                loop: params.loop,
            });
            break;
        case 'checkbox': {
            const checkedChoices = params.default
                ? choices.map((c) =>
                      typeof c === 'object' && 'value' in c && (params.default as any[]).includes(c.value)
                          ? { ...c, checked: true }
                          : c
                  )
                : choices;
            value = await checkbox({
                message,
                choices: checkedChoices,
                pageSize: params.pageSize,
                loop: params.loop,
            });
            break;
        }
        case 'autocomplete':
        case 'search':
            value = await search({
                message,
                source: params.source
                    ? (term, _opt) => params.source!(undefined, term)
                    : async () => choices,
                pageSize: params.pageSize,
            });
            break;
        default:
            value = await input({
                message,
                default: params.default ?? params.initialValue,
                validate: params.validate,
            });
            break;
    }

    return { [promptKey]: value };
};

export const inquirerSeparator = (text?: string) => {
    return new Separator(text);
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
        inputData.forEach((v: any, i: number) => {
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
    inquirerSeparator,
};
