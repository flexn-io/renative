import type { ConfigProp, ConfigPropKey, PlatformKey } from '../schema/types';
import type { RnvEngine, RnvEnginePlatform } from '../engines/types';
import type { OverridesOptions } from '../system/types';
import type { RnvPlatform } from '../types';
import type {
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
import type { NpmPackageFile } from '../configs/types';
import type { ConfigFileBuildConfig } from '../schema/configFiles/buildConfig';
import type { ParamKeys, ProgramOptionsKey } from '../tasks/constants';
import type { ExecaChildProcess } from 'execa';
import type { RnvPlugin } from '../plugins/types';
import type { RnvIntegration } from '../integrations/types';
import type { DependencyMutation } from '../projects/types';

export type CreateContextOptions = {
    program: RnvContextProgram;
    process: NodeJS.Process;
    cmd?: string;
    subCmd?: string;
    RNV_HOME_DIR?: string;
};

export type RnvContextProgram<ExtraKeys extends string = never> = {
    args?: string[];
    rawArgs?: string[];
    opts: () => ParamKeys<ExtraKeys>;
    option?: (cmd: string, desc: string) => void;
    parse?: (arg: string[]) => void;
    allowUnknownOption: (p: boolean) => void;
    showHelpAfterError: () => void;
    outputHelp: () => void;
    isHelpInvoked?: boolean;
};

export type RnvContext<Payload = any, ExtraOptionKeys extends string = ProgramOptionsKey> = {
    program: RnvContextProgram<ExtraOptionKeys>;
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
    mutations: {
        pendingMutations: Array<DependencyMutation>;
    };
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
    logging: {
        logMessages: Array<string>;
        containsError: boolean;
        containsWarning: boolean;
    };
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
    integrationsByIndex: Array<RnvIntegration>;
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
    scopedConfigTemplates: Record<string, ConfigFileTemplates>;
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
    IS_LINKED: boolean;
    IS_NPX_MODE: boolean;
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
