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
    getQuestion,
    getBuildFilePath,
    logSuccess,
    getBuildsFolder
} from '../common';
import { IOS, TVOS } from '../constants';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, mergeObjects } from '../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../pluginTools';
import {
    saveObjToPlistSync, objToPlist, parseExportOptionsPlistSync,
    parseInfoPlistSync, parseEntitlementsPlistSync
} from './apple/plistParser';
import { parsePodFileSync } from './apple/plistParser';

const xcode = require('xcode');
const readline = require('readline');

const checkIfCommandExists = command => new Promise((resolve, reject) => child_process.exec(`command -v ${command} 2>/dev/null`, (error) => {
    if (error) return reject(new Error(`${command} not installed`));
    return resolve();
}));

const runPod = (command, cwd, rejectOnFail = false) => new Promise((resolve, reject) => {
    logTask(`runPod:${command}`);

    if (!fs.existsSync(cwd)) {
        if (rejectOnFail) return reject(`Location ${cwd} does not exists!`);
        logError(`Location ${cwd} does not exists!`);
        return resolve();
    }
    return checkIfCommandExists('pod')
        .then(() => executeAsync('pod', [command], {
            cwd,
            evn: process.env,
            stdio: 'inherit',
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

    const iosPath = path.join(getAppFolder(c, platform), appFolderName);
    const sPath = path.join(c.paths.appConfigFolder, `assets/${platform}`);
    copyFolderContentsRecursiveSync(sPath, iosPath);
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
                c.paths.appConfigPath,
            )}! Check example config for more info:  ${chalk.blue(
                'https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/config.json',
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
                    p = [
                        'run-ios',
                        '--project-path',
                        appPath,
                        '--device',
                        '--udid',
                        selectedDevice.udid,
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
                        selectedDevice.name,
                        '--scheme',
                        scheme,
                        '--configuration',
                        runScheme,
                    ];
                }

                logDebug(`RN params: ${p}`);

                if (bundleAssets) {
                    logDebug('Assets will be bundled');
                    packageBundleForXcode(c, platform, bundleIsDev)
                        .then(v => executeAsync('react-native', p))
                        .then(() => resolve())
                        .catch(e => reject(e));
                } else {
                    executeAsync('react-native', p)
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
        p = ['run-ios', '--project-path', appPath, '--simulator', target, '--scheme', scheme, '--configuration', runScheme];
    }

    logDebug('running', p);
    if (p) {
        if (bundleAssets) {
            packageBundleForXcode(c, platform, bundleIsDev)
                .then(v => executeAsync('react-native', p))
                .then(() => resolve())
                .catch(e => reject(e));
        } else {
            executeAsync('react-native', p)
                .then(() => resolve())
                .catch(e => reject(e));
        }
    } else {
        reject('Missing options for react-native command!');
    }
});

const archiveXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`archiveXcodeProject:${platform}`);

    const appFolderName = _getAppFolderName(c, platform);
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


    logDebug('running', p);

    logTask('archiveXcodeProject: STARTING xcodebuild ARCHIVE...');


    _workerTimer = setInterval(_archiveLogger, 30000);

    if (c.files.appConfigFile.platforms[platform].runScheme === 'Release') {
        packageBundleForXcode(c, platform, bundleIsDev)
            .then(() => executeAsync('xcodebuild', p))
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
        executeAsync('xcodebuild', p)
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

    executeAsync('xcodebuild', p)
        .then(() => {
            logSuccess(`Your IPA is located in ${chalk.white(exportPath)} .`);
            resolve();
        })
        .catch(e => reject(e));
});

const packageBundleForXcode = (c, platform, isDev = false) => {
    logTask(`packageBundleForXcode:${platform}`);
    const appFolderName = _getAppFolderName(c, platform);

    return executeAsync('react-native', [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.appId}_${platform}`,
        '--entry-file',
        `${c.files.appConfigFile.platforms[platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, platform)}/main.jsbundle`,
    ]);
};

const _getAppFolderName = (c, platform) => {
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

//
//
//
//
//
//
//

const configureXcodeProject = (c, platform, ip, port) => new Promise((resolve, reject) => {
    createPlatformBuild(c, platform)
        .then(() => copyAppleAssets(c, platform, appFolderName))
        .then(() => copyAppleAssets(c, platform, appFolderName))
        .then(() => copyBuildsFolder(c, platform))
        .then(() => {
            parsePlugins(c, platform, (plugin, pluginPlat, key) => {
                _injectPlugin(c, pluginPlat, key, pluginPlat.package, pluginConfig);
            });
            parseAppDelegateSync(c, platform, appFolder, appFolderName, isBundled, ip, port);
            parseExportOptionsPlistSync(c, platform);
            parseXcschemeSync(c, platform);
            parsePodFileSync(c, platform);
            parseEntitlementsPlistSync(c, platform);
            parseInfoPlistSync(c, platform, embeddedFonts);
            return Promise.resolve();
        })
        .then(() => runPod(c.program.update ? 'update' : 'install', getAppFolder(c, platform), true))


        .then(() => parseXcodeProject())
        .then(() => resolve())
        .catch(e => reject(e));
});


const prepareXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    const { device } = c.program;
    const ip = device ? getIP() : 'localhost';
    const appFolder = getAppFolder(c, platform);
    const appFolderName = _getAppFolderName(c, platform);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    // CHECK TEAM ID IF DEVICE
    const tId = getConfigProp(c, platform, 'teamID');
    if (device && (!tId || tId === '')) {
        logError(
            `Looks like you're missing teamID in your ${chalk.white(
                c.paths.appConfigPath,
            )} => .platforms.${platform}.teamID . you will not be able to build ${platform} app for device!`,
        );
        // resolve();
        // return;
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
        // configureXcodeProject(c, platform)
        // INJECTORS
        c.pluginConfigiOS = {
            podfileInject: '',
            exportOptions: ''
        };
        _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip)
            .then(() => resolve(c))
            .catch(e => reject(e));
    }
});

const configureXcodeProjectOLD = (c, platform, ip, port) => new Promise((resolve, reject) => {
    logTask('configureXcodeProject');
    if (process.platform !== 'darwin') return;
    if (!isPlatformActive(c, platform, resolve)) return;

    // INJECTORS
    c.pluginConfigiOS = {
        podfileInject: '',
        exportOptions: ''
    };

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
                logWarning(`Looks like pod install is not enough! Let's try pod update! Error: ${e}`);
                _preConfigureProject(c, platform, appFolderName, ip, port)
                    .then(() => runPod('update', getAppFolder(c, platform)))
                    .then(() => resolve())
                    .catch(err => reject(err));
            } else {
                reject(e);
            }
        });
});


const _postConfigureProject = (c, platform, appFolder, appFolderName, isBundled = false, ip = 'localhost', port = 8081) => new Promise((resolve) => {
    logTask(`_postConfigureProject:${platform}:${ip}:${port}`);


    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        _injectPlugin(c, pluginPlat, key, pluginPlat.package, pluginConfig);
    });

    parseAppDelegateSync(c, platform, appFolder, appFolderName, isBundled, ip, port);

    parseExportOptions();

    parseXcschemeSync();


    parseXcodeProject2();
});

const _preConfigureProject = (c, platform, appFolderName, ip = 'localhost', port = 8081) => new Promise((resolve, reject) => {
    logTask(`_preConfigureProject:${platform}:${appFolderName}:${ip}:${port}`);

    const appFolder = getAppFolder(c, platform);
    const tId = getConfigProp(c, platform, 'teamID');


    // ASSETS
    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));


    parseXcodeProject()
        .then(() => {
            parsePodFileSync(c, platform);
            parseEntitlementsPlistSync(c, platform);
            parseInfoPlistSync(c, platform, embeddedFonts);
        }).catch(e => reject(e));
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
    prepareXcodeProject,
};
