import path from 'path';
import fs from 'fs';
import { executeAsync, execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError, logWarning,
    getAppFolder, isPlatformActive, logDebug, configureIfRequired,
    getAppVersion, getAppTitle, getEntryFile, writeCleanFile, getAppTemplateFolder,
} from '../common';
import { IOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

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

    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));


    const appDelegate = 'AppDelegate.swift';
    writeCleanFile(path.join(getAppTemplateFolder(c, platform), appFolderName, appDelegate),
        path.join(appFolder, appFolderName, appDelegate),
        [
            { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) },
        ]);

    const plistBuddy = '/usr/libexec/PlistBuddy';
    const plistPath = path.join(appFolder, `${appFolderName}/Info.plist`);

    // copyFileSync(path.join(getAppTemplateFolder(c, platform), 'Podfile'), path.join(appFolder, 'Podfile'))``;
    let pluginInject = '';
    // PLUGINS
    if (c.appConfigFile && c.pluginConfig) {
        // {{PLUGIN_PATHS}}
        // pod 'RNGestureHandler', :path => '../../node_modules/react-native-gesture-handler'
        const includedPlugins = c.appConfigFile.common.includedPlugins;
        const excludedPlugins = c.appConfigFile.common.excludedPlugins;
        if (includedPlugins) {
            if (includedPlugins.includes('*')) {
                const plugins = c.pluginConfig.plugins;
                for (const key in plugins) {
                    const plugin = plugins[key][platform];
                    if (plugin) {
                        pluginInject += `  pod '${plugin.podName}', :path => '${plugin.podPath}'\n`;
                    }
                }
            } else {
            // TODO
            }
        }
    }

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), 'Podfile'),
        path.join(appFolder, 'Podfile'),
        [
            { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        ]);


    if (!fs.existsSync(plistBuddy)) {
        logError(`PlistBuddy not found at location ${plistBuddy}. Make sure you have it installed!`);
        resolve();
    } else {
        execShellAsync(`${plistBuddy} -c "Set :CFBundleShortVersionString ${getAppVersion(c, platform)}" "${plistPath}"`)
            .then(() => execShellAsync(`${plistBuddy} -c "Set :CFBundleDisplayName ${getAppTitle(c, platform)}" "${plistPath}"`))
            .then(() => configureProjectPermissions(c, platform, appFolderName))
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const configureProjectPermissions = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask(`configureProjectPermissions:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const plistBuddy = '/usr/libexec/PlistBuddy';
    const plistPath = path.join(appFolder, `${appFolderName}/Info.plist`);

    const permissions = c.appConfigFile.platforms[platform].permissions;
    if (permissions) {
        const tasks = [];
        let pcmd = '';
        permissions.forEach((v) => {
            pcmd += ` -c "Set :${v.key} ${v.desc}"`;
        });

        execShellAsync(`${plistBuddy}${pcmd} "${plistPath}"`)
            .then(() => resolve())
            .catch(e => reject(e));
    } else {
        resolve();
    }
});


export { runPod, copyAppleAssets, configureXcodeProject, runXcodeProject };
