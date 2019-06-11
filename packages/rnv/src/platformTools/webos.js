/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { executeAsync, execCLI } from '../systemTools/exec';
import {
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    logError,
    getAppFolder,
    isPlatformActive,
    logWarning,
    logInfo,
    logSuccess,
    configureIfRequired,
    getAppVersion,
    getAppTitle,
    getAppVersionCode,
    writeCleanFile,
    getAppId,
    getAppTemplateFolder,
    getEntryFile,
    copyBuildsFolder,
} from '../common';
import {
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_DEVICE_INFO,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_SETUP_DEVICE
} from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../systemTools/fileutils';
import { buildWeb } from './web';

const launchWebOSimulator = c => new Promise((resolve, reject) => {
    logTask('launchWebOSimulator');

    const ePath = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app');

    if (!fs.existsSync(ePath)) {
        reject(`Can't find emulator at path: ${ePath}`);
        return;
    }

    const childProcess = require('child_process');
    childProcess.exec(`open ${ePath}`, (err, stdout, stderr) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});

const copyWebOSAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyWebOSAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.paths.appConfigFolder, 'assets', platform);
    const destPath = path.join(getAppFolder(c, platform), 'RNVApp');

    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const parseDevices = (devicesResponse) => {
    const linesArray = devicesResponse.split('\n').slice(2).map(line => line.trim());
    return linesArray.map((line) => {
        const [name, device, connection, profile] = line.split(' ').map(word => word.trim()).filter(word => word !== '');
        return {
            name,
            device,
            connection,
            profile,
            isDevice: !device.includes('127.0.0.1')
        };
    });
};

const installAndLaunchApp = async (c, target, appPath, tId) => {
    try {
        await execCLI(c, CLI_WEBOS_ARES_INSTALL, `--device ${target} ${appPath}`, logTask);
        await execCLI(c, CLI_WEBOS_ARES_LAUNCH, `--device ${target} ${tId}`, logTask);
    } catch (e) {
        if (e && e.toString().includes(CLI_WEBOS_ARES_INSTALL)) {
            logWarning(
                `Looks like there is no emulator or device connected! Let's try to launch it. "${chalk.white.bold(
                    'rnv target launch -p webos -t emulator'
                )}"`
            );

            await launchWebOSimulator(c, target);
            logInfo(
                `Once simulator is ready run: "${chalk.white.bold('rnv run -p webos -t emulator')}" again`
            );
        } else {
            throw e;
        }
    }
};

const buildDeviceChoices = devices => devices.map(device => ({
    key: device.name, name: `${device.name} - ${device.device}`, value: device.name
}));

const listWebOSTargets = async (c) => {
    const devicesResponse = await execCLI(c, CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = parseDevices(devicesResponse);

    const deviceArray = devices.map((device, i) => `-[${i + 1}] ${device.name} | ${device.device}`);
    console.log(deviceArray.join('\n'));
    return true;
};

const runWebOS = async (c, platform, target) => {
    logTask(`runWebOS:${platform}:${target}`);

    const { device } = c.program;

    const tDir = path.join(getAppFolder(c, platform), 'RNVApp');
    const tOut = path.join(getAppFolder(c, platform), 'output');
    const tSim = c.program.target || 'emulator';
    const configFilePath = path.join(getAppFolder(c, platform), 'RNVApp/appinfo.json');

    const cnfg = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    const tId = cnfg.id;
    const appPath = path.join(tOut, `${tId}_${cnfg.version}_all.ipk`);

    // Start the fun
    await configureWebOSProject(c, platform);
    await buildWeb(c, platform);
    await execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir} -n`, logTask);

    // List all devices
    const devicesResponse = await execCLI(c, CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = parseDevices(devicesResponse);

    if (device) {
        // Running on a device
        const actualDevices = devices.filter(d => d.isDevice);

        if (!actualDevices.length) {
            // No device configured. Asking to configure
            const response = await inquirer.prompt([{
                type: 'confirm',
                name: 'setupDevice',
                message: 'Looks like you want to deploy on a device but have none configured. Do you want to configure one?',
                default: false
            }]);

            if (response.setupDevice) {
                // Yes, I would like that
                logInfo('Please follow the instructions from http://webostv.developer.lge.com/develop/app-test/#installDevModeApp on how to setup the TV and the connection with the PC. Then follow the onscreen prompts\n');
                await executeAsync('bash', [c.cli[CLI_WEBOS_ARES_SETUP_DEVICE]]);

                const newDeviceResponse = await execCLI(c, CLI_WEBOS_ARES_DEVICE_INFO, '-D');
                const dev = parseDevices(newDeviceResponse);
                const actualDev = dev.filter(d => d.isDevice);

                if (actualDev.length > 0) {
                    const newDevice = actualDev[0];
                    // Oh boy, oh boy, I did it! I have a TV connected!
                    logInfo('Please enter the `Passphrase` from the TV\'s Developer Mode app');
                    await executeAsync('bash', [c.cli[CLI_WEBOS_ARES_NOVACOM], '--device', newDevice.name, '--getkey']);
                    await execCLI(c, CLI_WEBOS_ARES_INSTALL, `--device ${newDevice.name} ${appPath}`, logTask);
                    await execCLI(c, CLI_WEBOS_ARES_LAUNCH, `--device ${newDevice.name} ${tId}`, logTask);
                } else {
                    // Yes, I said I would but I didn't
                    // @todo handle user not setting up the device
                }
            }
        } else if (actualDevices.length === 1) {
            const tv = actualDevices[0];
            await execCLI(c, CLI_WEBOS_ARES_INSTALL, `--device ${tv.name} ${appPath}`, logTask);
            await execCLI(c, CLI_WEBOS_ARES_LAUNCH, `--device ${tv.name} ${tId}`, logTask);
        }
    } else if (!c.program.target) {
        // No target specified
        if (devices.length === 1) {
            // One device present
            await installAndLaunchApp(c, devices[0].name, appPath, tId);
        } else if (devices.length > 1) {
            // More than one, choosing
            const choices = buildDeviceChoices(devices);
            const response = await inquirer.prompt([{
                name: 'chosenDevice',
                type: 'list',
                message: 'What device would you like to start the app?',
                choices
            }]);
            if (response.chosenDevice) {
                await installAndLaunchApp(c, response.chosenDevice, appPath, tId);
            }
        } else {
            await installAndLaunchApp(c, tSim, appPath, tId);
        }
    } else {
        // Target specified, using that
        await installAndLaunchApp(c, c.program.target, appPath, tId);
    }
    // .then(() => execCLI(c, CLI_WEBOS_ARES_INSTALL, `--device ${tSim} ${appPath}`, logTask))
    // .then(() => execCLI(c, CLI_WEBOS_ARES_LAUNCH, `--device ${tSim} ${tId}`, logTask))
    // .catch((e) => {
    //     if (e && e.toString().includes(CLI_WEBOS_ARES_INSTALL)) {
    //         logWarning(
    //             `Looks like there is no emulator or device connected! Let's try to launch it. "${chalk.white.bold(
    //                 `rnv target launch -p webos -t ${target}`
    //             )}"`
    //         );

    //         launchWebOSimulator(c, target)
    //             .then(() => {
    //                 logInfo(
    //                     `Once simulator is ready run: "${chalk.white.bold(`rnv run -p ${platform} -t ${target}`)}" again`
    //                 );
    //                 resolve();
    //             })
    //             .catch(err => reject(err));
    //     } else {
    //         reject(e);
    //     }
    // });
};


const buildWebOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildWebOSProject:${platform}`);

    const tDir = path.join(getAppFolder(c, platform), 'public');
    const tOut = path.join(getAppFolder(c, platform), 'output');

    configureWebOSProject(c, platform)
        .then(() => buildWeb(c, platform))
        .then(() => execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir} -n`, logTask))
        .then(() => {
            logSuccess(`Your IPK package is located in ${chalk.white(tOut)}.`);
            return resolve();
        })
        .catch(reject);
});

const configureWebOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureWebOSProject');

    if (!isPlatformActive(c, platform, resolve)) return;

    // configureIfRequired(c, platform)
    //     .then(() => copyWebOSAssets(c, platform))
    copyWebOSAssets(c, platform)
        .then(() => copyBuildsFolder(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const configFile = 'RNVApp/appinfo.json';
    writeCleanFile(path.join(getAppTemplateFolder(c, platform), configFile), path.join(appFolder, configFile), [
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        { pattern: '{{APP_TITLE}}', override: getAppTitle(c, platform) },
        { pattern: '{{APP_VERSION}}', override: getAppVersion(c, platform) },
    ]);

    resolve();
});

export { launchWebOSimulator, copyWebOSAssets, configureWebOSProject, runWebOS, buildWebOSProject, listWebOSTargets };
