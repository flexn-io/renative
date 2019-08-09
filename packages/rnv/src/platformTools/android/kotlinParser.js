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
    copyBuildsFolder,
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
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync } from '../../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

export const parseMainApplicationSync = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const applicationPath = 'app/src/main/java/rnv/MainApplication.kt';
    writeCleanFile(getBuildFilePath(c, platform, applicationPath), path.join(appFolder, applicationPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) },
        { pattern: '{{GET_JS_BUNDLE_FILE}}', override: getGetJsBundleFile(c, platform) },
        { pattern: '{{PLUGIN_IMPORTS}}', override: c.pluginConfigAndroid.pluginImports },
        { pattern: '{{PLUGIN_PACKAGES}}', override: c.pluginConfigAndroid.pluginPackages },
        { pattern: '{{PLUGIN_METHODS}}', override: c.pluginConfigAndroid.mainApplicationMethods },
    ]);
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
    writeCleanFile(getBuildFilePath(c, platform, splashPath), path.join(appFolder, splashPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
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

    const mainActivity = plugin.mainActivity;
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

    if (plugin.MainApplication) {
        if (plugin.MainApplication.packages) {
            plugin.MainApplication.packages.forEach((v) => {
                _injectPackage(c, plugin, v);
            });
        }
    }

    if (plugin.mainApplicationMethods) {
        c.pluginConfigAndroid.mainApplicationMethods += `\n${plugin.mainApplicationMethods}\n`;
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
