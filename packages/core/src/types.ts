import type { PlatformKey } from './schema/types';

export type RnvPlatform = PlatformKey | null;

export type RnvPlatformWithAll = PlatformKey | 'all';

export type RnvModuleConfig = {
    modulePaths: Array<string>;
    moduleAliases: Record<string, string | undefined>;
    moduleAliasesArray: Array<string>;
};

export type RnvNextJSConfig = any;

export type RenativeConfigVersion = string | { version: string };

export type RnvError = any;
