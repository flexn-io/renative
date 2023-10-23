import type { _PluginPlatformMergedSchemaType } from './plugins';
import type { _AppDelegateMethodType } from './platforms/fragments/templateXcodeBase';
import type { _PlatformsKeysType } from './shared';
import type { _MergedPlatformObjectType } from './platforms';
import type { _RootAppBaseSchemalType } from './configFiles/app';

import type { _RootProjectBaseSchemaType } from './configFiles/project';
import type { _AndroidManifestType, _ManifestChildWithChildrenType } from './platforms/fragments/templateAndroidBase';
import type { _MergedPlatformPrivateObjectType } from './configFiles/private';
import { ConfigFileBuildConfig } from './configFiles/buildConfig';

//===============================
// NORMALIZED (MERGED+NORMALIZED)
//===============================

export type ConfigProp = _RootProjectBaseSchemaType &
    _RootAppBaseSchemalType &
    _MergedPlatformPrivateObjectType &
    _MergedPlatformObjectType;

export type ConfigPropKey = keyof ConfigProp;

//===============================
// SUB-TYPES
//===============================

export type RenativeConfigPlugin = Exclude<ConfigFileBuildConfig['plugins'][string], string>;

export type RenativeConfigPaths = ConfigFileBuildConfig['paths'];

export type RenativeConfigPluginPlatform = _PluginPlatformMergedSchemaType;

export type RenativeWebpackConfig = RenativeConfigPlugin['webpackConfig'];

export type PlatformKey = _PlatformsKeysType;

export type RenativeConfigTaskKey = keyof Required<Required<ConfigFileBuildConfig>['tasks']>;

export type RenativeConfigAppDelegateMethod = _AppDelegateMethodType;

export type AndroidManifestNode = _ManifestChildWithChildrenType;

export type AndroidManifest = _AndroidManifestType;

// export type ManifestNode = _ManifestChildType;

// export const test = (test: _ConfigRootMerged) => {
//     console.log(test);

//     const plugin = test.plugins['ss'];
//     if (typeof plugin !== 'string') {
//         console.log(plugin);
//     }
// };
