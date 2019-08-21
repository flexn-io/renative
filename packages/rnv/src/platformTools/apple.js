/* eslint-disable import/no-cycle */
// @todo fix circular dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';
import { executeAsync } from '../systemTools/exec';
import { isObject } from '../systemTools/objectUtils';
import { createPlatformBuild } from '../cli/platform';
import { launchAppleSimulator, getAppleDevices, listAppleDevices } from './apple/deviceManager';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug,
    getAppVersion,
    getAppTitle,
    getEntryFile,
    writeCleanFile,
    getAppTemplateFolder,
    getAppId,
    copyBuildsFolder,
    getConfigProp,
    getIP,
    getBuildFilePath,
    logSuccess,
    getBuildsFolder
} from '../common';
import { getQuestion } from '../systemTools/prompt';
import { IOS, TVOS } from '../constants';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, mergeObjects } from '../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../pluginTools';
import {
    saveObjToPlistSync, objToPlist, parseExportOptionsPlist,
    parseInfoPlist, parseEntitlementsPlist
} from './apple/plistParser';
import { parseXcscheme } from './apple/xcschemeParser';
import { parsePodFile } from './apple/podfileParser';
import { parseXcodeProject } from './apple/xcodeParser';
import { parseAppDelegate } from './apple/swiftParser';

const readline = require('readline');

const checkIfCommandExists = command => new Promise((resolve, reject) => child_process.exec(`command -v ${command} 2>/dev/null`, (error) => {
    if (error) return reject(new Error(`${command} not installed`));
    return resolve();
}));

const runPod = (command, cwd, rejectOnFail = false) => new Promise((resolve, reject) => {
    logTask(`runPod:${command}:${rejectOnFail}`);

    if (!fs.existsSync(cwd)) {
        if (rejectOnFail) return reject(`Location ${cwd} does not exists!`);
        logError(`Location ${cwd} does not exists!`);
        return resolve();
    }
    return checkIfCommandExists('pod')
        .then(() => executeAsync(`pod ${command}`, {
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
    const tId = getConfigProp(c, platform, 'teamID');

    const iosPath = path.join(getAppFolder(c, platform), appFolderName);
    const sPath = path.join(c.paths.appConfig.dir, `assets/${platform}`);
    copyFolderContentsRecursiveSync(sPath, iosPath);

    // ASSETS
    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));

    resolve();
});

const runXcodeProject = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`runXcodeProject:${platform}:${target}`);

    if (target === '?') {
        launchAppleSimulator(c, platform, target).then((newTarget) => {
            _runXcodeProject(c, platform, newTarget)
                .then(() => resolve())
                .catch(e => reject(e));
        });
    } else {
        _runXcodeProject(c, platform, target)
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const _runXcodeProject = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`_runXcodeProject:${platform}:${target}`);

    const appPath = getAppFolder(c, platform);
    const { device } = c.program;
    const scheme = getConfigProp(c, platform, 'scheme');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    let p;

    if (!scheme) {
        reject(
            `You missing scheme in platforms.${chalk.yellow(platform)} in your ${chalk.white(
                c.paths.appConfig.config,
            )}! Check example config for more info:  ${chalk.blue(
                'https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/renative.json',
            )} `,
        );
        return;
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
                    packageBundleForXcode(c, platform, bundleIsDev)
                        .then(v => executeAsync(`react-native ${p}`))
                        .then(() => resolve())
                        .catch(e => reject(e));
                } else {
                    executeAsync(`react-native ${p}`)
                        .then(() => resolve())
                        .catch(e => reject(e));
                }
            };

            if (c.program.target) {
                const selectedDevice = devicesArr.find(d => d.name === c.program.target);
                if (selectedDevice) {
                    run(selectedDevice);
                } else {
                    reject(`Could not find device ${c.program.target}`);
                }
                return;
            }

            let devicesString = '\n';
            devicesArr.forEach((v, i) => {
                devicesString += `-[${i + 1}] ${chalk.white(v.name)} | ${v.deviceIcon} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(
                    v.udid,
                )}${v.isDevice ? chalk.red(' (device)') : ''}\n`;
            });

            const readlineInterface = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readlineInterface.question(getQuestion(`${devicesString}\nType number of the device you want to launch`), (v) => {
                const selectedDevice = devicesArr[parseInt(v, 10) - 1];
                if (selectedDevice) {
                    run(selectedDevice);
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
        p = ['run-ios', '--project-path', appPath, '--device', device, '--scheme', scheme, '--configuration', runScheme];
    } else {
        p = ['run-ios', '--project-path', appPath, '--simulator', target.replace(/(\s+)/g, '\\$1'), '--scheme', scheme, '--configuration', runScheme];
    }

    if (p) {
        const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
        if (allowProvisioningUpdates) p.push('--allowProvisioningUpdates');

        if (bundleAssets) {
            packageBundleForXcode(c, platform, bundleIsDev)
                .then(() => executeAsync(`react-native ${p.join(' ')}`))
                .then(() => resolve())
                .catch(e => reject(e));
        } else {
            executeAsync(`react-native ${p.join(' ')}`)
                .then(() => resolve())
                .catch(e => reject(e));
        }
    } else {
        reject('Missing options for react-native command!');
    }
});

const archiveXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`archiveXcodeProject:${platform}`);

    const appFolderName = getAppFolderName(c, platform);
    const runScheme = getConfigProp(c, platform, 'runScheme', 'Debug');
    let sdk = getConfigProp(c, platform, 'sdk');
    if (!sdk) {
        sdk = platform === IOS ? 'iphoneos' : 'tvos';
    }
    // else if (sdk === 'iphonesimulator') {
    //     sdk += ' ONLY_ACTIVE_ARCH=NO';
    // }
    const sdkArr = [sdk];
    // if (sdk === 'iphonesimulator') {
    //     sdkArr.push('ONLY_ACTIVE_ARCH=NO');
    // }

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

    _workerTimer = setInterval(_archiveLogger, 30000);

    if (c.buildConfig.platforms[platform].runScheme === 'Release') {
        packageBundleForXcode(c, platform, bundleIsDev)
            .then(() => executeAsync(`xcodebuild ${p.join(' ')}`))
            .then(() => {
                logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
                clearInterval(_workerTimer);
                resolve();
            })
            .catch((e) => {
                clearInterval(_workerTimer);
                reject(e);
            });
    } else {
        executeAsync(`xcodebuild ${p.join(' ')}`)
            .then(() => {
                logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
                clearInterval(_workerTimer);
                resolve();
            })
            .catch((e) => {
                clearInterval(_workerTimer);
                reject(e);
            });
    }
});

let _workerTimer;
const _archiveLogger = () => {
    console.log(`ARCHIVING .... ${(new Date()).toLocaleString()}`);
};

const exportXcodeProject = (c, platform) => new Promise((resolve, reject) => {
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

    executeAsync(`xcodebuild ${p.join(' ')}`)
        .then(() => {
            logSuccess(`Your IPA is located in ${chalk.white(exportPath)} .`);
            resolve();
        })
        .catch(e => reject(e));
});

const packageBundleForXcode = (c, platform, isDev = false) => {
    logTask(`packageBundleForXcode:${platform}`);
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

    return executeAsync(`react-native ${args.join(' ')}`);
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
    copyAppleAssets(c, platform, appFolderName)
        .then(() => copyBuildsFolder(c, platform))
        .then(() => parseAppDelegate(c, platform, appFolder, appFolderName, bundleAssets, bundlerIp, port))
        .then(() => parseExportOptionsPlist(c, platform))
        .then(() => parseXcscheme(c, platform))
        .then(() => parsePodFile(c, platform))
        .then(() => parseEntitlementsPlist(c, platform))
        .then(() => parseInfoPlist(c, platform))
        .then(() => {
            runPod(forceUpdate ? 'update' : 'install', getAppFolder(c, platform), true)
                .then(() => parseXcodeProject(c, platform))
                .then(() => resolve())
                .catch((e) => {
                    if (!c.program.update) {
                        logWarning(`Looks like pod install is not enough! Let's try pod update! Error: ${e}`);
                        runPod('update', getAppFolder(c, platform), true)
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
