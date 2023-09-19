import { RenativeConfigFile } from '../configs/types';
import { RnvEngine, RnvEnginePlatform } from '../engines/types';
import { OverridesOptions } from '../system/types';
import { RnvPlatform } from '../types';

export interface RnvContext<Payload = any> {
    program: any;
    payload: Payload;
    command: string | null;
    subCommand: string | null;
    buildConfig: RnvContextBuildConfig;
    assetConfig: object;
    platform: RnvPlatform;
    process: any;
    rnvVersion: string;
    _currentTask?: string;
    systemPropsInjects: OverridesOptions;
    _requiresNpmInstall?: boolean;
    buildPipes: Record<string, Array<(c: RnvContext) => Promise<boolean>>>;
    isBuildHooksReady: boolean;
    supportedPlatforms: Array<string>;
    runtimePropsInjects: OverridesOptions;
    _renativePluginCache: any;
    cli: any;
    buildHooks: Record<string, (c: RnvContext) => Promise<void>>;
    configPropsInjects: any;
    runtime: RnvContextRuntime;
    paths: RnvContextPaths;
    files: RnvContextFiles;
    logMessages: Array<string>;
    timeStart: Date;
    timeEnd: Date;
}

export type RnvContextBuildConfig = Partial<RenativeConfigFile> & {
    _meta?: {
        currentAppConfigId: string;
    };
    _refs?: any;
};

export type RnvContextRuntime = {
    platform: string;
    appId: string | null;
    appDir: string;
    enginesByPlatform: Record<string, RnvEngine>;
    enginesByIndex: Array<RnvEngine>;
    enginesById: Record<string, RnvEngine>;
    missingEnginePlugins: Record<string, any>;
    localhost: string;
    scheme: string;
    bundleAssets: boolean;
    activeTemplate: string;
    engine?: RnvEngine;
    target: string;
    isTargetTrue: boolean;
    supportedPlatforms: Array<RnvContextPlatform>;
    keepSessionActive: boolean;
    platformBuildsProjectPath?: string;
    availablePlatforms: Array<string>;
    _platformBuildsSuffix?: string;
    timestamp: number;
    appConfigDir: string;
    hasAllEnginesRegistered: boolean;
    skipPackageUpdate?: boolean;
    selectedTemplate?: string;
    runtimeExtraProps: any;
    requiresBootstrap: boolean;
    currentTemplate: string;
    requiresForcedTemplateApply: boolean;
    forceBuildHookRebuild: boolean;
    disableReset: boolean;
    skipActiveServerCheck: boolean;
    port: number;
    rnvVersionRunner: string;
    rnvVersionProject: string;
    versionCheckCompleted: boolean;
    currentPlatform: RnvEnginePlatform;
    _skipPluginScopeWarnings: boolean;
    skipBuildHooks: boolean;
    isFirstRunAfterNew: boolean;
    currentEngine: RnvEngine;
    hosted: boolean;
    task: string;
    selectedWorkspace: string;
    isWSConfirmed: boolean;
    _skipNativeDepResolutions: boolean;
    targetUDID?: string;
    forceBundleAssets?: boolean;
    webpackTarget?: string;
    shouldOpenBrowser?: boolean;
};

export type RnvContextFiles = {
    rnv: {
        pluginTemplates: Record<string, any>;
        platformTemplates: Record<string, any>;
        projectTemplates: Record<string, any>;
        platformTemplate: Record<string, any>;
        plugins: Record<string, any>;
        engines: Record<string, any>;
        projectTemplate: Record<string, any>;
        //ADDON
        configWorkspaces: any;
        package: any;
    };
    workspace: RnvContextFileObj & {
        project: RnvContextFileObj & {
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
        };
        appConfig: RnvContextFileObj;
    };
    defaultWorkspace: RnvContextFileObj & {
        project: RnvContextFileObj & {
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
        };
        appConfig: RnvContextFileObj;
    };
    project: RnvContextFileObj & {
        appConfigBase: Record<string, any>;
        builds: Record<string, any>;
        assets: Record<string, any>;
        platformTemplates: Record<string, any>;
        //ADDON
        package: any;
    };
    appConfig: RnvContextFileObj;
};

export type RnvContextPaths = {
    GLOBAL_RNV_CONFIG: string;
    GLOBAL_RNV_DIR: string;
    RNV_HOME_DIR: string;
    IS_LINKED: boolean;
    CURRENT_DIR: string;
    RNV_NODE_MODULES_DIR: string;
    //=======
    rnv: {
        configWorkspaces: any;
        pluginTemplates: {
            configs: Record<string, any>;
            //ADDON
            dir?: string;
            config?: string;
            dirs: Record<string, string>;
        };
        platformTemplates: Record<string, any>;
        projectTemplates: Record<string, any>;
        platformTemplate: Record<string, any>;
        plugins: Record<string, any>;
        engines: Record<string, any>;
        projectTemplate: Record<string, any>;
        //ADDON
        dir: string;
        package: string;
    };
    workspace: RnvContextPathObj & {
        project: RnvContextPathObj & {
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
            appConfigsDirs: Array<string>;
            appConfigsDirNames: Array<string>;
        };
        appConfig: RnvContextPathObj;
    };
    defaultWorkspace: RnvContextPathObj & {
        project: {
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
            appConfigsDirs: Array<string>;
            appConfigsDirNames: Array<string>;
        };
        appConfig: {
            configs: Array<string>;
            configsPrivate: Array<string>;
            configsLocal: Array<string>;
        };
    };
    project: RnvContextPathObj & {
        appConfigBase: Record<string, any>;
        builds: Record<string, any>;
        assets: Record<string, any>;
        platformTemplates: Record<string, any>;
        appConfigsDirs: Array<string>;
        appConfigsDirNames: Array<string>;
        //ADDON
        dir: string;
        nodeModulesDir: string;
        srcDir?: string;
        package?: string;
        rnCliConfig?: string;
        babelConfig?: string;
        platformTemplatesDirs: Record<string, string>;
        fontSourceDirs?: Array<string>;
    };
    appConfig: RnvContextPathObj;
    // EXTRA
    buildHooks: {
        dist: Record<string, any>;
        //ADDON
        dir: string;
        index: string;
    };
    home: Record<string, any>;
    template: {
        appConfigBase: Record<string, any>;
        builds: Record<string, any>;
        assets: Record<string, any>;
        platformTemplates: Record<string, any>;
        appConfigsDir: string;
        configTemplate: string;
        config: string;
        dir: string;
    };
    appConfigBase: string;
};

export interface RnvContextPathObj {
    dir: string;
    config: string;
    configLocal: string;
    configPrivate: string;
    appConfigsDir: string;
    fontsDir: string;
    dirs: Array<string>;
    fontsDirs: Array<string>;
    pluginDirs: Array<string>;
    configs: Array<string>;
    configsLocal: Array<string>;
    configsPrivate: Array<string>;
    configExists?: boolean;
}

export interface RnvContextFileObj {
    config?: any;
    config_original?: any;
    configLocal?: any;
    configPrivate?: any;
    configs: Array<any>;
    configsLocal: Array<any>;
    configsPrivate: Array<any>;
}

export interface RnvContextPlatform {
    platform: string;
    isConnected: boolean;
    engine?: any;
    port?: number;
    isValid?: boolean;
}
