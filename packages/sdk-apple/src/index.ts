import child_process, { ExecFileOptions } from 'child_process';
import crypto from 'crypto';
import inquirer from 'inquirer';
import path from 'path';
import {
    AppleDevice,
    Common,
    Constants,
    EngineManager,
    Exec,
    FileUtils,
    Logger,
    PlatformManager,
    ProjectManager,
    Resolver,
    SDKManager,
} from 'rnv';
import { getAppFolderName } from './common';
import { registerDevice, updateProfile } from './fastlane';
import { parseEntitlementsPlist, parseExportOptionsPlist, parseInfoPlist } from './plistParser';
import { parsePodFile } from './podfileParser';
// import { parseAppDelegate } from './swiftParser';
import { parseXcodeProject } from './xcodeParser';
import { parseXcscheme } from './xcschemeParser';
import { ejectXcodeProject } from './ejector';
import { Context } from './types';
import { ObjectEncodingOptions } from 'fs';
import shellQuote from 'shell-quote';

const { getAppleDevices, launchAppleSimulator } = SDKManager.Apple;

const { fsExistsSync, mkdirSync, writeFileSync, fsWriteFileSync, fsReadFileSync, copyFileSync } = FileUtils;
const { executeAsync, commandExistsSync } = Exec;
const { getAppFolder, getConfigProp } = Common;
const { generateEnvVars } = EngineManager;
const { doResolve } = Resolver;
const { isPlatformActive } = PlatformManager;
const { copyAssetsFolder, copyBuildsFolder, parseFonts } = ProjectManager;

const { IOS, MACOS, TVOS } = Constants;
const { chalk, logInfo, logTask, logError, logWarning, logDebug, logSuccess, logRaw } = Logger;

export const generateChecksum = (str: string, algorithm?: string, encoding?: 'base64' | 'base64url' | 'hex') =>
    crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');

const checkIfPodsIsRequired = async (c: Context) => {
    const appFolder = getAppFolder(c);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    if (!fsExistsSync(podChecksumPath)) return true;
    const podChecksum = fsReadFileSync(podChecksumPath).toString();
    const podContentChecksum = generateChecksum(fsReadFileSync(path.join(appFolder, 'Podfile')).toString());

    if (podChecksum !== podContentChecksum) {
        logDebug('runCocoaPods:isMandatory');
        return true;
    }
    logInfo(
        'Pods do not seem like they need to be updated. If you want to update them manually run the same command with "-u" parameter'
    );
    return false;
};

const updatePodsChecksum = (c: Context) => {
    logTask('updatePodsChecksum');
    const appFolder = getAppFolder(c);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    const podContentChecksum = generateChecksum(fsReadFileSync(path.join(appFolder, 'Podfile')).toString());
    if (fsExistsSync(podChecksumPath)) {
        const existingContent = fsReadFileSync(podChecksumPath).toString();
        if (existingContent !== podContentChecksum) {
            logDebug(`updatePodsChecksum:${podContentChecksum}`);
            return fsWriteFileSync(podChecksumPath, podContentChecksum);
        }
        return true;
    }
    logDebug(`updatePodsChecksum:${podContentChecksum}`);
    return fsWriteFileSync(podChecksumPath, podContentChecksum);
};

const runCocoaPods = async (c: Context) => {
    logTask('runCocoaPods', `forceUpdate:${!!c.program.updatePods}`);

    if (c.runtime._skipNativeDepResolutions) return;

    const appFolder = getAppFolder(c);

    if (!fsExistsSync(appFolder)) {
        return Promise.reject(`Location ${appFolder} does not exists!`);
    }
    const podsRequired = c.program.updatePods || (await checkIfPodsIsRequired(c));

    if (podsRequired) {
        if (!commandExistsSync('pod')) {
            throw new Error('Cocoapods not installed. Please run `sudo gem install cocoapods`');
        }

        try {
            await executeAsync(c, 'bundle install', {
                env: process.env,
            });
            await executeAsync(c, 'bundle exec pod install', {
                cwd: appFolder,
                env: {
                    ...process.env,
                    RCT_NEW_ARCH_ENABLED: 1,
                }
            });
        } catch (e: Error | any) {
            const s = e?.toString ? e.toString() : '';
            const isGenericError =
                s.includes('No provisionProfileSpecifier configured') ||
                s.includes('TypeError:') ||
                s.includes('ReferenceError:') ||
                s.includes('find gem cocoapods');
            if (isGenericError) {
                return new Error(`pod install failed with:\n ${s}`);
            }
            logWarning(`pod install is not enough! Let's try pod update! Error:\n ${s}`);
            await executeAsync(c, 'bundle update', {
                env: process.env,
            });

            return executeAsync(c, 'RCT_NEW_ARCH_ENABLED=1 bundle exec pod update', {
                cwd: appFolder,
                env: {
                    ...process.env,
                    RCT_NEW_ARCH_ENABLED: 1,
                }
            })
                .then(() => updatePodsChecksum(c))
                .catch((er) => Promise.reject(er));
        }

        updatePodsChecksum(c);
        return true;
    }
};

const copyAppleAssets = (c: Context, platform: string, appFolderName: string) =>
    new Promise<void>((resolve) => {
        logTask('copyAppleAssets');
        if (!isPlatformActive(c, platform, resolve)) return;

        const appFolder = getAppFolder(c);

        // ASSETS
        fsWriteFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
        mkdirSync(path.join(appFolder, 'assets'));
        mkdirSync(path.join(appFolder, `${appFolderName}/images`));

        resolve();
    });

export const runXcodeProject = async (c: Context) => {
    logTask('runXcodeProject', `target:${c.runtime.target}`);

    const appPath = getAppFolder(c);
    const { device } = c.program;
    const appFolderName = getAppFolderName(c, c.platform);
    const runScheme = getConfigProp(c, c.platform, 'runScheme');
    const bundleIsDev = getConfigProp(c, c.platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets') === true;
    let p: string | undefined;

    let devicesArr: AppleDevice[] = [];
    if (device === true) {
        devicesArr = await getAppleDevices(c, false, true);
    } else if (c.runtime.target) {
        devicesArr = await getAppleDevices(c, true, false);
    }

    if (device === true) {
        if (devicesArr.length === 1) {
            logSuccess(
                `Found one device connected! device name: ${chalk().white(devicesArr[0].name)} udid: ${chalk().white(
                    devicesArr[0].udid
                )}`
            );
            if (devicesArr[0].udid) {
                p = `--udid ${devicesArr[0].udid}`;
                c.runtime.targetUDID = devicesArr[0].udid;
            } else {
                p = `--device ${devicesArr[0].name}`;
            }
        } else if (devicesArr.length > 1) {
            const run = (selectedDevice: AppleDevice) => {
                logDebug(`Selected device: ${JSON.stringify(selectedDevice, null, 3)}`);
                c.runtime.targetUDID = selectedDevice.udid;
                if (selectedDevice.udid) {
                    p = `--udid ${selectedDevice.udid}`;
                } else {
                    p = `--device ${selectedDevice.name}`;
                }

                logDebug(`RN params: ${p}`);

                if (bundleAssets) {
                    logDebug('Assets will be bundled');
                    return packageBundleForXcode(c, bundleIsDev).then(() =>
                        _checkLockAndExec(c, appPath, appFolderName, runScheme, p)
                    );
                }
                return _checkLockAndExec(c, appPath, appFolderName, runScheme, p);
            };

            if (c.runtime.target) {
                const selectedDevice = devicesArr.find((d) => d.name === c.runtime.target);
                if (selectedDevice) {
                    return run(selectedDevice);
                }
                logWarning(`Could not find device ${c.runtime.target}`);
            }

            const devices = devicesArr.map((v) => ({
                name: `${v.name} | ${v.icon} | v: ${chalk().green(v.version)} | udid: ${chalk().grey(v.udid)}${
                    v.isDevice ? chalk().red(' (device)') : ''
                }`,
                value: v,
            }));

            const { sim } = await inquirer.prompt({
                name: 'sim',
                message: 'Select the device you want to launch on',
                type: 'list',
                choices: devices,
            });

            if (sim) {
                return run(sim);
            }
        } else {
            return Promise.reject(`No ${c.platform} devices connected!`);
        }
    } else if (device) {
        p = `--device ${device}`;
    } else if (c.runtime.isTargetTrue) {
        const devices = devicesArr.map((v) => ({
            name: `${v.name} | ${v.icon} | v: ${chalk().green(v.version)} | udid: ${chalk().grey(v.udid)}${
                v.isDevice ? chalk().red(' (device)') : ''
            }`,
            value: v,
        }));

        const { sim } = await inquirer.prompt({
            name: 'sim',
            message: 'Select the device you want to launch on',
            type: 'list',
            choices: devices,
        });
        c.runtime.target = sim.name;
        if (c.runtime.target) {
            p = `--simulator ${c.runtime.target.replace(/(\s+)/g, '\\$1')}`;
        }
    } else if (c.runtime.target) {
        // check if the default sim is available
        const desiredSim = devicesArr.find((d) => d.name === c.runtime.target && !d.isDevice);
        if (!desiredSim) {
            const { sim } = await inquirer.prompt({
                name: 'sim',
                message: `We couldn't find ${c.runtime.target} as a device supported by the current version of your Xcode. Please select another sim`,
                type: 'list',
                choices: devicesArr
                    .filter((d) => !d.isDevice)
                    .map((v) => ({
                        name: `${v.name} | ${v.icon} | v: ${chalk().green(v.version)} | udid: ${chalk().grey(v.udid)}${
                            v.isDevice ? chalk().red(' (device)') : ''
                        }`,
                        value: v,
                    })),
            });

            const localOverridden = !!c.files.project.configLocal?.defaultTargets?.[c.platform];

            const actionLocalUpdate = `Update ${chalk().green('project')} default target for platform ${c.platform}`;
            const actionGlobalUpdate = `Update ${chalk().green('global')}${
                localOverridden ? ` and ${chalk().green('project')}` : ''
            } default target for platform ${c.platform}`;
            const actionNoUpdate = "Don't update";

            const { chosenAction } = await inquirer.prompt({
                message: 'What to do next?',
                type: 'list',
                name: 'chosenAction',
                choices: [actionLocalUpdate, actionGlobalUpdate, actionNoUpdate],
                warningMessage: `Your default target for platform ${c.platform} is set to ${c.runtime.target}. This seems to not be supported by Xcode anymore`,
            });

            c.runtime.target = sim.name;

            if (chosenAction === actionLocalUpdate || (chosenAction === actionGlobalUpdate && localOverridden)) {
                const configLocal = c.files.project.configLocal || {};
                if (!configLocal.defaultTargets) configLocal.defaultTargets = {};
                configLocal.defaultTargets[c.platform] = sim.name;

                c.files.project.configLocal = configLocal;
                writeFileSync(c.paths.project.configLocal, configLocal);
            }

            if (chosenAction === actionGlobalUpdate) {
                const configGlobal = c.files.workspace.config || {};
                if (!configGlobal.defaultTargets) configGlobal.defaultTargets = {};
                configGlobal.defaultTargets[c.platform] = sim.name;

                c.files.workspace.config = configGlobal;
                writeFileSync(c.paths.workspace.config, configGlobal);
            }
        }

        const target = c.runtime.target.replace(/(\s+)/g, '\\$1');

        p = `--simulator ${target}`;
    }

    if (c.platform === MACOS) {
        if (bundleAssets) {
            await packageBundleForXcode(c, bundleIsDev);
        }

        try {
            await buildXcodeProject(c);
        } catch (e) {
            await _handleMissingTeam(c, e);
        }

        return executeAsync(
            c,
            `open ${path.join(appPath, `build/RNVApp/Build/Products/${runScheme}-maccatalyst/RNVApp.app`)}`
        );
    }
    await launchAppleSimulator(c, c.runtime.target);

    if (p) {
        const allowProvisioningUpdates = getConfigProp(c, c.platform, 'allowProvisioningUpdates', true);
        if (allowProvisioningUpdates) p = `${p} --allowProvisioningUpdates`;
        return _packageOrRun(c, bundleAssets, bundleIsDev, appPath, appFolderName, runScheme, p);
    }
    // return Promise.reject('Missing options for react-native command!');
};

const _packageOrRun = (
    c: Context,
    bundleAssets: boolean,
    bundleIsDev: boolean,
    appPath: string,
    scheme: string,
    runScheme: string,
    p: string
) => {
    if (bundleAssets) {
        return packageBundleForXcode(c, bundleIsDev).then(() => _checkLockAndExec(c, appPath, scheme, runScheme, p));
    }
    return _checkLockAndExec(c, appPath, scheme, runScheme, p);
};

// const _getReactNativeCli = () => {
//     const cli = doResolve('@react-native-community/cli');
//     return path.join(cli, 'build/bin.js');
// };

const _checkLockAndExec = async (c: Context, appPath: string, scheme: string, runScheme: string, p = '') => {
    logTask('_checkLockAndExec', `scheme:${scheme} runScheme:${runScheme} p:${p}`);
    const appFolderName = getAppFolderName(c, c.platform);

    // const cmd = `node ${doResolve(
    //     c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native'
    // )}/local-cli/cli.js run-ios --project-path ${appPath} --scheme ${scheme} --configuration ${runScheme} ${p}`;
    const cmd = `npx react-native run-ios --scheme=${scheme} --mode=${runScheme} --no-packager`;
    try {
        // Inherit full logs
        // return executeAsync(c, cmd, { stdio: 'inherit', silent: true });
        return executeAsync(c, cmd, {
            env: {
                RCT_METRO_PORT: c.runtime.port,
            },
        });
    } catch (e: any) {
        if (e && e.includes) {
            const isDeviceLocked = e.includes('ERROR:DEVICE_LOCKED');
            if (isDeviceLocked) {
                await inquirer.prompt({
                    message: 'Unlock your device and press ENTER',
                    type: 'confirm',
                    name: 'confirm',
                });
                return executeAsync(c, cmd, {
                    env: {
                        RCT_METRO_PORT: c.runtime.port,
                    },
                });
            }
            const isDeviceNotRegistered = e.includes("doesn't include the currently selected device");
            if (isDeviceNotRegistered) {
                logError(e);
                logWarning(
                    `${c.platform} DEVICE: ${chalk().white(c.runtime.target)} with UDID: ${chalk().white(
                        c.runtime.targetUDID
                    )} is not included in your provisionong profile in TEAM: ${chalk().white(
                        getConfigProp(c, c.platform, 'teamID')
                    )}`
                );
                const { confirm } = await inquirer.prompt({
                    name: 'confirm',
                    message: 'Do you want to register it?',
                    type: 'confirm',
                });
                if (confirm) {
                    await registerDevice(c);
                    return Promise.reject('Updated. Re-run your last command');
                    // TODO: Tot picking up if re-run from here. forcing users to do it themselves for now
                    // await configureXcodeProject(c, c.platform);
                    // return runXcodeProject(c);
                }
            }
            await _handleMissingTeam(c, e);
            const isAutomaticSigningDisabled = e.includes(
                'Automatic signing is disabled and unable to generate a profile'
            );
            if (isAutomaticSigningDisabled) {
                return _handleProvisioningIssues(
                    c,
                    e,
                    "Your iOS App Development provisioning profiles don't match. under manual signing mode"
                );
            }
            const isProvisioningMissing = e.includes('requires a provisioning profile');
            if (isProvisioningMissing) {
                return _handleProvisioningIssues(c, e, 'Your iOS App requires a provisioning profile');
            }
        }

        return Promise.reject(`${e}

${chalk().green('SUGGESTION:')}

${chalk().yellow('STEP 1:')}
Open xcode workspace at: ${chalk().white(`${appPath}/${appFolderName}.xcworkspace`)}

${chalk().yellow('STEP 2:')}
${chalk().white('Run app and observe any extra errors')}

${chalk().yellow('IF ALL HOPE IS LOST:')}
Raise new issue and copy this SUMMARY box output at:
${chalk().white('https://github.com/flexn-io/renative/issues')}
and we will try to help!

`);
    }
};

const _handleMissingTeam = async (c: Context, e: any) => {
    const isDevelopmentTeamMissing = e.includes('requires a development team. Select a development team');
    if (isDevelopmentTeamMissing) {
        const loc = `./appConfigs/${c.runtime.appId}/renative.json:{ "platforms": { "${c.platform}": { "teamID": "....."`;
        logError(e);
        logWarning(`You need specify the development team if you want to run app on ${
            c.platform
        } device. this can be set manually in ${chalk().white(loc)}
  You can find correct teamID in the URL of your apple developer account: ${chalk().white(
      'https://developer.apple.com/account/#/overview/YOUR-TEAM-ID'
  )}
Type in your Apple Team ID to be used (will be saved to ${c.paths.appConfig?.config})`);
        const { confirm } = await inquirer.prompt({
            name: 'confirm',
            message: 'Apple Team ID',
            type: 'input',
        });
        if (confirm) {
            await _setDevelopmentTeam(c, confirm);
            return Promise.reject('Updated. Re-run your last command');
            // TODO: Tot picking up if re-run from here. forcing users to do it themselves for now
            // await configureXcodeProject(c, c.platform);
            // return runXcodeProject(c);
        }
    }
};

const _handleProvisioningIssues = async (c: Context, e: any, msg: string) => {
    const provisioningStyle = getConfigProp(c, c.platform, 'provisioningStyle');
    const appFolderName = getAppFolderName(c, c.platform); // Sometimes xcodebuild reports Automatic signing is disabled but it could be keychain not accepted by user
    const isProvAutomatic = provisioningStyle === 'Automatic';
    const proAutoText = isProvAutomatic
        ? ''
        : `${chalk().white('[4]>')} Switch to automatic signing for appId: ${c.runtime.appId} , platform: ${
              c.platform
          }, scheme: ${c.runtime.scheme}`;
    const fixCommand = `rnv crypto updateProfile -p ${c.platform} -s ${c.runtime.scheme}`;
    const workspacePath = chalk().white(`${getAppFolder(c)}/${appFolderName}.xcworkspace`);
    logError(e);
    logWarning(`${msg}. To fix try:
${chalk().white('[1]>')} Configure your certificates, provisioning profiles correctly manually
${chalk().white('[2]>')} Try to generate matching profiles with ${chalk().white(
        fixCommand
    )} (you need correct priviledges in apple developer portal)
${chalk().white(
    '[3]>'
)} Open generated project in Xcode: ${workspacePath} and debug from there (Sometimes this helps for the first-time builds)
${proAutoText}`);
    if (isProvAutomatic) return false;
    const { confirmAuto } = await inquirer.prompt({
        name: 'confirmAuto',
        message: 'Switch to automatic signing?',
        type: 'confirm',
    });
    if (confirmAuto) {
        await _setAutomaticSigning(c);
        return Promise.reject('Updated. Re-run your last command');
        // TODO: Tot picking up if re-run from here. forcing users to do it themselves for now
        // await configureXcodeProject(c, c.platform);
        // return runXcodeProject(c);
    }
};

const _setAutomaticSigning = async (c: Context) => {
    logTask(`_setAutomaticSigning:${c.platform}`);

    const scheme = c.files.appConfig?.config?.platforms?.[c.platform]?.buildSchemes?.[c.runtime.scheme];
    if (scheme) {
        scheme.provisioningStyle = 'Automatic';
        writeFileSync(c.paths.appConfig.config, c.files.appConfig.config);
        logSuccess(`Succesfully updated ${c.paths.appConfig.config}`);
    } else {
        return Promise.reject(
            `Failed to update ${c.paths.appConfig?.config}."platforms": { "${c.platform}": { buildSchemes: { "${c.runtime.scheme}" ... Object is null. Try update file manually`
        );
    }
};

const _setDevelopmentTeam = async (c: Context, teamID: string) => {
    logTask(`_setDevelopmentTeam:${teamID}`);

    try {
        // initialize if it doesn't exist, assume everything is set up, if it throws yell
        if (!c.files.appConfig.config_original.platforms[c.platform]) {
            c.files.appConfig.config_original.platforms[c.platform] = {};
        }
        c.files.appConfig.config_original.platforms[c.platform].teamID = teamID;
    } catch (e) {
        return Promise.reject(
            `Failed to update ${c.paths.appConfig?.config}."platforms": { "${c.platform}" ... Object is null. Try update file manually`
        );
    }
    writeFileSync(c.paths.appConfig.config, c.files.appConfig.config_original);
    logSuccess(`Succesfully updated ${c.paths.appConfig.config}`);
};

const composeXcodeArgsFromCLI = (string: string) => {
    const spacesReplaced = string.replace(/\s(?=(?:[^'"`]*(['"`])[^'"`]*\1)*[^'"`]*$)/g, '&&&'); // replaces spaces outside quotes with &&& for easy split
    const keysAndValues = spacesReplaced.split('&&&');
    const unescapedValues = keysAndValues.map((s) => s.replace(/'/g, '').replace(/"/g, '').replace(/\\/g, '')); // removes all quotes or backslashes

    return unescapedValues;
};

export const buildXcodeProject = async (c: Context) => {
    logTask('buildXcodeProject');

    const { platform } = c;

    const appFolderName = getAppFolderName(c, platform);
    const runScheme = getConfigProp(c, platform, 'runScheme', 'Debug');

    let destinationPlatform = '';
    switch (c.platform) {
        case IOS: {
            if (c.program.device) {
                destinationPlatform = 'iOS';
            } else {
                destinationPlatform = 'iOS Simulator';
            }
            break;
        }
        case TVOS: {
            if (c.program.device) {
                destinationPlatform = 'tvOS';
            } else {
                destinationPlatform = 'tvOS Simulator';
            }
            break;
        }
        case MACOS: {
            destinationPlatform = 'macOS';
            break;
        }
        default:
            logError(`platform ${c.platform} not supported`);
    }

    const appPath = getAppFolder(c);
    const buildPath = path.join(appPath, `build/${appFolderName}`);
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    let ps = '';
    if (c.program.xcodebuildArgs) {
        ps = c.program.xcodebuildArgs;
    }
    const p = [];

    if (!ps.includes('-workspace')) {
        p.push('-workspace');
        p.push(`${appPath}/${appFolderName}.xcworkspace`);
    }
    if (!ps.includes('-scheme')) {
        p.push('-scheme');
        p.push(appFolderName);
    }
    if (!ps.includes('-configuration')) {
        p.push('-configuration');
        p.push(runScheme);
    }
    if (!ps.includes('-derivedDataPath')) {
        p.push('-derivedDataPath');
        p.push(buildPath);
    }
    // -arch / -sdk params are not compatible with -destination
    if (!ps.includes('-destination') && !ps.includes('-arch')) {
        p.push('-destination');
        if (platform === MACOS) {
            p.push(`platform=${destinationPlatform}`);
        } else {
            p.push(`platform=${destinationPlatform},name=${c.runtime.target}`);
        }
    }

    p.push('build');

    if (allowProvisioningUpdates && !ps.includes('-allowProvisioningUpdates')) {
        p.push('-allowProvisioningUpdates');
    }
    if (ignoreLogs && !ps.includes('-quiet')) p.push('-quiet');

    logTask('buildXcodeProject', 'STARTING xcodebuild BUILD...');

    // TODO: check if below code is still required
    // if (c.buildConfig.platforms[platform].runScheme === 'Release') {
    //     await executeAsync(c, `xcodebuild ${ps} ${p.join(' ')}`);
    //     logSuccess(
    //         `Your Build is located in ${chalk().cyan(buildPath)} .`
    //     );
    // }

    const args = ps !== '' ? [...composeXcodeArgsFromCLI(ps), ...p] : p;

    logDebug('xcodebuild args', args);

    return executeAsync('xcodebuild', { rawCommand: { args } }).then(() => {
        logSuccess(`Your Build is located in ${chalk().cyan(buildPath)} .`);
    });
};

const archiveXcodeProject = (c: Context) => {
    logTask('archiveXcodeProject');
    const { platform } = c;

    const appFolderName = getAppFolderName(c, c.platform);
    const runScheme = getConfigProp(c, platform, 'runScheme', 'Debug');
    let sdk = getConfigProp(c, platform, 'sdk');
    if (!sdk) {
        if (platform === IOS) sdk = 'iphoneos';
        // if (platform === MACOS) sdk = 'macosx';
    }
    const sdkArr = [];

    if (sdk) {
        sdkArr.push(sdk);
    }

    const appPath = getAppFolder(c);
    const exportPath = path.join(appPath, 'release');

    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    const exportPathArchive = `${exportPath}/${appFolderName}.xcarchive`;
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
        p.push(appFolderName);
    }
    if (!ps.includes('-sdk') && sdkArr.length) {
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

    if (allowProvisioningUpdates && !ps.includes('-allowProvisioningUpdates')) {
        p.push('-allowProvisioningUpdates');
    }
    if (ignoreLogs && !ps.includes('-quiet')) p.push('-quiet');
    // if (sdk === 'iphonesimulator') p.push('ONLY_ACTIVE_ARCH=NO', "-destination='name=iPhone 7,OS=10.2'");

    logTask('archiveXcodeProject', 'STARTING xcodebuild ARCHIVE...');

    const args = ps !== '' ? [...composeXcodeArgsFromCLI(ps), ...p] : p;

    logDebug('xcodebuild args', args);

    return executeAsync('xcodebuild', { rawCommand: { args } }).then(() => {
        logSuccess(`Your Archive is located in ${chalk().cyan(exportPath)} .`);
    });
};

const exportXcodeProject = async (c: Context) => {
    logTask('exportXcodeProject');

    const { platform } = c;

    await archiveXcodeProject(c);

    const appPath = getAppFolder(c);
    const exportPath = path.join(appPath, 'release');

    const appFolderName = getAppFolderName(c, c.platform);
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');

    let ps = '';
    if (c.program.xcodebuildExportArgs) {
        ps = c.program.xcodebuildExportArgs;
    }
    const p = ['-exportArchive'];

    if (!ps.includes('-archivePath')) {
        p.push(`-archivePath ${exportPath}/${appFolderName}.xcarchive`);
    }
    if (!ps.includes('-exportOptionsPlist')) {
        p.push(`-exportOptionsPlist ${appPath}/exportOptions.plist`);
    }
    if (!ps.includes('-exportPath')) {
        p.push(`-exportPath ${exportPath}`);
    }

    if (allowProvisioningUpdates && !ps.includes('-allowProvisioningUpdates')) {
        p.push('-allowProvisioningUpdates');
    }
    if (ignoreLogs && !ps.includes('-quiet')) p.push('-quiet');

    logDebug('running', p);

    logTask('exportXcodeProject', 'STARTING xcodebuild EXPORT...');

    return executeAsync(c, `xcodebuild ${p.join(' ')}`).then(() => {
        logSuccess(`Your IPA is located in ${chalk().cyan(exportPath)} .`);
    });
};

export const packageBundleForXcode = (c: Context, isDev = false) => {
    logTask('packageBundleForXcode');
    // const { maxErrorLength } = c.program;
    const args = [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`,
        '--entry-file',
        // SECURITY-PATCH https://github.com/flexn-io/renative/security/code-scanning/112
        shellQuote.quote([`${c.buildConfig.platforms?.[c.platform].entryFile}.js`]),
        '--bundle-output',
        `${getAppFolder(c)}/main.jsbundle`,
    ];

    if (getConfigProp(c, c.platform, 'enableSourceMaps', false)) {
        args.push('--sourcemap-output');
        args.push(`${getAppFolder(c)}/main.jsbundle.map`);
    }

    if (c.program.info) {
        args.push('--verbose');
    }

    return executeAsync(
        c,
        `node ${doResolve(
            c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native'
        )}/local-cli/cli.js ${args.join(' ')} --config=${
            c.runtime.runtimeExtraProps?.reactNativeMetroConfigName || 'metro.config.js'
        }`,
        { env: { ...generateEnvVars(c) } }
    );
};

// Resolve or reject will not be called so this will keep running
const runAppleLog = (c: Context) =>
    new Promise(() => {
        logTask('runAppleLog');
        const filter = c.program.filter || 'RNV';
        const opts: ObjectEncodingOptions & ExecFileOptions = {}; //{ stdio: 'inherit', customFds: [0, 1, 2] };
        const child = child_process.execFile(
            'xcrun',
            ['simctl', 'spawn', 'booted', 'log', 'stream', '--predicate', `eventMessage contains "${filter}"`],
            opts
        );
        // use event hooks to provide a callback to execute when data are available:
        if (child.stdout) {
            child.stdout.on('data', (data) => {
                const d = data.toString();
                if (d.toLowerCase().includes('error')) {
                    logRaw(chalk().red(d));
                } else if (d.toLowerCase().includes('success')) {
                    logRaw(chalk().green(d));
                } else {
                    logRaw(d);
                }
            });
        }
    });

const configureXcodeProject = async (c: Context) => {
    logTask('configureXcodeProject');

    const { device } = c.program;
    const { platform } = c;
    // const bundlerIp = device ? getIP() : 'localhost';
    const appFolder = getAppFolder(c);
    const appFolderName = getAppFolderName(c, platform);
    c.runtime.platformBuildsProjectPath = `${appFolder}/${appFolderName}.xcworkspace`;

    // const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    // INJECTORS
    c.payload.pluginConfigiOS = {
        podfileInject: '',
        podPostInstall: '',
        staticPodExtraConditions: '',
        staticFrameworks: [],
        staticPodDefinition: '',
        exportOptions: '',
        embeddedFonts: [],
        embeddedFontSources: [],
        ignoreProjectFonts: [],
        pluginAppDelegateImports: '',
        pluginAppDelegateMethods: '',
        pluginAppDelegateExtensions: '',
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
                didRegisterForRemoteNotificationsWithDeviceToken: [],
                continue: [],
                didConnectCarInterfaceController: [],
                didDisconnectCarInterfaceController: [],
            },
            userNotificationCenter: {
                willPresent: [],
            },
        },
        podfileSources: '',
        deploymentTarget: '',
    };

    // FONTS
    // parsePlugins(c, platform, (plugin, pluginPlat) => {
    //     // const ignoreProjectFonts = getFlavouredProp(
    //     //     c,
    //     //     pluginPlat,
    //     //     'ignoreProjectFonts'
    //     // );
    //
    //     // TODO: enable this once mmoved to modular_headers Podfile
    //     // if (ignoreProjectFonts) {
    //     //     ignoreProjectFonts.forEach((v) => {
    //     //         if (!c.payload.pluginConfigiOS.ignoreProjectFonts.includes(v)) {
    //     //             logDebug(`Igonoring font: ${v}`);
    //     //             c.payload.pluginConfigiOS.ignoreProjectFonts.push(v);
    //     //         }
    //     //     });
    //     // }
    // });
    const embeddedFontSourcesCheck: Array<string> = [];
    parseFonts(c, (font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];
            const includedFonts = getConfigProp(c, c.platform, 'includedFonts');
            if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
                const fontSource = path.join(dir, font);
                if (fsExistsSync(fontSource)) {
                    const fontFolder = path.join(appFolder, 'fonts');
                    mkdirSync(fontFolder);
                    const fontDest = path.join(fontFolder, font);
                    copyFileSync(fontSource, fontDest);

                    if (
                        !c.payload.pluginConfigiOS.ignoreProjectFonts.includes(font) &&
                        !embeddedFontSourcesCheck.includes(font)
                    ) {
                        c.payload.pluginConfigiOS.embeddedFontSources.push(fontSource);
                        embeddedFontSourcesCheck.push(font);
                    }

                    if (!c.payload.pluginConfigiOS.embeddedFonts.includes(font)) {
                        c.payload.pluginConfigiOS.embeddedFonts.push(font);
                    }
                } else {
                    logWarning(`Font ${chalk().white(fontSource)} doesn't exist! Skipping.`);
                }
            }
        }
    });

    // CHECK TEAM ID IF DEVICE
    const tId = getConfigProp(c, platform, 'teamID');
    if (device && (!tId || tId === '')) {
        logError(
            `You're missing teamID in your ${chalk().white(
                c.paths.appConfig.config
            )} => .platforms.${platform}.teamID . you will not be able to build ${platform} app for device!`
        );
    }

    await copyAssetsFolder(c, platform, appFolderName);
    await copyAppleAssets(c, platform, appFolderName);
    // await parseAppDelegate(c, platform, appFolder, appFolderName, bundleAssets, bundlerIp);
    await parseExportOptionsPlist(c, platform);
    await parseXcscheme(c, platform);
    await parsePodFile(c, platform);
    await parseEntitlementsPlist(c, platform);
    await parseInfoPlist(c, platform);
    await copyBuildsFolder(c, platform);
    await runCocoaPods(c);
    await parseXcodeProject(c);
    return true;
};

export {
    runCocoaPods,
    copyAppleAssets,
    configureXcodeProject,
    ejectXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    runAppleLog,
    updateProfile,
};
