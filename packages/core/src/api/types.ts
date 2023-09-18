export type AnalyticsApi = {
    captureException: (e: string | Error, context: { extra: any }) => void;
    teardown: () => Promise<void>;
};

//TODO: move
export type RnvApiSpinner = (msg: string | { text: string }) => {
    start: RnvApiSpinner;
    fail: RnvApiSpinner;
    succeed: RnvApiSpinner;
    text: string;
};

//TODO: type this properly
export type RnvApiPrompt = {
    inquirerPrompt: (options: {
        name?: string;
        type: string;
        message?: string;
        choices?: Array<string>;
        validate?: (i: string) => string | boolean;
        logMessage?: string;
        warningMessage?: string;
        default?: any;
        pageSize?: number;
    }) => Promise<any>;
    generateOptions: (inputData: any, isMultiChoice?: boolean, mapping?: any, renderMethod?: PromptRenderFn) => any;
    pressAnyKeyToContinue: () => Promise<any>;
};

export type RnvContextAnalytics = {
    captureEvent: (ops: { type: string; platform?: string; template?: string; platforms?: Array<string> }) => void;
};

export interface RnvApi {
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
    fsExistsSync: any;
    fsReadFileSync: any;
    fsReaddirSync: any;
    fsWriteFileSync: any;
    path: any;
}

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
