import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { executeAsync, execShellAsync } from '../exec';
import { createPlatformBuild } from '../cli/platform';
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

const archiveXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`archiveXcodeProject:${platform}`);

    const appFolderName = platform === IOS ? 'RNVApp' : 'RNVAppTVOS';
    const sdk = platform === IOS ? 'iphoneos' : 'tvos';

    const appPath = getAppFolder(c, platform);
    const appFolder = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    if (!fs.existsSync(path.join(appPath, 'Pods'))) {
        logWarning(`Looks like your ${platform} project is not configured yet. Let's configure it!`);
        configureXcodeProject(c, platform)
            .then(() => archiveXcodeProject(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    const p = [
        '-workspace',
        `${appPath}/${appFolderName}.xcworkspace`,
        '-scheme',
        c.appConfigFile.platforms[platform].scheme,
        '-sdk',
        sdk,
        '-configuration',
        'Release',
        'archive',
        '-archivePath',
        `${exportPath}/${c.appConfigFile.platforms[platform].scheme}.xcarchive`,
    ];

    logDebug('running', p);

    if (c.appConfigFile.platforms[platform].runScheme === 'Release') {
        packageBundleForXcode(c, platform)
            .then(() => executeAsync('xcodebuild', p))
            .then(() => resolve()).catch(e => reject(e));
    } else {
        executeAsync('xcodebuild', p).then(() => resolve()).catch(e => reject(e));
    }
});

const exportXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`exportXcodeProject:${platform}`);

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    if (!fs.existsSync(path.join(appPath, 'Pods'))) {
        logWarning(`Looks like your ${platform} project is not configured yet. Let's configure it!`);
        configureXcodeProject(c, platform)
            .then(() => exportXcodeProject(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    const p = [
        '-exportArchive',
        '-archivePath',
        `${exportPath}/${c.appConfigFile.platforms[platform].scheme}.xcarchive`,
        '-exportOptionsPlist',
        `${appPath}/exportOptions.plist`,
        '-exportPath',
        `${exportPath}`,
    ];
    logDebug('running', p);

    executeAsync('xcodebuild', p).then(() => resolve()).catch(e => reject(e));
});

const packageBundleForXcode = (c, platform) => {
    logTask(`packageBundleForXcode:${platform}`);
    const appFolderName = platform === IOS ? 'RNVApp' : 'RNVAppTVOS';
    const appPath = path.join(getAppFolder(c, platform), appFolderName);

    return executeAsync('react-native', [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        'false',
        '--assets-dest',
        `platformBuilds/${c.appId}_${platform}`,
        '--entry-file',
        `${c.appConfigFile.platforms[platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, platform)}/main.jsbundle`]);
};

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

    const check = path.join(appFolder, `${appFolderName}.xcodeproj`);
    if (!fs.existsSync(check)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
        createPlatformBuild(c, platform)
            .then(() => configureXcodeProject(c, platform))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

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
                        if (plugins[key]['no-active'] !== true) {
                            const isNpm = plugins[key]['no-npm'] !== true;
                            if (isNpm) {
                                const podPath = `../../${plugin.path}` || `../../node_modules/${key}`;
                                pluginInject += `  pod '${plugin.podName}', :path => '${podPath}'\n`;
                            } else if (plugin.git) {
                                pluginInject += `  pod '${plugin.podName}', :git => '${plugin.git}'\n`;
                            } else if (plugin.version) {
                                pluginInject += `  pod '${plugin.podName}', '${plugin.version}'\n`;
                            }
                        }
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

        if (c.appConfigFile.platforms[platform].teamID) {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', c.appConfigFile.platforms[platform].teamID);
        } else {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
        }

        xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

        let pluginFonts = '';
        if (c.appConfigFile) {
            if (fs.existsSync(c.fontsConfigFolder)) {
                fs.readdirSync(c.fontsConfigFolder).forEach((font) => {
                    if (font.includes('.ttf') || font.includes('.otf')) {
                        const key = font.split('.')[0];
                        const includedFonts = c.appConfigFile.common.includedFonts;
                        if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
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
                });
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

        // if (c.appConfigFile.platforms[platform].teamID) {
        //     writeCleanFile(path.join(appTemplateFolder, 'exportOptions.plist'),
        //         path.join(appFolder, 'exportOptions.plist'),
        //         [
        //             { pattern: '{{TEAM_ID}}', override: c.appConfigFile.platforms[platform].teamID },
        //         ]);
        // }

        resolve();
    });
});

export { runPod, copyAppleAssets, configureXcodeProject, runXcodeProject, exportXcodeProject, archiveXcodeProject, packageBundleForXcode };
