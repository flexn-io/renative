import {
    OverridesOptions,
    PlatformKey,
    RenativeConfigPluginPlatform,
    RnvContext,
    addSystemInjects,
    getAppFolder,
    getAppId,
    getBuildFilePath,
    getConfigProp,
    getEntryFile,
    getGetJsBundleFile,
    getIP,
    writeCleanFile,
} from '@rnv/core';
import { mkdirSync } from 'fs';
import path from 'path';
import { Context } from './types';

const JS_BUNDLE_DEFAULTS: Partial<Record<PlatformKey, string>> = {
    // Android Wear does not support webview required for connecting to packager. this is hack to prevent RN connectiing to running bundler
    androidwear: '"assets://index.androidwear.bundle"',
};

export const parseFlipperSync = (c: Context, scheme: 'debug' | 'release') => {
    const appFolder = getAppFolder(c);
    const { platform } = c;

    const appId = getAppId(c, c.platform);
    // console.log('appId', appId);
    const javaPackageArray = appId?.split('.') || [];

    const javaPackagePath = `app/src/${scheme}/java/${javaPackageArray.join('/')}`;
    mkdirSync(path.join(appFolder, javaPackagePath), { recursive: true });

    const templatePath = `app/src/${scheme}/java/rnv_template/ReactNativeFlipper.java.tpl`;
    const applicationPath = `${javaPackagePath}/ReactNativeFlipper.java`;

    const injects: OverridesOptions = [{ pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) }];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, templatePath),
        path.join(appFolder, applicationPath),
        injects,
        undefined,
        c
    );
};

export const parseMainApplicationSync = (c: Context) => {
    const appFolder = getAppFolder(c);
    const { platform } = c;

    if (!platform) return;

    const appId = getAppId(c, c.platform);
    // console.log('appId', appId);
    const javaPackageArray = appId?.split('.') || [];

    const javaPackagePath = `app/src/main/java/${javaPackageArray.join('/')}`;
    mkdirSync(path.join(appFolder, javaPackagePath), { recursive: true });

    const templatePath = 'app/src/main/java/rnv_template/MainApplication.java.tpl';
    const applicationPath = `${javaPackagePath}/MainApplication.java`;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets');
    const bundleDefault = JS_BUNDLE_DEFAULTS[platform];
    const bundleFile: string =
        getGetJsBundleFile(c, platform) || bundleAssets
            ? `"assets://${getEntryFile(c, platform)}.bundle"`
            : bundleDefault || '"super.getJSBundleFile()"';
    const bundlerIp = getIP() || '10.0.2.2';
    if (!bundleAssets) {
        c.payload.pluginConfigAndroid.pluginApplicationDebugServer +=
            '    var mPreferences: SharedPreferences = PreferenceManager.getDefaultSharedPreferences(this)\n';
        c.payload.pluginConfigAndroid.pluginApplicationDebugServer += `    mPreferences?.edit()?.putString("debug_http_host", "${bundlerIp}:${c.runtime.port}")?.apply()\n`;
    }

    const injects: OverridesOptions = [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) || '' },
        { pattern: '{{GET_JS_BUNDLE_FILE}}', override: bundleFile },
        {
            pattern: '{{PLUGIN_IMPORTS}}',
            override: c.payload.pluginConfigAndroid.pluginApplicationImports,
        },
        {
            pattern: '{{PLUGIN_PACKAGES}}',
            override: c.payload.pluginConfigAndroid.pluginPackages,
        },
        {
            pattern: '{{PLUGIN_METHODS}}',
            override: c.payload.pluginConfigAndroid.pluginApplicationMethods,
        },
        {
            pattern: '{{RN_HOST_METHODS}}',
            override: c.payload.pluginConfigAndroid.reactNativeHostMethods,
        },
        {
            pattern: '{{PLUGIN_ON_CREATE}}',
            override: c.payload.pluginConfigAndroid.pluginApplicationCreateMethods,
        },
        {
            pattern: '{{PLUGIN_DEBUG_SERVER}}',
            override: c.payload.pluginConfigAndroid.pluginApplicationDebugServer,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, templatePath),
        path.join(appFolder, applicationPath),
        injects,
        undefined,
        c
    );
};

export const parseMainActivitySync = (c: RnvContext) => {
    const appFolder = getAppFolder(c);
    const { platform } = c;

    const appId = getAppId(c, c.platform);
    // console.log('appId', appId);
    const javaPackageArray = appId?.split('.') || [];

    const javaPackagePath = `app/src/main/java/${javaPackageArray.join('/')}`;
    mkdirSync(path.join(appFolder, javaPackagePath), { recursive: true });

    const templatePath = 'app/src/main/java/rnv_template/MainActivity.java.tpl';
    const activityPath = `${javaPackagePath}/MainActivity.java`;

    const templateAndroid = getConfigProp(c, platform, 'templateAndroid', {});

    const mainActivity = templateAndroid?.MainActivity_java;

    c.payload.pluginConfigAndroid.injectActivityOnCreate =
        mainActivity?.onCreate || 'super.onCreate(savedInstanceState)';
    console.log('pluginConfigAndroid', c.payload.pluginConfigAndroid);
    const injects = [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        {
            pattern: '{{PLUGIN_ACTIVITY_IMPORTS}}',
            override: c.payload.pluginConfigAndroid.pluginActivityImports,
        },
        {
            pattern: '{{PLUGIN_ACTIVITY_METHODS}}',
            override: c.payload.pluginConfigAndroid.pluginActivityMethods,
        },
        {
            pattern: '{{PLUGIN_ON_CREATE}}',
            override: c.payload.pluginConfigAndroid.pluginActivityCreateMethods,
        },
        {
            pattern: '{{INJECT_ON_CREATE}}',
            override: c.payload.pluginConfigAndroid.injectActivityOnCreate,
        },
        {
            pattern: '{{PLUGIN_ON_ACTIVITY_RESULT}}',
            override: c.payload.pluginConfigAndroid.pluginActivityResultMethods,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, templatePath),
        path.join(appFolder, activityPath),
        injects,
        undefined,
        c
    );
};

export const parseSplashActivitySync = (c: Context) => {
    const appFolder = getAppFolder(c);
    const { platform } = c;
    const appId = getAppId(c, c.platform);
    const javaPackageArray = appId?.split('.') || [];

    const splashTemplatePath = 'app/src/main/java/rnv_template/SplashActivity.java.tpl';
    const splashPath = `app/src/main/java/${javaPackageArray.join('/')}/SplashActivity.java`;

    // TODO This is temporary ANDROIDX support. whole kotlin parser will be refactored in the near future
    const enableAndroidX = getConfigProp(c, platform, 'enableAndroidX', true);
    if (enableAndroidX === true) {
        c.payload.pluginConfigAndroid.pluginSplashActivityImports +=
            'import androidx.appcompat.app.AppCompatActivity;\n';
    } else {
        c.payload.pluginConfigAndroid.pluginSplashActivityImports +=
            'import android.support.v7.app.AppCompatActivity\n';
    }

    const injects = [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        {
            pattern: '{{PLUGIN_SPLASH_ACTIVITY_IMPORTS}}',
            override: c.payload.pluginConfigAndroid.pluginSplashActivityImports,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, splashTemplatePath),
        path.join(appFolder, splashPath),
        injects,
        undefined,
        c
    );
};

export const injectPluginKotlinSync = (
    c: RnvContext,
    plugin: RenativeConfigPluginPlatform,
    key: string,
    pkg: string | undefined
) => {
    const templ = plugin.templateAndroid;
    const mainActivity = templ?.MainActivity_java;
    if (mainActivity?.imports) {
        mainActivity.imports.forEach((activityImport) => {
            // Avoid duplicate imports
            if (c.payload.pluginConfigAndroid.pluginActivityImports.indexOf(activityImport) === -1) {
                c.payload.pluginConfigAndroid.pluginActivityImports += `import ${activityImport};\n`;
            }
        });
    }

    if (mainActivity?.methods) {
        c.payload.pluginConfigAndroid.pluginActivityMethods += '\n';
        c.payload.pluginConfigAndroid.pluginActivityMethods += `${mainActivity.methods.join('\n    ')}`;
    }

    if (mainActivity) {
        if (mainActivity.createMethods) {
            c.payload.pluginConfigAndroid.pluginActivityCreateMethods += '\n';
            c.payload.pluginConfigAndroid.pluginActivityCreateMethods += `${mainActivity.createMethods.join('\n    ')}`;
        }

        if (mainActivity.resultMethods) {
            c.payload.pluginConfigAndroid.pluginActivityResultMethods += '\n';
            c.payload.pluginConfigAndroid.pluginActivityResultMethods += `${mainActivity.resultMethods.join('\n    ')}`;
        }
    }

    _injectPackage(c, plugin, pkg);

    const mainApplication = templ?.MainApplication_java;

    if (mainApplication?.packages) {
        mainApplication.packages.forEach((v) => {
            _injectPackage(c, plugin, v);
        });
    }

    if (mainApplication?.createMethods) {
        c.payload.pluginConfigAndroid.pluginApplicationCreateMethods += '\n';
        c.payload.pluginConfigAndroid.pluginApplicationCreateMethods += `${mainApplication.createMethods.join(
            '\n    '
        )}`;
    }

    if (mainApplication?.imports) {
        mainApplication.imports.forEach((v) => {
            c.payload.pluginConfigAndroid.pluginApplicationImports += `import ${v}\n`;
        });
    }

    if (mainApplication?.methods) {
        c.payload.pluginConfigAndroid.pluginApplicationMethods += '\n';
        c.payload.pluginConfigAndroid.pluginApplicationMethods += `${mainApplication.methods.join('\n    ')}`;
    }
};

const _injectPackage = (c: RnvContext, plugin: RenativeConfigPluginPlatform, pkg: string | undefined) => {
    if (pkg) {
        c.payload.pluginConfigAndroid.pluginApplicationImports += `import ${pkg}\n`;
    }
    let packageParams = '';
    const mainApplication = plugin.templateAndroid?.MainApplication_java;
    if (mainApplication?.packageParams) {
        packageParams = mainApplication.packageParams.join(',');
    }

    if (pkg) {
        const className = _extractClassName(pkg);
        if (className) {
            c.payload.pluginConfigAndroid.pluginPackages += `${className}(${packageParams}),\n`;
        }
    }
};

const _extractClassName = (pkg: string) => (pkg ? pkg.split('.').pop() : null);
