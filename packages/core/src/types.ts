import { RnvContext } from './context/types';

export type RnvPlatform = string;

export type RnvModuleConfig = {
    modulePaths: Array<string>;
    moduleAliases: Record<string, string | undefined>;
    moduleAliasesArray: Array<string>;
};

export type RnvNextJSConfig = any;

export type RenativeConfigVersion = string | { version: string };

export type RnvError = any;

export type GetConfigPropFn = <T = any>(c: RnvContext, platform: string, key: string, defaultVal?: any) => T;

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
