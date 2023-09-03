import { RenativeConfigFile } from '../configManager/types';
import { RnvEngine, RnvEnginePlatform } from '../engineManager/types';
import { OverridesOptions } from '../systemManager/types';
import { RnvPlatform } from '../types';

export interface RnvContext<Payload = any> {
    program: any;
    payload: Payload;
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
    buildPipes: Record<string, Array<(c: RnvContext) => Promise<boolean>>>;
    isBuildHooksReady: boolean;
    supportedPlatforms: Array<string>;
    runtimePropsInjects: OverridesOptions;
    //=======
    _renativePluginCache: any;
    cli: any;
    buildHooks: Record<string, (c: RnvContext) => Promise<void>>;
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
        isTargetTrue: boolean;
        supportedPlatforms: Array<RnvContextPlatform>;
        keepSessionActive: boolean;
        platformBuildsProjectPath: string;
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
        _skipNativeDepResolutions: boolean;
        targetUDID?: string;
        xcodeProj?: {
            id?: string;
            runScheme?: string;
            provisioningStyle?: string;
            deploymentTarget?: string;
            provisionProfileSpecifier?: any;
            provisionProfileSpecifiers?: any;
            excludedArchs?: Array<string>;
            codeSignIdentity?: string;
            codeSignIdentities?: Record<string, string>;
            systemCapabilities?: Record<string, boolean>;
            teamID?: any;
            appId?: any;
        };
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
}

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
