import { z } from 'zod';
import { zodBuildSchemeFragment, zodTemplateConfigFragment } from './shared';
import { zodCommonSchemaFragment } from './common';
import { zodPlatformAndroidFragment } from './platforms/fragments/android';
import { zodPlatformBaseFragment } from './platforms/fragments/base';
import { zodPlatformElectronFragment } from './platforms/fragments/electron';
import { zodPlatformiOSFragment } from './platforms/fragments/ios';
import { zodPlatformLightningFragment } from './platforms/fragments/lightning';
import { zodPlatformNextJsFragment } from './platforms/fragments/nextjs';
import { zodPlatformReactNativeFragment } from './platforms/fragments/reactNative';
import {
    zodAndroidManifest,
    zodAndroidResources,
    zodManifestChildBase,
    zodManifestChildWithChildren,
    zodResourcesChildBase,
    zodResourcesChildWithChildren,
    zodTemplateAndroidFragment,
} from './platforms/fragments/templateAndroid';
import {
    type ConfigTemplateXcodeAppDelegateMethod,
    zodTemplateXcodeFragment,
} from './platforms/fragments/templateXcode';
import { zodPlatformTizenFragment } from './platforms/fragments/tizen';
import { zodPlatformWebFragment } from './platforms/fragments/web';
import { zodPlatformWebOSFragment } from './platforms/fragments/webos';
import { zodPlatformWebpackFragment } from './platforms/fragments/webpack';
import { zodPlatformWindowsFragment } from './platforms/fragments/windows';
import { zodRootAppBaseFragment } from './configFiles/app';
import { zodConfigFileEngine } from './configFiles/engine';
import { zodConfigFileIntegration } from './configFiles/integration';
import { zodConfigFileLocal } from './configFiles/local';
import { zodConfigFileOverrides } from './configFiles/overrides';
import { zodPluginBaseFragment } from './plugins/fragments/base';
import { zodPluginPlatformAndroidFragment } from './plugins/fragments/platformAndroid';
import { zodPluginPlatformBaseFragment } from './plugins/fragments/platformBase';
import { zodPluginPlatformiOSFragment } from './plugins/fragments/platformIos';
import { zodPluginFragment } from './configFiles/plugin';
import { zodConfigFilePrivate } from './configFiles/private';
import { zodConfigFileRuntime } from './configFiles/runtime';
import { zodConfigTemplateBootstrapConfig } from './configFiles/template';
import { zodRootProjectBaseFragment } from './configFiles/project';
import { zodConfigFileTemplates } from './configFiles/templates';
import { zodConfigFileWorkspace } from './configFiles/workspace';
import { zodConfigFileWorkspaces } from './configFiles/workspaces';
import type { RnvPlatformKey } from '../types';
import { zodPrivatePlatformAndroid } from './platforms/fragments/androidPrivate';

// Shared -----------------------
//
export type ConfigBuildSchemeFragment = z.infer<typeof zodBuildSchemeFragment>;
export type ConfigTemplateConfigFragment = z.infer<typeof zodTemplateConfigFragment>;

// Common -----------------------
//
export type ConfigCommonSchemaFragment = z.infer<typeof zodCommonSchemaFragment>;
export type CommonPropKey = keyof ConfigCommonSchemaFragment; // We Request keys excluding buildScheme (not ConfigCommonSchema)

export type ConfigCommonBuildSchemeSchema = Partial<
    ConfigCommonSchemaFragment & ConfigBuildSchemeFragment & ConfigPlatformBaseFragment
>;
export type CommonBuildSchemeKey = keyof ConfigCommonBuildSchemeSchema;

export type ConfigCommonSchema = Partial<ConfigCommonSchemaFragment> & {
    buildSchemes?: Record<string, ConfigCommonBuildSchemeSchema>;
};

// Platform -----------------------
//
export type ConfigPlatformAndroidFragment = z.infer<typeof zodPlatformAndroidFragment>;
export type ConfigPlatformBaseFragment = z.infer<typeof zodPlatformBaseFragment>;
export type ConfigPlatformElectronFragment = z.infer<typeof zodPlatformElectronFragment>;
export type ConfigPlatformiOSFragment = z.infer<typeof zodPlatformiOSFragment>;
export type ConfigPlatformLightningFragment = z.infer<typeof zodPlatformLightningFragment>;
export type ConfigPlatformNextJsFragment = z.infer<typeof zodPlatformNextJsFragment>;
export type ConfigPlatformReactNativeFragment = z.infer<typeof zodPlatformReactNativeFragment>;

export type ConfigAndroidManifestNode = z.infer<typeof zodManifestChildWithChildren>;
export type ConfigAndroidManifestChildType = z.infer<typeof zodManifestChildBase> & {
    children?: ConfigAndroidManifestChildType[];
};
export type ConfigAndroidManifest = z.infer<typeof zodAndroidManifest>;
export type ConfigTemplateAndroidFragment = z.infer<typeof zodTemplateAndroidFragment>;

export type ConfigAndroidResources = z.infer<typeof zodAndroidResources>;
export type ConfigAndroidResourcesNode = z.infer<typeof zodResourcesChildWithChildren>;
export type ConfigAndroidResourcesChildType = z.infer<typeof zodResourcesChildBase> & {
    children?: ConfigAndroidResourcesChildType[];
};
export type ConfigTemplateXcodeFragment = z.infer<typeof zodTemplateXcodeFragment>;
export type ConfigAppDelegateMethod = ConfigTemplateXcodeAppDelegateMethod[number];
export type ConfigPlatformTizenFragment = z.infer<typeof zodPlatformTizenFragment>;
export type ConfigPlatformWebFragment = z.infer<typeof zodPlatformWebFragment>;
export type ConfigPlatformWebOSFragment = z.infer<typeof zodPlatformWebOSFragment>;
export type ConfigPlatformWebpackFragment = z.infer<typeof zodPlatformWebpackFragment>;
export type ConfigPlatformWindowsFragment = z.infer<typeof zodPlatformWindowsFragment>;

export type ConfigPlatformSchemaFragment = ConfigCommonSchemaFragment &
    ConfigPlatformBaseFragment &
    ConfigPlatformiOSFragment &
    ConfigPlatformAndroidFragment &
    ConfigPrivatePlatformAndroid &
    ConfigPlatformWebFragment &
    ConfigPlatformTizenFragment &
    ConfigPlatformWindowsFragment &
    ConfigPlatformWebOSFragment &
    ConfigPlatformLightningFragment &
    ConfigPlatformReactNativeFragment &
    ConfigPlatformWebpackFragment &
    ConfigPlatformElectronFragment &
    ConfigPlatformNextJsFragment &
    ConfigTemplateAndroidFragment &
    ConfigTemplateXcodeFragment;
export type PlatPropKey = keyof ConfigPlatformSchemaFragment; // We Request keys excluding buildScheme (not ConfigPlatformSchema)

// export type ConfigPlatformsSchema = z.infer<typeof zodPlatformsSchema>;
export type ConfigPlatformBuildSchemeSchema = ConfigCommonSchemaFragment &
    ConfigBuildSchemeFragment &
    ConfigPlatformSchemaFragment;
export type PlatformBuildSchemeKey = keyof ConfigPlatformBuildSchemeSchema;

export type ConfigPlatformSchema = ConfigPlatformSchemaFragment & {
    buildSchemes?: Record<string, ConfigPlatformBuildSchemeSchema>;
};
export type ConfigPlatformsSchema = Partial<Record<RnvPlatformKey, ConfigPlatformSchema>>;

// App -----------------------
//
export type ConfigRootAppBaseFragment = z.infer<typeof zodRootAppBaseFragment>;

export type ConfigFileApp = ConfigRootAppBaseFragment & {
    common?: ConfigCommonSchema;
    platforms?: ConfigPlatformsSchema;
    plugins?: ConfigPluginsSchema;
};
// appConfigs/**/renative.json

// BuildConfig -----------------------
//
type RootPluginsMerged = {
    scopedPluginTemplates: Record<string, ConfigFileTemplates['pluginTemplates']>;
};

// renative.build.json
export type ConfigFileBuildConfig = ConfigFileTemplates &
    ConfigFileWorkspace &
    RootPluginsMerged &
    ConfigFileProject &
    ConfigFileLocal &
    ConfigRootAppBaseFragment;

export type BuildConfigKey = keyof ConfigFileBuildConfig;

export type ConfigPropRootMerged<T> = ConfigFileBuildConfig & T;
export type ConfigPropRootKeyMerged<T> = keyof ConfigPropRootMerged<T>;
export type GetConfigRootPropVal<T, K extends ConfigPropRootKeyMerged<T>> = ConfigPropRootMerged<T>[K] | undefined;

// Engine -----------------------
//
// renative.engine.json
export type ConfigFileEngine = z.infer<typeof zodConfigFileEngine>;

// Integration -----------------------
//
// renative.integration.json
export type ConfigFileIntegration = z.infer<typeof zodConfigFileIntegration>;

// Local -----------------------
//
// renative.local.json
export type ConfigFileLocal = z.infer<typeof zodConfigFileLocal>;

// Overrides -----------------------
//
//overrides.json
export type ConfigFileOverrides = z.infer<typeof zodConfigFileOverrides>;

// Plugin -----------------------
//
export type ConfigPluginBaseFragment = z.infer<typeof zodPluginBaseFragment>;
export type ConfigPluginPlatformAndroidFragment = Partial<z.infer<typeof zodPluginPlatformAndroidFragment>>;
export type ConfigPluginPlatformBaseFragment = Partial<z.infer<typeof zodPluginPlatformBaseFragment>>;
export type ConfigPluginPlatformiOSFragment = Partial<z.infer<typeof zodPluginPlatformiOSFragment>>;
export type ConfigPluginPlatformSchema = ConfigPluginPlatformBaseFragment &
    ConfigPluginPlatformAndroidFragment &
    ConfigPluginPlatformiOSFragment;
export type ConfigPluginPlatformsSchema = Record<RnvPlatformKey, ConfigPluginPlatformSchema>;
export type ConfigPluginSchema = ConfigPluginBaseFragment & Partial<ConfigPluginPlatformsSchema>;
export type ConfigPluginsSchema = Record<string, ConfigPluginSchema | string>;
// renative.plugin.json
export type ConfigFilePlugin = ConfigPluginSchema & z.infer<typeof zodPluginFragment>;

// Private -----------------------
//
export type ConfigPrivatePlatformAndroid = z.infer<typeof zodPrivatePlatformAndroid>;
// renative.private.json
export type ConfigFilePrivate = z.infer<typeof zodConfigFilePrivate>;

// Project -----------------------
//
export type ConfigRootProjectBaseFragment = z.infer<typeof zodRootProjectBaseFragment> & {
    templateConfig?: ConfigTemplateConfigFragment;
};
export type ConfigProjectPaths = Required<ConfigRootProjectBaseFragment>['paths'];
// renative.json
export type ConfigFileProject = ConfigRootProjectBaseFragment & {
    common?: ConfigCommonSchema;
    platforms?: ConfigPlatformsSchema;
    plugins?: ConfigPluginsSchema;
};

// Template -----------------------
//
type ConfigTemplateBootstrapConfig = z.infer<typeof zodConfigTemplateBootstrapConfig>;
// renative.template.json
export type ConfigFileTemplate = {
    // defaults: ConfigDefault,
    // engines: z.optional(EnginesSchema),
    templateConfig?: ConfigTemplateConfigFragment;
    bootstrapConfig?: ConfigTemplateBootstrapConfig;
};

// Templates -----------------------
//
// renative.templates.json
export type ConfigFileTemplates = z.infer<typeof zodConfigFileTemplates>;

// Workspace -----------------------
//
// renative.workspace.json
export type ConfigFileWorkspace = z.infer<typeof zodConfigFileWorkspace>;

// Workspaces -----------------------
//
// renative.workspaces.json
export type ConfigFileWorkspaces = z.infer<typeof zodConfigFileWorkspaces>;

export type ConfigFileRenative = {
    app: ConfigFileApp;
    project: ConfigFileProject;
    local: ConfigFileLocal;
    overrides: ConfigFileOverrides;
    integration: ConfigFileIntegration;
    engine: ConfigFileEngine;
    plugin: ConfigFilePlugin;
    private: ConfigFilePrivate;
    templateProject: ConfigFileTemplate;
    templateIntegrations: ConfigFileTemplates;
    templateProjects: ConfigFileTemplates;
    templatePlugins: ConfigFileTemplates;
    workspace: ConfigFileWorkspace;
    workspaces: ConfigFileWorkspaces;
};

// Runtime -----------------------
//
// renative.runtime.json
export type ConfigFileRuntime = z.infer<typeof zodConfigFileRuntime>;

// ConfigProp -----------------------
//
export type ConfigProp = ConfigPlatformSchemaFragment;
export type ConfigPropKey = keyof ConfigProp;
export type ConfigPropMerged<T> = ConfigProp & T;
export type ConfigPropKeyMerged<T> = keyof ConfigPropMerged<T>;
export type GetConfigPropVal<T, K extends ConfigPropKeyMerged<T>> = ConfigPropMerged<T>[K] | undefined;
