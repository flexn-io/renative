/* eslint-disable import/no-cycle */
// @todo fix circular dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';
import inquirer from 'inquirer';

import { executeAsync, commandExistsSync } from '../../systemTools/exec';
import { getAppleDevices } from './deviceManager';
import { registerDevice } from './fastlane';
import {
    getAppFolder,
    getConfigProp,
    getIP,
    generateChecksum
} from '../../common';
import { isPlatformActive } from '..';
import { copyAssetsFolder, copyBuildsFolder, parseFonts } from '../../projectTools/projectParser';
import { copyFileSync, mkdirSync, writeFileSync } from '../../systemTools/fileutils';
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
    logWarning, logDebug, logSuccess } from '../../systemTools/logger';

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
    logTask('updatePodsChecksum');
    const appFolder = getAppFolder(c, c.platform);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    const podContentChecksum = generateChecksum(fs.readFileSync(path.join(appFolder, 'Podfile')).toString());
    if (fs.existsSync(podChecksumPath)) {
        const existingContent = fs.readFileSync(podChecksumPath).toString();
        if (existingContent !== podContentChecksum) {
            logDebug(`updatePodsChecksum:${podContentChecksum}`);
            return fs.writeFileSync(podChecksumPath, podContentChecksum);
        }
        return true;
    }
    logDebug(`updatePodsChecksum:${podContentChecksum}`);
    return fs.writeFileSync(podChecksumPath, podContentChecksum);
};

const runPod = async (c, platform) => {
    logTask(`runPod:${platform}`);

    const appFolder = getAppFolder(c, platform);

    if (!fs.existsSync(appFolder)) {
        return Promise.reject(`Location ${appFolder} does not exists!`);
    }
    const podsRequired = c.program.updatePods || await checkIfPodsIsRequired(c);

    if (podsRequired) {
        if (!commandExistsSync('pod')) throw new Error('Cocoapods not installed. Please run `sudo gem install cocoapods`');

        try {
            await executeAsync(c, 'pod install', {
                cwd: appFolder,
                env: process.env,
            });
        } catch (e) {
            const s = e?.toString ? e.toString() : '';
            const isGenericError = s.includes('No provisionProfileSpecifier configured') || s.includes('TypeError:') || s.includes('ReferenceError:') || s.includes('find gem cocoapods');
            if (isGenericError) return new Error(`pod install failed with:\n ${s}`);
            logWarning(`Looks like pod install is not enough! Let's try pod update! Error:\n ${s}`);
            return executeAsync(c, 'pod update', { cwd: appFolder, env: process.env })
                .then(() => updatePodsChecksum(c))
                .catch(er => Promise.reject(er));
        }

        updatePodsChecksum(c);
        return true;
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

export const runXcodeProject = async (c) => {
    logTask(`runXcodeProject:${c.platform}:${c.runtime.target}`);

    const appPath = getAppFolder(c, c.platform);
    const { device } = c.program;
    const scheme = getConfigProp(c, c.platform, 'scheme');
    const runScheme = getConfigProp(c, c.platform, 'runScheme');
    const bundleIsDev = getConfigProp(c, c.platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets') === true;
    let p;

    if (!scheme) {
        return Promise.reject(
            `You missing scheme in platforms.${chalk.yellow(c.platform)} in your ${chalk.white(
                c.paths.appConfig.config,
            )}! Check example config for more info:  ${chalk.grey(
                'https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/renative.json',
            )} `,
        );
    }

    let devicesArr;
    if (device === true) devicesArr = await getAppleDevices(c, c.platform, false, true);
    else if (c.runtime.target === true) devicesArr = await getAppleDevices(c, c.platform, true, false);

    if (device === true) {
        if (devicesArr.length === 1) {
            logSuccess(`Found one device connected! device name: ${chalk.white(devicesArr[0].name)} udid: ${chalk.white(devicesArr[0].udid)}`);
            if (devicesArr[0].udid) {
                p = `--device --udid ${devicesArr[0].udid}`;
                c.runtime.targetUDID = devicesArr[0].udid;
            } else {
                p = `--device ${devicesArr[0].name}`;
            }
        } else if (devicesArr.length > 1) {
            const run = (selectedDevice) => {
                logDebug(`Selected device: ${JSON.stringify(selectedDevice, null, 3)}`);
                c.runtime.targetUDID = selectedDevice.udid;
                if (selectedDevice.udid) {
                    p = `--device --udid ${selectedDevice.udid}`;
                } else {
                    p = `--device ${selectedDevice.name}`;
                }

                logDebug(`RN params: ${p}`);

                if (bundleAssets) {
                    logDebug('Assets will be bundled');
                    return packageBundleForXcode(c, c.platform, bundleIsDev).then(() => _checkLockAndExec(c, appPath, scheme, runScheme, p));
                }
                return _checkLockAndExec(c, appPath, scheme, runScheme, p);
            };

            if (c.runtime.target !== true) {
                const selectedDevice = devicesArr.find(d => d.name === c.runtime.target);
                if (selectedDevice) {
                    return run(selectedDevice);
                }
                logWarning(`Could not find device ${c.runtime.target}`);
            }

            const devices = devicesArr.map(v => ({ name: `${v.name} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.grey(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}`, value: v }));

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
            return Promise.reject(`No ${c.platform} devices connected!`);
        }
    } else if (device) {
        p = `--device ${device}`;
    } else if (c.runtime.target === true) {
        const devices = devicesArr.map(v => ({ name: `${v.name} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.grey(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}`, value: v }));

        const { sim } = await inquirer.prompt({
            name: 'sim',
            message: 'Select the device you want to launch on',
            type: 'list',
            choices: devices
        });
        c.runtime.target = sim.name;
        p = `--simulator ${c.runtime.target.replace(/(\s+)/g, '\\$1')}`;
    } else {
        p = `--simulator ${c.runtime.target.replace(/(\s+)/g, '\\$1')}`;
    }

    if (p) {
        const allowProvisioningUpdates = getConfigProp(c, c.platform, 'allowProvisioningUpdates', true);
        // if (allowProvisioningUpdates) p.push('--allowProvisioningUpdates');

        if (bundleAssets) {
            return packageBundleForXcode(c, c.platform, bundleIsDev).then(() => _checkLockAndExec(c, appPath, scheme, runScheme, p));
        }
        return _checkLockAndExec(c, appPath, scheme, runScheme, p);
    }
    return Promise.reject('Missing options for react-native command!');
};

const _checkLockAndExec = async (c, appPath, scheme, runScheme, p) => {
    logTask(`_checkLockAndExec:${scheme}:${runScheme}`);
    const cmd = `react-native run-ios --project-path ${appPath} --scheme ${scheme} --configuration ${runScheme} ${p}`;
    try {
        await executeAsync(c, cmd);
        return true;
    } catch (e) {
        const isDeviceLocked = e.includes('ERROR:DEVICE_LOCKED');
        if (isDeviceLocked) {
            await inquirer.prompt({ message: 'Unlock your device and press ENTER', type: 'confirm', name: 'confirm' });
            return executeAsync(c, cmd);
        }
        const isDeviceNotRegistered = e.includes("doesn't include the currently selected device");
        if (isDeviceNotRegistered) {
            logError(e);
            logWarning(`${c.platform} DEVICE: ${chalk.white(c.runtime.target)} with UDID: ${chalk.white(c.runtime.targetUDID)} is not included in your provisionong profile in TEAM: ${chalk.white(getConfigProp(c, c.platform, 'teamID'))}`);
            const { confirm } = await inquirer.prompt({
                name: 'confirm',
                message: 'Do you want to register it?',
                type: 'confirm'
            });
            if (confirm) {
                await registerDevice(c);
                return Promise.reject('Updated. Re-run your last command');
                // TODO: Tot picking up if re-run from here. forcing users to do it themselves for now
                // await configureXcodeProject(c, c.platform);
                // return runXcodeProject(c);
            }
        }
        const isDevelopmentTeamMissing = e.includes('requires a development team. Select a development team');
        if (isDevelopmentTeamMissing) {
            const loc = `./appConfigs/${c.runtime.appId}/renative.json:{ "platforms": { "${c.platform}": { "teamID": "....."`;
            logError(e);
            logWarning(`You need specify the development team if you want to run app on ${c.platform} device. this can be set manually in ${chalk.white(loc)}
You can find correct teamID in the URL of your apple developer account: ${chalk.white('https://developer.apple.com/account/#/overview/YOUR-TEAM-ID')}`);
            const { confirm } = await inquirer.prompt({
                name: 'confirm',
                message: `Type in your Apple Team ID to be used (will be saved to ${c.paths.appConfig?.config})`,
                type: 'input'
            });
            if (confirm) {
                await _setDevelopmentTeam(c, confirm);
                return Promise.reject('Updated. Re-run your last command');
                // TODO: Tot picking up if re-run from here. forcing users to do it themselves for now
                // await configureXcodeProject(c, c.platform);
                // return runXcodeProject(c);
            }
        }
        const isAutomaticSigningDisabled = e.includes('Automatic signing is disabled and unable to generate a profile');
        if (isAutomaticSigningDisabled) {
            return _handleProvisioningIssues(c, e, 'Your iOS App Development provisioning profiles don\'t match. under manual signing mode');
        }
        const isProvisioningMissing = e.includes('requires a provisioning profile');
        if (isProvisioningMissing) {
            return _handleProvisioningIssues(c, e, 'Your iOS App requires a provisioning profile');
        }
        return Promise.reject(e);
    }
};

const _handleProvisioningIssues = async (c, e, msg) => {
    const provisioningStyle = getConfigProp(c, c.platform, 'provisioningStyle');
    // Sometimes xcodebuild reports Automatic signing is disabled but it could be keychain not accepted by user
    const isProvAutomatic = provisioningStyle === 'Automatic';
    const proAutoText = isProvAutomatic ? '' : `${chalk.white('[4]>')} Switch to automatic signing for appId: ${c.runtime.appId} , platform: ${c.platform}, scheme: ${c.runtime.scheme}`;
    const fixCommand = `rnv crypto updateProfile -p ${c.platform} -s ${c.runtime.scheme}`;
    const workspacePath = chalk.white(`${getAppFolder(c, c.platform)}/RNVApp.xcworkspace`);
    logError(e);
    logWarning(`${msg}. To fix try:
${chalk.white('[1]>')} Configure your certificates, provisioning profiles correctly manually
${chalk.white('[2]>')} Try to generate matching profiles with ${chalk.white(fixCommand)} (you need correct priviledges in apple developer portal)
${chalk.white('[3]>')} Open generated project in Xcode: ${workspacePath} and debug from there (Sometimes this helps for the first-time builds)
${proAutoText}`);
    if (isProvAutomatic) return false;
    const { confirmAuto } = await inquirer.prompt({
        name: 'confirmAuto',
        message: 'Switch to automatic signing?',
        type: 'confirm'
    });
    if (confirmAuto) {
        await _setAutomaticSigning(c);
        return Promise.reject('Updated. Re-run your last command');
        // TODO: Tot picking up if re-run from here. forcing users to do it themselves for now
        // await configureXcodeProject(c, c.platform);
        // return runXcodeProject(c);
    }
};

const _setAutomaticSigning = async (c) => {
    logTask(`_setAutomaticSigning:${c.platform}`);

    const scheme = c.files.appConfig?.config?.platforms?.[c.platform]?.buildSchemes?.[c.runtime.scheme];
    if (scheme) {
        scheme.provisioningStyle = 'Automatic';
        writeFileSync(c.paths.appConfig.config, c.files.appConfig.config);
        logSuccess(`Succesfully updated ${c.paths.appConfig.config}`);
    } else {
        return Promise.reject(`Failed to update ${c.paths.appConfig?.config}."platforms": { "${c.platform}": { buildSchemes: { "${c.runtime.scheme}" ... Object is null. Try update file manually`);
    }
};

const _setDevelopmentTeam = async (c, teamID) => {
    logTask(`_setDevelopmentTeam:${teamID}`);

    const plat = c.files.appConfig?.config?.platforms?.[c.platform];
    if (plat) {
        plat.teamID = teamID;
        writeFileSync(c.paths.appConfig.config, c.files.appConfig.config);
        logSuccess(`Succesfully updated ${c.paths.appConfig.config}`);
    } else {
        return Promise.reject(`Failed to update ${c.paths.appConfig?.config}."platforms": { "${c.platform}" ... Object is null. Try update file manually`);
    }
};

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

const configureXcodeProject = async (c, platform, ip, port) => {
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

    await copyAssetsFolder(c, platform);
    await copyAppleAssets(c, platform, appFolderName);
    await parseAppDelegate(c, platform, appFolder, appFolderName, bundleAssets, bundlerIp, port);
    await parseExportOptionsPlist(c, platform);
    await parseXcscheme(c, platform);
    await parsePodFile(c, platform);
    await parseEntitlementsPlist(c, platform);
    await parseInfoPlist(c, platform);
    await copyBuildsFolder(c, platform);
    await runPod(c, platform);
    await parseXcodeProject(c, platform);
    return true;
};

export {
    runPod,
    copyAppleAssets,
    configureXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    runAppleLog,
};
