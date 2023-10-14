import type { _PluginPlatformMergedType } from '../zod/plugins';
import type { _ConfigRootEngineType } from '../zod/configFiles/engine';
import type { _RootProjectLocalSchemaPartialType } from '../zod/configFiles/local';
import type { _AppDelegateMethodType } from '../zod/platforms/iosBase';
import type { _PluginiOSType } from '../zod/plugins/ios';
import type { _PlatformsKeysType } from '../zod/shared';
import type { ConfigRootMerged } from './configRootMerged';

export type RenativeConfigFile = ConfigRootMerged;

export type RenativeConfigBuildScheme = Required<RenativeConfigFile['platforms'][string]>['buildSchemes'][string];

export type RenativeConfigPlugin = RenativeConfigFile['plugins'][string];

export type RenativeConfigPluginiOS = _PluginiOSType;

export type RenativeConfigPlatform = RenativeConfigFile['platforms'][string];

export type RenativeConfigPluginPlatform = _PluginPlatformMergedType;

export type RenativeWebpackConfig = RenativeConfigFile['plugins'][string]['webpackConfig'];

export type PlatformKey = _PlatformsKeysType;

export type RenativeConfigTaskKey = keyof Required<Required<RenativeConfigFile>['tasks']>;

export type RenativeEngineConfig = _ConfigRootEngineType;

export type RenativeConfigLocal = _RootProjectLocalSchemaPartialType;

export type RenativeConfigAppDelegateMethod = _AppDelegateMethodType;
