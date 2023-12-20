import { RenativeConfigPluginPlatform, RnvContext } from '@rnv/core';

export type Payload = {
    currentDevices: AndroidDevice[];
    pluginConfigAndroid: {
        gradleWrapperVersion: string;
        injectReactNativeEngine: string;
        injectActivityOnCreate: string;
        appBuildGradleImplementations: string;
        injectHermes: string;
        pluginApplicationImports: string;
        reactNativeHostMethods: string;
        packagingOptions: string;
        defaultConfig: string;
        appBuildGradleSigningConfigs: string;
        appBuildGradleAfterEvaluate: string;
        buildTypes: string;
        multiAPKs: string;
        minSdkVersion: number;
        ndkVersion: string;
        targetSdkVersion: number;
        compileSdkVersion: number;
        compileOptions: string;
        localProperties: string;
        kotlinVersion: string;
        pluginIncludes: string;
        pluginPaths: string;
        buildGradleBuildScriptDexOptions: string;
        gradleBuildToolsVersion: string;
        supportLibVersion: string;
        buildToolsVersion: string;
        buildGradleAllProjectsRepositories: string;
        buildGradleBuildScriptRepositories: string;
        googleServicesVersion: string;
        pluginActivityImports: string;
        buildGradlePlugins: string;
        buildGradleAfterAll: string;
        pluginActivityCreateMethods: string;
        buildGradleBuildScriptDependencies: string;
        applyPlugin: string;
        splits: string;
        pluginActivityMethods: string;
        pluginApplicationDebugServer: string;
        pluginPackages: string;
        pluginApplicationMethods: string;
        pluginActivityResultMethods: string;
        pluginApplicationCreateMethods: string;
        pluginSplashActivityImports: string;
        resourceStrings: Required<TemplateAndroid['strings_xml']>['children'];
        store?: {
            storeFile?: string;
            // keyAlias: string;
            // storePassword: string;
            // keyPassword: string;
        };
    };
};

export type Context = RnvContext<Payload>;

export type AndroidDevice = {
    udid: string;
    model?: string;
    product?: string;
    isPhone?: boolean;
    isTablet?: boolean;
    isWear?: boolean;
    isTV?: boolean;
    isMobile?: boolean;
    screenProps?: {
        width: number;
        height: number;
        density: number;
    };
    arch?: string;
    avdConfig?: Record<string, string>;
    // {
    //     'hw.lcd.density': string;
    //     'hw.lcd.width': string;
    //     'hw.lcd.height': string;
    //     'abi.type': string;
    //     'image.sysdir.1': string;
    //     'tag.id': string;
    //     'tag.display': string;
    //     'hw.device.name': string;
    //     'skin.name': string;
    // };
    isNotEligibleAndroid?: boolean;
    name: string;
    isDevice?: boolean;
    isActive: boolean;
    isRunning?: boolean;
};

export type TemplateAndroid = Required<Required<RenativeConfigPluginPlatform>['templateAndroid']>;
