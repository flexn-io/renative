import type { ConfigFileBuildConfig } from './schema';
import type { PlatformKey } from './schema/types';

export * from './schema/configFiles/types';

export type RnvPlatform = PlatformKey | null;

export type RnvPlatformWithAll = PlatformKey | 'all';

export type RenativeConfigVersion = string | { version: string };

export type RnvError = any;

export type Env = Record<string, any>;

type Plat = Required<Required<ConfigFileBuildConfig>['platforms']>[PlatformKey];
export type PlatPropKey = keyof Plat;
export type BuildSchemePropKey = keyof Required<Plat>['buildSchemes'][string];
export type CommonPropKey = keyof ConfigFileBuildConfig['common'];
export type BuildConfigPropKey = keyof ConfigFileBuildConfig;
