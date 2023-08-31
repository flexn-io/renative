import { RnvConfig } from './configManager/types';

export type RnvPlatform = string;

export type RnvModuleConfig = {
    modulePaths: Array<string>;
    moduleAliasesArray: Array<string>;
};

export type RnvNextJSConfig = any;

export type RenativeConfigVersion = string | { version: string };

export type RnvError = any;

export type GetConfigPropFn = <T = any>(c: RnvConfig, platform: string, key: string, defaultVal?: any) => T;
