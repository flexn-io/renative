import type { _PluginPlatformMergedSchemaType } from './plugins';
import type { _RootLocalSchemaType } from './configFiles/local';
import type { _AppDelegateMethodType } from './platforms/fragments/templateXcodeBase';
import type { _PlatformsKeysType } from './shared';
import type { _MergedPlatformObjectType, _PlatformsSchemaType } from './platforms';
import type { _PluginType } from './plugins';
import type { _RootAppBaseSchemalType } from './configFiles/app';
import type { _RootGlobalSchemaType } from './configFiles/global';
import type { _RootProjectBaseSchemaType } from './configFiles/project';
import type { _RootPluginsSchemaType } from './configFiles/plugins';
import type { _ManifestChildWithChildrenType } from './platforms/fragments/templateAndroidBase';
import type { _MergedPlatformPrivateObjectType } from './configFiles/private';
import type { _CommonSchemaType } from './common';
import { _RootTemplatesSchemaType } from './configFiles/templates';
// import type { _CommonBuildSchemesSchemaType, _CommonSchemaPartialType } from './common';
// import type { RenativeConfigFile } from './types';

// NOTE: Why am I bothered with all this nonsense instead of just exporting root schema types?
// because infering full schema (complex zod types & unions) impacts TS server performance
// here I'm giving TS hand by offloading some of the heavy computations to predefined types and removing unions
// When all reantive json get merged into one file this happens conceptually anyway

//===============================
// BUILD CONFIG (MERGED)
//===============================

type RootPluginsMerged = {
    pluginTemplates: Record<string, _RootPluginsSchemaType>;
};

type Common = {
    common: _CommonSchemaType;
};

type PluginsMap = {
    plugins: Record<string, _PluginType | string>;
};

type PlatformsMap = {
    platforms: _PlatformsSchemaType;
};

type _ConfigRootMerged =
    //Templates
    _RootTemplatesSchemaType &
        //Global
        _RootGlobalSchemaType &
        //Plugins (multiple roots merged under scope object)
        RootPluginsMerged &
        //Project + App
        Required<_RootProjectBaseSchemaType> &
        _RootLocalSchemaType &
        _RootAppBaseSchemalType &
        Common &
        PluginsMap &
        PlatformsMap;

export type RenativeConfigFile = _ConfigRootMerged;

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

export type RenativeConfigPlugin = Exclude<RenativeConfigFile['plugins'][string], string>;

export type RenativeConfigPaths = RenativeConfigFile['paths'];

export type RenativeConfigPluginPlatform = _PluginPlatformMergedSchemaType;

export type RenativeWebpackConfig = RenativeConfigPlugin['webpackConfig'];

export type PlatformKey = _PlatformsKeysType;

export type RenativeConfigTaskKey = keyof Required<Required<RenativeConfigFile>['tasks']>;

export type RenativeConfigAppDelegateMethod = _AppDelegateMethodType;

export type ManifestFeature = _ManifestChildWithChildrenType;

// export const test = (test: _ConfigRootMerged) => {
//     console.log(test);

//     const plugin = test.plugins['ss'];
//     if (typeof plugin !== 'string') {
//         console.log(plugin);
//     }
// };
