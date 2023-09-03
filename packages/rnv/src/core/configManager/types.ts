export type RenativeConfigFile = {
    sdks?: Record<string, string>;
    workspaceID: string;
    common: {
        buildSchemes?: Record<string, RenativeConfigBuildScheme>;
        runtime?: Record<string, any>;
        versionCodeFormat?: string;
        includedFonts: Array<string>;
        includedPermissions: RenativeConfigPermissionsList;
        excludedPermissions: RenativeConfigPermissionsList;
    };
    defaults: {
        ports?: Record<string, number>;
        supportedPlatforms?: Array<string>;
        portOffset?: number;
    };
    platforms: Record<string, RenativeConfigPlatform>;
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
    permissions: Record<string, RenativeConfigPermission>;
};

export type RenativeConfigPermission = Record<string, Record<string, string>>;

export type RenativeConfigPlatform = {
    buildSchemes?: Record<string, RenativeConfigBuildScheme>;
    entryFile?: string;
    runtime?: Record<string, any>;
    appName?: string;
    id?: string;
    certificateProfile?: string;
    engine?: string;
    gradle?: {
        buildTypes: Record<string, string[]>;
    };
    'gradle.properties'?: Record<string, string | boolean>;
    includedPermissions?: RenativeConfigPermissionsList;
    excludedPermissions?: RenativeConfigPermissionsList;
    //iOS
    orientationSupport?: {
        phone: string;
        tab: string;
    };
    urlScheme?: string;
    xcodeproj?: {
        sourceFiles: Array<string>;
        resourceFiles: Array<string>;
        headerFiles: Array<string>;
        buildPhases: Array<{
            shellPath: string;
            shellScript: string;
            inputPaths: string;
        }>;
        frameworks: Array<string>;
        buildSettings: Record<string, any>;
    };
    //Tizen
    package?: string;
};

export type RenativeConfigPermissionsList = Array<string>;

export type RenativeConfigPlugin = {
    source?: string;
    'no-npm'?: boolean;
    'no-active'?: boolean;
    version?: string;
    pluginDependencies?: Record<string, string>;
    ios?: RenativeConfigPluginPlatform;
    android?: RenativeConfigPluginPlatform;
    tvos?: RenativeConfigPluginPlatform;
    androidtv?: RenativeConfigPluginPlatform;
    web?: RenativeConfigPluginPlatform;
    webpack?: RenativeWebpackConfig; //DEPRECATED
    webpackConfig?: RenativeWebpackConfig;
    'engine-rn-next'?: RenativeWebpackConfig; //DEPRECATED?
    npm?: Record<string, string>;
    enabled?: boolean;
    deprecated?: boolean;
    plugins?: Record<string, string>;
    props?: Record<string, string | boolean | number>;
};

export type RenativeConfigPluginPlatform = {
    package?: string;
    path?: string;
    git?: string;
    commit?: string;
    enabled?: boolean;
    version?: string;
    //ANDROID
    projectName?: string;
    skipLinking?: boolean;
    skipImplementation?: boolean;
    implementation?: string;
    afterEvaluate?: string[];
    implementations?: string[];
    'app/build.gradle'?: {
        apply: string[];
        defaultConfig: string[];
    };
    'build.gradle'?: {
        allprojects?: {
            repositories: Record<string, boolean>;
        };
        plugins?: string[];
        buildscript: {
            repositories: Record<string, boolean>;
            dependencies: Record<string, boolean>;
        };
        injectAfterAll: string[];
        dexOptions: Record<string, boolean>;
    };
    BuildGradle?: RenativeConfigPluginPlatform['build.gradle'];
    ResourceStrings?: {
        children: Array<{
            tag: string;
            name: string;
            child_value: string;
        }>;
    };
    //iOS
    appDelegateMethods?: RenativeConfigAppDelegateMethods;
    Podfile?: {
        injectLines: Array<string>;
        post_install: Array<string>;
        sources: Array<string>;
    };
    staticPods?: Array<string>;
    podNames?: Array<string>;
    podDependencies?: Array<string>;
};

export type RenativeConfigAppDelegateMethods = {
    application: {
        didFinishLaunchingWithOptions: Array<RenativeConfigAppDelegateMethod>;
        applicationDidBecomeActive: Array<RenativeConfigAppDelegateMethod>;
        open: Array<RenativeConfigAppDelegateMethod>;
        supportedInterfaceOrientationsFor: Array<RenativeConfigAppDelegateMethod>;
        didReceiveRemoteNotification: Array<RenativeConfigAppDelegateMethod>;
        didFailToRegisterForRemoteNotificationsWithError: Array<RenativeConfigAppDelegateMethod>;
        didReceive: Array<RenativeConfigAppDelegateMethod>;
        didRegister: Array<RenativeConfigAppDelegateMethod>;
        didRegisterForRemoteNotificationsWithDeviceToken: Array<RenativeConfigAppDelegateMethod>;
        continue: Array<RenativeConfigAppDelegateMethod>;
        didConnectCarInterfaceController: Array<RenativeConfigAppDelegateMethod>;
        didDisconnectCarInterfaceController: Array<RenativeConfigAppDelegateMethod>;
    };
    userNotificationCenter: {
        willPresent: Array<RenativeConfigAppDelegateMethod>;
    };
};

export type RenativeConfigAppDelegateMethod =
    | {
          order: number;
          value: string;
          weight: number;
      }
    | string;

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
    nextTranspileModules?: Array<string>;
};

export type RenativeConfigBuildScheme = Record<string, any>;

export type RnvFileKey = 'config' | 'configLocal' | 'configPrivate';

export type NpmPackageFile = {
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
};
