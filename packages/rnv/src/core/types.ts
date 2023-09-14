import { RnvContext } from './contextManager/types';

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
