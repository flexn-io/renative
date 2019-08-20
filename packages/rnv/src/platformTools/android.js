/* eslint-disable import/no-cycle */
// @todo fix circular
import path from 'path';
import os from 'os';
import fs from 'fs';
import net from 'net';
import chalk from 'chalk';
import shell from 'shelljs';
import child_process from 'child_process';
import inquirer from 'inquirer';

import { executeAsync, execCLI, executeTelnet } from '../systemTools/exec';
import { createPlatformBuild } from '../cli/platform';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
    copyBuildsFolder,
    askQuestion,
    finishQuestion,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    getAppTemplateFolder,
    logWarning,
    logDebug,
    getConfigProp,
    logInfo,
    getQuestion,
    logSuccess,
} from '../common';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync } from '../systemTools/fileutils';
import { IS_TABLET_ABOVE_INCH, ANDROID_WEAR, ANDROID, ANDROID_TV } from '../constants';
import { parsePlugins } from '../pluginTools';
import { parseAndroidManifestSync, injectPluginManifestSync } from './android/manifestParser';
import { parseMainActivitySync, parseSplashActivitySync, parseMainApplicationSync, injectPluginKotlinSync } from './android/kotlinParser';
import {
    parseAppBuildGradleSync, parseBuildGradleSync, parseSettingsGradleSync,
    parseGradlePropertiesSync, injectPluginGradleSync
} from './android/gradleParser';
import { parseValuesStringsSync, injectPluginXmlValuesSync } from './android/xmlValuesParser';

const readline = require('readline');

const CHECK_INTEVAL = 5000;

const isRunningOnWindows = process.platform === 'win32';

const currentDeviceProps = {};

const composeDevicesString = (devices, returnArray) => {
    logTask(`composeDevicesString:${devices ? devices.length : null}`);
    const devicesArray = [];
    devices.forEach((v, i) => devicesArray.push(_getDeviceString(v, !returnArray ? i : null)));
    if (returnArray) return devicesArray;
    return `\n${devicesArray.join('')}`;
};

const launchAndroidSimulator = (c, platform, target, isIndependentThread = false) => {
    logTask(`launchAndroidSimulator:${platform}:${target}`);

    if (target === '?' || target === undefined || target === '') {
        return _listAndroidTargets(c, true, false, false)
            .then((devicesArr) => {
                const devicesString = composeDevicesString(devicesArr);
                const readlineInterface = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                readlineInterface.question(getQuestion(`${devicesString}\nType number of the emulator you want to launch`), (v) => {
                    const selectedDevice = devicesArr[parseInt(v, 10) - 1];
                    if (selectedDevice) {
                        if (isIndependentThread) {
                            execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${selectedDevice.name}"`).catch((err) => {
                                if (err.includes && err.includes('WHPX')) {
                                    logWarning(err);
                                    return logError('It seems you do not have the Windows Hypervisor Platform virtualization enabled. Enter windows features in the Windows search box and select Turn Windows features on or off in the search results. In the Windows Features dialog, enable both Hyper-V and Windows Hypervisor Platform.', true);
                                }
                                logError(err);
                            });
                            return Promise.resolve();
                        }
                        return execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${selectedDevice.name}"`);
                    }
                    logError(`Wrong choice ${v}! Ingoring`);
                });
            });
    }

    if (target) {
        const actualTarget = target.name || target;
        if (isIndependentThread) {
            execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${actualTarget}"`).catch((err) => {
                if (err.includes && err.includes('WHPX')) {
                    logWarning(err);
                    return logError('It seems you do not have the Windows Hypervisor Platform virtualization enabled. Enter windows features in the Windows search box and select Turn Windows features on or off in the search results. In the Windows Features dialog, enable both Hyper-V and Windows Hypervisor Platform.', true);
                }
                logError(err);
            });
            return Promise.resolve();
        }
        return execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${actualTarget}"`);
    }
    return Promise.reject('No simulator -t target name specified!');
};

const listAndroidTargets = (c) => {
    logTask('listAndroidTargets');
    const { program: { device } } = c;
    return _listAndroidTargets(c, false, device, device).then(list => composeDevicesString(list)).then((devices) => {
        console.log(devices);
        if (devices.trim() === '') console.log('No devices found');
        return devices;
    });
};

const _getDeviceString = (device, i) => {
    const {
        isTV, isTablet, name, udid, isDevice, isActive, avdConfig, isWear, arch
    } = device;
    let deviceIcon = '';
    if (isTablet) deviceIcon = 'Tablet 💊 ';
    if (isTV) deviceIcon = 'TV 📺 ';
    if (isWear) deviceIcon = 'Wear ⌚ ';
    if (!deviceIcon && (udid !== 'unknown' || avdConfig)) deviceIcon = 'Phone 📱 ';

    const deviceString = `${chalk.white(name)} | ${deviceIcon} | arch: ${arch} | udid: ${chalk.blue(udid)}${isDevice ? chalk.red(' (device)') : ''} ${
        isActive ? chalk.magenta(' (active)') : ''}`;

    if (i === null) return { key: name, name: deviceString, value: name };

    return `-[${i + 1}] ${deviceString}\n`;
};

const _listAndroidTargets = async (c, skipDevices, skipAvds, deviceOnly = false) => {
    logTask(`_listAndroidTargets:${c.platform}:${skipDevices}:${skipAvds}:${deviceOnly}`);
    try {
        let devicesResult;
        let avdResult;

        await execCLI(c, CLI_ANDROID_ADB, 'kill-server');
        await execCLI(c, CLI_ANDROID_ADB, 'start-server');

        if (!skipDevices) {
            devicesResult = await execCLI(c, CLI_ANDROID_ADB, 'devices -l');
        }
        if (!skipAvds) {
            avdResult = await execCLI(c, CLI_ANDROID_EMULATOR, '-list-avds');
        }
        return _parseDevicesResult(devicesResult, avdResult, deviceOnly, c);
    } catch (e) {
        return Promise.reject(e);
    }
};

const calculateDeviceDiagonal = (width, height, density) => {
    // Calculate the diagonal in inches
    const widthInches = width / density;
    const heightInches = height / density;
    return Math.sqrt(widthInches * widthInches + heightInches * heightInches);
};

const isSquareishDevice = (width, height) => {
    const ratio = width / height;
    if (ratio > 0.8 && ratio < 1.2) return true;
    return false;
};

const getRunningDeviceProp = async (c, udid, prop) => {
    // avoid multiple calls to the same device
    if (currentDeviceProps[udid]) {
        if (!prop) return currentDeviceProps[udid];
        return currentDeviceProps[udid][prop];
    }
    const rawProps = await execCLI(c, CLI_ANDROID_ADB, `-s ${udid} shell getprop`);
    const reg = /\[.+\]: \[.*\n?[^\[]*\]/gm;
    const lines = rawProps.match(reg);

    lines.forEach((line) => {
        const words = line.split(']: [');
        const key = words[0].slice(1);
        const value = words[1].slice(0, words[1].length - 1);

        if (!currentDeviceProps[udid]) currentDeviceProps[udid] = {};
        currentDeviceProps[udid][key] = value;
    });

    return getRunningDeviceProp(c, udid, prop);
};

const decideIfTVRunning = async (c, device) => {
    const { udid, model, product } = device;
    const mod = await getRunningDeviceProp(c, udid, 'ro.product.model');
    const name = await getRunningDeviceProp(c, udid, 'ro.product.name');
    const flavor = await getRunningDeviceProp(c, udid, 'ro.build.flavor');
    const description = await getRunningDeviceProp(c, udid, 'ro.build.description');

    let isTV = false;
    [mod, name, flavor, description, model, product].forEach((string) => {
        if (string && string.toLowerCase().includes('tv')) isTV = true;
    });

    if (model.includes('SHIELD')) isTV = true;

    return isTV;
};

const decideIfWearRunning = async (c, device) => {
    const { udid, model, product } = device;
    const fingerprint = await getRunningDeviceProp(c, udid, 'ro.vendor.build.fingerprint');
    const name = await getRunningDeviceProp(c, udid, 'ro.product.vendor.name');
    const mod = await getRunningDeviceProp(c, udid, 'ro.product.vendor.model');
    const flavor = await getRunningDeviceProp(c, udid, 'ro.build.flavor');
    const description = await getRunningDeviceProp(c, udid, 'ro.build.description');

    let isWear = false;
    [fingerprint, name, mod, flavor, description, model, product].forEach((string) => {
        if (string && string.toLowerCase().includes('wear')) isWear = true;
    });
    return isWear;
};

const getDeviceType = async (device, c) => {
    logDebug('getDeviceType - in', { device });
    if (device.udid !== 'unknown') {
        const screenSizeResult = await execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} shell wm size`);
        const screenDensityResult = await execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} shell wm density`);
        const arch = await getRunningDeviceProp(c, device.udid, 'ro.product.cpu.abi');
        let screenProps;

        if (screenSizeResult) {
            const [width, height] = screenSizeResult.split('Physical size: ')[1].split('x');
            screenProps = { width: parseInt(width, 10), height: parseInt(height, 10) };
        }

        if (screenDensityResult) {
            const density = screenDensityResult.split('Physical density: ')[1];
            screenProps = { ...screenProps, density: parseInt(density, 10) };
        }

        device.isTV = await decideIfTVRunning(c, device);

        if (screenSizeResult && screenDensityResult) {
            const { width, height, density } = screenProps;

            const diagonalInches = calculateDeviceDiagonal(width, height, density);
            screenProps = { ...screenProps, diagonalInches };
            device.isTablet = !device.isTV && diagonalInches > IS_TABLET_ABOVE_INCH && diagonalInches <= 15;
            device.isWear = await decideIfWearRunning(c, device);
        }

        device.isPhone = !device.isTablet && !device.isWear && !device.isTV;
        device.isMobile = !device.isWear && !device.isTV;
        device.screenProps = screenProps;
        device.arch = arch;
        logDebug('getDeviceType - out', { device });
        return device;
    }

    if (device.avdConfig) {
        const density = parseInt(device.avdConfig['hw.lcd.density'], 10);
        const width = parseInt(device.avdConfig['hw.lcd.width'], 10);
        const height = parseInt(device.avdConfig['hw.lcd.height'], 10);
        const arch = device.avdConfig['abi.type'];

        // Better detect wear
        const sysdir = device.avdConfig['image.sysdir.1'];
        const tagId = device.avdConfig['tag.id'];
        const tagDisplay = device.avdConfig['tag.display'];
        const deviceName = device.avdConfig['hw.device.name'];

        device.isWear = false;
        [sysdir, tagId, tagDisplay, deviceName].forEach((string) => {
            if (string && string.includes('wear')) device.isWear = true;
        });

        const avdId = device.avdConfig.AvdId;
        const name = device.avdConfig['hw.device.name'];
        const skin = device.avdConfig['skin.name'];
        const image = device.avdConfig['image.sysdir.1'];

        device.isTV = false;
        [avdId, name, skin, image].forEach((string) => {
            if (string && string.toLowerCase().includes('tv')) device.isTV = true;
        });

        const diagonalInches = calculateDeviceDiagonal(width, height, density);
        device.isTablet = !device.isTV && diagonalInches > IS_TABLET_ABOVE_INCH;
        device.isPhone = !device.isTablet && !device.isWear && !device.isTV;
        device.isMobile = !device.isWear && !device.isTV;
        device.arch = arch;
        logDebug('getDeviceType - out', { device });
        return device;
    }
    return device;
};

const getAvdDetails = (c, deviceName) => {
    const { ANDROID_SDK_HOME, ANDROID_AVD_HOME } = process.env;

    // .avd dir might be in other place than homedir. (https://developer.android.com/studio/command-line/variables)
    const avdConfigPaths = [
        `${ANDROID_AVD_HOME}`,
        `${ANDROID_SDK_HOME}/.android/avd`,
        `${os.homedir()}/.android/avd`,
    ];

    const results = {};

    avdConfigPaths.forEach((cPath) => {
        if (fs.existsSync(cPath)) {
            const filesPath = fs.readdirSync(cPath);


            filesPath.forEach((fName) => {
                const fPath = path.join(cPath, fName);
                const dirent = fs.lstatSync(fPath);
                if (!dirent.isDirectory() && fName === `${deviceName}.ini`) {
                    const avdData = fs.readFileSync(fPath).toString();
                    const lines = avdData.trim().split(/\r?\n/);
                    lines.forEach((line) => {
                        const [key, value] = line.split('=');
                        if (key === 'path') {
                            const initData = fs.readFileSync(`${value}/config.ini`).toString();
                            const initLines = initData.trim().split(/\r?\n/);
                            const avdConfig = {};
                            initLines.forEach((initLine) => {
                                const [iniKey, iniValue] = initLine.split('=');
                                // also remove the white space
                                avdConfig[iniKey.trim()] = iniValue.trim();
                            });
                            results.avdConfig = avdConfig;
                        }
                    });
                }
            });
        }
    });
    return results;
};

const getEmulatorName = async (words) => {
    const emulator = words[0];
    const port = emulator.split('-')[1];

    const emulatorReply = await executeTelnet(port, 'avd name');
    const emulatorReplyArray = emulatorReply.split('OK');
    const emulatorName = emulatorReplyArray[emulatorReplyArray.length - 2].trim();
    return emulatorName;
};

const connectToWifiDevice = async (c, ip) => {
    const deviceResponse = await execCLI(c, CLI_ANDROID_ADB, `connect ${ip}:5555`);
    if (deviceResponse.includes('connected')) return true;
    logError(`Failed to connect to ${ip}:5555`);
    return false;
};

const _parseDevicesResult = async (devicesString, avdsString, deviceOnly, c) => {
    logDebug(`_parseDevicesResult:${devicesString}:${avdsString}:${deviceOnly}`);
    const devices = [];

    if (devicesString) {
        const lines = devicesString.trim().split(/\r?\n/);
        logDebug('_parseDevicesResult 2', { lines });
        if (lines.length !== 0) {
            await Promise.all(lines.map(async (line) => {
                const words = line.split(/[ ,\t]+/).filter(w => w !== '');
                if (words.length === 0) return;
                logDebug('_parseDevicesResult 3', { words });

                if (words[1] === 'device') {
                    const isDevice = !words[0].includes('emulator');
                    let name = _getDeviceProp(words, 'model:');
                    const model = name;
                    const product = _getDeviceProp(words, 'product:');
                    logDebug('_parseDevicesResult 4', { name });
                    if (!isDevice) {
                        await waitForEmulatorToBeReady(c, words[0]);
                        name = await getEmulatorName(words);
                        logDebug('_parseDevicesResult 5', { name });
                    }
                    logDebug('_parseDevicesResult 6', { deviceOnly, isDevice });
                    if ((deviceOnly && isDevice) || !deviceOnly) {
                        devices.push({
                            udid: words[0],
                            isDevice,
                            isActive: true,
                            name,
                            model,
                            product
                        });
                    }
                    return true;
                }
            }));
        }
    }

    if (avdsString) {
        const avdLines = avdsString.trim().split(/\r?\n/);
        logDebug('_parseDevicesResult 7', { avdLines });

        await Promise.all(avdLines.map(async (line) => {
            let avdDetails;

            try {
                avdDetails = getAvdDetails(c, line);
            } catch (e) {
                logError(e);
            }

            try {
                logDebug('_parseDevicesResult 8', { avdDetails });

                // Yes, 2 greps. Hacky but it excludes the grep process corectly and quickly :)
                // if this runs without throwing it means that the simulator is running so it needs to be excluded
                const findProcess = isRunningOnWindows ? `tasklist | find "avd ${line}"` : `ps x | grep "avd ${line}" | grep -v grep`;
                child_process.execSync(findProcess);
                logDebug('_parseDevicesResult 9 - excluding running emulator');
            } catch (e) {
                if (avdDetails) {
                    devices.push({
                        udid: 'unknown',
                        isDevice: false,
                        isActive: false,
                        name: line,
                        ...avdDetails
                    });
                }
            }
        }));
    }

    logDebug('_parseDevicesResult 10', { devices });

    return Promise.all(devices.map(device => getDeviceType(device, c)))
        .then(devicesArray => devicesArray.filter((device) => {
            // filter devices based on selected platform
            const { platform } = c;
            const matches = (platform === ANDROID && device.isTablet) || (platform === ANDROID_WEAR && device.isWear) || (platform === ANDROID_TV && device.isTV) || (platform === ANDROID && device.isMobile);
            logDebug('getDeviceType - filter', { device, matches, platform });
            return matches;
        }));
};

const _getDeviceProp = (arr, prop) => {
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (v && v.includes(prop)) return v.replace(prop, '');
    }
    return '';
};

const _askForNewEmulator = (c, platform) => new Promise((resolve, reject) => {
    logTask('_askForNewEmulator');
    const emuName = c.files.globalConfig.defaultTargets[platform];
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    readlineInterface.question(
        getQuestion(`Do you want ReNative to create new Emulator (${chalk.white(emuName)}) for you? (y) to confirm`),
        (v) => {
            if (v.toLowerCase() === 'y') {
                switch (platform) {
                case 'android':
                    return _createEmulator(c, '28', 'google_apis', emuName)
                        .then(() => launchAndroidSimulator(c, platform, emuName, true))
                        .then(resolve);
                case 'androidtv':
                    return _createEmulator(c, '28', 'android-tv', emuName)
                        .then(() => launchAndroidSimulator(c, platform, emuName, true))
                        .then(resolve);
                case 'androidwear':
                    return _createEmulator(c, '28', 'android-wear', emuName)
                        .then(() => launchAndroidSimulator(c, platform, emuName, true))
                        .then(resolve);
                default:
                    return reject('Cannot find any active or created emulators');
                }
            } else {
                reject('Cannot find any active or created emulators');
            }
        },
    );
});

const _createEmulator = (c, apiVersion, emuPlatform, emuName) => {
    logTask('_createEmulator');
    return execCLI(c, CLI_ANDROID_SDKMANAGER, `"system-images;android-${apiVersion};${emuPlatform};x86"`)
        .then(() => execCLI(c, CLI_ANDROID_AVDMANAGER, `create avd -n ${emuName} -k system-images;android-${apiVersion};${emuPlatform};x86`))
        .catch(e => logError(e, true));
};

const copyAndroidAssets = (c, platform) => new Promise((resolve) => {
    logTask('copyAndroidAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const destPath = path.join(getAppFolder(c, platform), 'app/src/main/res');
    const sourcePath = path.join(c.paths.appConfigFolder, `assets/${platform}/res`);
    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

// let _workerTimer;
// const _workerLogger = () => {
//     console.log(`PACKAGING ANDROID.... ${(new Date()).toLocaleString()}`);
// };

const packageAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask(`packageAndroid:${platform}`);

    // CRAPPY BUT Android Wear does not support webview required for connecting to packager. this is hack to prevent RN connectiing to running bundler
    const { entryFile } = c.files.appConfigFile.platforms[platform];
    // TODO Android PROD Crashes if not using this hardcoded one
    let outputFile;
    if (platform === ANDROID_WEAR) {
        outputFile = entryFile;
    } else {
        outputFile = 'index.android';
    }


    const appFolder = getAppFolder(c, platform);
    let reactNative = 'react-native';

    if (isRunningOnWindows) {
        reactNative = path.normalize(`${process.cwd()}/node_modules/.bin/react-native.cmd`);
    }

    console.log('ANDROID PACKAGE STARTING...');
    // _workerTimer = setInterval(_workerLogger, 30000);
    executeAsync(`${reactNative} bundle --platform android --dev false --assets-dest ${appFolder}/app/src/main/res --entry-file ${entryFile}.js --bundle-output ${appFolder}/app/src/main/assets/${outputFile}.bundle`)
        .then(() => {
            // clearInterval(_workerTimer);
            console.log('ANDROID PACKAGE FINISHED');
            return resolve();
        })
        .catch((e) => {
            // clearInterval(_workerTimer);
            console.log('ANDROID PACKAGE FAILED');
            return reject(e);
        });
});

const waitForEmulatorToBeReady = (c, emulator) => {
    let attempts = 0;
    const maxAttempts = 10;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            execCLI(c, CLI_ANDROID_ADB, `-s ${emulator} shell getprop init.svc.bootanim`)
                .then((res) => {
                    if (res.includes('stopped')) {
                        clearInterval(interval);
                        logDebug('waitForEmulatorToBeReady - boot complete');
                        resolve(emulator);
                    } else {
                        attempts++;
                        console.log(`Checking if emulator has booted up: attempt ${attempts}/${maxAttempts}`);
                        if (attempts === maxAttempts) {
                            clearInterval(interval);
                            throw new Error('Can\'t connect to the running emulator. Try restarting it.');
                        }
                    }
                }).catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        throw new Error('Can\'t connect to the running emulator. Try restarting it.');
                    }
                });
        }, CHECK_INTEVAL);
    });
};

const runAndroid = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`runAndroid:${platform}:${target}`);

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets', false) === true;
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev', false) === true;

    if (bundleAssets) {
        packageAndroid(c, platform, bundleIsDev)
            .then(() => _runGradle(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
    } else {
        _runGradle(c, platform)
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const _runGradle = async (c, platform) => {
    logTask(`_runGradle:${platform}`);
    const outputAab = getConfigProp(c, platform, 'aab', false);
    // shortcircuit devices logic since aabs can't be installed on a device
    if (outputAab) return _runGradleApp(c, platform, {});

    const { target } = c.program;

    if (target && net.isIP(target)) {
        await connectToWifiDevice(c, target);
    }

    let devicesAndEmulators;
    try {
        devicesAndEmulators = await _listAndroidTargets(c, false, false, c.program.device !== undefined);
    } catch (e) {
        return Promise.reject(e);
    }
    const activeDevices = devicesAndEmulators.filter(d => d.isActive);
    const inactiveDevices = devicesAndEmulators.filter(d => !d.isActive);

    const askWhereToRun = async () => {
        if (activeDevices.length === 0 && inactiveDevices.length > 0) {
        // No device active, but there are emulators created
            const devicesString = composeDevicesString(inactiveDevices, true);
            const choices = devicesString;
            const response = await inquirer.prompt([{
                name: 'chosenEmulator',
                type: 'list',
                message: 'What emulator would you like to start?',
                choices
            }]);
            if (response.chosenEmulator) {
                await launchAndroidSimulator(c, platform, response.chosenEmulator, true);
                const devices = await _checkForActiveEmulator(c, platform);
                await _runGradleApp(c, platform, devices);
            }
        } else if (activeDevices.length > 1) {
            const devicesString = composeDevicesString(activeDevices, true);
            const choices = devicesString;
            const response = await inquirer.prompt([{
                name: 'chosenEmulator',
                type: 'list',
                message: 'Where would you like to run your app?',
                choices
            }]);
            if (response.chosenEmulator) {
                const dev = activeDevices.find(d => d.name === response.chosenEmulator);
                await _runGradleApp(c, platform, dev);
            }
        } else {
            await _askForNewEmulator(c, platform);
            const devices = await _checkForActiveEmulator(c, platform);
            await _runGradleApp(c, platform, devices);
        }
    };

    if (target) {
        logDebug('Target provided', target);
        const foundDevice = devicesAndEmulators.find(d => d.udid.includes(target) || d.name.includes(target));
        if (foundDevice) {
            if (foundDevice.isActive) {
                await _runGradleApp(c, platform, foundDevice);
            } else {
                await launchAndroidSimulator(c, platform, foundDevice, true);
                const device = await _checkForActiveEmulator(c, platform);
                await _runGradleApp(c, platform, device);
            }
        } else {
            await askWhereToRun();
        }
    } else if (activeDevices.length === 1) {
        // Only one that is active, running on that one
        const dv = activeDevices[0];
        logInfo(`Found device ${dv.name}:${dv.udid}!`);
        await _runGradleApp(c, platform, dv);
    } else {
        logDebug('Target not provided, asking where to run');
        await askWhereToRun();
    }
};

const _checkForActiveEmulator = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_checkForActiveEmulator:${platform}`);
    let attempts = 1;
    const maxAttempts = isRunningOnWindows ? 20 : 10;
    let running = false;
    const poll = setInterval(() => {
        // Prevent the interval from running until enough promises return to make it stop or we get a result
        if (!running) {
            running = true;
            _listAndroidTargets(c, false, true, false)
                .then((v) => {
                    if (v.length > 0) {
                        logSuccess(`Found active emulator! ${chalk.white(v[0].udid)}. Will use it`);
                        clearInterval(poll);
                        resolve(v[0]);
                    } else {
                        running = false;
                        console.log(`looking for active emulators: attempt ${attempts}/${maxAttempts}`);
                        attempts++;
                        if (attempts > maxAttempts) {
                            clearInterval(poll);
                            reject('Could not find any active emulatros');
                            // TODO: Asking for new emulator is worng as it diverts
                            // user from underlying failure of not being able to connect
                            // return _askForNewEmulator(c, platform);
                        }
                    }
                })
                .catch((e) => {
                    clearInterval(poll);
                    logError(e);
                });
        }
    }, CHECK_INTEVAL);
});

const _checkSigningCerts = c => new Promise((resolve, reject) => {
    logTask('_checkSigningCerts');
    const signingConfig = getConfigProp(c, c.platform, 'signingConfig', 'Debug');

    if (signingConfig === 'Release' && !c.files.privateConfig) {
        logError(`You're attempting to ${c.command} app in release mode but you have't configured your ${chalk.white(c.paths.privateConfigPath)} yet.`);
        askQuestion('Do you want to configure it now? (y)')
            .then((v) => {
                const sc = {};
                if (v === 'y') {
                    askQuestion(`Paste asolute or relative path to ${chalk.white(c.paths.privateConfigDir)} of your existing ${chalk.white('release.keystore')} file.`, sc, 'storeFile')
                        .then(() => askQuestion('storePassword', sc, 'storePassword'))
                        .then(() => askQuestion('keyAlias', sc, 'keyAlias'))
                        .then(() => askQuestion('keyPassword', sc, 'keyPassword'))
                        .then(() => {
                            finishQuestion();
                            if (c.paths.privateConfigDir) {
                                mkdirSync(c.paths.privateConfigDir);
                                c.files.privateConfig = {
                                    android: sc
                                };
                            }
                            fs.writeFileSync(c.paths.privateConfigPath, JSON.stringify(c.files.privateConfig, null, 2));
                            logSuccess(`Successfully created private config file at ${chalk.white(c.paths.privateConfigPath)}.`);
                            resolve();
                        });
                } else {
                    reject(`You selected ${v}. Can't proceed`);
                }
            }).catch(e => reject(e));
    } else {
        resolve();
    }
});

const _runGradleApp = (c, platform, device) => new Promise((resolve, reject) => {
    logTask(`_runGradleApp:${platform}`);

    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');
    const appFolder = getAppFolder(c, platform);
    const bundleId = getConfigProp(c, platform, 'id');
    const outputAab = getConfigProp(c, platform, 'aab', false);
    const outputFolder = signingConfig === 'Debug' ? 'debug' : 'release';
    const { arch, name } = device;

    shell.cd(`${appFolder}`);

    _checkSigningCerts(c)
        .then(() => executeAsync(`${isRunningOnWindows ? 'gradlew.bat' : './gradlew'} ${outputAab ? 'bundle' : 'assemble'}${signingConfig} -x bundleReleaseJsAndAssets`))
        .then(() => {
            if (outputAab) {
                const aabPath = path.join(appFolder, `app/build/outputs/bundle/${outputFolder}/app.aab`);
                logInfo(`App built. Path ${aabPath}`);
                return Promise.resolve();
            }
            let apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}.apk`);
            if (!fs.existsSync(apkPath)) {
                apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}-unsigned.apk`);
            } if (!fs.existsSync(apkPath)) {
                apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${arch}-${outputFolder}.apk`);
            }
            logInfo(`Installing ${apkPath} on ${name}`);
            return execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} install -r -d -f ${apkPath}`);
        })
        .then(() => ((!outputAab && device.isDevice && platform !== ANDROID_WEAR)
            ? execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} reverse tcp:8081 tcp:8081`)
            : Promise.resolve()))
        .then(() => !outputAab && execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} shell am start -n ${bundleId}/.MainActivity`))
        .then(() => resolve())
        .catch(e => reject(e));
});

const buildAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');

    shell.cd(`${appFolder}`);

    _checkSigningCerts(c)
        .then(() => executeAsync(`${isRunningOnWindows ? 'gradlew.bat' : './gradlew'} assemble${signingConfig} -x bundleReleaseJsAndAssets`))
        .then(() => {
            logSuccess(`Your APK is located in ${chalk.white(path.join(appFolder, `app/build/outputs/apk/${signingConfig.toLowerCase()}`))} .`);
            resolve();
        }).catch(e => reject(e));
});

const configureAndroidProperties = (c, platform) => new Promise((resolve) => {
    logTask(`configureAndroidProperties:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const addNDK = c.files.globalConfig.sdks.ANDROID_NDK && !c.files.globalConfig.sdks.ANDROID_NDK.includes('<USER>');
    const ndkString = `ndk.dir=${c.files.globalConfig.sdks.ANDROID_NDK}`;
    let sdkDir = c.files.globalConfig.sdks.ANDROID_SDK;

    if (isRunningOnWindows) {
        sdkDir = sdkDir.replace(/\\/g, '/');
    }

    fs.writeFileSync(
        path.join(appFolder, 'local.properties'),
        `#Generated by ReNative (https://renative.org)
${addNDK ? ndkString : ''}
sdk.dir=${sdkDir}`,
    );

    resolve();
});

const configureGradleProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureGradleProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;


    copyAndroidAssets(c, platform)
        .then(() => copyBuildsFolder(c, platform))
        .then(() => configureAndroidProperties(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);

    const gradlew = path.join(appFolder, 'gradlew');

    if (!fs.existsSync(gradlew)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
        createPlatformBuild(c, platform)
            .then(() => configureGradleProject(c, platform))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    mkdirSync(path.join(appFolder, 'app/src/main/assets'));
    fs.writeFileSync(path.join(appFolder, 'app/src/main/assets/index.android.bundle'), '{}');
    fs.chmodSync(gradlew, '755');

    // INJECTORS
    c.pluginConfigAndroid = {
        pluginIncludes: "include ':app'",
        pluginPaths: '',
        pluginImports: '',
        pluginPackages: 'MainReactPackage(),\n',
        pluginActivityImports: '',
        pluginActivityMethods: '',
        mainApplicationMethods: '',
        applyPlugin: '',
        pluginActivityCreateMethods: '',
        pluginActivityResultMethods: '',
        manifestApplication: '',
        buildGradleAllProjectsRepositories: '',
        buildGradleBuildScriptRepositories: '',
        buildGradleBuildScriptDependencies: '',
        buildGradleBuildScriptDexOptions: '',
        appBuildGradleSigningConfigs: '',
        appBuildGradleImplementations: '',
        appBuildGradleAfterEvaluate: '',
    };

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        injectPluginGradleSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginKotlinSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginManifestSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginXmlValuesSync(c, pluginPlat, key, pluginPlat.package);
    });

    c.pluginConfigAndroid.pluginPackages = c.pluginConfigAndroid.pluginPackages.substring(0, c.pluginConfigAndroid.pluginPackages.length - 2);

    // FONTS
    if (c.files.appConfigFile) {
        if (fs.existsSync(c.paths.fontsConfigFolder)) {
            fs.readdirSync(c.paths.fontsConfigFolder).forEach((font) => {
                if (font.includes('.ttf') || font.includes('.otf')) {
                    const key = font.split('.')[0];
                    const { includedFonts } = c.files.appConfigFile.common;
                    if (includedFonts) {
                        if (includedFonts.includes('*') || includedFonts.includes(key)) {
                            if (font) {
                                const fontSource = path.join(c.paths.projectConfigFolder, 'fonts', font);
                                if (fs.existsSync(fontSource)) {
                                    const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                                    mkdirSync(fontFolder);
                                    const fontDest = path.join(fontFolder, font);
                                    copyFileSync(fontSource, fontDest);
                                } else {
                                    logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    parseSettingsGradleSync(c, platform);
    parseAppBuildGradleSync(c, platform);
    parseBuildGradleSync(c, platform);
    parseMainActivitySync(c, platform);
    parseMainApplicationSync(c, platform);
    parseSplashActivitySync(c, platform);
    parseValuesStringsSync(c, platform);
    parseAndroidManifestSync(c, platform);
    parseGradlePropertiesSync(c, platform);

    resolve();
});

// Resolve or reject will not be called so this will keep running
const runAndroidLog = c => new Promise(() => {
    const filter = c.program.filter || '';
    const child = child_process.spawn(c.cli[CLI_ANDROID_ADB], ['logcat']);
    // use event hooks to provide a callback to execute when data are available:
    child.stdout.on('data', (data) => {
        const d = data.toString().split('\n');
        d.forEach((v) => {
            if (v.includes(' E ') && v.includes(filter)) {
                console.log(chalk.red(v));
            } else if (v.includes(' W ') && v.includes(filter)) {
                console.log(chalk.yellow(v));
            } else if (v.includes(filter)) {
                console.log(v);
            }
        });
    });
});

export {
    copyAndroidAssets,
    configureGradleProject,
    launchAndroidSimulator,
    buildAndroid,
    listAndroidTargets,
    packageAndroid,
    runAndroid,
    runAndroidLog,
};
