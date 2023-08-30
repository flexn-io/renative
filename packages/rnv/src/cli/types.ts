export type PromptOptions = {
    keysAsArray: any;
    valuesAsArray: any;
    keysAsObject: any;
    valuesAsObject: any;
    asString: any;
    optionsAsArray: any;
};

export type PromptParams = {
    logMessage?: string;
    warningMessage?: string;
    message?: string;
    choices?: any;
    default?: any;
    name?: string;
    type: string;
    pageSize?: number;
    validate?: (i: string) => string | boolean;
};

export type PromptRenderFn = (i: number, obj: any, mapping: any, defaultVal: string) => string;
