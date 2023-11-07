import child_process, { ExecFileOptions } from 'child_process';
import crypto from 'crypto';
import path from 'path';
import {
    fsExistsSync,
    mkdirSync,
    writeFileSync,
    fsWriteFileSync,
    fsReadFileSync,
    copyFileSync,
    executeAsync,
    commandExistsSync,
    getAppFolder,
    getConfigProp,
    generateEnvVars,
    isPlatformActive,
    copyAssetsFolder,
    copyBuildsFolder,
    parseFonts,
    IOS,
    MACOS,
    TVOS,
    chalk,
    logInfo,
    logTask,
    logError,
    logWarning,
    logDebug,
    logSuccess,
    logRaw,
    inquirerPrompt,
    RnvPlatform,
} from '@rnv/core';
import { getAppleDevices } from './deviceManager';

import { getAppFolderName } from './common';
import { parseEntitlementsPlist, parseExportOptionsPlist, parseInfoPlist } from './plistParser';
import { parsePodFile } from './podfileParser';
// import { parseAppDelegate } from './swiftParser';
import { parseXcodeProject } from './xcodeParser';
import { parseXcscheme } from './xcschemeParser';
import { AppleDevice, Context } from './types';
import { ObjectEncodingOptions } from 'fs';
import RNPermissionsMap from './rnPermissionsMap';
import { packageReactNativeIOS, runReactNativeIOS } from '@rnv/sdk-react-native';
import { registerDevice } from './fastlane';

export const packageBundleForXcode = (c: Context) => {
    return packageReactNativeIOS(c);
};

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
    const packageDependenciesChecksum = generateChecksum(
        JSON.stringify({ ...c.files.project.package.dependencies, ...c.files.project.package.devDependencies })
    );
    const combinedChecksum = podContentChecksum + packageDependenciesChecksum;

    if (podChecksum !== combinedChecksum) {
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
    const packageDependenciesChecksum = generateChecksum(
        JSON.stringify({ ...c.files.project.package.dependencies, ...c.files.project.package.devDependencies })
    );
    const combinedChecksum = podContentChecksum + packageDependenciesChecksum;
    if (fsExistsSync(podChecksumPath)) {
        const existingContent = fsReadFileSync(podChecksumPath).toString();
        if (existingContent !== combinedChecksum) {
            logDebug(`updatePodsChecksum:${combinedChecksum}`);
            return fsWriteFileSync(podChecksumPath, combinedChecksum);
        }
        return true;
    }
    logDebug(`updatePodsChecksum:${combinedChecksum}`);
    return fsWriteFileSync(podChecksumPath, combinedChecksum);
};

const runCocoaPods = async (c: Context) => {
    logTask('runCocoaPods', `forceUpdate:${!!c.program.updatePods}`);

    if (c.runtime._skipNativeDepResolutions) return;

    const appFolder = getAppFolder(c);

    if (!fsExistsSync(appFolder)) {
        return Promise.reject(`Location ${appFolder} does not exists!`);
    }
    const podsRequired = c.program.updatePods || (await checkIfPodsIsRequired(c));
    const permissions = c.platform === 'ios' ? c.buildConfig.permissions?.[c.platform] : {};
    let requiredPodPermissions = permissions
        ? Object.keys(permissions).map((key) => RNPermissionsMap[key]?.podPermissionKey)
        : '';

    // remove duplicates
    if (requiredPodPermissions) {
        requiredPodPermissions = Array.from(new Set(requiredPodPermissions));
    }

    const env = {
        ...process.env,
        RCT_NEW_ARCH_ENABLED: 1,
        REACT_NATIVE_PERMISSIONS_REQUIRED: requiredPodPermissions,
        ...generateEnvVars(c),
    };

    const printableEnvKeys = [
        'RCT_NEW_ARCH_ENABLED',
        'REACT_NATIVE_PERMISSIONS_REQUIRED',
        'RNV_APP_BUILD_DIR',
        'RNV_ENGINE_PATH',
    ];

    if (podsRequired) {
        if (!commandExistsSync('pod')) {
            throw new Error('Cocoapods not installed. Please run `sudo gem install cocoapods`');
        }

        try {
            await executeAsync(c, 'bundle install', {
                env: process.env,
                printableEnvKeys,
            });
            await executeAsync(c, 'bundle exec pod install', {
                cwd: appFolder,
                env,
                printableEnvKeys,
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

            return executeAsync(c, 'bundle exec pod update', {
                cwd: appFolder,
                env,
                printableEnvKeys,
            })
                .then(() => updatePodsChecksum(c))
                .catch((er) => Promise.reject(er));
        }

        updatePodsChecksum(c);
        return true;
    }
};

const copyAppleAssets = (c: Context, platform: RnvPlatform, appFolderName: string) =>
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

export const getDeviceToRunOn = async (c: Context) => {
    logTask('getDeviceToRunOn');

    if (!c.platform) return;

    const { device } = c.program;
    let devicesArr: AppleDevice[] = [];
    if (device === true) {
        devicesArr = await getAppleDevices(c, false, true);
    } else {
        devicesArr = await getAppleDevices(c, true, false);
    }

    let p = '';

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

                return p;
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

            const { sim } = await inquirerPrompt({
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

        const { sim } = await inquirerPrompt({
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
            const { sim } = await inquirerPrompt({
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

            const { chosenAction } = await inquirerPrompt({
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
                const configGlobal = c.files.workspace.config;
                if (configGlobal) {
                    if (!configGlobal.defaultTargets) configGlobal.defaultTargets = {};
                    configGlobal.defaultTargets[c.platform] = sim.name;

                    c.files.workspace.config = configGlobal;
                    writeFileSync(c.paths.workspace.config, configGlobal);
                }
            }
        }

        const target = c.runtime.target?.replace(/(\s+)/g, '\\$1');

        p = `--simulator ${target}`;
    }

    return p;
};

export const runXcodeProject = async (c: Context, runDeviceArguments?: string) => {
    logTask('runXcodeProject', `targetArgs:${runDeviceArguments}`);

    const appPath = getAppFolder(c);
    const schemeTarget = getConfigProp(c, c.platform, 'schemeTarget') || 'RNVApp';
    const runScheme = getConfigProp(c, c.platform, 'runScheme') || 'Debug';
    const bundleIsDev = getConfigProp(c, c.platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets') === true;

    if (runDeviceArguments) {
        // await launchAppleSimulator(c, c.runtime.target); @TODO - do we still need this? RN CLI does it as well

        //const allowProvisioningUpdates = getConfigProp(c, c.platform, 'allowProvisioningUpdates', true);
        //if (allowProvisioningUpdates) p = `${p} --allowProvisioningUpdates`;
        if (bundleAssets) {
            await packageReactNativeIOS(c, bundleIsDev);
        }
        return _checkLockAndExec(c, appPath, schemeTarget, runScheme, runDeviceArguments);
    }

    if (c.platform === MACOS) {
        if (bundleAssets) {
            await packageReactNativeIOS(c, bundleIsDev);
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
    // return Promise.reject('Missing options for react-native command!');
};

const _checkLockAndExec = async (
    c: Context,
    appPath: string,
    scheme: string,
    runScheme: string,
    extraParamsString = ''
) => {
    logTask('_checkLockAndExec', `scheme:${scheme} runScheme:${runScheme} p:${extraParamsString}`);
    if (!c.platform) return;

    const appFolderName = getAppFolderName(c, c.platform);

    try {
        return runReactNativeIOS(c, scheme, runScheme, extraParamsString);
    } catch (e) {
        if (typeof e === 'string') {
            const isDeviceLocked = e.includes('ERROR:DEVICE_LOCKED');
            if (isDeviceLocked) {
                await inquirerPrompt({
                    message: 'Unlock your device and press ENTER',
                    type: 'confirm',
                    name: 'confirm',
                });
                return runReactNativeIOS(c, scheme, runScheme, extraParamsString);
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
                const { confirm } = await inquirerPrompt({
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

const _handleMissingTeam = async (c: Context, e: unknown) => {
    if (typeof e !== 'string') return;
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
        const { confirm } = await inquirerPrompt({
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

const _handleProvisioningIssues = async (c: Context, e: unknown, msg: string) => {
    const provisioningStyle = c.program.provisioningStyle || getConfigProp(c, c.platform, 'provisioningStyle');
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
    const { confirmAuto } = await inquirerPrompt({
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

    if (!c.platform) return;

    const cnf = c.files.appConfig.config;
    if (!cnf) return;

    const scheme = c.runtime.scheme && cnf.platforms?.[c.platform]?.buildSchemes?.[c.runtime.scheme];
    if (scheme && 'provisioningStyle' in scheme) {
        scheme.provisioningStyle = 'Automatic';
        writeFileSync(c.paths.appConfig.config, cnf);
        logSuccess(`Succesfully updated ${c.paths.appConfig.config}`);
    } else {
        return Promise.reject(
            `Failed to update ${c.paths.appConfig?.config}."platforms": { "${c.platform}": { buildSchemes: { "${c.runtime.scheme}" ... Object is null. Try update file manually`
        );
    }
};

const _setDevelopmentTeam = async (c: Context, teamID: string) => {
    logTask(`_setDevelopmentTeam:${teamID}`);

    if (!c.platform) return;
    const cnf = c.files.appConfig.config_original;
    if (!cnf) return;

    try {
        // initialize if it doesn't exist, assume everything is set up, if it throws yell
        const platforms = cnf.platforms || {};
        const plat = platforms[c.platform] || {};
        cnf.platforms = platforms;
        platforms[c.platform] = plat;
        if (!platforms[c.platform]) {
            cnf.platforms[c.platform] = {};
        }
        if ('teamID' in plat) {
            plat.teamID = teamID;
        } else {
            return;
        }
    } catch (e) {
        return Promise.reject(
            `Failed to update ${c.paths.appConfig?.config}."platforms": { "${c.platform}" ... Object is null. Try update file manually`
        );
    }
    writeFileSync(c.paths.appConfig.config, cnf);
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
    const schemeTarget = getConfigProp(c, c.platform, 'schemeTarget') || 'RNVApp';

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
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates') || true;
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    let ps = '';
    if (c.program.xcodebuildArgs) {
        ps = c.program.xcodebuildArgs;
    }
    const p: string[] = [];

    if (!ps.includes('-workspace')) {
        p.push('-workspace');
        p.push(`${appPath}/${appFolderName}.xcworkspace`);
    }
    if (!ps.includes('-scheme')) {
        p.push('-scheme');
        p.push(schemeTarget);
    }
    if (runScheme) {
        if (!ps.includes('-configuration')) {
            p.push('-configuration');
            p.push(runScheme);
        }
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

    return executeAsync('xcodebuild', {
        rawCommand: { args },
        env: {
            RCT_NO_LAUNCH_PACKAGER: true,
        },
    }).then(() => {
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
    const p: string[] = [];

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
    if (runScheme) {
        if (!ps.includes('-configuration')) {
            p.push('-configuration');
            p.push(runScheme);
        }
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

    return executeAsync('xcodebuild', {
        rawCommand: { args },
        env: {
            RCT_NO_LAUNCH_PACKAGER: true,
        },
    }).then(() => {
        logSuccess(`Your Archive is located in ${chalk().cyan(exportPath)} .`);
    });
};

export const exportXcodeProject = async (c: Context) => {
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

// Resolve or reject will not be called so this will keep running
export const runAppleLog = (c: Context) =>
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

export const configureXcodeProject = async (c: Context) => {
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
        podfileNodeRequire: '',
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
