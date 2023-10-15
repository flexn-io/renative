import type { _PluginPlatformMergedType } from './plugins';
import type { _ConfigRootEngineType } from './configFiles/engine';
import type { _RootProjectLocalSchemaPartialType } from './configFiles/local';
import type { _AppDelegateMethodType } from './platforms/templateXcodeBase';
import type { _PluginiOSType } from './plugins/ios';
import type { _PlatformsKeysType } from './shared';
import type { NpmPackageFile } from '../configs/types';
import type { _MergedPlatformObjectType, _PlatformMergedType } from './platforms';
import type { _PluginType } from './plugins';
import type { _RootAppSchemaPartialType, _RootAppSchemaType } from './configFiles/appConfig';
import type { _RootGlobalSchemaType } from './configFiles/global';
import type { _RootProjectSchemaPartialType } from './configFiles/project';
import type { _RootTemplatesSchemaType } from './configFiles/pluginTemplates';
import type { _ConfigRootPlugin } from './configFiles/plugin';
import type { _RootProjectSchemaType } from './configFiles/project';
import type { _ManifestChildWithChildrenType } from './platforms/templateAndroidBase';
import type { _CommonBuildSchemesSchemaType, _CommonSchemaPartialType } from './common';
// import type { RenativeConfigFile } from './types';

// NOTE: Why am I bothered with all this nonsense instead of just exporting root schema types?
// because infering full schema (complex zod types & unions) impacts TS server performance
// here I'm giving TS hand by offloading some of the heavy computations to predefined types and removing unions
// When all reantive json get merged into one file this happens conceptually anyway

type MergedPluginTemplates = {
    pluginTemplates: Record<string, _RootTemplatesSchemaType>;
};

type Common = {
    common: _CommonSchemaPartialType & {
        buildSchemes: _CommonBuildSchemesSchemaType;
    };
};

type PluginsMap = {
    plugins: Record<string, _PluginType>;
};

type PlatformsMap = {
    platforms: Record<string, _PlatformMergedType>;
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
    Required<_RootProjectSchemaPartialType> &
    _RootProjectLocalSchemaPartialType &
    _RootAppSchemaPartialType &
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

export type ConfigRootPlugin = _ConfigRootPlugin;

export type RenativeConfigFile = _ConfigRootMerged;

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

export type ManifestFeature = _ManifestChildWithChildrenType;

export type ConfigProp = _MergedPlatformObjectType;
