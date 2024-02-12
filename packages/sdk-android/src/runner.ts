import path from 'path';
import net from 'net';
import {
    inquirerPrompt,
    execaCommand,
    copyAssetsFolder,
    copyBuildsFolder,
    parseFonts,
    parsePlugins,
    fsExistsSync,
    copyFileSync,
    mkdirSync,
    getRealPath,
    updateObjectSync,
    fsWriteFileSync,
    executeAsync,
    getAppFolder,
    getConfigProp,
    getEntryFile,
    isPlatformActive,
    isSystemWin,
    updateRenativeConfigs,
    chalk,
    logTask,
    logWarning,
    logDebug,
    logSuccess,
    logRaw,
    logError,
    ANDROID_WEAR,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    DEFAULTS,
    RnvPlatform,
    logInfo,
} from '@rnv/core';
import { parseAndroidManifestSync, injectPluginManifestSync } from './manifestParser';
import {
    parseMainActivitySync,
    parseSplashActivitySync,
    parseMainApplicationSync,
    injectPluginKotlinSync,
} from './kotlinParser';
import {
    parseAppBuildGradleSync,
    parseBuildGradleSync,
    parseSettingsGradleSync,
    parseGradlePropertiesSync,
    injectPluginGradleSync,
    parseAndroidConfigObject,
} from './gradleParser';
import { parseGradleWrapperSync } from './gradleWrapperParser';
import { parseValuesStringsSync, injectPluginXmlValuesSync, parseValuesColorsSync } from './xmlValuesParser';
import { ejectGradleProject } from './ejector';
import { AndroidDevice, Context } from './types';
import {
    resetAdb,
    getAndroidTargets,
    launchAndroidSimulator,
    checkForActiveEmulator,
    askForNewEmulator,
    connectToWifiDevice,
    composeDevicesArray,
} from './deviceManager';
import { CLI_ANDROID_ADB } from './constants';
import { runReactNativeAndroid, packageReactNativeAndroid } from '@rnv/sdk-react-native';

export const packageAndroid = async (c: Context) => {
    logTask('packageAndroid');

    return packageReactNativeAndroid(c);
};

export const getAndroidDeviceToRunOn = async (c: Context) => {
    const defaultTarget = c.runtime.target;
    logTask('getAndroidDeviceToRunOn', `default:${defaultTarget}`);

    if (!c.platform) return;

    const { target, device } = c.program;
    const { platform } = c;

    await resetAdb(c);
    const targetToConnectWiFi = _isString(target) ? target : device;

    if (_isString(targetToConnectWiFi) && net.isIP(targetToConnectWiFi.split(':')[0])) {
        await connectToWifiDevice(c, targetToConnectWiFi);
    }

    const devicesAndEmulators = await getAndroidTargets(c, false, false, !!device);

    const activeDevices = devicesAndEmulators.filter((d) => d.isActive);
    const inactiveDevices = devicesAndEmulators.filter((d) => !d.isActive);
    const foundDevice = devicesAndEmulators.find(
        (d) => d.udid.includes(target) || d.name.includes(target) || d.udid.includes(device) || d.name.includes(device)
    );

    const askWhereToRun = async () => {
        if (activeDevices.length || inactiveDevices.length) {
            // No device active and device param is passed, exiting
            if (c.program.device && !activeDevices.length) {
                return logError('No active devices found, please connect one or remove the device argument', true);
            }
            if (!foundDevice && (_isString(target) || _isString(device))) {
                logInfo(
                    `The target is specified, but no such emulator or device is available: ${chalk().magenta(
                        _isString(target) ? target : device
                    )}`
                );
            }
            const activeDeviceInfoArr = composeDevicesArray(activeDevices);
            const inactiveDeviceInfoArr = composeDevicesArray(inactiveDevices);

            const choices = [...activeDeviceInfoArr, ...inactiveDeviceInfoArr];

            let chosenEmulator: string;
            if (activeDeviceInfoArr.length === 1 && !target) {
                chosenEmulator = activeDeviceInfoArr[0].value;
                logInfo(`Found only one active emulator: ${chalk().magenta(chosenEmulator)}. Will use it.`);
            } else if (activeDeviceInfoArr.length === 0 && inactiveDeviceInfoArr.length === 1 && !target) {
                //If we have no active devices and only one AVD available let's just launch it.
                chosenEmulator = inactiveDeviceInfoArr[0].value;
                logInfo(`Found only one emulator to launch: ${chalk().magenta(chosenEmulator)}. Will use it.`);
            } else {
                const response = await inquirerPrompt({
                    name: 'chosenEmulator',
                    type: 'list',
                    message: 'What emulator would you like to use?',
                    choices,
                });
                chosenEmulator = response?.chosenEmulator;
            }

            if (chosenEmulator) {
                const dev = activeDevices.find((d) => d.name === chosenEmulator);
                if (dev) return dev;

                await launchAndroidSimulator(c, chosenEmulator, true);
                const device = await checkForActiveEmulator(c, chosenEmulator);
                return device;
            }
        } else {
            if (c.program.device) {
                return logError('No active devices found, please connect one or remove the device argument', true);
            }
            await askForNewEmulator(c, platform);
            const device = await checkForActiveEmulator(c);
            return device;
        }
    };
    if (target) {
        // a target is provided
        logDebug('Target provided', target);
        if (foundDevice) {
            if (foundDevice.isActive) {
                return foundDevice;
            }
            await launchAndroidSimulator(c, foundDevice, true);
            const device = await checkForActiveEmulator(c, foundDevice.name);
            return device;
        }
        logDebug('Target not found, asking where to run');
        return askWhereToRun();
    } else if (defaultTarget) {
        // neither a target nor an active device is found, revert to default target if available
        logDebug('Default target used', defaultTarget);
        const foundDevice = devicesAndEmulators.find(
            (d) => d.udid.includes(defaultTarget) || d.name.includes(defaultTarget)
        );

        if (!foundDevice) {
            logDebug('Target not provided, asking where to run');
            return askWhereToRun();
        } else if (!foundDevice.isActive) {
            await launchAndroidSimulator(c, foundDevice, true);
            const device = await checkForActiveEmulator(c, foundDevice.name);
            return device;
        }
        return foundDevice;
    } else {
        // we don't know what to do, ask the user
        logDebug('Target not provided, asking where to run');
        return askWhereToRun();
    }
};

export const runAndroid = async (c: Context, device: AndroidDevice) => {
    logTask('runAndroid', `target:${device.udid}`);
    const { platform } = c;

    if (!platform) return;

    await runReactNativeAndroid(c, platform, device);
};

const _checkSigningCerts = async (c: Context) => {
    logTask('_checkSigningCerts');
    const signingConfig = getConfigProp(c, c.platform, 'signingConfig', 'Debug');
    const isRelease = signingConfig === 'Release';

    if (!c.platform) return;
    if (!c.files.workspace.appConfig.configPrivate) return;

    if (isRelease && !c.payload.pluginConfigAndroid?.store?.storeFile) {
        const msg = `You're attempting to ${
            c.command
        } app in release mode but you have't configured your ${chalk().white(
            c.paths.workspace.appConfig.configPrivate
        )} for ${chalk().white(c.platform)} platform yet.`;
        if (c.program.ci === true) {
            return Promise.reject(msg);
        }
        logWarning(msg);

        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Do you want to configure it now?',
        });

        if (confirm) {
            let confirmCopy = false;
            let platCandidate: RnvPlatform = null;
            const { confirmNewKeystore } = await inquirerPrompt({
                type: 'confirm',
                name: 'confirmNewKeystore',
                message: 'Do you want to generate new keystore as well?',
            });

            const platforms = c.files.workspace.appConfig.configPrivate?.platforms || {};

            if (c.files.workspace.appConfig.configPrivate) {
                const platCandidates = [ANDROID_WEAR, ANDROID_TV, ANDROID, FIRE_TV] as const;

                platCandidates.forEach((v) => {
                    if (c.files.workspace.appConfig.configPrivate?.platforms?.[v]) {
                        platCandidate = v;
                    }
                });
                if (platCandidate) {
                    const resultCopy = await inquirerPrompt({
                        type: 'confirm',
                        name: 'confirmCopy',
                        message: `Found existing keystore configuration for ${platCandidate}. do you want to reuse it?`,
                    });
                    confirmCopy = resultCopy?.confirmCopy;
                }
            }

            if (confirmCopy && platCandidate) {
                platforms[c.platform] = platforms[platCandidate];
            } else {
                let storeFile: string | undefined;

                if (!confirmNewKeystore) {
                    const result = await inquirerPrompt({
                        type: 'input',
                        name: 'storeFile',
                        default: './release.keystore',
                        message: `Paste relative path to ${chalk().white(
                            c.paths.workspace.appConfig.dir
                        )} of your existing ${chalk().white('release.keystore')} file`,
                    });
                    storeFile = result?.storeFile;
                }

                const { storePassword } = await inquirerPrompt({
                    type: 'password',
                    name: 'storePassword',
                    message: 'storePassword',
                });

                const { keyAlias } = await inquirerPrompt({
                    type: 'input',
                    name: 'keyAlias',
                    message: 'keyAlias',
                });

                const { keyPassword } = await inquirerPrompt({
                    type: 'password',
                    name: 'keyPassword',
                    message: 'keyPassword',
                });

                if (confirmNewKeystore) {
                    const keystorePath = path.join(c.paths.workspace.appConfig.dir, 'release.keystore');
                    mkdirSync(c.paths.workspace.appConfig.dir);
                    const keytoolCmd = `keytool -genkey -v -keystore ${keystorePath} -alias ${keyAlias} -keypass ${keyPassword} -storepass ${storePassword} -keyalg RSA -keysize 2048 -validity 10000`;
                    await executeAsync(c, keytoolCmd, {
                        shell: true,
                        stdio: 'inherit',
                        silent: true,
                    });
                    storeFile = './release.keystore';
                }

                if (c.paths.workspace.appConfig.dir) {
                    mkdirSync(c.paths.workspace.appConfig.dir);
                    c.files.workspace.appConfig.configPrivate = {
                        platforms: {},
                    };
                    if (storeFile) {
                        platforms[c.platform] = {
                            storeFile,
                            storePassword,
                            keyAlias,
                            keyPassword,
                        };
                    }
                }
            }

            updateObjectSync(c.paths.workspace.appConfig.configPrivate, c.files.workspace.appConfig.configPrivate);
            logSuccess(
                `Successfully updated private config file at ${chalk().white(c.paths.workspace.appConfig.dir)}.`
            );
            // await configureProject(c);
            await updateRenativeConfigs(c);
            await parseAppBuildGradleSync(c);
            // await configureGradleProject(c);
        } else {
            return Promise.reject("You selected no. Can't proceed");
        }
    }
};

export const configureAndroidProperties = async (c: Context) => {
    logTask('configureAndroidProperties');

    const appFolder = getAppFolder(c);

    c.runtime.platformBuildsProjectPath = appFolder;

    const addNDK = c.buildConfig?.sdks?.ANDROID_NDK && !c.buildConfig.sdks.ANDROID_NDK.includes('<USER>');
    let ndkString = `ndk.dir=${getRealPath(c, c.buildConfig?.sdks?.ANDROID_NDK)}`;
    let sdkDir = getRealPath(c, c.buildConfig?.sdks?.ANDROID_SDK);

    if (!sdkDir) {
        logError(`Cannot resolve c.buildConfig?.sdks?.ANDROID_SDK: ${c.buildConfig?.sdks?.ANDROID_SDK}`);
        return false;
    }

    if (isSystemWin) {
        sdkDir = sdkDir.replace(/\\/g, '/');
        ndkString = ndkString.replace(/\\/g, '/');
    }

    fsWriteFileSync(
        path.join(appFolder, 'local.properties'),
        `#Generated by ReNative (https://renative.org)
${addNDK ? ndkString : ''}
sdk.dir=${sdkDir}`
    );

    return true;
};

export const configureGradleProject = async (c: Context) => {
    const { platform } = c;
    logTask('configureGradleProject');

    if (!isPlatformActive(c, platform)) return;
    await copyAssetsFolder(c, platform, 'app/src/main');
    await configureAndroidProperties(c);
    await configureProject(c);
    await copyBuildsFolder(c, platform);
    return true;
};

// const createJavaPackageFolders = async (c: Context, appFolder: string) => {
//     console.log('createJavaPackageFolders', appFolder);
//     const appId = getAppId(c, c.platform);
//     console.log('appId', appId);
//     const javaPackageArray = appId.split('.');
//     const javaPackagePath = path.join(appFolder, 'app/src/main/java', ...javaPackageArray);
//     console.log('javaPackagePath', javaPackagePath);

//     if (!fsExistsSync(javaPackagePath)) {
//         await mkdir(javaPackagePath, { recursive: true });
//     }
//     throw new Error('createJavaPackageFolders not implemented');
// }

export const configureProject = async (c: Context) => {
    logTask('configureProject');
    const { platform } = c;

    const appFolder = getAppFolder(c);

    // if (!fsExistsSync(gradlew)) {
    //     logWarning(`Your ${chalk().white(platform)} platformBuild is misconfigured!. let's repair it.`);
    //     await createPlatformBuild(c, platform);
    //     await configureGradleProject(c);

    //     return true;
    // }

    const outputFile = getEntryFile(c, platform);

    // await createJavaPackageFolders(c, appFolder);
    mkdirSync(path.join(appFolder, 'app/src/main/assets'));
    fsWriteFileSync(path.join(appFolder, `app/src/main/assets/${outputFile}.bundle`), '{}');

    // INJECTORS
    c.payload.pluginConfigAndroid = {
        pluginIncludes: "include ':app'",
        pluginPaths: '',
        pluginPackages: '',
        pluginActivityImports: '',
        pluginActivityMethods: '',
        pluginApplicationImports: '',
        pluginApplicationMethods: '',
        reactNativeHostMethods: '',
        pluginApplicationCreateMethods: '',
        pluginApplicationDebugServer: '',
        applyPlugin: '',
        defaultConfig: '',
        pluginActivityCreateMethods: '',
        pluginActivityResultMethods: '',
        pluginSplashActivityImports: '',
        buildGradleAllProjectsRepositories: '',
        buildGradleBuildScriptRepositories: '',
        buildGradlePlugins: '',
        buildGradleAfterAll: '',
        buildGradleBuildScriptDependencies: '',
        injectReactNativeEngine: '',
        buildGradleBuildScriptDexOptions: '',
        appBuildGradleSigningConfigs: '',
        packagingOptions: '',
        appBuildGradleImplementations: '',
        resourceStrings: [],
        appBuildGradleAfterEvaluate: '',
        kotlinVersion: '',
        googleServicesVersion: '',
        buildToolsVersion: '',
        buildTypes: '',
        compileOptions: '',
        compileSdkVersion: DEFAULTS.compileSdkVersion,
        ndkVersion: '',
        gradleBuildToolsVersion: '',
        gradleWrapperVersion: '',
        localProperties: '',
        minSdkVersion: DEFAULTS.minSdkVersion,
        multiAPKs: '',
        splits: '',
        supportLibVersion: '',
        targetSdkVersion: DEFAULTS.targetSdkVersion,
    };

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        injectPluginGradleSync(c, plugin, pluginPlat, key);
        injectPluginKotlinSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginManifestSync();
        injectPluginXmlValuesSync(c, pluginPlat);
    });

    c.payload.pluginConfigAndroid.pluginPackages = c.payload.pluginConfigAndroid.pluginPackages.substring(
        0,
        c.payload.pluginConfigAndroid.pluginPackages.length - 2
    );

    // FONTS
    const includedFonts = getConfigProp(c, c.platform, 'includedFonts') || [];
    parseFonts(c, (font: string, dir: string) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];

            if (includedFonts) {
                if (includedFonts.includes('*') || includedFonts.includes(key)) {
                    if (font) {
                        const fontSource = path.join(dir, font);
                        if (fsExistsSync(fontSource)) {
                            const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                            mkdirSync(fontFolder);
                            const fontNormalised = font.replace(/__/g, ' ');
                            const fontDest = path.join(fontFolder, fontNormalised);
                            copyFileSync(fontSource, fontDest);
                        } else {
                            logWarning(`Font ${chalk().white(fontSource)} doesn't exist! Skipping.`);
                        }
                    }
                }
            }
        }
    });
    parseAndroidConfigObject(c);
    parseSettingsGradleSync(c);
    parseAppBuildGradleSync(c);
    parseBuildGradleSync(c);
    parseGradleWrapperSync(c);
    parseMainActivitySync(c);
    parseMainApplicationSync(c);
    parseSplashActivitySync(c);
    parseValuesStringsSync(c);
    parseValuesColorsSync(c);
    parseAndroidManifestSync(c);
    parseGradlePropertiesSync(c);
    // parseFlipperSync(c, 'debug');
    // parseFlipperSync(c, 'release');
    await _checkSigningCerts(c);

    return true;
};

// Resolve or reject will not be called so this will keep running
export const runAndroidLog = async (c: Context) => {
    logTask('runAndroidLog');
    const filter = c.program.filter || '';
    const child = execaCommand(`${c.cli[CLI_ANDROID_ADB]} logcat`);
    // use event hooks to provide a callback to execute when data are available:
    child.stdout?.on('data', (data: Buffer) => {
        const d = data.toString().split('\n');
        d.forEach((v) => {
            if (v.includes(' E ') && v.includes(filter)) {
                logRaw(chalk().red(v));
            } else if (v.includes(' W ') && v.includes(filter)) {
                logRaw(chalk().yellow(v));
            } else if (v.includes(filter)) {
                logRaw(v);
            }
        });
    });
    return child.then((res) => res.stdout).catch((err) => Promise.reject(`Error: ${err}`));
};

const _isString = (target: boolean | string): boolean => {
    return typeof target === 'string';
};
export { ejectGradleProject };
