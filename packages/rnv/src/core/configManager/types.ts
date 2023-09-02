import { RnvEngine, RnvEnginePlatform } from '../engineManager/types';
import { OverridesOptions } from '../systemManager/types';
import { RnvPlatform } from '../types';

export interface RnvConfig {
    program: any;
    command: string | null;
    subCommand: string | null;
    buildConfig: Partial<RenativeConfigFile> & {
        _meta?: {
            currentAppConfigId: string;
        };
        _refs?: any;
    };
    assetConfig: object;
    platform: RnvPlatform;
    process: any;
    rnvVersion: string;
    _currentTask?: string;
    systemPropsInjects: OverridesOptions;
    _requiresNpmInstall?: boolean;
    buildPipes: Record<string, Array<(c: RnvConfig) => Promise<boolean>>>;
    isBuildHooksReady: boolean;
    supportedPlatforms: Array<string>;
    runtimePropsInjects: OverridesOptions;
    //=======
    _renativePluginCache: any;
    cli: any;
    buildHooks: Record<string, (c: RnvConfig) => Promise<void>>;
    api: {
        fsExistsSync: any;
        fsReadFileSync: any;
        fsReaddirSync: any;
        fsWriteFileSync: any;
        path: any;
    };
    configPropsInjects: any;
    runtime: {
        platform: string;
        appId: string | null;
        appDir: string;
        enginesByPlatform: Record<string, RnvEngine>;
        enginesByIndex: Array<RnvEngine>;
        enginesById: Record<string, RnvEngine>;
        missingEnginePlugins: Record<string, any>;
        localhost: string;
        scheme: string;
        // scheme: {
        //     bundleAssets: boolean;
        // };
        bundleAssets: boolean;
        activeTemplate: string;
        engine?: RnvEngine;
        target: string;
        supportedPlatforms: Array<RnvConfigPlatform>;
        keepSessionActive: boolean;
        platformBuildsProjectPath: string;
        availablePlatforms: Array<string>;
        _platformBuildsSuffix?: string;
        timestamp: number;
        appConfigDir: string;
        hasAllEnginesRegistered: boolean;
        skipPackageUpdate?: boolean;
        selectedTemplate?: string;
        runtimeExtraProps: string;
        requiresBootstrap: boolean;
        currentTemplate: string;
        requiresForcedTemplateApply: boolean;
        forceBuildHookRebuild: boolean;
        disableReset: boolean;
        skipActiveServerCheck: boolean;
        port: string;
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
    };
    paths: {
        GLOBAL_RNV_CONFIG: string;
        GLOBAL_RNV_DIR: string;
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
        workspace: RnvConfigPathObj & {
            project: RnvConfigPathObj & {
                appConfigBase: Record<string, any>;
                builds: Record<string, any>;
                assets: Record<string, any>;
                platformTemplates: Record<string, any>;
                appConfigsDirs: Array<string>;
                appConfigsDirNames: Array<string>;
            };
            appConfig: RnvConfigPathObj;
        };
        defaultWorkspace: RnvConfigPathObj & {
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
        project: RnvConfigPathObj & {
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
        };
        appConfig: RnvConfigPathObj;
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
    files: {
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
        workspace: RnvConfigFileObj & {
            project: RnvConfigFileObj & {
                appConfigBase: Record<string, any>;
                builds: Record<string, any>;
                assets: Record<string, any>;
                platformTemplates: Record<string, any>;
            };
            appConfig: RnvConfigFileObj;
        };
        defaultWorkspace: RnvConfigFileObj & {
            project: RnvConfigFileObj & {
                appConfigBase: Record<string, any>;
                builds: Record<string, any>;
                assets: Record<string, any>;
                platformTemplates: Record<string, any>;
            };
            appConfig: RnvConfigFileObj;
        };
        project: RnvConfigFileObj & {
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
            //ADDON
            package: any;
        };
        appConfig: RnvConfigFileObj;
    };
}

export type RnvFileKey = 'config' | 'configLocal' | 'configPrivate';

export type DependencyType = 'devDependencies' | 'dependencies' | 'peerDependencies';

export type RnvConfigSchema = Record<string, any>;

export interface RnvConfigPathObj {
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
    // appConfigBase: Record<string, any>;
    // builds: Record<string, any>;
    // assets: Record<string, any>;
    // platformTemplates: Record<string, any>;
    // appConfigsDirs: Array<string>;
    // appConfigsDirNames: Array<string>;
}

export interface RnvConfigFileObj {
    config?: any;
    config_original?: any;
    configLocal?: any;
    configPrivate?: any;
    configs: Array<any>;
    configsLocal: Array<any>;
    configsPrivate: Array<any>;
}

export type RenativeConfigFile = {
    sdks?: Record<string, string>;
    workspaceID: string;
    common: {
        buildSchemes?: Record<string, RenativeConfigBuildScheme>;
        runtime?: Record<string, any>;
        versionCodeFormat?: string;
    };
    defaults: {
        ports?: Record<string, string>;
        supportedPlatforms?: Array<string>;
        portOffset?: number;
    };
    platforms: Record<
        string,
        {
            buildSchemes?: Record<string, RenativeConfigBuildScheme>;
            entryFile?: string;
            runtime?: Record<string, any>;
            appName?: string;
            id?: string;
            certificateProfile?: string;
            engine?: string;
        }
    >;
    templates: Record<
        string,
        {
            version: string;
        }
    >;
    plugins: Record<string, RenativeConfigPlugin | string>;
    currentTemplate?: string;
    projectTemplates?: object;
    platformTemplatesDirs: Record<string, string>;
    paths: {
        appConfigsDirs: Array<string>;
        platformTemplatesDirs: Record<string, string>;
        globalConfigDir?: string;
    };
    integrations: Record<string, string>;
    tasks: Array<any> | Record<string, any>;
    engineTemplates: Record<string, any>;
    engines: Record<string, string>;
    pluginTemplates?: Record<string, any>;
    runtime: Record<string, any>;
    defaultTargets: Record<string, string>;
    templateConfig?: any;
    enableAnalytics?: boolean;
    workspaceAppConfigsDir?: string;
};

export type RenativeConfigPlugin = {
    source?: string;
    'no-npm'?: boolean;
    'no-active'?: boolean;
    version?: string;
    pluginDependencies?: Record<string, string>;
    ios?: any;
    android?: any;
    tvos?: any;
    androidtv?: any;
    web?: any;
    webpack?: RenativeWebpackConfig; //DEPRECATED
    webpackConfig?: RenativeWebpackConfig;
    npm?: Record<string, string>;
    enabled?: boolean;
    deprecated?: boolean;
    plugins?: Record<string, string>;
    props?: Record<string, string | boolean | number>;
};

export type RnvConfigPlatform = {
    platform: string;
    isConnected: boolean;
    engine?: any;
    port?: string;
    isValid?: boolean;
};

export type RenativeWebpackConfig = {
    modulePaths?:
        | Array<
              | {
                    projectPath: string;
                }
              | string
          >
        | boolean;

    moduleAliases?:
        | Record<
              string,
              | string
              | {
                    path: string;
                    projectPath: string;
                }
          >
        | boolean;
};

export type RenativeConfigBuildScheme = Record<string, any>;

export type NpmPackageFile = {
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
};
