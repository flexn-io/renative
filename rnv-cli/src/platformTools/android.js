/* eslint-disable import/no-cycle */
// @todo fix circular
import path from 'path';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import shell from 'shelljs';
import child_process from 'child_process';
import { executeAsync, execCLI } from '../exec';
import { createPlatformBuild } from '../cli/platform';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
    copyBuildsFolder,
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
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import { IS_TABLET_ABOVE_INCH, ANDROID_WEAR, ANDROID, ANDROID_TV, IS_WEAR_UNDER_SIZE } from '../constants';

const readline = require('readline');

const composeDevicesString = (devices, platform) => {
    const devicesArray = [];

    const p = platform;
    devices.forEach((v, i) => {
        if ((p === ANDROID_WEAR && v.isWear) || (p === ANDROID_TV && v.isTV) || p === ANDROID && v.isMobile) devicesArray.push(_getDeviceString(v, i));
    });

    return `\n${devicesArray.join('')}`;
};

const launchAndroidSimulator = (c, platform, target, isIndependentThread = false) => {
    logTask(`launchAndroidSimulator:${platform}:${target}`);

    if (target === '?' || target === undefined || target === '') {
        return _listAndroidTargets(c, true, false, false)
            .then((devicesArr) => {
                const devicesString = composeDevicesString(devicesArr, platform);
                const readlineInterface = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                readlineInterface.question(getQuestion(`${devicesString}\nType number of the emulator you want to launch`), (v) => {
                    const selectedDevice = devicesArr[parseInt(v, 10) - 1];
                    if (selectedDevice) {
                        if (isIndependentThread) {
                            execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${selectedDevice.name}"`).catch(logError);
                            resolve();
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
            resolve();
        }
        return execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${target}"`);
    }
    return Promise.reject('No simulator -t target name specified!');
};

const listAndroidTargets = (c) => {
    logTask('listAndroidTargets');
    return _listAndroidTargets(c, false, false).then(list => composeDevicesString(list, c.platform)).then((devices) => {
        console.log(devices);
        return devices;
    });
};

const _getDeviceString = (device, i) => {
    const {
        isTV, isTablet, name, udid, isDevice, isActive, avdConfig, isWear
    } = device;
    let deviceIcon = '';
    if (isTablet) deviceIcon = 'Tablet 💊 ';
    if (isTV) deviceIcon = 'TV 📺 ';
    if (isWear) deviceIcon = 'Wear ⌚ ';
    if (!deviceIcon && (udid !== 'unknown' || avdConfig)) deviceIcon = 'Phone 📱 ';

    return `-[${i + 1}] ${chalk.white(name)} | ${deviceIcon} | udid: ${chalk.blue(udid)}${isDevice ? chalk.red(' (device)') : ''} ${
        isActive ? chalk.magenta(' (active)') : ''
    }\n`;
};

const _listAndroidTargets = (c, skipDevices, skipAvds, deviceOnly = false, skipPlatformFilter = false) => {
    logTask(`_listAndroidTargets:${c.platform}`);
    try {
        let devicesResult;
        let avdResult;

        if (!skipDevices) {
            devicesResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} devices -l`).toString();
        }
        if (!skipAvds) {
            avdResult = child_process.execSync(`${c.cli[CLI_ANDROID_EMULATOR]} -list-avds`).toString();
        }
        return _parseDevicesResult(devicesResult, avdResult, deviceOnly, skipPlatformFilter, c);
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

const getDeviceType = async (device, c) => {
    device.isPhone = true;
    device.isMobile = true;
    if (device.udid !== 'unknown') {
        const dumpsysResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${device.udid} shell dumpsys tv_input`).toString();
        const screenSizeResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${device.udid} shell wm size`).toString();
        const screenDensityResult = child_process.execSync(`${c.cli[CLI_ANDROID_ADB]} -s ${device.udid} shell wm density`).toString();

        let screenProps;

        if (screenSizeResult) {
            const [width, height] = screenSizeResult.split('Physical size: ')[1].split('x');
            screenProps = { width: parseInt(width, 10), height: parseInt(height, 10) };
        }

        if (screenDensityResult) {
            const density = screenDensityResult.split('Physical density: ')[1];
            screenProps = { ...screenProps, density: parseInt(density, 10) };
        }

        if (screenSizeResult && screenDensityResult) {
            const { width, height, density } = screenProps;

            const diagonalInches = calculateDeviceDiagonal(width, height, density);
            screenProps = { ...screenProps, diagonalInches };
            device.isTablet = diagonalInches > IS_TABLET_ABOVE_INCH;
            device.isWear = isSquareishDevice(width, height);
        }

        device.isTV = !!dumpsysResult;
        device.isPhone = !device.isTablet && !device.isWear && !device.isTV;
        device.isMobile = !device.isWear && !device.isTV;
        device.screenProps = screenProps;
        return device;
    }

    if (device.avdConfig) {
        const batteryPresent = device.avdConfig['hw.battery'];
        const density = parseInt(device.avdConfig['hw.lcd.density'], 10);
        const width = parseInt(device.avdConfig['hw.lcd.width'], 10);
        const height = parseInt(device.avdConfig['hw.lcd.height'], 10);

        // Better detect wear
        const sysdir = device.avdConfig['image.sysdir.1'];
        const tagId = device.avdConfig['tag.id'];
        const tagDisplay = device.avdConfig['tag.display'];
        const deviceName = device.avdConfig['hw.device.name'];

        device.isWear = false;
        [sysdir, tagId, tagDisplay, deviceName].forEach((string) => {
            if (string.includes('wear')) device.isWear = true;
        });

        const diagonalInches = calculateDeviceDiagonal(width, height, density);
        device.isTablet = diagonalInches > IS_TABLET_ABOVE_INCH;
        device.isTV = batteryPresent !== 'yes';
        device.isPhone = !device.isTablet && !device.isWear && !device.isTV;
        device.isMobile = !device.isWear && !device.isTV;
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

const _parseDevicesResult = async (devicesString, avdsString, deviceOnly, skipPlatformFilter, c) => {
    const devices = [];

    if (devicesString) {
        const lines = devicesString.trim().split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
            const words = lines[i].split(/[ ,\t]+/).filter(w => w !== '');

            if (words[1] === 'device') {
                const isDevice = !words[0].includes('emulator');
                if ((deviceOnly && isDevice) || !deviceOnly) {
                    devices.push({
                        udid: words[0],
                        isDevice,
                        isActive: true,
                        name: _getDeviceProp(words, 'model:'),
                    });
                }
            }
        }
    }

    if (avdsString) {
        const avdLines = avdsString.trim().split(/\r?\n/);

        await Promise.all(avdLines.map(async (line) => {
            const avdDetails = await getAvdDetails(line);
            try {
                // Yes, 2 greps. Hacky but it excludes the grep process corectly and quickly :)
                // if this runs without throwing it means that the simulator is running so it needs to be excluded
                child_process.execSync(`ps x | grep "qemu.*${line}" | grep -v grep`);
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

    return Promise.all(devices.map(device => getDeviceType(device, c)));
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
    const sourcePath = path.join(c.appConfigFolder, `assets/${platform}/res`);
    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const packageAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask('packageAndroid');

    // CRAPPY BUT Android Wear does not support webview required for connecting to packager. this is hack to prevent RN connectiing to running bundler
    const { entryFile } = c.files.appConfigFile.platforms[platform];
    const outputFile = entryFile;

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
    const appFolder = getAppFolder(c, platform);
    shell.cd(`${appFolder}`);

    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');

    const devicesArr = await _listAndroidTargets(c, false, true, c.program.device !== undefined);
    if (devicesArr.length === 1) {
        const dv = devicesArr[0];
        logInfo(`Found device ${dv.name}:${dv.udid}!`);
        await _runGradleApp(c, platform, appFolder, signingConfig, dv);
    } else if (devicesArr.length > 1) {
        logWarning('More than one device is connected!');
        const devicesString = composeDevicesString(devicesArr, platform);
        const readlineInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        await new Promise((resolve, reject) => readlineInterface.question(getQuestion(`${devicesString}\nType number of the device to use`), (v) => {
            const selectedDevice = devicesArr[parseInt(v, 10) - 1];
            if (selectedDevice) {
                logInfo(`Selected device ${selectedDevice.name}:${selectedDevice.udid}!`);
                _runGradleApp(c, platform, appFolder, signingConfig, selectedDevice)
                    .then(resolve)
                    .catch(reject);
            } else {
                logError(`Wrong choice ${v}! Ingoring`);
            }
        }));
    } else if (c.files.globalConfig.defaultTargets[platform]) {
        logWarning(
            `No connected devices found. Launching ${chalk.white(c.files.globalConfig.defaultTargets[platform])} emulator!`,
        );
        await launchAndroidSimulator(c, platform, c.files.globalConfig.defaultTargets[platform], true);
        const device = await _checkForActiveEmulator(c, platform);
        await _runGradleApp(c, platform, appFolder, signingConfig, device);
    } else {
        throw new Error(
            `No active or connected devices! You can launch android emulator with ${chalk.white(
                'rnv target launch -p android -t <TARGET_NAME>',
            )}`,
        );
    }
};


const _checkForActiveEmulator = (c, platform) => new Promise((resolve) => {
    let attempts = 1;
    const maxAttempts = 8;
    const poll = setInterval(() => {
        _listAndroidTargets(c, false, true, false)
            .then((v) => {
                if (v.length > 0) {
                    logSuccess(`Found active emulator! ${chalk.white(v[0].udid)}. Will use it`);
                    clearInterval(poll);
                    resolve(v[0]);
                } else {
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
    }, 2000);
});

const _runGradleApp = (c, platform, appFolder, signingConfig, device) => new Promise((resolve, reject) => {
    const bundleId = getConfigProp(c, platform, 'id');
    const outputFolder = signingConfig === 'Debug' ? 'debug' : 'release';
    executeAsync(process.platform === 'win32' ? 'gradlew.bat' : './gradlew', [
        `assemble${signingConfig}`,
        '-x',
        'bundleReleaseJsAndAssets',
    ])
        .then(() => {
            let apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}.apk`);
            if (!fs.existsSync(apkPath)) {
                apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}-unsigned.apk`);
            }
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

const buildAndroid = (c, platform) => new Promise((resolve) => {
    logTask(`buildAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);

    shell.cd(`${appFolder}`);
    shell.exec('./gradlew assembleRelease -x bundleReleaseJsAndAssets', (error) => {
        if (error) {
            logError(`Command 'gradlew assembleRelease -x bundleReleaseJsAndAssets' failed with error code ${error}`, true);
            return;
        }

        logSuccess(`Your APK is located in ${chalk.white(path.join(appFolder, 'app/build/outputs/apk/release'))}.`);
        resolve();
    });
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
        `#Generated by ReNative
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
                pluginConfig.pluginImplementations += `${plugin.implementation}`;
            } else {
                pluginConfig.pluginImplementations += `    implementation project(':${plugin.projectName}')\n`;
            }
        }
    } else {
        pluginConfig.pluginIncludes += `, ':${key}'`;
        pluginConfig.pluginPaths += `project(':${key}').projectDir = new File(rootProject.projectDir, '${modulePath}')\n`;
        if (!plugin.skipImplementation) {
            if (plugin.implementation) {
                pluginConfig.pluginImplementations += `${plugin.implementation}`;
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
        pluginConfig.pluginActivityMethods += `${plugin.activityMethods.join('\n    ')}`;
    }
    if (pkg) pluginConfig.pluginImports += `import ${pkg}\n`;
    if (className) pluginConfig.pluginPackages += `${className}(${packageParams}),\n`;

    if (plugin.implementations) {
        plugin.implementations.forEach((v) => {
            pluginConfig.pluginImplementations += `    implementation '${v}'\n`;
        });
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
    const pluginConfig = {
        pluginIncludes,
        pluginPaths,
        pluginImports,
        pluginPackages,
        pluginImplementations,
        pluginAfterEvaluate,
        pluginActivityImports,
        pluginActivityMethods,
    };
        // PLUGINS
    if (c.files.appConfigFile && c.files.pluginConfig) {
        const { includedPlugins } = c.files.appConfigFile.common;
        if (includedPlugins) {
            const { plugins } = c.files.pluginConfig;
            Object.keys(plugins).forEach((key) => {
                if (includedPlugins.includes('*') || includedPlugins.includes(key)) {
                    const plugin = plugins[key][platform];
                    if (plugin) {
                        if (plugins[key]['no-active'] !== true) {
                            if (plugin.packages) {
                                plugin.packages.forEach((ppkg) => {
                                    _injectPlugin(c, plugin, key, ppkg, pluginConfig);
                                });
                            } else {
                                _injectPlugin(c, plugin, key, plugin.package, pluginConfig);
                            }
                        }
                    }
                }
            });
        }
    }
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

    writeCleanFile(path.join(appTemplateFolder, 'settings.gradle'), path.join(appFolder, 'settings.gradle'), [
        { pattern: '{{PLUGIN_INCLUDES}}', override: pluginConfig.pluginIncludes },
        { pattern: '{{PLUGIN_PATHS}}', override: pluginConfig.pluginPaths },
    ]);

    writeCleanFile(path.join(appTemplateFolder, 'app/build.gradle'), path.join(appFolder, 'app/build.gradle'), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{VERSION_CODE}}', override: getAppVersionCode(c, platform) },
        { pattern: '{{VERSION_NAME}}', override: getAppVersion(c, platform) },
        { pattern: '{{PLUGIN_IMPLEMENTATIONS}}', override: pluginConfig.pluginImplementations },
        { pattern: '{{PLUGIN_AFTER_EVALUATE}}', override: pluginConfig.pluginAfterEvaluate },
    ]);

    const activityPath = 'app/src/main/java/rnv/MainActivity.kt';
    writeCleanFile(path.join(appTemplateFolder, activityPath), path.join(appFolder, activityPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{PLUGIN_ACTIVITY_IMPORTS}}', override: pluginConfig.pluginActivityImports },
        { pattern: '{{PLUGIN_ACTIVITY_METHODS}}', override: pluginConfig.pluginActivityMethods },
    ]);

    const applicationPath = 'app/src/main/java/rnv/MainApplication.kt';
    writeCleanFile(path.join(appTemplateFolder, applicationPath), path.join(appFolder, applicationPath), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{ENTRY_FILE}}', override: getEntryFile(c, platform) },
        { pattern: '{{PLUGIN_IMPORTS}}', override: pluginConfig.pluginImports },
        { pattern: '{{PLUGIN_PACKAGES}}', override: pluginConfig.pluginPackages },
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

    // RELEASE CONFIGS
    const globalAppConfigPath = path.join(c.paths.globalConfigFolder, c.files.appConfigFile.id);
    const signingPropertiesPath = path.join(globalAppConfigPath, 'signing.properties');
    let signingPropFile = null;
    if (fs.existsSync(signingPropertiesPath)) {
        signingPropFile = `new File("${signingPropertiesPath}")`;
    } else {
        logWarning(
            `You're missing signing.properties for this app: ${chalk.white(
                signingPropertiesPath,
            )}. You won't be able to make production releases without it!`,
        );
    }
    writeCleanFile(path.join(appTemplateFolder, 'build.gradle'), path.join(appFolder, 'build.gradle'), [
        { pattern: '{{SIGNING_PROPS_FILE}}', override: signingPropFile },
    ]);

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
    configureAndroidProperties,
    runAndroidLog,
};
