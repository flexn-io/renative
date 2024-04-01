import type { RnvPluginPlatformSchema, RnvPluginSchema } from './plugins';
import type { _AppDelegateMethodType } from './platforms/fragments/templateXcode';
import type { RnvPlatformSchemaFragment } from './platforms';
import type { RnvRootProjectBaseFragment } from './configFiles/project';
import type { _AndroidManifestType, _ManifestChildWithChildrenType } from './platforms/fragments/templateAndroid';
import type { _MergedPlatformPrivateObjectType } from './configFiles/private';
import type { ConfigFileBuildConfig } from './configFiles/buildConfig';
import { type RnvPlatformNameKey } from '../enums/platformName';
import { RnvRootAppBaseFragment } from './configFiles/app';

//===============================
// NORMALIZED (MERGED+NORMALIZED)
//===============================

export type ConfigProp = Required<RnvRootProjectBaseFragment> &
    Required<RnvRootAppBaseFragment> &
    Required<_MergedPlatformPrivateObjectType> &
    Required<RnvPlatformSchemaFragment>;

export type ConfigPropKey = keyof ConfigProp;

//===============================
// SUB-TYPES
//===============================

export type RenativeConfigPlugin = RnvPluginSchema;

export type RenativeConfigPaths = Required<RnvRootProjectBaseFragment>['paths'];

export type RenativeConfigPluginPlatform = RnvPluginPlatformSchema;

export type RenativeWebpackConfig = RenativeConfigPlugin['webpackConfig'];

export type PlatformKey = RnvPlatformNameKey;

export type RenativeConfigRnvTaskName = keyof Required<Required<ConfigFileBuildConfig>['tasks']>;

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

export type PlatformsMapSchema<T> = {
    android: T;
    androidtv: T;
    androidwear: T;
    firetv: T;
    ios: T;
    tvos: T;
    tizen: T;
    tizenmobile: T;
    tizenwatch: T;
    webos: T;
    web: T;
    webtv: T;
    chromecast: T;
    kaios: T;
    macos: T;
    linux: T;
    windows: T;
    xbox: T;
};
