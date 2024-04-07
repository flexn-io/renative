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
    zodManifestChildBase,
    zodManifestChildWithChildren,
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
import { zodPrivatePlatformAndroid, zodConfigFilePrivate } from './configFiles/private';
import { zodConfigFileRuntime } from './configFiles/runtime';
import { zodConfigTemplateBootstrapConfig } from './configFiles/template';
import { zodRootProjectBaseFragment } from './configFiles/project';
import { zodConfigFileTemplates } from './configFiles/templates';
import { zodConfigFileWorkspace } from './configFiles/workspace';
import { zodConfigFileWorkspaces } from './configFiles/workspaces';
import type { RnvPlatformKey } from '../types';

// Shared -----------------------
//
export type RnvBuildSchemeFragment = z.infer<typeof zodBuildSchemeFragment>;
export type RnvTemplateConfigFragment = z.infer<typeof zodTemplateConfigFragment>;

// Common -----------------------
//
export type RnvCommonSchemaFragment = z.infer<typeof zodCommonSchemaFragment>;
export type CommonPropKey = keyof RnvCommonSchemaFragment; // We Request keys excluding buildScheme (not RnvCommonSchema)

export type RnvCommonBuildSchemeSchema = Partial<
    RnvCommonSchemaFragment & RnvBuildSchemeFragment & RnvPlatformBaseFragment
>;
export type CommonBuildSchemeKey = keyof RnvCommonBuildSchemeSchema;

export type RnvCommonSchema = Partial<RnvCommonSchemaFragment> & {
    buildSchemes?: Record<string, RnvCommonBuildSchemeSchema>;
};

// Platform -----------------------
//
export type RnvPlatformAndroidFragment = z.infer<typeof zodPlatformAndroidFragment>;
export type RnvPlatformBaseFragment = z.infer<typeof zodPlatformBaseFragment>;
export type RnvPlatformElectronFragment = z.infer<typeof zodPlatformElectronFragment>;
export type RnvPlatformiOSFragment = z.infer<typeof zodPlatformiOSFragment>;
export type RnvPlatformLightningFragment = z.infer<typeof zodPlatformLightningFragment>;
export type RnvPlatformNextJsFragment = z.infer<typeof zodPlatformNextJsFragment>;
export type RnvPlatformReactNativeFragment = z.infer<typeof zodPlatformReactNativeFragment>;
export type AndroidManifestNode = z.infer<typeof zodManifestChildWithChildren>;
export type ConfigAndroidManifestChildType = z.infer<typeof zodManifestChildBase> & {
    children?: ConfigAndroidManifestChildType[];
};
export type AndroidManifest = z.infer<typeof zodAndroidManifest>;
export type RnvTemplateAndroidFragment = z.infer<typeof zodTemplateAndroidFragment>;
export type RnvTemplateXcodeFragment = z.infer<typeof zodTemplateXcodeFragment>;
export type ConfigAppDelegateMethod = ConfigTemplateXcodeAppDelegateMethod[number];
export type RnvPlatformTizenFragment = z.infer<typeof zodPlatformTizenFragment>;
export type RnvPlatformWebFragment = z.infer<typeof zodPlatformWebFragment>;
export type RnvPlatformWebOSFragment = z.infer<typeof zodPlatformWebOSFragment>;
export type RnvPlatformWebpackFragment = z.infer<typeof zodPlatformWebpackFragment>;
export type RnvPlatformWindowsFragment = z.infer<typeof zodPlatformWindowsFragment>;

export type RnvPlatformSchemaFragment = RnvCommonSchemaFragment &
    RnvPlatformBaseFragment &
    RnvPlatformiOSFragment &
    RnvPlatformAndroidFragment &
    RnvPlatformWebFragment &
    RnvPlatformTizenFragment &
    RnvPlatformWindowsFragment &
    RnvPlatformWebOSFragment &
    RnvPlatformLightningFragment &
    RnvPlatformReactNativeFragment &
    RnvPlatformWebpackFragment &
    RnvPlatformElectronFragment &
    RnvPlatformNextJsFragment &
    RnvTemplateAndroidFragment &
    RnvTemplateXcodeFragment;
export type PlatPropKey = keyof RnvPlatformSchemaFragment; // We Request keys excluding buildScheme (not RnvPlatformSchema)

// export type RnvPlatformsSchema = z.infer<typeof zodPlatformsSchema>;
export type RnvPlatformBuildSchemeSchema = RnvCommonSchemaFragment & RnvBuildSchemeFragment & RnvPlatformSchemaFragment;
export type PlatformBuildSchemeKey = keyof RnvPlatformBuildSchemeSchema;

export type RnvPlatformSchema = RnvPlatformSchemaFragment & {
    buildSchemes?: Record<string, RnvPlatformBuildSchemeSchema>;
};
export type RnvPlatformsSchema = Partial<Record<RnvPlatformKey, RnvPlatformSchema>>;

// App -----------------------
//
export type RnvRootAppBaseFragment = z.infer<typeof zodRootAppBaseFragment>;

export type ConfigFileApp = RnvRootAppBaseFragment & {
    common?: RnvCommonSchema;
    platforms?: RnvPlatformsSchema;
    plugins?: RnvPluginsSchema;
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
    RnvRootAppBaseFragment;

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
export type RnvPluginBaseFragment = z.infer<typeof zodPluginBaseFragment>;
export type RnvPluginPlatformAndroidFragment = Partial<z.infer<typeof zodPluginPlatformAndroidFragment>>;
export type RnvPluginPlatformBaseFragment = Partial<z.infer<typeof zodPluginPlatformBaseFragment>>;
export type RnvPluginPlatformiOSFragment = Partial<z.infer<typeof zodPluginPlatformiOSFragment>>;
export type RnvPluginPlatformSchema = RnvPluginPlatformBaseFragment &
    RnvPluginPlatformAndroidFragment &
    RnvPluginPlatformiOSFragment;
export type RnvPluginPlatformsSchema = Record<RnvPlatformKey, RnvPluginPlatformSchema>;
export type RnvPluginSchema = RnvPluginBaseFragment & Partial<RnvPluginPlatformsSchema>;
export type RnvPluginsSchema = Record<string, RnvPluginSchema | string>;
// renative.plugin.json
export type ConfigFilePlugin = RnvPluginSchema & z.infer<typeof zodPluginFragment>;

// Private -----------------------
//
export type ConfigPrivatePlatformAndroid = z.infer<typeof zodPrivatePlatformAndroid>;
// renative.private.json
export type ConfigFilePrivate = z.infer<typeof zodConfigFilePrivate>;

// Project -----------------------
//
export type RnvRootProjectBaseFragment = z.infer<typeof zodRootProjectBaseFragment> & {
    templateConfig?: RnvTemplateConfigFragment;
};
export type ConfigProjectPaths = Required<RnvRootProjectBaseFragment>['paths'];
// renative.json
export type ConfigFileProject = RnvRootProjectBaseFragment & {
    common?: RnvCommonSchema;
    platforms?: RnvPlatformsSchema;
    plugins?: RnvPluginsSchema;
};

// Template -----------------------
//
type ConfigTemplateBootstrapConfig = z.infer<typeof zodConfigTemplateBootstrapConfig>;
// renative.template.json
export type ConfigFileTemplate = {
    // defaults: RnvDefault,
    // engines: z.optional(EnginesSchema),
    templateConfig?: RnvTemplateConfigFragment;
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
export type ConfigProp = RnvPlatformSchemaFragment;
export type ConfigPropKey = keyof ConfigProp;
export type ConfigPropMerged<T> = ConfigProp & T;
export type ConfigPropKeyMerged<T> = keyof ConfigPropMerged<T>;
export type GetConfigPropVal<T, K extends ConfigPropKeyMerged<T>> = ConfigPropMerged<T>[K] | undefined;
