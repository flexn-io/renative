/* eslint-disable import/no-cycle */
// @todo fix circular dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';
import inquirer from 'inquirer';

import { executeAsync } from '../../systemTools/exec';
import { launchAppleSimulator, getAppleDevices, listAppleDevices } from './deviceManager';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug,
    getConfigProp,
    getIP,
    logSuccess,
} from '../../common';
import { copyAssetsFolder, copyBuildsFolder } from '../../projectTools/projectParser';
import { copyFileSync, mkdirSync } from '../../systemTools/fileutils';
import { IOS, TVOS, MACOS } from '../../constants';
import {
    parseExportOptionsPlist,
    parseInfoPlist, parseEntitlementsPlist
} from './plistParser';
import { parseXcscheme } from './xcschemeParser';
import { parsePodFile } from './podfileParser';
import { parseXcodeProject } from './xcodeParser';
import { parseAppDelegate } from './swiftParser';

const checkIfCommandExists = command => new Promise((resolve, reject) => child_process.exec(`command -v ${command} 2>/dev/null`, (error) => {
    if (error) return reject(new Error(`${command} not installed`));
    return resolve();
}));

const runPod = (c, command, cwd, rejectOnFail = false) => new Promise((resolve, reject) => {
    logTask(`runPod:${command}:${rejectOnFail}`);

    if (!fs.existsSync(cwd)) {
        if (rejectOnFail) return reject(`Location ${cwd} does not exists!`);
        logError(`Location ${cwd} does not exists!`);
        return resolve();
    }
    return checkIfCommandExists('pod')
        .then(() => executeAsync(c, `pod ${command}`, {
            cwd,
            evn: process.env,
        })
            .then(() => resolve())
            .catch((e) => {
                if (rejectOnFail) {
                    logWarning(e);
                    return reject(e);
                }
                logError(e);
                return resolve();
            }))
        .catch(err => logError(err));
});

const copyAppleAssets = (c, platform, appFolderName) => new Promise((resolve) => {
    logTask('copyAppleAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);

    // ASSETS
    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));

    resolve();
});

const runXcodeProject = async (c, platform, target) => {
    logTask(`runXcodeProject:${platform}:${target}`);

    if (target === '?') {
        const newTarget = await launchAppleSimulator(c, platform, target);
        await _runXcodeProject(c, platform, newTarget);
    } else {
        await _runXcodeProject(c, platform, target);
    }
};

const _runXcodeProject = async (c, platform, target) => {
    logTask(`_runXcodeProject:${platform}:${target}`);

    const appPath = getAppFolder(c, platform);
    const { device } = c.program;
    const scheme = getConfigProp(c, platform, 'scheme');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    let p;

    if (!scheme) {
        return Promise.reject(
            `You missing scheme in platforms.${chalk.yellow(platform)} in your ${chalk.white(
                c.paths.appConfig.config,
            )}! Check example config for more info:  ${chalk.grey(
                'https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/renative.json',
            )} `,
        );
    }

    if (device === true) {
        const devicesArr = getAppleDevices(c, platform, false, true);
        if (devicesArr.length === 1) {
            logSuccess(`Found one device connected! device name: ${chalk.white(devicesArr[0].name)} udid: ${chalk.white(devicesArr[0].udid)}`);
            if (devicesArr[0].udid) {
                p = [
                    'run-ios',
                    '--project-path',
                    appPath,
                    '--device',
                    '--udid',
                    devicesArr[0].udid,
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
                    '--device',
                    devicesArr[0].name,
                    '--scheme',
                    scheme,
                    '--configuration',
                    runScheme,
                ];
            }
        } else if (devicesArr.length > 1) {
            const run = (selectedDevice) => {
                logDebug(`Selected device: ${JSON.stringify(selectedDevice, null, 3)}`);
                if (selectedDevice.udid) {
                    p = `run-ios --project-path ${appPath} --device --udid ${selectedDevice.udid} --scheme ${scheme} --configuration ${runScheme}`;
                } else {
                    p = `run-ios --project-path ${appPath} --device ${selectedDevice.name} --scheme ${scheme} --configuration ${runScheme}`;
                }

                logDebug(`RN params: ${p}`);

                if (bundleAssets) {
                    logDebug('Assets will be bundled');
                    return packageBundleForXcode(c, platform, bundleIsDev).then(() => _checkLockAndExec(c, p));
                }
                return _checkLockAndExec(c, p);
            };

            if (c.program.target) {
                const selectedDevice = devicesArr.find(d => d.name === c.program.target);
                if (selectedDevice) {
                    return run(selectedDevice);
                }
                return Promise.reject(`Could not find device ${c.program.target}`);
            }

            const devices = devicesArr.map(v => ({ name: `${v.name} | ${v.deviceIcon} | v: ${chalk.green(v.version)} | udid: ${chalk.grey(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}`, value: v }));

            const { sim } = await inquirer.prompt({
                name: 'sim',
                message: 'Select the device you want to launch on',
                type: 'list',
                choices: devices
            });

            if (sim) {
                return run(sim);
            }
        } else {
            return Promise.reject(`No ${platform} devices connected!`);
        }
    } else if (device) {
        p = ['run-ios', '--project-path', appPath, '--device', device, '--scheme', scheme, '--configuration', runScheme];
    } else {
        p = ['run-ios', '--project-path', appPath, '--simulator', target.replace(/(\s+)/g, '\\$1'), '--scheme', scheme, '--configuration', runScheme];
    }

    if (p) {
        const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
        if (allowProvisioningUpdates) p.push('--allowProvisioningUpdates');

        if (bundleAssets) {
            return packageBundleForXcode(c, platform, bundleIsDev).then(() => executeAsync(c, `react-native ${p.join(' ')}`));
        }
        return _checkLockAndExec(c, p.join(' '));
    }
    return Promise.reject('Missing options for react-native command!');
};

const _checkLockAndExec = (c, p) => executeAsync(c, `react-native ${p}`)
    .catch((e) => {
        const isDeviceLocked = e.includes('ERROR:DEVICE_LOCKED');
        if (isDeviceLocked) {
            return inquirer.prompt({ message: 'Unlock your device and press ENTER', type: 'confirm', name: 'confirm' })
                .then(() => executeAsync(c, `react-native ${p}`));
        }
        return Promise.reject(e);
    });

const archiveXcodeProject = (c, platform) => {
    logTask(`archiveXcodeProject:${platform}`);


    const appFolderName = getAppFolderName(c, platform);
    const runScheme = getConfigProp(c, platform, 'runScheme', 'Debug');
    let sdk = getConfigProp(c, platform, 'sdk');
    if (!sdk) {
        if (platform === IOS) sdk = 'iphoneos';
        if (platform === TVOS) sdk = 'appletvos';
        if (platform === MACOS) sdk = 'macosx';
    }
    const sdkArr = [sdk];

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    const scheme = getConfigProp(c, platform, 'scheme');
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const exportPathArchive = `${exportPath}/${scheme}.xcarchive`;
    const p = [
        '-workspace',
        `${appPath}/${appFolderName}.xcworkspace`,
        '-scheme',
        scheme,
        '-sdk',
        ...sdkArr,
        '-configuration',
        runScheme,
        'archive',
        '-archivePath',
        exportPathArchive
    ];

    if (allowProvisioningUpdates) p.push('-allowProvisioningUpdates');
    if (ignoreLogs) p.push('-quiet');
    // if (sdk === 'iphonesimulator') p.push('ONLY_ACTIVE_ARCH=NO', "-destination='name=iPhone 7,OS=10.2'");

    logTask('archiveXcodeProject: STARTING xcodebuild ARCHIVE...');

    if (c.buildConfig.platforms[platform].runScheme === 'Release') {
        return packageBundleForXcode(c, platform, bundleIsDev)
            .then(() => executeAsync(c, `xcodebuild ${p.join(' ')}`))
            .then(() => {
                logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
            });
    }
    return executeAsync(c, `xcodebuild ${p.join(' ')}`)
        .then(() => {
            logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
        });
};

const exportXcodeProject = (c, platform) => {
    logTask(`exportXcodeProject:${platform}`);

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    const scheme = getConfigProp(c, platform, 'scheme');
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    const p = [
        '-exportArchive',
        '-archivePath',
        `${exportPath}/${scheme}.xcarchive`,
        '-exportOptionsPlist',
        `${appPath}/exportOptions.plist`,
        '-exportPath',
        `${exportPath}`,
    ];
    if (allowProvisioningUpdates) p.push('-allowProvisioningUpdates');
    if (ignoreLogs) p.push('-quiet');
    logDebug('running', p);

    logTask('exportXcodeProject: STARTING xcodebuild EXPORT...');

    return executeAsync(c, `xcodebuild ${p.join(' ')}`)
        .then(() => {
            logSuccess(`Your IPA is located in ${chalk.white(exportPath)} .`);
        });
};

const packageBundleForXcode = (c, platform, isDev = false) => {
    logTask(`packageBundleForXcode:${platform}`);
    const { maxErrorLength } = c.program;
    const args = [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.runtime.appId}_${platform}`,
        '--entry-file',
        `${c.buildConfig.platforms[platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, platform)}/main.jsbundle`,
    ];

    if (c.program.info) {
        args.push('--verbose');
    }

    return executeAsync(c, `react-native ${args.join(' ')}`);
};

export const getAppFolderName = (c, platform) => {
    const projectFolder = getConfigProp(c, platform, 'projectFolder');
    if (projectFolder) {
        return projectFolder;
    }
    return platform === IOS ? 'RNVApp' : 'RNVAppTVOS';
};


// Resolve or reject will not be called so this will keep running
const runAppleLog = c => new Promise(() => {
    const filter = c.program.filter || 'RNV';
    const child = child_process.execFile(
        'xcrun',
        ['simctl', 'spawn', 'booted', 'log', 'stream', '--predicate', `eventMessage contains \"${filter}\"`],
        { stdio: 'inherit', customFds: [0, 1, 2] },
    );
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

const configureXcodeProject = (c, platform, ip, port) => new Promise((resolve, reject) => {
    logTask(`configureXcodeProject:${platform}`);
    const { device } = c.program;
    const bundlerIp = device ? getIP() : 'localhost';
    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    // INJECTORS
    c.pluginConfigiOS = {
        podfileInject: '',
        exportOptions: '',
        embeddedFonts: [],
        embeddedFontSources: [],
        pluginAppDelegateImports: '',
        pluginAppDelegateMethods: '',
        appDelegateMethods: {
            application: {
                didFinishLaunchingWithOptions: [],
                open: [],
                supportedInterfaceOrientationsFor: [],
                didReceiveRemoteNotification: [],
                didFailToRegisterForRemoteNotificationsWithError: [],
                didReceive: [],
                didRegister: [],
                didRegisterForRemoteNotificationsWithDeviceToken: []
            },
            userNotificationCenter: {
                willPresent: []
            }
        },
        podfileSources: [],
    };

    // FONTS
    if (c.buildConfig) {
        if (fs.existsSync(c.paths.project.projectConfig.fontsDir)) {
            fs.readdirSync(c.paths.project.projectConfig.fontsDir).forEach((font) => {
                if (font.includes('.ttf') || font.includes('.otf')) {
                    const key = font.split('.')[0];
                    const { includedFonts } = c.buildConfig.common;
                    if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
                        const fontSource = path.join(c.paths.project.projectConfig.dir, 'fonts', font);
                        if (fs.existsSync(fontSource)) {
                            const fontFolder = path.join(appFolder, 'fonts');
                            mkdirSync(fontFolder);
                            const fontDest = path.join(fontFolder, font);
                            copyFileSync(fontSource, fontDest);
                            c.pluginConfigiOS.embeddedFontSources.push(fontSource);
                            c.pluginConfigiOS.embeddedFonts.push(font);
                        } else {
                            logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                        }
                    }
                }
            });
        }
    }

    // CHECK TEAM ID IF DEVICE
    const tId = getConfigProp(c, platform, 'teamID');
    if (device && (!tId || tId === '')) {
        logError(
            `Looks like you're missing teamID in your ${chalk.white(
                c.paths.appConfig.config,
            )} => .platforms.${platform}.teamID . you will not be able to build ${platform} app for device!`,
        );
    }

    // PARSERS
    const forceUpdate = !fs.existsSync(path.join(appFolder, 'Podfile.lock')) || c.program.update;
    copyAssetsFolder(c, platform)
        .then(() => copyAppleAssets(c, platform, appFolderName))
        .then(() => copyBuildsFolder(c, platform))
        .then(() => parseAppDelegate(c, platform, appFolder, appFolderName, bundleAssets, bundlerIp, port))
        .then(() => parseExportOptionsPlist(c, platform))
        .then(() => parseXcscheme(c, platform))
        .then(() => parsePodFile(c, platform))
        .then(() => parseEntitlementsPlist(c, platform))
        .then(() => parseInfoPlist(c, platform))
        .then(() => {
            runPod(c, forceUpdate ? 'update' : 'install', getAppFolder(c, platform), true)
                .then(() => parseXcodeProject(c, platform))
                .then(() => resolve())
                .catch((e) => {
                    if (!c.program.update) {
                        logWarning(`Looks like pod install is not enough! Let's try pod update! Error: ${e}`);
                        runPod(c, 'update', getAppFolder(c, platform), true)
                            .then(() => parseXcodeProject(c, platform))
                            .then(() => resolve())
                            .catch(err => reject(err));
                    } else {
                        reject(e);
                    }
                });
        })
        .catch(e => reject(e));
});

export {
    runPod,
    copyAppleAssets,
    configureXcodeProject,
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    listAppleDevices,
    launchAppleSimulator,
    runAppleLog,
};
