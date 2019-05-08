import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { executeAsync, execShellAsync } from '../exec';
import { createPlatformBuild } from '../cli/platform';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError, logWarning,
    getAppFolder, isPlatformActive, logDebug, configureIfRequired,
    getAppVersion, getAppTitle, getEntryFile, writeCleanFile, getAppTemplateFolder,
    getAppId, copyBuildsFolder, getConfigProp, getIP, getQuestion, logSuccess,
} from '../common';
import { IOS, TVOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const child_process = require('child_process');

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

    if (target === '?') {
        launchAppleSimulator(c, platform, target)
            .then((newTarget) => {
                _runXcodeProject(c, platform, newTarget).then(() => resolve()).catch(e => reject(e));
            });
    } else {
        _runXcodeProject(c, platform, target).then(() => resolve()).catch(e => reject(e));
    }
});

const _runXcodeProject = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`_runXcodeProject:${platform}:${target}`);

    const appPath = getAppFolder(c, platform);
    const device = c.program.device;
    const appFolderName = _getAppFolderName(c, platform);
    const scheme = getConfigProp(c, platform, 'scheme');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    let p;

    if (!scheme) {
        reject(`You missing scheme in platforms.${chalk.yellow(platform)} in your ${chalk.white(c.appConfigPath)}! Check example config for more info:  ${chalk.blue('https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/config.json')} `);
        return;
    }

    if (device === true) {
        const devicesArr = _getAppleDevices(c, platform, false, true);
        if (devicesArr.length === 1) {
            logSuccess(`Found one device connected! ${chalk.white(devicesArr[0].name)}`);
            p = [
                'run-ios',
                '--project-path',
                appPath,
                '--device',
                devicesArr[0].name,
                '--scheme',
                scheme,
                '--configuration',
                runScheme,
            ];
        } else if (devicesArr.length > 1) {
            let devicesString = '\n';
            devicesArr.forEach((v, i) => {
                devicesString += `-[${(i + 1)}] ${chalk.white(v.name)} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}\n`;
            });

            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readline.question(getQuestion(`${devicesString}\nType number of the device you want to launch`), (v) => {
                const selectedDevice = devicesArr[(parseInt(v, 10) - 1)];
                if (selectedDevice) {
                    p = [
                        'run-ios',
                        '--project-path',
                        appPath,
                        '--device',
                        selectedDevice.name,
                        '--scheme',
                        scheme,
                        '--configuration',
                        runScheme,
                    ];
                    if (bundleAssets) {
                        packageBundleForXcode(c, platform, bundleIsDev)
                            .then(v => executeAsync('react-native', p))
                            .then(() => resolve()).catch(e => reject(e));
                    } else {
                        executeAsync('react-native', p).then(() => resolve()).catch(e => reject(e));
                    }
                } else {
                    reject(`Wrong choice ${v}! Ingoring`);
                }
            });
            return;
        } else {
            reject(`No ${platform} devices connected!`);
            return;
        }
    } else if (device) {
        p = [
            'run-ios',
            '--project-path',
            appPath,
            '--device',
            device,
            '--scheme',
            scheme,
            '--configuration',
            runScheme,
        ];
    } else {
        p = [
            'run-ios',
            '--project-path',
            appPath,
            '--simulator',
            target,
            '--scheme',
            scheme,
            '--configuration',
            runScheme,
        ];
    }

    logDebug('running', p);
    if (p) {
        if (bundleAssets) {
            packageBundleForXcode(c, platform, bundleIsDev)
                .then(v => executeAsync('react-native', p))
                .then(() => resolve()).catch(e => reject(e));
        } else {
            executeAsync('react-native', p).then(() => resolve()).catch(e => reject(e));
        }
    } else {
        reject('Missing options for react-native command!');
    }
});

const archiveXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`archiveXcodeProject:${platform}`);

    const appFolderName = _getAppFolderName(c, platform);
    const sdk = platform === IOS ? 'iphoneos' : 'tvos';

    const appPath = getAppFolder(c, platform);
    const appFolder = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');


    const scheme = getConfigProp(c, platform, 'scheme');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const p = [
        '-workspace',
        `${appPath}/${appFolderName}.xcworkspace`,
        '-scheme',
        scheme,
        '-sdk',
        sdk,
        '-configuration',
        'Release',
        'archive',
        '-archivePath',
        `${exportPath}/${scheme}.xcarchive`,
        '-allowProvisioningUpdates',
    ];

    logDebug('running', p);

    if (c.appConfigFile.platforms[platform].runScheme === 'Release') {
        packageBundleForXcode(c, platform, bundleIsDev)
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

    const scheme = getConfigProp(c, platform, 'scheme');
    const p = [
        '-exportArchive',
        '-archivePath',
        `${exportPath}/${scheme}.xcarchive`,
        '-exportOptionsPlist',
        `${appPath}/exportOptions.plist`,
        '-exportPath',
        `${exportPath}`,
        '-allowProvisioningUpdates',
    ];
    logDebug('running', p);

    executeAsync('xcodebuild', p).then(() => {
        logSuccess(`Your IPA is located in ${chalk.white(exportPath)}.`);
        resolve();
    }).catch(e => reject(e));
});

const packageBundleForXcode = (c, platform, isDev = false) => {
    logTask(`packageBundleForXcode:${platform}`);
    const appFolderName = _getAppFolderName(c, platform);
    const appPath = path.join(getAppFolder(c, platform), appFolderName);

    return executeAsync('react-native', [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.appId}_${platform}`,
        '--entry-file',
        `${c.appConfigFile.platforms[platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, platform)}/main.jsbundle`]);
};

const prepareXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    const device = c.program.device;
    const ip = device ? getIP() : 'localhost';
    const appFolder = getAppFolder(c, platform);
    const appFolderName = _getAppFolderName(c, platform);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    // CHECK TEAM ID IF DEVICE
    const tId = getConfigProp(c, platform, 'teamID');
    if (device && (!tId || tId === '')) {
        logError(`Looks like you're missing teamID in your ${chalk.white(c.appConfigPath)} => .platforms.${platform}.teamID . you will not be able to build ${platform} app for device!`);
        resolve();
        return;
    }

    const check = path.join(appFolder, `${appFolderName}.xcodeproj`);
    if (!fs.existsSync(check)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
        createPlatformBuild(c, platform)
            .then(() => configureXcodeProject(c, platform))
            .then(() => _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }
    if (!fs.existsSync(path.join(appFolder, 'Pods'))) {
        logWarning(`Looks like your ${platform} project is not configured yet. Let's configure it!`);
        configureXcodeProject(c, platform)
            .then(() => _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip))
            .then(() => resolve(c))
            .catch(e => reject(e));
    } else {
        _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip)
            .then(() => resolve(c))
            .catch(e => reject(e));
    }
});

const configureXcodeProject = (c, platform, ip, port) => new Promise((resolve, reject) => {
    logTask('configureXcodeProject');
    if (process.platform !== 'darwin') return;
    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolderName = _getAppFolderName(c, platform);

    // configureIfRequired(c, platform)
    //     .then(() => copyAppleAssets(c, platform, appFolderName))
    copyAppleAssets(c, platform, appFolderName)
        .then(() => copyAppleAssets(c, platform, appFolderName))
        .then(() => copyBuildsFolder(c, platform))
        .then(() => _preConfigureProject(c, platform, appFolderName, ip, port))
        .then(() => runPod(c.program.update ? 'update' : 'install', getAppFolder(c, platform), true))
        .then(() => resolve())
        .catch((e) => {
            if (!c.program.update) {
                logWarning(`Looks like pod install is not enough! Let\'s try pod update! Error: ${e}`);
                runPod('update', getAppFolder(c, platform))
                    .then(() => _preConfigureProject(c, platform, appFolderName, ip, port))
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                reject(e);
            }
        });
});

const _postConfigureProject = (c, platform, appFolder, appFolderName, isBundled = false, ip = 'localhost', port = 8081) => new Promise((resolve, reject) => {
    logTask(`_postConfigureProject:${platform}:${ip}:${port}`);
    const appDelegate = 'AppDelegate.swift';

    const entryFile = getEntryFile(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);
    const tId = getConfigProp(c, platform, 'teamID');
    let bundle;
    if (isBundled) {
        bundle = `RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "${entryFile}", fallbackResource: nil)`;
    } else {
        bundle = `URL(string: "http://${ip}:${port}/${entryFile}.bundle?platform=ios")`;
    }

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), appFolderName, appDelegate),
        path.join(appFolder, appFolderName, appDelegate),
        [
            { pattern: '{{BUNDLE}}', override: bundle },
            { pattern: '{{ENTRY_FILE}}', override: entryFile },
            { pattern: '{{IP}}', override: ip },
            { pattern: '{{PORT}}', override: port },
        ]);

    writeCleanFile(path.join(appTemplateFolder, 'exportOptions.plist'),
        path.join(appFolder, 'exportOptions.plist'),
        [
            { pattern: '{{TEAM_ID}}', override: tId },
        ]);


    const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
    const xcodeProj = xcode.project(projectPath);
    xcodeProj.parse((err) => {
        const appId = getAppId(c, platform);
        if (tId) {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', tId);
        } else {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
        }

        xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

        resolve();
    });
});

const _preConfigureProject = (c, platform, appFolderName, ip = 'localhost', port = 8081) => new Promise((resolve, reject) => {
    logTask(`_preConfigureProject:${platform}:${appFolderName}:${ip}:${port}`);

    const appFolder = getAppFolder(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);
    const tId = getConfigProp(c, platform, 'teamID');

    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));

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
                                const podPath = plugin.path ? `../../${plugin.path}` : `../../node_modules/${key}`;
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
        if (tId) {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', tId);
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

        resolve();
    });
});

const _getAppFolderName = (c, platform) => {
    const projectFolder = getConfigProp(c, platform, 'projectFolder');
    if (projectFolder) {
        return projectFolder;
    }
    return (platform === IOS ? 'RNVApp' : 'RNVAppTVOS');
};

const listAppleDevices = (c, platform) => new Promise((resolve, reject) => {
    logTask(`listAppleDevices:${platform}`);

    const devicesArr = _getAppleDevices(c, platform);
    let devicesString = '\n';
    devicesArr.forEach((v, i) => {
        devicesString += `-[${(i + 1)}] ${chalk.white(v.name)} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}\n`;
    });
    console.log(devicesString);
});

const launchAppleSimulator = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`launchAppleSimulator:${platform}:${target}`);

    const devicesArr = _getAppleDevices(c, platform, true);
    let selectedDevice;
    for (let i = 0; i < devicesArr.length; i++) {
        if (devicesArr[i].name === target) {
            selectedDevice = devicesArr[i];
        }
    }
    if (selectedDevice) {
        _launchSimulator(selectedDevice);
        resolve(selectedDevice.name);
    } else {
        logWarning(`Your specified simulator target ${chalk.white(target)} doesn't exists`);
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        let devicesString = '\n';
        devicesArr.forEach((v, i) => {
            devicesString += `-[${(i + 1)}] ${chalk.white(v.name)} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}\n`;
        });
        readline.question(getQuestion(`${devicesString}\nType number of the simulator you want to launch`), (v) => {
            const selectedDevice = devicesArr[(parseInt(v, 10) - 1)];
            if (selectedDevice) {
                _launchSimulator(selectedDevice);
                resolve(selectedDevice.name);
            } else {
                logError(`Wrong choice ${v}! Ingoring`);
            }
        });
    }
});

const _launchSimulator = (selectedDevice) => {
    try {
        child_process.spawnSync('xcrun', [
            'instruments',
            '-w',
            selectedDevice.udid,
        ]);
    } catch (e) {
        // instruments always fail with 255 because it expects more arguments,
        // but we want it to only launch the simulator
    }
};

const _getAppleDevices = (c, platform, ignoreDevices, ignoreSimulators) => {
    const devices = child_process.execFileSync('xcrun', ['instruments', '-s'], {
        encoding: 'utf8',
    });

    const devicesArr = _parseIOSDevicesList(devices, platform, ignoreDevices, ignoreSimulators);
    return devicesArr;
};

const _parseIOSDevicesList = (text, platform, ignoreDevices = false, ignoreSimulators = false) => {
    const devices = [];
    text.split('\n').forEach((line) => {
        const device = line.match(/(.*?) \((.*?)\) \[(.*?)\]/);
        const sim = line.match(/(.*?) \((.*?)\) \[(.*?)\] \((.*?)\)/);

        if (device != null) {
            const name = device[1];
            const version = device[2];
            const udid = device[3];
            const isDevice = sim === null;
            if ((isDevice && !ignoreDevices) || (!isDevice && !ignoreSimulators)) {
                switch (platform) {
                case IOS:
                    if (name.includes('iPhone') || name.includes('iPad') || name.includes('iPod') || isDevice) {
                        devices.push({ udid, name, version, isDevice });
                    }
                    break;
                case TVOS:
                    if (name.includes('Apple TV') || isDevice) {
                        devices.push({ udid, name, version, isDevice });
                    }
                    break;
                default:
                    devices.push({ udid, name, version, isDevice });
                    break;
                }
            }
        }
    });

    return devices;
};

const runAppleLog = (c, platform) => new Promise((resolve, reject) => {
    const filter = c.program.filter || 'RNV';
    const child = require('child_process').execFile('xcrun', [
        'simctl',
        'spawn',
        'booted',
        'log',
        'stream',
        '--predicate',
        `eventMessage contains \"${filter}\"`,
    ], { stdio: 'inherit', customFds: [0, 1, 2] });
    // use event hooks to provide a callback to execute when data are available:
    child.stdout.on('data', (data) => {
        const d = data.toString();
        if (d.toLowerCase().includes('error')) {
            console.log(chalk.red(d));
        } else if (d.toLowerCase().includes('success')) {
            console.log(chalk.green(d));
        } else {
            console.log(d);
        }
    });
});


export {
    runPod, copyAppleAssets, configureXcodeProject, runXcodeProject,
    exportXcodeProject, archiveXcodeProject, packageBundleForXcode,
    listAppleDevices, launchAppleSimulator, runAppleLog, prepareXcodeProject,
};
