import { ConfigPluginPlatformSchema } from '@rnv/core';

export type Payload = {
    pluginConfigAndroid: {
        gradleWrapperVersion: string;
        injectReactNativeEngine: string;
        injectActivityOnCreate: string;
        appBuildGradleImplementations: string;
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
        gradleBuildToolsVersion: string;
        supportLibVersion: string;
        buildToolsVersion: string;
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
        store?: {
            storeFile?: string;
            // keyAlias: string;
            // storePassword: string;
            // keyPassword: string;
        };
    };
};

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

export type TemplateAndroid = Required<Required<ConfigPluginPlatformSchema>['templateAndroid']>;

// export type AndroidManifestJSONNode = {
//     tag: string;
//     'android:name': string;
//     children?: AndroidManifestJSONNode[];
// };
// export type AndroidManifestJSON = AndroidManifestJSONNode & {
//     package?: string;
// };
export type TargetResourceFile = 'styles_xml' | 'strings_xml' | 'colors_xml';
