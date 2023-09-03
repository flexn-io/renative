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

export type RnvFileKey = 'config' | 'configLocal' | 'configPrivate';

export type NpmPackageFile = {
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
};
