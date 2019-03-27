import path from 'path';
import fs from 'fs';
import { executeAsync, execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError, logWarning,
    getAppFolder, isPlatformActive, logDebug, configureIfRequired,
    getAppVersion, getAppTitle, getEntryFile, writeCleanFile, getAppTemplateFolder,
    getAppId,
} from '../common';
import { IOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const xcode = require('xcode');

const runPod = (command, cwd, rejectOnFail = false) => new Promise((resolve, reject) => {
    logTask(`runPod:${command}`);

    if (!fs.existsSync(cwd)) {
        logError(`Location ${cwd} does not exists!`);
        if (rejectOnFail) reject(e);
        else resolve();
        return;
    }

    return executeAsync('pod', [
        command,
    ], {
        cwd,
        evn: process.env,
        stdio: 'inherit',
    }).then(() => resolve())
        .catch((e) => {
            logError(e);
            if (rejectOnFail) reject(e);
            else resolve();
        });
});

const copyAppleAssets = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask('copyAppleAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const iosPath = path.join(getAppFolder(c, platform), appFolderName);
    const sPath = path.join(c.appConfigFolder, `assets/${platform}`);
    copyFolderContentsRecursiveSync(sPath, iosPath);
    resolve();
});

const runXcodeProject = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`runXcodeProject:${platform}:${target}`);

    const appPath = getAppFolder(c, platform);

    if (!fs.existsSync(path.join(appPath, 'Pods'))) {
        logWarning(`Looks like your ${platform} project is not configured yet. Let's configure it!`);
        configureXcodeProject(c, platform)
            .then(() => runXcodeProject(c, platform, target))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    const p = [
        'run-ios',
        '--project-path',
        appPath,
        '--simulator',
        target,
        '--scheme',
        c.appConfigFile.platforms[platform].scheme,
        '--configuration',
        c.appConfigFile.platforms[platform].runScheme,
    ];
    logDebug('running', p);
    if (c.appConfigFile.platforms[platform].runScheme === 'Release') {
        // iosPackage(buildConfig).then(v => executeAsync('react-native', p));
    } else {
        executeAsync('react-native', p).then(() => resolve()).catch(e => reject(e));
    }
});

const configureXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureXcodeProject');
    if (process.platform !== 'darwin') return;
    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolderName = platform === IOS ? 'RNVApp' : 'RNVAppTVOS';

    // configureIfRequired(c, platform)
    //     .then(() => copyAppleAssets(c, platform, appFolderName))
    copyAppleAssets(c, platform, appFolderName)
        .then(() => configureProject(c, platform, appFolderName))
        .then(() => runPod(c.program.update ? 'update' : 'install', getAppFolder(c, platform), true))
        .then(() => resolve())
        .catch((e) => {
            if (!c.program.update) {
                logWarning(`Looks like pod install is not enough! Let\'s try pod update! Error: ${e}`);
                runPod('update', getAppFolder(c, platform))
                    .then(() => copyAppleAssets(c, platform, appFolderName))
                    .then(() => configureProject(c, platform, appFolderName))
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                reject(e);
            }
        });
});

const configureProject = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);

    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));


    const appDelegate = 'AppDelegate.swift';
    writeCleanFile(path.join(getAppTemplateFolder(c, platform), appFolderName, appDelegate),
        path.join(appFolder, appFolderName, appDelegate),
        [
            { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) },
        ]);

    const plistPath = path.join(appFolder, `${appFolderName}/Info.plist`);

    let pluginInject = '';
    // PLUGINS
    if (c.appConfigFile && c.pluginConfig) {
        const includedPlugins = c.appConfigFile.common.includedPlugins;
        const excludedPlugins = c.appConfigFile.common.excludedPlugins;
        if (includedPlugins) {
            const plugins = c.pluginConfig.plugins;
            for (const key in plugins) {
                if (includedPlugins.includes('*') || includedPlugins.includes(key)) {
                    const plugin = plugins[key][platform];
                    if (plugin) {
                        pluginInject += `  pod '${plugin.podName}', :path => '${plugin.podPath}'\n`;
                    }
                }
            }
        }
    }

    // PERMISSIONS
    let pluginPermissions = '';
    const permissions = c.appConfigFile.platforms[platform].permissions;
    if (permissions) {
        permissions.forEach((v) => {
            if (c.permissionsConfig) {
                const plat = c.permissionsConfig.permissions[platform] ? platform : 'ios';
                const pc = c.permissionsConfig.permissions[plat];
                if (pc[v]) {
                    pluginPermissions += `  <key>${pc[v].key}</key>\n  <string>${pc[v].desc}</string>\n`;
                }
            }
        });
    }
    pluginPermissions = pluginPermissions.substring(0, pluginPermissions.length - 1);

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), 'Podfile'),
        path.join(appFolder, 'Podfile'),
        [
            { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        ]);

    const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
    const xcodeProj = xcode.project(projectPath);
    xcodeProj.parse((err) => {
        const appId = getAppId(c, platform);
        console.log('JSHJKHKSJHSKSHK', appId);
        xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

        let pluginFonts = '';
        if (c.appConfigFile && c.fontsConfig) {
            const includedFonts = c.appConfigFile.common.includedFonts;
            if (includedFonts) {
                const fonts = c.fontsConfig.fonts;
                for (const key in fonts) {
                    if (includedFonts.includes('*') || includedFonts.includes(key)) {
                        const font = fonts[key];
                        if (font) {
                            const fontSource = path.join(c.projectConfigFolder, 'fonts', font);
                            if (fs.existsSync(fontSource)) {
                                const fontFolder = path.join(appFolder, 'fonts');
                                mkdirSync(fontFolder);
                                const fontDest = path.join(fontFolder, font);
                                copyFileSync(fontSource, fontDest);
                                xcodeProj.addResourceFile(fontSource);
                                pluginFonts += `  <string>${font}</string>\n`;
                            } else {
                                logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                            }
                        }
                    }
                }
            }
        }

        fs.writeFileSync(projectPath, xcodeProj.writeSync());

        writeCleanFile(path.join(appTemplateFolder, `${appFolderName}/Info.plist`),
            plistPath,
            [
                { pattern: '{{PLUGIN_FONTS}}', override: pluginFonts },
                { pattern: '{{PLUGIN_PERMISSIONS}}', override: pluginPermissions },
                { pattern: '{{PLUGIN_APPTITLE}}', override: getAppTitle(c, platform) },
                { pattern: '{{PLUGIN_VERSION_STRING}}', override: getAppVersion(c, platform) },
            ]);

        resolve();
    });
});

export { runPod, copyAppleAssets, configureXcodeProject, runXcodeProject };
