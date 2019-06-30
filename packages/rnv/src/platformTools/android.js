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

import { executeAsync, execCLI, commandExistsSync } from '../systemTools/exec';
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
    getAppVersion,
    getAppTitle,
    getAppVersionCode,
    writeCleanFile,
    getAppId,
    getAppTemplateFolder,
    getEntryFile,
    logWarning,
    logDebug,
    getConfigProp,
    logInfo,
    getQuestion,
    logSuccess,
} from '../common';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync } from '../systemTools/fileutils';
import { IS_TABLET_ABOVE_INCH, ANDROID_WEAR, ANDROID, ANDROID_TV } from '../constants';
import { getMergedPlugin, parsePlugins } from '../pluginTools';

const readline = require('readline');

let currentDeviceProps = null;

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
                            execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${selectedDevice.name}"`).catch(logError);
                            return Promise.resolve();
                        }
                        return execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${selectedDevice.name}"`);
                    }
                    logError(`Wrong choice ${v}! Ingoring`);
                });
            });
    }

    if (target) {
        if (isIndependentThread) {
            execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${target}"`).catch(logError);
            return Promise.resolve();
        }
        return execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${target}"`);
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

const _listAndroidTargets = (c, skipDevices, skipAvds, deviceOnly = false) => {
    logTask(`_listAndroidTargets:${c.platform}:${skipDevices}:${skipAvds}:${deviceOnly}`);
    try {
        let devicesResult;
        let avdResult;

        if (!skipDevices) {
            devicesResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} devices -l`).toString();
            logDebug(`${c.cli[CLI_ANDROID_ADB]} devices -l`, devicesResult);
        }
        if (!skipAvds) {
            avdResult = child_process.execSync(`${c.cli[CLI_ANDROID_EMULATOR]} -list-avds`).toString();
            logDebug(`${c.cli[CLI_ANDROID_EMULATOR]} -list-avds`, avdResult);
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

const getRunningDeviceProp = (c, udid, prop) => {
    // avoid multiple calls to the same device
    if (currentDeviceProps) {
        if (!prop) return currentDeviceProps;
        return currentDeviceProps[prop];
    }
    const rawProps = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${udid} shell getprop`).toString().trim();
    const lines = rawProps.trim().split(/\r?\n/);
    lines.forEach((line) => {
        const words = line.split(']: [');
        const key = words[0].slice(1);
        const value = words[1].slice(0, words[1].length - 1);

        if (!currentDeviceProps) currentDeviceProps = {};
        currentDeviceProps[key] = value;
    });

    return getRunningDeviceProp(c, udid, prop);
};

const decideIfTV = (c, udid) => {
    const model = getRunningDeviceProp(c, udid, 'ro.product.model');
    const name = getRunningDeviceProp(c, udid, 'ro.product.name');
    const flavor = getRunningDeviceProp(c, udid, 'ro.build.flavor');
    const description = getRunningDeviceProp(c, udid, 'ro.build.description');

    if (model.includes('atv') || name.includes('atv') || flavor.includes('atv') || description.includes('atv')) return true;
    return false;
};

const getDeviceType = async (device, c) => {
    logDebug('getDeviceType - in', { device });
    if (device.udid !== 'unknown') {
        const screenSizeResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${device.udid} shell wm size`).toString();
        const screenDensityResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${device.udid} shell wm density`).toString();
        const arch = getRunningDeviceProp(c, device.udid, 'ro.product.cpu.abi');
        let screenProps;

        if (screenSizeResult) {
            const [width, height] = screenSizeResult.split('Physical size: ')[1].split('x');
            screenProps = { width: parseInt(width, 10), height: parseInt(height, 10) };
        }

        if (screenDensityResult) {
            const density = screenDensityResult.split('Physical density: ')[1];
            screenProps = { ...screenProps, density: parseInt(density, 10) };
        }

        device.isTV = decideIfTV(c, device.udid);

        if (screenSizeResult && screenDensityResult) {
            const { width, height, density } = screenProps;

            const diagonalInches = calculateDeviceDiagonal(width, height, density);
            screenProps = { ...screenProps, diagonalInches };
            device.isTablet = !device.isTV && diagonalInches > IS_TABLET_ABOVE_INCH && diagonalInches <= 15;
            device.isWear = isSquareishDevice(width, height);
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
            if ((string && string.includes('tv')) || (string && string.includes('TV'))) device.isTV = true;
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

const getAvdDetails = async (deviceName) => {
    const avdConfigPath = `${os.homedir()}/.android/avd/${deviceName}.avd/config.ini`;
    if (fs.existsSync(avdConfigPath)) {
        const fileData = fs.readFileSync(avdConfigPath).toString();
        const lines = fileData.trim().split(/\r?\n/);
        const avdConfig = {};
        lines.forEach((line) => {
            const [key, value] = line.split('=');
            // also remove the white space
            avdConfig[key.trim()] = value.trim();
        });
        return { avdConfig };
    }

    return {};
};

const getEmulatorName = async (words) => {
    const emulator = words[0];
    const port = emulator.split('-')[1];
    // Use telnet or nc, whichever is available
    let command = commandExistsSync('nc') ? 'nc' : null;
    if (commandExistsSync('telnet')) command = 'telnet';

    if (!command) throw new Error('You must have nc or telnet installed');

    const emulatorReply = await execCLI(null, null, `echo "avd name" | ${command} localhost ${port}`);
    const emulatorReplyArray = emulatorReply.split('OK');
    const emulatorName = emulatorReplyArray[emulatorReplyArray.length - 2].trim();
    return emulatorName;
};

const connectToWifiDevice = async (c, ip) => {
    const deviceResponse = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} connect ${ip}:5555`).toString();
    if (deviceResponse.includes('connected')) return true;
    logError(`Failed to connect to ${ip}:5555`);
    return false;
};

const _parseDevicesResult = async (devicesString, avdsString, deviceOnly, c) => {
    logDebug(`_parseDevicesResult:${devicesString}:${avdsString}:${deviceOnly}`);
    const devices = [];

    if (devicesString) {
        const lines = devicesString.trim().split(/\r?\n/);
        logDebug('_parseDevicesResult', { lines });
        if (lines.length !== 0) {
            await Promise.all(lines.map(async (line) => {
                const words = line.split(/[ ,\t]+/).filter(w => w !== '');
                if (words.length === 0) return;
                logDebug('_parseDevicesResult', { words });

                if (words[1] === 'device') {
                    const isDevice = !words[0].includes('emulator');
                    let name = _getDeviceProp(words, 'model:');
                    logDebug('_parseDevicesResult', { name });
                    if (!isDevice) {
                        await waitForEmulatorToBeReady(c, words[0]);
                        name = await getEmulatorName(words);
                        logDebug('_parseDevicesResult', { name });
                    }
                    logDebug('_parseDevicesResult', { deviceOnly, isDevice });
                    if ((deviceOnly && isDevice) || !deviceOnly) {
                        devices.push({
                            udid: words[0],
                            isDevice,
                            isActive: true,
                            name,
                        });
                    }
                    return true;
                }
            }));
        }
    }

    if (avdsString) {
        const avdLines = avdsString.trim().split(/\r?\n/);
        logDebug('_parseDevicesResult', { avdLines });

        await Promise.all(avdLines.map(async (line) => {
            const avdDetails = await getAvdDetails(line);
            logDebug('_parseDevicesResult', { avdDetails });
            try {
                // Yes, 2 greps. Hacky but it excludes the grep process corectly and quickly :)
                // if this runs without throwing it means that the simulator is running so it needs to be excluded
                child_process.execSync(`ps x | grep "qemu.*${line}" | grep -v grep`);
                logDebug('_parseDevicesResult - excluding running emulator');
            } catch (e) {
                devices.push({
                    udid: 'unknown',
                    isDevice: false,
                    isActive: false,
                    name: line,
                    ...avdDetails
                });
            }
        }));
    }

    logDebug('_parseDevicesResult', { devices });

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
                readlineInterface.question(getQuestion('Input desired Android API version number'), (v) => {
                    const apiVersion = v;
                    readlineInterface.question(
                        getQuestion('Select device type: \n 1: Android Phone \n 2: Android TV \n 3: Android Wear \n'),
                        (val) => {
                            switch (parseInt(val, 10)) {
                            case 1:
                                return _createEmulator(c, apiVersion, 'google_apis', emuName);
                            case 2:
                                return _createEmulator(c, apiVersion, 'android-tv', emuName);
                            case 3:
                                return _createEmulator(c, apiVersion, 'android-wear', emuName);
                            default:
                                return reject('Wrong value entered');
                            }
                        },
                    );
                });
            } else {
                reject('Cannot find any active emulators');
            }
        },
    );
});

const _createEmulator = (c, apiVersion, emuPlatform, emuName) => {
    logTask('_createEmulator');
    return execCLI(c, CLI_ANDROID_SDKMANAGER, `"system-images;android-${apiVersion};${emuPlatform};x86"`)
        .then(() => execCLI(
            c,
            CLI_ANDROID_AVDMANAGER,
            `create avd  -n ${emuName} -k "system-images;android-${apiVersion};${emuPlatform};x86" `,
        ))
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

const packageAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask('packageAndroid');

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
    executeAsync('react-native', [
        'bundle',
        '--platform',
        'android',
        '--dev',
        'false',
        '--assets-dest',
        `${appFolder}/app/src/main/res`,
        '--entry-file',
        `${entryFile}.js`,
        '--bundle-output',
        `${appFolder}/app/src/main/assets/${outputFile}.bundle`,
    ])
        .then(() => resolve())
        .catch(e => reject(e));
});

const waitForEmulatorToBeReady = (c, emulator) => new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 10;
    const poll = setInterval(() => {
        try {
            const isBooting = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${emulator} shell getprop init.svc.bootanim`).toString();
            if (isBooting.includes('stopped')) {
                clearInterval(poll);
                logDebug('waitForEmulatorToBeReady - boot complete');
                resolve(emulator);
            } else {
                attempts++;
                console.log(`Checking if emulator has booted up: attempt ${attempts}/${maxAttempts}`);
                if (attempts === maxAttempts) {
                    clearInterval(poll);
                    throw new Error('Can\'t connect to the running emulator. Try restarting it.');
                }
            }
        } catch (e) {
            console.log(`Checking if emulator has booted up: attempt ${attempts}/${maxAttempts}`);
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(poll);
                throw new Error('Can\'t connect to the running emulator. Try restarting it.');
            }
        }
    }, 2000);
});

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

    const { target } = c.program;

    if (target && net.isIP(target)) {
        await connectToWifiDevice(c, target);
    }

    const devicesAndEmulators = await _listAndroidTargets(c, false, false, c.program.device !== undefined);
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
            const devices = await _checkForActiveEmulator(c, platform);
            await _runGradleApp(c, platform, devices);
        }
    };

    if (target) {
        console.log('TCL: _runGradle -> devicesAndEmulators', devicesAndEmulators);
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
        await askWhereToRun();
    }
};

const _checkForActiveEmulator = (c, platform) => new Promise((resolve) => {
    let attempts = 1;
    const maxAttempts = 10;
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
                            return _askForNewEmulator(c, platform);
                        }
                    }
                })
                .catch((e) => {
                    clearInterval(poll);
                    logError(e);
                });
        }
    }, 2000);
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
    const outputFolder = signingConfig === 'Debug' ? 'debug' : 'release';
    const { arch, name } = device;

    shell.cd(`${appFolder}`);

    _checkSigningCerts(c)
        .then(() => executeAsync(process.platform === 'win32' ? 'gradlew.bat' : './gradlew', [
            `assemble${signingConfig}`,
            '-x',
            'bundleReleaseJsAndAssets',
        ]))
        .then(() => {
            let apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}.apk`);
            if (!fs.existsSync(apkPath)) {
                apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}-unsigned.apk`);
            } if (!fs.existsSync(apkPath)) {
                apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${arch}-${outputFolder}.apk`);
            }
            logInfo(`Installing ${apkPath} on ${name}`);
            return executeAsync(c.cli[CLI_ANDROID_ADB], ['-s', device.udid, 'install', '-r', '-d', '-f', apkPath]);
        })
        .then(() => ((device.isDevice && platform !== ANDROID_WEAR)
            ? executeAsync(c.cli[CLI_ANDROID_ADB], ['-s', device.udid, 'reverse', 'tcp:8081', 'tcp:8081'])
            : Promise.resolve()))
        .then(() => executeAsync(c.cli[CLI_ANDROID_ADB], [
            '-s',
            device.udid,
            'shell',
            'am',
            'start',
            '-n',
            `${bundleId}/.MainActivity`,
        ]))
        .then(() => resolve())
        .catch(e => reject(e));
});

const buildAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');

    shell.cd(`${appFolder}`);

    _checkSigningCerts(c)
        .then(() => executeAsync(process.platform === 'win32' ? 'gradlew.bat' : './gradlew', [
            `assemble${signingConfig}`,
            '-x',
            'bundleReleaseJsAndAssets',
        ]))
        .then(() => {
            logSuccess(`Your APK is located in ${chalk.white(path.join(appFolder, 'app/build/outputs/apk/release'))}.`);
            resolve();
        }).catch(e => reject(e));
});

const configureAndroidProperties = c => new Promise((resolve) => {
    logTask('configureAndroidProperties');

    const localProperties = path.join(c.paths.globalConfigFolder, 'local.properties');
    if (fs.existsSync(localProperties)) {
        console.log('local.properties file exists!');
    } else {
        console.log('local.properties file missing! Creating one for you...');
    }

    fs.writeFileSync(
        localProperties,
        `#Generated by ReNative (https://renative.org)
ndk.dir=${c.files.globalConfig.sdks.ANDROID_NDK}
sdk.dir=${c.files.globalConfig.sdks.ANDROID_SDK}`,
    );

    resolve();
});

const configureGradleProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureGradleProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    // configureIfRequired(c, platform)
    //     .then(() => configureAndroidProperties(c, platform))
    configureAndroidProperties(c, platform)
        .then(() => copyAndroidAssets(c, platform))
        .then(() => copyBuildsFolder(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _injectPlugin = (c, plugin, key, pkg, pluginConfig) => {
    const className = pkg ? pkg.split('.').pop() : null;
    let packageParams = '';
    if (plugin.packageParams) {
        packageParams = plugin.packageParams.join(',');
    }

    const pathFixed = plugin.path ? `${plugin.path}` : `node_modules/${key}/android`;
    const modulePath = `../../${pathFixed}`;
    if (plugin.projectName) {
        pluginConfig.pluginIncludes += `, ':${plugin.projectName}'`;
        pluginConfig.pluginPaths += `project(':${
            plugin.projectName
        }').projectDir = new File(rootProject.projectDir, '${modulePath}')\n`;
        if (!plugin.skipImplementation) {
            if (plugin.implementation) {
                pluginConfig.pluginImplementations += `${plugin.implementation}\n`;
            } else {
                pluginConfig.pluginImplementations += `    implementation project(':${plugin.projectName}')\n`;
            }
        }
    } else {
        pluginConfig.pluginIncludes += `, ':${key}'`;
        pluginConfig.pluginPaths += `project(':${key}').projectDir = new File(rootProject.projectDir, '${modulePath}')\n`;
        if (!plugin.skipImplementation) {
            if (plugin.implementation) {
                pluginConfig.pluginImplementations += `${plugin.implementation}\n`;
            } else {
                pluginConfig.pluginImplementations += `    implementation project(':${key}')\n`;
            }
        }
    }
    if (plugin.activityImports instanceof Array) {
        plugin.activityImports.forEach((activityImport) => {
            // Avoid duplicate imports
            if (pluginConfig.pluginActivityImports.indexOf(activityImport) === -1) {
                pluginConfig.pluginActivityImports += `import ${activityImport}\n`;
            }
        });
    }

    if (plugin.activityMethods instanceof Array) {
        pluginConfig.pluginActivityMethods += '\n';
        pluginConfig.pluginActivityMethods += `${plugin.activityMethods.join('\n    ')}`;
    }

    const mainActivity = plugin.mainActivity;
    if (mainActivity) {
        if (mainActivity.createMethods instanceof Array) {
            pluginConfig.pluginActivityCreateMethods += '\n';
            pluginConfig.pluginActivityCreateMethods += `${mainActivity.createMethods.join('\n    ')}`;
        }

        if (mainActivity.resultMethods instanceof Array) {
            pluginConfig.pluginActivityResultMethods += '\n';
            pluginConfig.pluginActivityResultMethods += `${mainActivity.resultMethods.join('\n    ')}`;
        }

        if (mainActivity.imports instanceof Array) {
            mainActivity.imports.forEach((v) => {
                pluginConfig.pluginActivityImports += `import ${v}\n`;
            });
        }

        if (mainActivity.methods instanceof Array) {
            pluginConfig.pluginActivityMethods += '\n';
            pluginConfig.pluginActivityMethods += `${mainActivity.methods.join('\n    ')}`;
        }
    }

    if (pkg) pluginConfig.pluginImports += `import ${pkg}\n`;
    if (className) pluginConfig.pluginPackages += `${className}(${packageParams}),\n`;

    if (plugin.imports) {
        plugin.imports.forEach((v) => {
            pluginConfig.pluginImports += `import ${v}\n`;
        });
    }

    if (plugin.implementations) {
        plugin.implementations.forEach((v) => {
            pluginConfig.pluginImplementations += `    implementation ${v}\n`;
        });
    }

    if (plugin.mainApplicationMethods) {
        pluginConfig.mainApplicationMethods += `\n${plugin.mainApplicationMethods}\n`;
    }

    const appBuildGradle = plugin['app/build.gradle'];
    if (appBuildGradle) {
        if (appBuildGradle.apply) {
            appBuildGradle.apply.forEach((v) => {
                pluginConfig.applyPlugin += `apply ${v}\n`;
            });
        }
    }

    if (plugin.afterEvaluate) {
        plugin.afterEvaluate.forEach((v) => {
            pluginConfig.pluginAfterEvaluate += ` ${v}\n`;
        });
    }
    _fixAndroidLegacy(c, pathFixed);
};

const _fixAndroidLegacy = (c, modulePath) => {
    const buildGradle = path.join(c.paths.projectRootFolder, modulePath, 'build.gradle');

    if (fs.existsSync(buildGradle)) {
        logDebug('FIX:', buildGradle);
        writeCleanFile(buildGradle, buildGradle, [
            { pattern: " compile '", override: "  implementation '" },
            { pattern: ' compile "', override: '  implementation "' },
            { pattern: ' testCompile "', override: '  testImplementation "' },
            { pattern: " provided '", override: "  compileOnly '" },
            { pattern: ' provided "', override: '  compileOnly "' },
            { pattern: ' compile fileTree', override: '  implementation fileTree' },
        ]);
    }
};

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

    copyFileSync(path.join(c.paths.globalConfigFolder, 'local.properties'), path.join(appFolder, 'local.properties'));
    mkdirSync(path.join(appFolder, 'app/src/main/assets'));
    fs.writeFileSync(path.join(appFolder, 'app/src/main/assets/index.android.bundle'), '{}');
    fs.chmodSync(gradlew, '755');

    // INJECTORS
    const pluginIncludes = "include ':app'";
    const pluginPaths = '';
    const pluginImports = '';
    const pluginPackages = 'MainReactPackage(),\n';
    const pluginImplementations = '';
    const pluginAfterEvaluate = '';
    const pluginActivityImports = '';
    const pluginActivityMethods = '';
    const mainApplicationMethods = '';
    const applyPlugin = '';
    const pluginActivityCreateMethods = '';
    const pluginActivityResultMethods = '';
    const pluginConfig = {
        pluginIncludes,
        pluginPaths,
        pluginImports,
        pluginPackages,
        pluginImplementations,
        pluginAfterEvaluate,
        pluginActivityImports,
        pluginActivityMethods,
        mainApplicationMethods,
        applyPlugin,
        pluginActivityCreateMethods,
        pluginActivityResultMethods
    };

    // PLUGINS
    parsePlugins(c, (plugin, pluginPlat, key) => {
        // if (pluginPlat.packages) {
        //     pluginPlat.packages.forEach((ppkg) => {
        //         _injectPlugin(c, pluginPlat, key, ppkg, pluginConfig);
        //     });
        _injectPlugin(c, pluginPlat, key, pluginPlat.package, pluginConfig);
    });

    pluginConfig.pluginPackages = pluginConfig.pluginPackages.substring(0, pluginConfig.pluginPackages.length - 2);

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

    // const debugSigning = 'debug';
    const debugSigning = `
    debug {
        storeFile file('debug.keystore')
        storePassword "android"
        keyAlias "androiddebugkey"
        keyPassword "android"
    }`;

    // SIGNING CONFIGS
    pluginConfig.signingConfigs = `${debugSigning}
    release`;
    pluginConfig.localProperties = '';
    c.files.privateConfig = _getPrivateConfig(c, platform);

    if (c.files.privateConfig) {
        const keystorePath = c.files.privateConfig[platform].storeFile;
        let keystorePathFull;
        if (keystorePath) {
            if (keystorePath.startsWith('./')) {
                keystorePathFull = path.join(c.files.privateConfig.parentFolder, keystorePath);
            } else {
                keystorePathFull = keystorePath;
            }
        }

        if (fs.existsSync(keystorePathFull)) {
            const genPropsPath = path.join(appFolder, 'keystore.properties');
            fs.writeFileSync(genPropsPath, `# auto generated by ReNative
storeFile=${keystorePathFull}
keyAlias=${c.files.privateConfig[platform].keyAlias}
storePassword=${c.files.privateConfig[platform].storePassword}
keyPassword=${c.files.privateConfig[platform].keyPassword}`);

            pluginConfig.signingConfigs = `${debugSigning}
            release {
                storeFile file(keystoreProps['storeFile'])
                storePassword keystoreProps['storePassword']
                keyAlias keystoreProps['keyAlias']
                keyPassword keystoreProps['keyPassword']
            }`;

            pluginConfig.localProperties = `
          def keystorePropsFile = rootProject.file("keystore.properties")
          def keystoreProps = new Properties()
          keystoreProps.load(new FileInputStream(keystorePropsFile))`;
        } else {
            logWarning(
                `Your ${chalk.white(keystorePathFull)} does not exist. You won't be able to make production releases without it!`,
            );
        }
    }

    // BUILD_TYPES
    pluginConfig.buildTypes = `
    debug {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }`;

    const isMultiApk = getConfigProp(c, platform, 'multipleAPKs', false) === true;
    // MULTI APK
    pluginConfig.multiAPKs = '';
    if (isMultiApk) {
        pluginConfig.multiAPKs = `
      ext.abiCodes = ["armeabi-v7a": 1, "x86": 2, "arm64-v8a": 3, "x86_64": 4]
      import com.android.build.OutputFile

      android.applicationVariants.all { variant ->
        variant.outputs.each { output ->
          def bavc = project.ext.abiCodes.get(output.getFilter(OutputFile.ABI))
          if (bavc != null) {
            output.versionCodeOverride = Integer.parseInt(Integer.toString(variant.versionCode) + Integer.toString(bavc))
          }
        }
      }`;
    }

    // SPLITS
    pluginConfig.splits = '';
    if (isMultiApk) {
        pluginConfig.splits = `
    splits {
      abi {
          reset()
          enable true
          include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
          universalApk false
      }
    }
`;
    }


    // PACKAGING OPTIONS
    pluginConfig.packagingOptions = `
    exclude 'META-INF/DEPENDENCIES.txt'
    exclude 'META-INF/DEPENDENCIES'
    exclude 'META-INF/dependencies.txt'
    exclude 'META-INF/LICENSE.txt'
    exclude 'META-INF/LICENSE'
    exclude 'META-INF/license.txt'
    exclude 'META-INF/LGPL2.1'
    exclude 'META-INF/NOTICE.txt'
    exclude 'META-INF/NOTICE'
    exclude 'META-INF/notice.txt'
    pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    pickFirst 'lib/x86_64/libc++_shared.so'
    pickFirst 'lib/x86/libc++_shared.so'
    pickFirst 'lib/arm64-v8a/libc++_shared.so'
    pickFirst 'lib/arm64-v8a/libjsc.so'
    pickFirst 'lib/x86_64/libjsc.so'`;

    // COMPILE OPTIONS
    pluginConfig.compileOptions = `
    sourceCompatibility 1.8
    targetCompatibility 1.8`;

    writeCleanFile(path.join(appTemplateFolder, 'settings.gradle'), path.join(appFolder, 'settings.gradle'), [
        { pattern: '{{PLUGIN_INCLUDES}}', override: pluginConfig.pluginIncludes },
        { pattern: '{{PLUGIN_PATHS}}', override: pluginConfig.pluginPaths },
    ]);

    // ANDROID PROPS
    pluginConfig.minSdkVersion = getConfigProp(c, platform, 'minSdkVersion', 21);
    pluginConfig.targetSdkVersion = getConfigProp(c, platform, 'targetSdkVersion', 28);
    pluginConfig.compileSdkVersion = getConfigProp(c, platform, 'compileSdkVersion', 28);
    pluginConfig.supportLibVersion = getConfigProp(c, platform, 'supportLibVersion', '28.0.0');
    pluginConfig.buildToolsVersion = getConfigProp(c, platform, 'buildToolsVersion', '28.0.0');


    writeCleanFile(path.join(appTemplateFolder, 'app/build.gradle'), path.join(appFolder, 'app/build.gradle'), [
        { pattern: '{{PLUGIN_APPLY}}', override: pluginConfig.applyPlugin },
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{VERSION_CODE}}', override: getAppVersionCode(c, platform) },
        { pattern: '{{VERSION_NAME}}', override: getAppVersion(c, platform) },
        { pattern: '{{PLUGIN_IMPLEMENTATIONS}}', override: pluginConfig.pluginImplementations },
        { pattern: '{{PLUGIN_AFTER_EVALUATE}}', override: pluginConfig.pluginAfterEvaluate },
        { pattern: '{{PLUGIN_SIGNING_CONFIGS}}', override: pluginConfig.signingConfigs },
        { pattern: '{{PLUGIN_SPLITS}}', override: pluginConfig.splits },
        { pattern: '{{PLUGIN_PACKAGING_OPTIONS}}', override: pluginConfig.packagingOptions },
        { pattern: '{{PLUGIN_BUILD_TYPES}}', override: pluginConfig.buildTypes },
        { pattern: '{{PLUGIN_MULTI_APKS}}', override: pluginConfig.multiAPKs },
        { pattern: '{{MIN_SDK_VERSION}}', override: pluginConfig.minSdkVersion },
        { pattern: '{{TARGET_SDK_VERSION}}', override: pluginConfig.targetSdkVersion },
        { pattern: '{{COMPILE_SDK_VERSION}}', override: pluginConfig.compileSdkVersion },
        { pattern: '{{PLUGIN_COMPILE_OPTIONS}}', override: pluginConfig.compileOptions },
        { pattern: '{{PLUGIN_LOCAL_PROPERTIES}}', override: pluginConfig.localProperties },
    ]);

    writeCleanFile(path.join(appTemplateFolder, 'build.gradle'), path.join(appFolder, 'build.gradle'), [
        { pattern: '{{COMPILE_SDK_VERSION}}', override: pluginConfig.compileSdkVersion },
        { pattern: '{{SUPPORT_LIB_VERSION}}', override: pluginConfig.supportLibVersion },
        { pattern: '{{BUILD_TOOLS_VERSION}}', override: pluginConfig.buildToolsVersion }
    ]);

    const activityPath = 'app/src/main/java/rnv/MainActivity.kt';
    writeCleanFile(path.join(appTemplateFolder, activityPath), path.join(appFolder, activityPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{PLUGIN_ACTIVITY_IMPORTS}}', override: pluginConfig.pluginActivityImports },
        { pattern: '{{PLUGIN_ACTIVITY_METHODS}}', override: pluginConfig.pluginActivityMethods },
        { pattern: '{{PLUGIN_ON_CREATE}}', override: pluginConfig.pluginActivityCreateMethods },
        { pattern: '{{PLUGIN_ON_ACTIVITY_RESULT}}', override: pluginConfig.pluginActivityResultMethods },
    ]);

    const applicationPath = 'app/src/main/java/rnv/MainApplication.kt';
    writeCleanFile(path.join(appTemplateFolder, applicationPath), path.join(appFolder, applicationPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) },
        { pattern: '{{PLUGIN_IMPORTS}}', override: pluginConfig.pluginImports },
        { pattern: '{{PLUGIN_PACKAGES}}', override: pluginConfig.pluginPackages },
        { pattern: '{{PLUGIN_METHODS}}', override: pluginConfig.mainApplicationMethods },
    ]);

    const splashPath = 'app/src/main/java/rnv/SplashActivity.kt';
    writeCleanFile(path.join(appTemplateFolder, splashPath), path.join(appFolder, splashPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
    ]);

    const stringsPath = 'app/src/main/res/values/strings.xml';
    writeCleanFile(path.join(appTemplateFolder, stringsPath), path.join(appFolder, stringsPath), [
        { pattern: '{{APP_TITLE}}', override: getAppTitle(c, platform) },
    ]);

    let prms = '';
    const { permissions } = c.files.appConfigFile.platforms[platform];
    if (permissions) {
        permissions.forEach((v) => {
            if (c.files.permissionsConfig) {
                const plat = c.files.permissionsConfig.permissions[platform] ? platform : 'android';
                const pc = c.files.permissionsConfig.permissions[plat];
                if (pc[v]) {
                    prms += `\n<uses-permission android:name="${pc[v].key}" />`;
                }
            }
        });
    }

    const manifestFile = 'app/src/main/AndroidManifest.xml';
    writeCleanFile(path.join(appTemplateFolder, manifestFile), path.join(appFolder, manifestFile), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{PERMISIONS}}', override: prms },
    ]);


    // GRADLE.PROPERTIES
    let pluginGradleProperties = '';
    const pluginConfigAndroid = c.files.pluginConfig ? c.files.pluginConfig.android : null;
    const gradleProps = pluginConfigAndroid ? pluginConfigAndroid['gradle.properties'] : null;
    if (gradleProps) {
        for (const key in gradleProps) {
            pluginGradleProperties += `${key}=${gradleProps[key]}\n`;
        }
    }
    const gradleProperties = 'gradle.properties';
    writeCleanFile(path.join(appTemplateFolder, gradleProperties), path.join(appFolder, gradleProperties), [
        { pattern: '{{PLUGIN_GRADLE_PROPERTIES}}', override: pluginGradleProperties }
    ]);

    resolve();
});

const _getPrivateConfig = (c, platform) => {
    const privateConfigFolder = path.join(c.paths.globalConfigFolder, c.files.projectPackage.name, c.files.appConfigFile.id);
    const appConfigSPP = c.files.appConfigFile.platforms[platform] ? c.files.appConfigFile.platforms[platform].signingPropertiesPath : null;
    const appConfigSPPClean = appConfigSPP ? appConfigSPP.replace('{globalConfigFolder}', c.paths.globalConfigFolder) : null;
    const privateConfigPath = appConfigSPPClean || path.join(privateConfigFolder, 'config.private.json');
    c.paths.privateConfigPath = privateConfigPath;
    c.paths.privateConfigDir = privateConfigPath.replace('/config.private.json', '');
    if (fs.existsSync(privateConfigPath)) {
        try {
            const output = JSON.parse(fs.readFileSync(privateConfigPath));
            output.parentFolder = c.paths.privateConfigDir;
            output.path = privateConfigPath;
            logInfo(
                `Found ${chalk.white(privateConfigPath)}. Will use it for production releases!`,
            );
            return output;
        } catch (e) {
            logError(e);
            return null;
        }
    } else {
        logWarning(
            `You're missing ${chalk.white(privateConfigPath)} for this app: . You won't be able to make production releases without it!`,
        );
        return null;
    }
};

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
    configureAndroidProperties,
    runAndroidLog,
};
