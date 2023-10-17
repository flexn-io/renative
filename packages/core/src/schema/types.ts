import type { _PluginPlatformMergedSchemaType } from './plugins';
import type { _ConfigRootEngineType } from './configFiles/engine';
import type { _RootLocalSchemaType } from './configFiles/local';
import type { _AppDelegateMethodType } from './platforms/fragments/templateXcodeBase';
import type { _PlatformsKeysType } from './shared';
import type { NpmPackageFile } from '../configs/types';
import type { _MergedPlatformObjectType, _PlatformsSchemaType } from './platforms';
import type { _PluginType } from './plugins';
import type { _RootAppBaseSchemalType, _RootAppSchemaType } from './configFiles/app';
import type { _RootGlobalSchemaType } from './configFiles/global';
import type { _RootProjectBaseSchemaType } from './configFiles/project';
import type { _RootPluginsSchemaType } from './configFiles/plugins';
import type { _RootPluginSchemaType } from './configFiles/plugin';
import type { _RootProjectSchemaType } from './configFiles/project';
import type { _ManifestChildWithChildrenType } from './platforms/fragments/templateAndroidBase';
import type { _MergedPlatformPrivateObjectType, _RootPrivateSchemaType } from './configFiles/private';
import type { _CommonSchemaType } from './common';
// import type { _CommonBuildSchemesSchemaType, _CommonSchemaPartialType } from './common';
// import type { RenativeConfigFile } from './types';

// NOTE: Why am I bothered with all this nonsense instead of just exporting root schema types?
// because infering full schema (complex zod types & unions) impacts TS server performance
// here I'm giving TS hand by offloading some of the heavy computations to predefined types and removing unions
// When all reantive json get merged into one file this happens conceptually anyway

type MergedPluginTemplates = {
    pluginTemplates: Record<string, _RootPluginsSchemaType>;
};

// type Common = {
//     common: _CommonSchemaPartialType & {
//         buildSchemes: _CommonBuildSchemesSchemaType;
//     };
// };

type Common = {
    common: _CommonSchemaType;
};

type PluginsMap = {
    plugins: Record<string, _PluginType | string>;
};

// type PlatformsMap = {
//     platforms: Record<string, _PlatformMergedType>;
// };

type PlatformsMap = {
    platforms: _PlatformsSchemaType;
};

type ProjectTemplate = {
    projectTemplates?: object;
    engineTemplates?: Record<
        string,
        {
            version: string;
            id: string;
        }
    >;
    templateConfig?: {
        includedPaths?: string[];
        packageTemplate?: NpmPackageFile;
    };
};

type _ConfigRootMerged = _RootGlobalSchemaType &
    MergedPluginTemplates &
    Required<_RootProjectBaseSchemaType> &
    _RootLocalSchemaType &
    _RootAppBaseSchemalType &
    Common &
    PluginsMap &
    PlatformsMap &
    ProjectTemplate;

// export const test = (test: _ConfigRootMerged) => {
//     console.log(test);

//     const plugin = test.plugins['ss'];
//     if (typeof plugin !== 'string') {
//         console.log(plugin);
//     }
// };

export type ConfigRootProject = _RootProjectSchemaType;

export type ConfigRootApp = _RootAppSchemaType;

export type ConfigRootEngine = _ConfigRootEngineType;

export type ConfigRootPlugin = _RootPluginSchemaType;

export type RenativeConfigFile = _ConfigRootMerged;

export type RenativeConfigPlugin = Exclude<RenativeConfigFile['plugins'][string], string>;

// export type RenativeConfigPluginiOS = _PluginiOSType;

export type RenativeConfigPluginPlatform = _PluginPlatformMergedSchemaType;

export type RenativeWebpackConfig = RenativeConfigPlugin['webpackConfig'];

export type PlatformKey = _PlatformsKeysType;

export type RenativeConfigTaskKey = keyof Required<Required<RenativeConfigFile>['tasks']>;

export type RenativeEngineConfig = _ConfigRootEngineType;

export type RenativeConfigLocal = _RootLocalSchemaType;

export type RenativeConfigPrivate = _RootPrivateSchemaType;

export type RenativeConfigAppDelegateMethod = _AppDelegateMethodType;

export type ManifestFeature = _ManifestChildWithChildrenType;

export type ConfigProp = _RootProjectBaseSchemaType &
    _RootAppBaseSchemalType &
    _MergedPlatformPrivateObjectType &
    _MergedPlatformObjectType;

export type ConfigPropKey = keyof ConfigProp;
