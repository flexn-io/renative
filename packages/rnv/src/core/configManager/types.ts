export interface RnvConfig {
    program: any;
    command: string;
    subCommand: string;
    buildConfig: any;
    platform: string;
    process: any;
    rnvVersion: string;
    _currentTask?: string;
    systemPropsInjects: Array<string>;
    //=======
    _renativePluginCache: any;
    cli: any;
    api: {
        fsExistsSync: any;
        fsReadFileSync: any;
        fsReaddirSync: any;
        fsWriteFileSync: any;
        path: any;
    };
    configPropsInjects: any;
    runtime: {
        appId: string;
        enginesByPlatform: any;
        enginesByIndex: Array<{
            config: {
                id: string;
            };
        }>;
        enginesById: Record<string, any>;
        missingEnginePlugins: Record<string, any>;
        localhost: string;
        scheme: string;
        bundleAssets: boolean;
        activeTemplate: string;
        engine: any;
        target: string;
        supportedPlatforms: Array<{
            platform: string;
            isConnected: boolean;
            engine: any;
        }>;
        keepSessionActive: boolean;
        platformBuildsProjectPath: string;
        availablePlatforms: Array<string>;
        _platformBuildsSuffix?: string;
        timestamp: number;
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
            // config: string;
            // configLocal: string;
            // configPrivate: string;
            // appConfigsDir: string;
            // dirs: Array<string>;
            // fontsDirs: Array<string>;
            // pluginDirs: Array<string>;
            // configs: Array<string>;
            // configsLocal: Array<string>;
            // configsPrivate: Array<string>;
        };
        workspace: {
            project: {
                appConfigBase: Record<string, any>;
                builds: Record<string, any>;
                assets: Record<string, any>;
                platformTemplates: Record<string, any>;
                appConfigsDirs: Array<string>;
                appConfigsDirNames: Array<string>;
                //ADDON
                dir?: string;
                config?: string;
                configExists?: boolean;
                configLocal?: string;
                configPrivate?: string;
                appConfigsDir?: string;
            };
            appConfig: {
                configs: Array<string>;
                configsPrivate: Array<string>;
                configsLocal: Array<string>;
            };
            //ADDON
            config: string;
            configLocal?: string;
            configPrivate?: string;
            dir: string;
        };
        defaultWorkspace: {
            //ADDON
            config: string;
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
        project: {
            config: string;
            configExists: boolean;
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
            appConfigsDirs: Array<string>;
            appConfigsDirNames: Array<string>;
            //ADDON
            dir: string;
            nodeModulesDir: string;
            srcDir: string;
            appConfigsDir: string;
            package: string;
            rnCliConfig: string;
            babelConfig: string;
            configLocal: string;
            configPrivate: string;
            platformTemplatesDirs: Record<string, string>;
            // appConfigsDir: string;
            // dirs: Array<string>;
            // fontsDirs: Array<string>;
            // pluginDirs: Array<string>;
            // configs: Array<string>;
            // configsLocal: Array<string>;
            // configsPrivate: Array<string>;
        };
        appConfig: {
            config: string;
            configs: Array<string>;
            configsPrivate: Array<string>;
            configsLocal: Array<string>;
            dir: string;
        };
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
        };
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
        workspace: {
            project: {
                appConfigBase: Record<string, any>;
                builds: Record<string, any>;
                assets: Record<string, any>;
                platformTemplates: Record<string, any>;
                //ADDON
                config: any;
                configLocal: any;
                configPrivate: any;
            };
            appConfig: {
                configs: Array<string>;
                configsPrivate: Array<string>;
                configsLocal: Array<string>;
            };
            //ADDON
            config: any;
            configLocal: any;
            configPrivate: any;
        };
        defaultWorkspace: {
            project: {
                appConfigBase: Record<string, any>;
                builds: Record<string, any>;
                assets: Record<string, any>;
                platformTemplates: Record<string, any>;
            };
            appConfig: {
                configs: Array<string>;
                configsPrivate: Array<string>;
                configsLocal: Array<string>;
            };
            //ADDON
            config: any;
            configLocal: any;
            configPrivate: any;
        };
        project: {
            appConfigBase: Record<string, any>;
            builds: Record<string, any>;
            assets: Record<string, any>;
            platformTemplates: Record<string, any>;
            //ADDON
            config: any;
            configLocal: any;
            configPrivate: any;
            package: any;
        };
        appConfig: {
            config?: any;
            configs: Array<string>;
            configsPrivate: Array<string>;
            configsLocal: Array<string>;
        };
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
    dirs: Array<string>;
    fontsDirs: Array<string>;
    pluginDirs: Array<string>;
    configs: Array<string>;
    configsLocal: Array<string>;
    configsPrivate: Array<string>;
    // appConfigBase: Record<string, any>;
    // builds: Record<string, any>;
    // assets: Record<string, any>;
    // platformTemplates: Record<string, any>;
    // appConfigsDirs: Array<string>;
    // appConfigsDirNames: Array<string>;
}

export interface RnvConfigFileObj {
    config: any;
    configLocal: any;
    configPrivate: any;
    configs: Array<any>;
    configsLocal: Array<any>;
    configsPrivate: Array<any>;
}

export type RenativeConfigFile = {
    common: {
        buildSchemes: Record<string, RenativeConfigBuildScheme>;
    };
    platforms: Record<
        string,
        {
            buildSchemes: Record<string, RenativeConfigBuildScheme>;
        }
    >;
};

export type RenativeConfigBuildScheme = Record<string, any>;
