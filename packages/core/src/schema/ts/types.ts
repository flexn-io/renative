import type { _PluginPlatformMergedType } from '../zod/configPlugins';
import type { _ConfigRootEngineType } from '../zod/configRootEngine';
import type { _RootProjectLocalSchemaPartialType } from '../zod/configRootProjectLocal';
import type { _AppDelegateMethodType } from '../zod/ios/configPlatformSharediOS';
import type { _PluginiOSType } from '../zod/ios/configPluginiOS';
import type { _PlatformsKeysType } from '../zod/shared/configShared';
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
