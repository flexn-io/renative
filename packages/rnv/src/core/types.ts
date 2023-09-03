import { RnvContext } from './context/types';

export type RnvPlatform = string;

export type RnvModuleConfig = {
    modulePaths: Array<string>;
    moduleAliasesArray: Array<string>;
};

export type RnvNextJSConfig = any;

export type RenativeConfigVersion = string | { version: string };

export type RnvError = any;

export type GetConfigPropFn = <T = any>(c: RnvContext, platform: string, key: string, defaultVal?: any) => T;
