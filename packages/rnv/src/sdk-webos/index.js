import path from 'path';
import semver from 'semver';
import inquirer from 'inquirer';
import { fsExistsSync, getRealPath, writeCleanFile, fsReadFileSync } from '../core/systemManager/fileutils';
import { executeAsync, execCLI, openCommand } from '../core/systemManager/exec';
import {
    // getAppFolder,
    // getAppSubFolder,
    getPlatformProjectDir,
    // getPlatformBuildDir,
    getTemplateProjectDir,
    getPlatformBuildDir,
    // getTemplateDir,
    getAppVersion,
    // getAppTemplateFolder,
    getAppTitle,
    getAppId,
    // getAppTemplateFolder,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects
} from '../core/common';
import { buildWeb, runWebpackServer, configureCoreWebProject, waitForWebpack } from '../sdk-webpack';

import { waitForEmulator } from '../core/targetManager';
import { isPlatformActive } from '../core/platformManager';
import {
    chalk,
    logToSummary,
    logTask,
    logInfo,
    logSuccess,
    logError
} from '../core/systemManager/logger';
import {
    copyBuildsFolder,
    copyAssetsFolder
} from '../core/projectManager/projectParser';
import {
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_DEVICE_INFO,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    RNV_PROJECT_DIR_NAME,
    RNV_SERVER_DIR_NAME
} from '../core/constants';
import { isSystemWin, isUrlLocalhost } from '../core/utils';

const launchWebOSimulator = (c) => {
    logTask('launchWebOSimulator');

    const ePath = path.join(
        getRealPath(c, c.buildConfig?.sdks?.WEBOS_SDK),
        `Emulator/v4.0.0/LG_webOS_TV_Emulator${
            isSystemWin ? '.exe' : '_RCU.app'
        }`
    );

    if (!fsExistsSync(ePath)) {
        return Promise.reject(`Can't find emulator at path: ${ePath}`);
    }
    if (isSystemWin) { return executeAsync(c, ePath, { detached: true, stdio: 'ignore' }); }
    return executeAsync(c, `${openCommand} ${ePath}`, { detached: true });
};

// const startHostedServerIfRequired = (c) => {
//     if (Config.isWebHostEnabled) {
//         return rnvStart(c);
//     }
// };

const parseDevices = (c, devicesResponse) => {
    const linesArray = devicesResponse
        .split('\n')
        .slice(2)
        .map(line => line.trim())
        .filter(line => line !== '');
    return Promise.all(
        linesArray.map(async (line) => {
            const [name, device, connection, profile] = line
                .split(' ')
                .map(word => word.trim())
                .filter(word => word !== '');
            let deviceInfo = '';
            try {
                deviceInfo = await execCLI(
                    c,
                    CLI_WEBOS_ARES_DEVICE_INFO,
                    `-d ${name}`,
                    { silent: true, timeout: 10000 }
                );
            } catch (e) {
                deviceInfo = e;
            }

            return {
                name,
                device,
                connection,
                profile,
                isDevice: !isUrlLocalhost(device),
                active: !deviceInfo.includes('ERR!')
            };
        })
    );
};

const installAndLaunchApp = async (c, target, appPath, tId) => {
    try {
        await execCLI(
            c,
            CLI_WEBOS_ARES_INSTALL,
            `--device ${target} ${appPath}`
        );
    } catch (e) {
        // installing it again if it fails. For some reason webosCLI says that it can't connect to
        // the device from time to time. Running it again works.
        await execCLI(
            c,
            CLI_WEBOS_ARES_INSTALL,
            `--device ${target} ${appPath}`
        );
    }
    // const { hosted } = c.program;
    // const { platform } = c;
    // const isHosted = hosted || !getConfigProp(c, platform, 'bundleAssets');
    const toReturn = true;
    // if (isHosted) {
    //     toReturn = startHostedServerIfRequired(c);
    //     await waitForWebpack(c);
    // }
    await execCLI(c, CLI_WEBOS_ARES_LAUNCH, `--device ${target} ${tId}`);
    return toReturn;
};

const buildDeviceChoices = devices => devices.map(device => ({
    key: device.name,
    name: `${device.name} - ${device.device}`,
    value: device.name
}));

const listWebOSTargets = async (c) => {
    const devicesResponse = await execCLI(c, CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = await parseDevices(c, devicesResponse);

    const deviceArray = devices.map(
        (device, i) => ` [${i + 1}]> ${chalk().bold(device.name)} | ${device.device}`
    );

    logToSummary(`WebOS Targets:\n${deviceArray.join('\n')}`);

    return true;
};

const waitForEmulatorToBeReady = async (c) => {
    const devicesResponse = await execCLI(c, CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = await parseDevices(c, devicesResponse);
    const emulator = devices.filter(d => !d.isDevice)[0];
    if (!emulator) throw new Error('No WebOS emulator configured');

    return waitForEmulator(
        c,
        CLI_WEBOS_ARES_DEVICE_INFO,
        `-d ${emulator.name}`,
        res => res.includes('modelName')
    );
};

const _runWebosSimOrDevice = async (c) => {
    const { device } = c.program;

    const tDir = getPlatformProjectDir(c);
    const tOut = path.join(getPlatformBuildDir(c), 'output');
    const tSim = c.program.target || 'emulator';
    const configFilePath = path.join(tDir, 'appinfo.json');

    // logTask(`runWebOS:${target}:${isHosted}`, chalk().grey);
    const cnfg = JSON.parse(fsReadFileSync(configFilePath, 'utf-8'));
    const tId = cnfg.id;
    const appPath = path.join(tOut, `${tId}_${cnfg.version}_all.ipk`);


    // Start the fun
    // await buildWeb(c);
    await execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir} -n`);

    // List all devices
    const devicesResponse = await execCLI(c, CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = await parseDevices(c, devicesResponse);
    const activeDevices = devices.filter(d => d.active);

    if (device) {
        // Running on a device
        const actualDevices = devices.filter(d => d.isDevice);

        if (!actualDevices.length) {
            // No device configured. Asking to configure
            const response = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'setupDevice',
                    message:
                      'You want to deploy on a device but have none configured. Do you want to configure one?',
                    default: false
                }
            ]);

            if (response.setupDevice) {
                // Yes, I would like that
                logInfo(
                    'Please follow the instructions from http://webostv.developer.lge.com/develop/app-test/#installDevModeApp on how to setup the TV and the connection with the PC. Then follow the onscreen prompts\n'
                );
                await execCLI(c, CLI_WEBOS_ARES_SETUP_DEVICE, '', {
                    interactive: true
                });

                const newDeviceResponse = await execCLI(
                    c,
                    CLI_WEBOS_ARES_DEVICE_INFO,
                    '-D'
                );
                const dev = await parseDevices(c, newDeviceResponse);
                const actualDev = dev.filter(d => d.isDevice);

                if (actualDev.length > 0) {
                    const newDevice = actualDev[0];
                    // Oh boy, oh boy, I did it! I have a TV connected!
                    logInfo(
                        "Please enter the `Passphrase` from the TV's Developer Mode app"
                    );
                    await execCLI(
                        c,
                        CLI_WEBOS_ARES_NOVACOM,
                        `--device ${newDevice.name} --getkey`,
                        { stdio: 'inherit' }
                    );
                    return installAndLaunchApp(c, newDevice.name, appPath, tId);
                }
                // Yes, I said I would but I didn't
                // @todo handle user not setting up the device
            }
        } else if (actualDevices.length === 1) {
            const tv = actualDevices[0];
            return installAndLaunchApp(c, tv.name, appPath, tId);
        }
    } else if (!c.program.target) {
        // No target specified
        if (activeDevices.length === 1) {
            // One device present
            return installAndLaunchApp(c, devices[0].name, appPath, tId);
        }
        if (activeDevices.length > 1) {
            // More than one, choosing
            const choices = buildDeviceChoices(devices);
            const response = await inquirer.prompt([
                {
                    name: 'chosenDevice',
                    type: 'list',
                    message: 'What device would you like to start the app?',
                    choices
                }
            ]);
            if (response.chosenDevice) {
                return installAndLaunchApp(
                    c,
                    response.chosenDevice,
                    appPath,
                    tId
                );
            }
        } else {
            await launchWebOSimulator(c);
            await waitForEmulatorToBeReady(c);
            return installAndLaunchApp(c, tSim, appPath, tId);
        }
    } else {
        // Target specified, using that
        return installAndLaunchApp(c, c.program.target, appPath, tId);
    }
};

const runWebOS = async (c) => {
    const { hosted } = c.program;
    const { target } = c.runtime;
    const { platform } = c;


    const isHosted = hosted && !getConfigProp(c, platform, 'bundleAssets');

    if (isHosted) {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler(c);
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
    }

    logTask('runWebOS', `target:${target} hosted:${!!isHosted}`);
    if (isHosted) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        await buildWeb(c);
        await _runWebosSimOrDevice(c);
    } else {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().white(
                    platform
                )} devServer at port ${chalk().white(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForWebpack(c)
                .then(() => _runWebosSimOrDevice(c))
                .catch(logError);
            await runWebpackServer(c, isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler(c);
            if (resetCompleted) {
                waitForWebpack(c)
                    .then(() => _runWebosSimOrDevice(c))
                    .catch(logError);
                await runWebpackServer(c, isWeinreEnabled);
            } else {
                await _runWebosSimOrDevice(c);
            }
        }
    }
};

const buildWebOSProject = async (c) => {
    logTask('buildWebOSProject');

    await buildWeb(c);

    if (!c.program.hosted) {
        const tDir = getPlatformProjectDir(c);
        const tOut = path.join(getPlatformBuildDir(c), 'output');
        await execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir} -n`);

        logSuccess(
            `Your IPK package is located in ${chalk().cyan(tOut)} .`
        );
    }
};

const configureWebOSProject = async (c) => {
    logTask('configureWebOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c);

    if (!isPlatformActive(c, platform)) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c, bundleAssets ? RNV_PROJECT_DIR_NAME : RNV_SERVER_DIR_NAME);
    await configureProject(c);
    return copyBuildsFolder(c, platform);
};

const configureProject = async (c) => {
    logTask('configureProject');
    const { platform } = c;

    const configFile = 'appinfo.json';

    const injects = [
        {
            pattern: '{{APPLICATION_ID}}',
            override: getAppId(c, platform).toLowerCase()
        },
        {
            pattern: '{{APP_TITLE}}',
            override: getAppTitle(c, platform)
        },
        {
            pattern: '{{APP_VERSION}}',
            override: semver.coerce(getAppVersion(c, platform))
        }
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        path.join(getTemplateProjectDir(c), configFile),
        path.join(getPlatformProjectDir(c), configFile),
        injects, null, c
    );

    return true;
};

export {
    launchWebOSimulator,
    configureWebOSProject,
    runWebOS,
    buildWebOSProject,
    listWebOSTargets
};
