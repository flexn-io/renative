import type { _PluginPlatformMergedType } from '../zod/configPlugins';
import { _ConfigRootEngineType } from '../zod/configRootEngine';
import type { _PlatformsKeysType } from '../zod/shared/configShared';
import type { ConfigRootMerged } from './configRootMerged';

export type RenativeConfigFile = ConfigRootMerged;

export type RenativeConfigBuildScheme = Required<RenativeConfigFile['platforms'][string]>['buildSchemes'][string];

export type RenativeConfigPlugin = RenativeConfigFile['plugins'][string];

export type RenativeConfigPlatform = RenativeConfigFile['platforms'][string];

export type RenativeConfigPluginPlatform = _PluginPlatformMergedType;

export type RenativeWebpackConfig = RenativeConfigFile['plugins'][string]['webpackConfig'];

export type PlatformKey = _PlatformsKeysType;

export type RenativeConfigTaskKey = keyof Required<Required<RenativeConfigFile>['tasks']>;

export type RenativeEngineConfig = _ConfigRootEngineType;
