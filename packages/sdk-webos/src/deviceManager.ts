import path from 'path';
import {
    fsExistsSync,
    getRealPath,
    fsReadFileSync,
    getDirectories,
    executeAsync,
    execCLI,
    openCommand,
    getPlatformProjectDir,
    chalk,
    logToSummary,
    logDefault,
    logInfo,
    logTask,
    logWarning,
    isSystemWin,
    RnvContext,
    inquirerPrompt,
    ExecOptionsPresets,
    isSystemLinux,
    isSystemMac,
    logError,
    logSuccess,
    getConfigProp,
    getAppFolder,
} from '@rnv/core';
import { WebosDevice } from './types';
import {
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
} from './constants';
import semver from 'semver';
import { isUrlLocalhost } from '@rnv/sdk-utils';

export const launchWebOSimulator = async (c: RnvContext, target: string | boolean) => {
    logTask('launchWebOSimulator', `${target}`);
    const webosSdkPath = getRealPath(c.buildConfig?.sdks?.WEBOS_SDK);
    if (!webosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.WEBOS_SDK undefined`);
    }
    const availableSimulatorVersions = getDirectories(path.join(webosSdkPath, 'Simulator'));

    if (target === true) {
        const { selectedSimulator } = await inquirerPrompt({
            name: 'selectedSimulator',
            type: 'list',
            message: 'What simulator would you like to launch?',
            choices: availableSimulatorVersions,
        });

        target = selectedSimulator;
    } else if (typeof target === 'string' && !availableSimulatorVersions.includes(target)) {
        logWarning(
            `Target with name ${chalk().red(target)} does not exist. You can update it here: ${chalk().cyan(
                c.paths.GLOBAL_RNV_CONFIG
            )}`
        );
        await launchWebOSimulator(c, true);
        return true;
    }

    const ePath = path.join(
        webosSdkPath,
        `Simulator/${target}/${target}${isSystemWin ? '.exe' : isSystemLinux ? '.appimage' : '.app'}`
    );

    if (!fsExistsSync(ePath)) {
        return Promise.reject(`Can't find simulator at path: ${ePath}`);
    }
    if (isSystemWin || isSystemLinux) {
        return executeAsync(ePath, ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY);
    }

    await executeAsync(`${openCommand} ${ePath}`, ExecOptionsPresets.FIRE_AND_FORGET);
    logSuccess(`Succesfully launched ${target}`);
    return true;
};

const parseDevices = (c: RnvContext, devicesResponse: string): Promise<Array<WebosDevice>> => {
    const linesArray = devicesResponse
        .split('\n')
        .slice(2)
        .map((line) => line.trim())
        .filter((line) => line !== '');
    return Promise.all(
        linesArray.map(async (line) => {
            const [name, device, connection, profile] = line
                .split(' ')
                .map((word) => word.trim())
                .filter((word) => word !== '');
            let deviceInfo = '';
            try {
                deviceInfo = await execCLI(CLI_WEBOS_ARES_DEVICE_INFO, `-d ${name}`, {
                    silent: true,
                    timeout: 10000,
                });
            } catch (e) {
                if (typeof e === 'string') {
                    deviceInfo = e;
                } else if (e instanceof Error) {
                    deviceInfo = e.message;
                }
            }

            return {
                name,
                device,
                connection,
                profile,
                isDevice: !isUrlLocalhost(device),
                active: !deviceInfo.includes('ERR!'),
            };
        })
    );
};

// Used for simulator
const launchAppOnSimulator = async (c: RnvContext, appPath: string) => {
    logDefault('launchAppOnSimulator');

    const webosSdkPath = getRealPath(c.buildConfig?.sdks?.WEBOS_SDK);

    if (!webosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.WEBOS_SDK undefined`);
    }

    const simulatorDirPath = path.join(webosSdkPath, 'Simulator');

    const webOS_cli_version = await execCLI(CLI_WEBOS_ARES_LAUNCH, `-V`);

    const webOS_cli_version_number = semver.coerce(webOS_cli_version);

    if (!webOS_cli_version_number) {
        return logError(`Couldn't find webOS TV CLI. WebOS TV simulator requires webOS TV CLI 1.12 or higher.`, true);
    } else if (semver.lt(webOS_cli_version_number, '1.12.0')) {
        return logError(
            `WebOS TV simulator requires webOS TV CLI 1.12 or higher. You are using webOS TV CLI ${webOS_cli_version_number}.`,
            true
        );
    }

    const availableEmulatorVersions = getDirectories(simulatorDirPath);

    if (!availableEmulatorVersions.length) {
        return Promise.reject(`Can't find simulator at path: ${simulatorDirPath}`);
    }

    let selectedOption;
    if (availableEmulatorVersions.length > 1) {
        ({ selectedOption } = await inquirerPrompt({
            name: 'selectedOption',
            type: 'list',
            choices: availableEmulatorVersions,
            warningMessage: `Found several installed simulators. Choose which one to use:`,
        }));
    } else {
        selectedOption = availableEmulatorVersions[0];
        logInfo(`Found simulator ${selectedOption} at path: ${simulatorDirPath}`);
    }

    const regex = /\d+(\.\d+)?/g;
    const version = selectedOption.match(regex)[0];
    if (isSystemMac) {
        logInfo(
            `If you encounter damaged simulator error, run this command line: xattr -c ${simulatorDirPath}/${selectedOption}/${selectedOption}.app`
        );
    }

    await execCLI(CLI_WEBOS_ARES_LAUNCH, `-s ${version} ${appPath}`);
    logInfo(
        `Launched app on webOS TV simulator ${selectedOption}. If you do not see the app opening please close the simulator and try again.`
    );
};

// Used for actual devices
const installAndLaunchApp = async (target: string, appPath: string, tId: string) => {
    try {
        await execCLI(CLI_WEBOS_ARES_INSTALL, `--device ${target} ${appPath}`);
    } catch (e) {
        // installing it again if it fails. For some reason webosCLI says that it can't connect to
        // the device from time to time. Running it again works.
        await execCLI(CLI_WEBOS_ARES_INSTALL, `--device ${target} ${appPath}`);
    }
    // const { hosted } = c.program;
    // const { platform } = c;
    // const isHosted = hosted || !getConfigProp(c, platform, 'bundleAssets');
    const toReturn = true;
    // if (isHosted) {
    //     toReturn = startHostedServerIfRequired(c);
    //     await waitForHost(c);
    // }
    await execCLI(CLI_WEBOS_ARES_LAUNCH, `--device ${target} ${tId}`);
    return toReturn;
};

const buildDeviceChoices = (devices: Array<WebosDevice>) =>
    devices.map((device) => ({
        key: device.name,
        name: `${device.name} - ${device.device}`,
        value: device.name,
    }));

export const listWebOSTargets = async (c: RnvContext) => {
    const devicesResponse = await execCLI(CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = await parseDevices(c, devicesResponse);

    const deviceArray = devices.map((device, i) => ` [${i + 1}]> ${chalk().bold(device.name)} | ${device.device}`);

    const webosSdkPath = getRealPath(c.buildConfig?.sdks?.WEBOS_SDK);
    if (!webosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.WEBOS_SDK undefined`);
    }
    const availableSimulatorVersions = getDirectories(path.join(webosSdkPath, 'Simulator'));
    availableSimulatorVersions.map((a) => {
        deviceArray.push(` [${deviceArray.length + 1}]> ${chalk().bold(a)} | simulator`);
    });

    logToSummary(`WebOS Targets:\n${deviceArray.join('\n')}`);

    return true;
};

export const runWebosSimOrDevice = async (c: RnvContext) => {
    const { device } = c.program;

    const platDir = getAppFolder();
    if (!platDir) {
        return Promise.reject(`Cannot determine getAppFolder value`);
    }

    const tDir = getPlatformProjectDir();

    if (!tDir) {
        return Promise.reject(`Cannot determine getPlatformProjectDir value`);
    }
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    const appLocation = bundleAssets ? path.join(tDir, 'build') : tDir;

    if (!appLocation) {
        return Promise.reject(`Cannot determine appLocation value`);
    }
    const tOut = path.join(platDir, 'output');
    const configFilePath = path.join(appLocation, 'appinfo.json');

    const cnfg = JSON.parse(fsReadFileSync(configFilePath).toString());
    const tId = cnfg.id;
    const appPath = path.join(tOut, `${tId}_${cnfg.version}_all.ipk`);

    // Start the fun
    await execCLI(CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${appLocation} -n`);

    // List all devices
    const devicesResponse = await execCLI(CLI_WEBOS_ARES_DEVICE_INFO, '-D');
    const devices = await parseDevices(c, devicesResponse);
    const activeDevices = devices.filter((d) => d.active);

    if (device) {
        // Running on a device
        const actualDevices = devices.filter((d) => d.isDevice);

        if (!actualDevices.length) {
            // No device configured. Asking to configure
            const response = await inquirerPrompt({
                type: 'confirm',
                name: 'setupDevice',
                message: 'You want to deploy on a device but have none configured. Do you want to configure one?',
                default: false,
            });

            if (response.setupDevice) {
                // Yes, I would like that
                logInfo(
                    'Please follow the instructions from http://webostv.developer.lge.com/develop/app-test/#installDevModeApp on how to setup the TV and the connection with the PC. Then follow the onscreen prompts\n'
                );
                await execCLI(CLI_WEBOS_ARES_SETUP_DEVICE, '', ExecOptionsPresets.INHERIT_OUTPUT_NO_SPINNER);

                const newDeviceResponse = await execCLI(CLI_WEBOS_ARES_DEVICE_INFO, '-D');
                const dev = await parseDevices(c, newDeviceResponse);
                const actualDev = dev.filter((d) => d.isDevice);

                if (actualDev.length > 0) {
                    const newDevice = actualDev[0];
                    // Oh boy, oh boy, I did it! I have a TV connected!
                    logInfo("Please enter the `Passphrase` from the TV's Developer Mode app");
                    await execCLI(CLI_WEBOS_ARES_NOVACOM, `--device ${newDevice.name} --getkey`, {
                        stdio: 'inherit',
                    });
                    return installAndLaunchApp(newDevice.name, appPath, tId);
                }
                // Yes, I said I would but I didn't
                // @todo handle user not setting up the device
            }
        } else if (actualDevices.length === 1) {
            const tv = actualDevices[0];
            return installAndLaunchApp(tv.name, appPath, tId);
        }
    } else if (!c.program.target) {
        // No target specified
        if (activeDevices.length === 1) {
            // One device present
            return installAndLaunchApp(devices[0].name, appPath, tId);
        }
        if (activeDevices.length > 1) {
            // More than one, choosing
            const choices = buildDeviceChoices(devices);
            const response = await inquirerPrompt({
                name: 'chosenDevice',
                type: 'list',
                message: 'What device would you like to start the app?',
                choices,
            });
            if (response.chosenDevice) {
                return installAndLaunchApp(response.chosenDevice, appPath, tId);
            }
        } else {
            return launchAppOnSimulator(c, appLocation);
        }
    } else {
        // Target specified, using that
        return installAndLaunchApp(c.program.target, appPath, tId);
    }
};
