import type { ConfigProp, ConfigPropKey, PlatformKey } from '../schema/types';
import type { RnvEngine, RnvEnginePlatform } from '../engines/types';
import type { OverridesOptions } from '../system/types';
import type { RnvPlatform } from '../types';
import {
    ConfigFileApp,
    ConfigFileLocal,
    ConfigFilePlugin,
    ConfigFilePrivate,
    ConfigFileProject,
    ConfigFileRuntime,
    ConfigFileTemplates,
    ConfigFileWorkspace,
    ConfigFileWorkspaces,
} from '../schema/configFiles/types';
import { NpmPackageFile } from '../configs/types';
import { ConfigFileBuildConfig } from '../schema/configFiles/buildConfig';
import type { ParamKeys } from '../tasks/constants';
import { ExecaChildProcess } from 'execa';
import { RnvPlugin } from '../plugins/types';

export type CreateContextOptions = {
    program: RnvContextProgram;
    process: NodeJS.Process;
    cmd?: string;
    subCmd?: string;
    RNV_HOME_DIR?: string;
};

export type RnvContextProgram = ParamKeys & {
    args?: string[];
    rawArgs?: string[];
    option?: (cmd: string, desc: string) => void;
    parse?: (arg: string[]) => void;
};

export type RnvContext<Payload = any> = {
    program: RnvContextProgram;
    /**
     * Extra payload object used by 3rd party (ie @rnv/sdk-apple) to decorate context with extra typed information
     */
    payload: Payload;
    /**
     * first command value from cli (ie "rnv run -p android") returns "run"
     */
    command: string | null;
    /**
     * second command value from cli (ie "rnv hooks list") returns "list"
     */
    subCommand: string | null;
    /**
     * complete object containing ALL renative.*.json files collected and merged during execution
     */
    buildConfig: RnvContextBuildConfig;
    assetConfig: object;
    platform: RnvPlatform;
    process: NodeJS.Process;
    runningProcesses: ExecaChildProcess[];
    rnvVersion: string;
    isSystemWin: boolean;
    _currentTask?: string;
    systemPropsInjects: OverridesOptions;
    _requiresNpmInstall?: boolean;
    buildPipes: Record<string, Array<(c: RnvContext) => Promise<boolean>>>;
    isBuildHooksReady: boolean;
    supportedPlatforms: Array<string>;
    runtimePropsInjects: OverridesOptions;
    _renativePluginCache: Record<string, ConfigFilePlugin>;
    cli: Record<string, string | undefined>;
    buildHooks: Record<string, (c: RnvContext) => Promise<void>>;
    configPropsInjects: OverridesOptions;
    injectableConfigProps: Record<string, ConfigProp[ConfigPropKey]>;
    runtime: RnvContextRuntime;
    paths: RnvContextPaths;
    files: RnvContextFiles;
    logMessages: Array<string>;
    timeStart: Date;
    timeEnd: Date;
    isDefault: boolean;
};

export type RnvContextBuildConfig = Partial<ConfigFileBuildConfig> & {
    _meta?: {
        currentAppConfigId: string;
    };
    //TODO: validate if this is really needed
    _refs?: Record<string, string>;
};

export type RnvContextRuntime = {
    enginesByPlatform: Record<string, RnvEngine>;
    enginesByIndex: Array<RnvEngine>;
    enginesById: Record<string, RnvEngine>;
    missingEnginePlugins: Record<string, string>;
    supportedPlatforms: Array<RnvContextPlatform>;
    runtimeExtraProps: Record<string, string>;
    availablePlatforms: Array<PlatformKey>;
    platform: RnvPlatform;
    isTargetTrue: boolean;
    bundleAssets: boolean;
    keepSessionActive: boolean;
    hasAllEnginesRegistered: boolean;
    requiresBootstrap: boolean;
    forceBuildHookRebuild: boolean;
    disableReset: boolean;
    skipActiveServerCheck: boolean;
    requiresForcedTemplateApply: boolean;
    isWSConfirmed: boolean;
    _skipNativeDepResolutions: boolean;
    versionCheckCompleted: boolean;
    _skipPluginScopeWarnings: boolean;
    skipBuildHooks: boolean;
    hosted: boolean;
    port: number;
    //OPTIONALS
    engine?: RnvEngine;
    currentPlatform?: RnvEnginePlatform;
    currentEngine?: RnvEngine;
    skipPackageUpdate?: boolean;
    selectedTemplate?: string;
    _platformBuildsSuffix?: string;
    platformBuildsProjectPath?: string;
    targetUDID?: string;
    forceBundleAssets?: boolean;
    webpackTarget?: string;
    shouldOpenBrowser?: boolean;
    appId?: string;
    rnvVersionRunner?: string;
    rnvVersionProject?: string;
    localhost?: string;
    scheme?: string;
    appDir?: string;
    activeTemplate?: string;
    timestamp?: number;
    appConfigDir?: string;
    currentTemplate?: string;
    task?: string;
    selectedWorkspace?: string;
    target?: string;
    plugins: Record<string, RnvPlugin>;
    pluginVersions: Record<string, string>;
};

export type RuntimePropKey = keyof RnvContextRuntime;

export type RnvContextFiles = {
    dotRnv: {
        configWorkspaces?: ConfigFileWorkspaces;
        config: ConfigFileWorkspace;
    };
    rnv: {
        package: NpmPackageFile;
    };
    rnvCore: {
        package: NpmPackageFile;
    };
    rnvConfigTemplates: {
        package?: NpmPackageFile;
        config?: ConfigFileTemplates;
    };
    scopedPluginTemplates: Record<string, ConfigFileTemplates['pluginTemplates']>;
    workspace: RnvContextFileObj<ConfigFileWorkspace> & {
        project: RnvContextFileObj<ConfigFileProject>;
        appConfig: RnvContextFileObj<ConfigFileApp>;
    };
    // defaultWorkspace: RnvContextFileObj<ConfigFileWorkspace> & {
    //     project: RnvContextFileObj<ConfigFileProject>;
    //     appConfig: RnvContextFileObj<ConfigFileApp>;
    // };
    project: RnvContextFileObj<ConfigFileProject> & {
        builds: Record<string, ConfigFileBuildConfig>;
        assets: {
            config?: ConfigFileRuntime;
        };
        package: NpmPackageFile;
    };
    appConfig: RnvContextFileObj<ConfigFileApp>;
};

export type RnvContextFileObj<T> = {
    config?: T;
    config_original?: T;
    configLocal?: ConfigFileLocal;
    configPrivate?: ConfigFilePrivate;
    configs: Array<T>;
    configsLocal: Array<ConfigFileLocal>;
    configsPrivate: Array<ConfigFilePrivate>;
};

export type RnvContextPaths = {
    // GLOBAL_RNV_CONFIG: string;
    // GLOBAL_RNV_DIR: string;
    // RNV_HOME_DIR: string;
    IS_LINKED: boolean;
    IS_NPX_MODE: boolean;
    // CURRENT_DIR: string;
    // RNV_CORE_HOME_DIR: string;
    // RNV_NODE_MODULES_DIR: string;
    //=======
    user: {
        homeDir: string;
        currentDir: string;
    };
    dotRnv: {
        dir: string;
        config: string;
        configWorkspaces: string;
    };
    rnvConfigTemplates: {
        dir: string;
        package: string;
        config: string;
        pluginTemplatesDir: string;
    };
    scopedConfigTemplates: {
        pluginTemplatesDirs: Record<string, string>;
        configs: Record<string, string>;
    };
    rnvCore: {
        dir: string;
        package: string;
        templateFilesDir: string;
    };
    rnv: {
        dir: string;
        package: string;
    };
    workspace: RnvContextPathObj & {
        project: RnvContextPathObj & {
            appConfigBase: {
                dir: string;
            };
            builds: string;
            assets: string;
        };
        appConfig: RnvContextPathObj;
    };
    // defaultWorkspace: RnvContextPathObj & {
    //     project: {
    //         appConfigBase: {
    //             dir: string;
    //         };
    //         builds: {
    //             dir: string;
    //         };
    //         assets: {
    //             dir: string;
    //         };
    //     };
    //     appConfig: {
    //         configs: Array<string>;
    //         configsPrivate: Array<string>;
    //         configsLocal: Array<string>;
    //     };
    // };
    project: RnvContextPathObj & {
        appConfigBase: {
            dir: string;
            pluginsDir: string;
            fontsDir: string;
            fontsDirs: Array<string>;
        };
        builds: {
            dir: string;
            config: string;
        };
        assets: {
            dir: string;
            config: string;
            runtimeDir: string;
        };
        appConfigsDirs: Array<string>;
        appConfigsDirNames: Array<string>;
        dir: string;
        dotRnvDir: string;
        nodeModulesDir: string;
        srcDir?: string;
        package?: string;
        babelConfig?: string;
        platformTemplatesDirs: Record<string, string>;
        fontSourceDirs?: Array<string>;
    };
    appConfig: RnvContextPathObj;
    buildHooks: {
        dir: string;
        dist: {
            dir: string;
            index: string;
        };
        src: {
            dir: string;
            index: string;
            indexTs: string;
        };
        tsconfig: string;
    };
    template: {
        appConfigBase: {
            dir: string;
        };
        builds: {
            dir: string;
        };
        assets: {
            dir: string;
        };
        appConfigsDir: string;
        configTemplate: string;
        config: string;
        dir: string;
    };
    appConfigBase: string; //REMOVE?
};

export type RnvContextPathObj = {
    dir: string;
    config: string;
    configLocal: string;
    configPrivate: string;
    appConfigsDir: string;
    dirs: Array<string>;
    configs: Array<string>;
    configsLocal: Array<string>;
    configsPrivate: Array<string>;
    configExists?: boolean;
    configLocalExists?: boolean;
    configPrivateExists?: boolean;
    pluginDirs: Array<string>;
    fontsDir: string;
    fontsDirs: Array<string>;
};

export type RnvContextPlatform = {
    platform: PlatformKey;
    isConnected: boolean;
    engine?: RnvEngine;
    port?: number;
    isValid?: boolean;
};

export type RnvContextFileKey = 'config' | 'configLocal' | 'configPrivate';
