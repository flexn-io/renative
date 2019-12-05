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
    getAppFolder,
    isPlatformActive,
    getConfigProp,
    getIP,
    logSuccess,
    generateChecksum
} from '../../common';
import { copyAssetsFolder, copyBuildsFolder, parseFonts } from '../../projectTools/projectParser';
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
import { logInfo, logTask,
    logError,
    logWarning, logDebug } from '../../systemTools/logger';

const checkIfCommandExists = command => new Promise((resolve, reject) => child_process.exec(`command -v ${command} 2>/dev/null`, (error) => {
    if (error) return reject(new Error(`${command} not installed`));
    return resolve(true);
}));

const checkIfPodsIsRequired = async (c) => {
    const appFolder = getAppFolder(c, c.platform);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    if (!fs.existsSync(podChecksumPath)) return true;
    const podChecksum = fs.readFileSync(podChecksumPath).toString();
    const podContentChecksum = generateChecksum(fs.readFileSync(path.join(appFolder, 'Podfile')).toString());

    if (podChecksum !== podContentChecksum) {
        logDebug('runPod:isMandatory');
        return true;
    }
    logInfo('Pods do not seem like they need to be updated. If you want to update them manually run the same command with "-u" parameter');
    return false;
};

const updatePodsChecksum = (c) => {
    const appFolder = getAppFolder(c, c.platform);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    const podContentChecksum = generateChecksum(fs.readFileSync(path.join(appFolder, 'Podfile')).toString());
    if (fs.existsSync(podChecksumPath)) {
        const existingContent = fs.readFileSync(podChecksumPath).toString();
        if (existingContent !== podContentChecksum) {
            logDebug(`runPod:updateChecksum:${podContentChecksum}`);
            return fs.writeFileSync(podChecksumPath, podContentChecksum);
        }
        return true;
    }
    logDebug(`runPod:updateChecksum:${podContentChecksum}`);
    return fs.writeFileSync(podChecksumPath, podContentChecksum);
};

const runPod = async (c, command, cwd, rejectOnFail = false) => {
    logTask(`runPod:${command}:${rejectOnFail}`);

    if (!fs.existsSync(cwd)) {
        if (rejectOnFail) return Promise.reject(`Location ${cwd} does not exists!`);
        logError(`Location ${cwd} does not exists!`);
        return true;
    }
    const podsRequired = command === 'install' || await checkIfPodsIsRequired(c);

    if (podsRequired) {
        await checkIfCommandExists('pod');
        return executeAsync(c, `pod ${command}`, {
            cwd,
            evn: process.env,
        })
            .then(() => updatePodsChecksum(c))
            .catch((e) => {
                if (rejectOnFail) {
                    logWarning(e);
                    return Promise.reject(e);
                }
                logError(e);
                return true;
            });
    }
};

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
        const devicesArr = await getAppleDevices(c, platform, false, true);
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
        // if (allowProvisioningUpdates) p.push('--allowProvisioningUpdates');

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

const composeXcodeArgsFromCLI = (string) => {
    const spacesReplaced = string.replace(/\s(?=(?:[^'"`]*(['"`])[^'"`]*\1)*[^'"`]*$)/g, '&&&'); // replaces spaces outside quotes with &&& for easy split
    const keysAndValues = spacesReplaced.split('&&&');
    const unescapedValues = keysAndValues.map(s => s.replace(/\'/g, '').replace(/"/g, '').replace(/\\/g, '')); // removes all quotes or backslashes

    return unescapedValues;
};

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
    let ps = '';
    if (c.program.xcodebuildArchiveArgs) {
        ps = c.program.xcodebuildArchiveArgs;
    }
    const p = [];

    if (!ps.includes('-workspace')) {
        p.push('-workspace');
        p.push(`${appPath}/${appFolderName}.xcworkspace`);
    }
    if (!ps.includes('-scheme')) {
        p.push('-scheme');
        p.push(scheme);
    }
    if (!ps.includes('-sdk')) {
        p.push('-sdk');
        p.push(...sdkArr);
    }
    if (!ps.includes('-configuration')) {
        p.push('-configuration');
        p.push(runScheme);
    }
    p.push('archive');
    if (!ps.includes('-archivePath')) {
        p.push('-archivePath');
        p.push(exportPathArchive);
    }

    if (allowProvisioningUpdates && !ps.includes('-allowProvisioningUpdates')) p.push('-allowProvisioningUpdates');
    if (ignoreLogs && !ps.includes('-quiet')) p.push('-quiet');
    // if (sdk === 'iphonesimulator') p.push('ONLY_ACTIVE_ARCH=NO', "-destination='name=iPhone 7,OS=10.2'");


    logTask('archiveXcodeProject: STARTING xcodebuild ARCHIVE...');

    if (c.buildConfig.platforms[platform].runScheme === 'Release') {
        return packageBundleForXcode(c, platform, bundleIsDev)
            .then(() => executeAsync(c, `xcodebuild ${ps} ${p.join(' ')}`))
            .then(() => {
                logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
            });
    }

    const args = ps !== '' ? [...composeXcodeArgsFromCLI(ps), ...p] : p;

    logDebug('xcodebuild args', args);

    return executeAsync('xcodebuild', { rawCommand: { args } })
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

    let ps = '';
    if (c.program.xcodebuildExportArgs) {
        ps = c.program.xcodebuildExportArgs;
    }
    const p = ['-exportArchive'];

    if (!ps.includes('-archivePath')) {
        p.push(`-archivePath ${exportPath}/${scheme}.xcarchive`);
    }
    if (!ps.includes('-exportOptionsPlist')) {
        p.push(`-exportOptionsPlist ${appPath}/exportOptions.plist`);
    }
    if (!ps.includes('-exportPath')) {
        p.push(`-exportPath ${exportPath}`);
    }

    if (allowProvisioningUpdates && !ps.includes('-allowProvisioningUpdates')) p.push('-allowProvisioningUpdates');
    if (ignoreLogs && !ps.includes('-quiet')) p.push('-quiet');

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
    logTask('runAppleLog');
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
                applicationDidBecomeActive: [],
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
    parseFonts(c, (font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];
            const { includedFonts } = c.buildConfig.common;
            if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
                const fontSource = path.join(dir, font);
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
    const forceUpdate = fs.existsSync(path.join(appFolder, 'Podfile.lock')) || c.program.update;
    copyAssetsFolder(c, platform)
        .then(() => copyAppleAssets(c, platform, appFolderName))
        .then(() => parseAppDelegate(c, platform, appFolder, appFolderName, bundleAssets, bundlerIp, port))
        .then(() => parseExportOptionsPlist(c, platform))
        .then(() => parseXcscheme(c, platform))
        .then(() => parsePodFile(c, platform))
        .then(() => parseEntitlementsPlist(c, platform))
        .then(() => parseInfoPlist(c, platform))
        .then(() => copyBuildsFolder(c, platform))
        .then(() => {
            runPod(c, forceUpdate ? 'update' : 'install', getAppFolder(c, platform), true)
                .then(() => parseXcodeProject(c, platform))
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                    if (!c.program.update) {
                        if (e && e.toString) {
                            const s = e.toString();
                            if (
                                s.includes('No provisionProfileSpecifier configured')
                              || s.includes('TypeError:')
                              || s.includes('ReferenceError:')
                              || s.includes('find gem cocoapods')
                            ) {
                                reject(e);
                            }
                        } else {
                            logWarning(`Looks like pod install is not enough! Let's try pod update! Error: ${e}`);
                            runPod(c, 'update', getAppFolder(c, platform), true)
                                .then(() => parseXcodeProject(c, platform))
                                .then(() => resolve())
                                .catch(err => reject(err));
                        }
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
