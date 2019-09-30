import path from 'path';
import os from 'os';
import fs from 'fs';
import net from 'net';
import chalk from 'chalk';
import shell from 'shelljs';
import child_process from 'child_process';
import inquirer from 'inquirer';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
    getAppVersion,
    getAppTitle,
    getAppVersionCode,
    writeCleanFile,
    getAppId,
    getAppTemplateFolder,
    getBuildFilePath,
    getEntryFile,
    getGetJsBundleFile,
    logWarning,
    logDebug,
    getConfigProp,
    logInfo,
    logSuccess,
    getBuildsFolder,
} from '../../common';
import { copyBuildsFolder } from '../../projectTools/projectParser';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync } from '../../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

export const parseMainApplicationSync = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const applicationPath = 'app/src/main/java/rnv/MainApplication.kt';
    const bundleFile = getGetJsBundleFile(c, platform) || JS_BUNDLE_DEFAULTS[platform];
    writeCleanFile(getBuildFilePath(c, platform, applicationPath), path.join(appFolder, applicationPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) },
        { pattern: '{{GET_JS_BUNDLE_FILE}}', override: bundleFile },
        { pattern: '{{PLUGIN_IMPORTS}}', override: c.pluginConfigAndroid.pluginImports },
        { pattern: '{{PLUGIN_PACKAGES}}', override: c.pluginConfigAndroid.pluginPackages },
        { pattern: '{{PLUGIN_METHODS}}', override: c.pluginConfigAndroid.pluginApplicationMethods },
        { pattern: '{{PLUGIN_ON_CREATE}}', override: c.pluginConfigAndroid.pluginApplicationCreateMethods },
    ]);
};

const JS_BUNDLE_DEFAULTS = {
    android: 'super.getJSBundleFile()',
    androidtv: 'super.getJSBundleFile()',
    // CRAPPY BUT Android Wear does not support webview required for connecting to packager
    androidwear: '"assets://index.androidwear.bundle"',
};


export const parseMainActivitySync = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const activityPath = 'app/src/main/java/rnv/MainActivity.kt';
    writeCleanFile(getBuildFilePath(c, platform, activityPath), path.join(appFolder, activityPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{PLUGIN_ACTIVITY_IMPORTS}}', override: c.pluginConfigAndroid.pluginActivityImports },
        { pattern: '{{PLUGIN_ACTIVITY_METHODS}}', override: c.pluginConfigAndroid.pluginActivityMethods },
        { pattern: '{{PLUGIN_ON_CREATE}}', override: c.pluginConfigAndroid.pluginActivityCreateMethods },
        { pattern: '{{PLUGIN_ON_ACTIVITY_RESULT}}', override: c.pluginConfigAndroid.pluginActivityResultMethods },
    ]);
};

export const parseSplashActivitySync = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const splashPath = 'app/src/main/java/rnv/SplashActivity.kt';


    // TODO This is temporary ANDROIDX support. whole kotlin parser will be refactored in the near future
    const enableAndroidX = getConfigProp(c, platform, 'enableAndroidX');
    if (enableAndroidX === true) {
        c.pluginConfigAndroid.pluginSplashActivityImports += 'import androidx.appcompat.app.AppCompatActivity\n';
    } else {
        c.pluginConfigAndroid.pluginSplashActivityImports += 'import android.support.v7.app.AppCompatActivity\n';
    }

    writeCleanFile(getBuildFilePath(c, platform, splashPath), path.join(appFolder, splashPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{PLUGIN_SPLASH_ACTIVITY_IMPORTS}}', override: c.pluginConfigAndroid.pluginSplashActivityImports }
    ]);
};

export const injectPluginKotlinSync = (c, plugin, key, pkg) => {
    const pathFixed = plugin.path ? `${plugin.path}` : `node_modules/${key}/android`;
    const modulePath = `../../${pathFixed}`;

    if (plugin.activityImports instanceof Array) {
        plugin.activityImports.forEach((activityImport) => {
            // Avoid duplicate imports
            if (c.pluginConfigAndroid.pluginActivityImports.indexOf(activityImport) === -1) {
                c.pluginConfigAndroid.pluginActivityImports += `import ${activityImport}\n`;
            }
        });
    }

    if (plugin.activityMethods instanceof Array) {
        c.pluginConfigAndroid.pluginActivityMethods += '\n';
        c.pluginConfigAndroid.pluginActivityMethods += `${plugin.activityMethods.join('\n    ')}`;
    }

    const { mainActivity } = plugin;
    if (mainActivity) {
        if (mainActivity.createMethods instanceof Array) {
            c.pluginConfigAndroid.pluginActivityCreateMethods += '\n';
            c.pluginConfigAndroid.pluginActivityCreateMethods += `${mainActivity.createMethods.join('\n    ')}`;
        }

        if (mainActivity.resultMethods instanceof Array) {
            c.pluginConfigAndroid.pluginActivityResultMethods += '\n';
            c.pluginConfigAndroid.pluginActivityResultMethods += `${mainActivity.resultMethods.join('\n    ')}`;
        }

        if (mainActivity.imports instanceof Array) {
            mainActivity.imports.forEach((v) => {
                c.pluginConfigAndroid.pluginActivityImports += `import ${v}\n`;
            });
        }

        if (mainActivity.methods instanceof Array) {
            c.pluginConfigAndroid.pluginActivityMethods += '\n';
            c.pluginConfigAndroid.pluginActivityMethods += `${mainActivity.methods.join('\n    ')}`;
        }
    }

    if (plugin.imports) {
        plugin.imports.forEach((v) => {
            c.pluginConfigAndroid.pluginImports += `import ${v}\n`;
        });
    }

    _injectPackage(c, plugin, pkg);

    const { mainApplication } = plugin;
    if (mainApplication) {
        if (mainApplication.packages) {
            mainApplication.packages.forEach((v) => {
                _injectPackage(c, plugin, v);
            });
        }

        if (mainApplication.createMethods instanceof Array) {
            c.pluginConfigAndroid.pluginApplicationCreateMethods += '\n';
            c.pluginConfigAndroid.pluginApplicationCreateMethods += `${mainApplication.createMethods.join('\n    ')}`;
        }

        if (mainApplication.methods instanceof Array) {
            c.pluginConfigAndroid.pluginApplicationMethods += '\n';
            c.pluginConfigAndroid.pluginApplicationMethods += `${mainApplication.methods.join('\n    ')}`;
        }
    }

    if (plugin.mainApplicationMethods) {
        logWarning(`Plugin ${key} in ${c.paths.project.config} is using DEPRECATED MainApplicationMethods. Use "mainApplication": { "methods": []} instead`);
        c.pluginConfigAndroid.pluginApplicationMethods += `\n${plugin.mainApplicationMethods}\n`;
    }
};

const _injectPackage = (c, plugin, pkg) => {
    if (pkg) c.pluginConfigAndroid.pluginImports += `import ${pkg}\n`;
    let packageParams = '';
    if (plugin.packageParams) {
        packageParams = plugin.packageParams.join(',');
    }

    const className = _extractClassName(pkg);
    if (className) c.pluginConfigAndroid.pluginPackages += `${className}(${packageParams}),\n`;
};

const _extractClassName = pkg => (pkg ? pkg.split('.').pop() : null);
