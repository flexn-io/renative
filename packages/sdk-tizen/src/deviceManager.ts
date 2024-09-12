import net from 'net';
import path from 'path';
import {
    getConfigProp,
    getPlatformProjectDir,
    RnvContext,
    execCLI,
    fsRenameSync,
    chalk,
    logDebug,
    logError,
    logInfo,
    logDefault,
    logToSummary,
    logWarning,
    waitForExecCLI,
    inquirerPrompt,
    DEFAULTS,
    executeAsync,
    ExecOptionsPresets,
    RnvFileName,
    getContext,
} from '@rnv/core';
import { CLI_SDB_TIZEN, CLI_TIZEN, CLI_TIZEN_EMULATOR } from './constants';

import { TizenDevice, TizenSecurityConfig } from './types';

const xml2js = require('xml2js');

const parser = new xml2js.Parser();

export const DEFAULT_CERTIFICATE_NAME = 'tizen_author';

const ERROR_MSG = {
    UNKNOWN_VM: 'does not match any VM',
    ALREADY_RUNNING: 'is running now',
};

type PlatKeyObj = {
    _: string;
    $: {
        name: string;
    };
};

const formatXMLObject = (
    obj: Record<
        string,
        {
            platform?:
                | Array<{
                      key: PlatKeyObj[];
                  }>
                | {
                      key: PlatKeyObj[];
                  };
        }
    >
) => {
    const platArr = obj['model-config']?.platform;
    const platKeyArr = Array.isArray(platArr) ? platArr?.[0]?.key : platArr?.key;
    if (platKeyArr) {
        return {
            ...platKeyArr.reduce((acc: Record<string, string>, cur) => {
                acc[cur.$.name] = cur._;
                return acc;
            }, {}),
        };
    }
    logWarning('Invalid object received from shell cat /etc/config/model-config.xml');
    return {};
};

export const launchTizenEmulator = async (name: string | true): Promise<boolean> => {
    const c = getContext();
    logDefault(`launchTizenEmulator:${name}`);

    if (name === true) {
        const emulators = await execCLI(CLI_TIZEN_EMULATOR, 'list-vm');
        const devices = await execCLI(CLI_SDB_TIZEN, 'devices');
        const devices_lines = devices.split('\n');

        const allDownloadedEmulators = emulators.split('\n'); // all tizen, tizenwatch and tizenmobile emulators

        const specificEmulators = await getSubplatformDevices(allDownloadedEmulators, c.platform as string);
        const devicesArr = devices_lines.slice(1).map((line: string) => line.split(' ')[0]); // devices array with only their ip

        const lines = specificEmulators.concat(devicesArr);

        const targetsArray = lines.map((line) => ({ id: line, name: line }));

        const choices = _composeDevicesString(targetsArray);

        const { chosenEmulator } = await inquirerPrompt({
            name: 'chosenEmulator',
            type: 'list',
            message: 'What emulator would you like to launch?',
            choices,
        });

        name = chosenEmulator;
    }

    if (name) {
        const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
        if (name === true || ipRegex.test(name)) {
            logInfo('Connecting to device'); // don't continue with further code - launching on device works diffirently than on emulator
            return true;
        }
        try {
            await executeAsync(
                `${c.cli[CLI_TIZEN_EMULATOR]} launch --name ${name}`,
                ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
            );
            return true;
        } catch (e) {
            if (typeof e === 'string') {
                if (e.includes(ERROR_MSG.UNKNOWN_VM)) {
                    logError(`The VM "${name}" does not exist.`);
                    return launchTizenEmulator(true);
                }

                if (e.includes(ERROR_MSG.ALREADY_RUNNING)) {
                    logError(`The VM "${name}" is already running.`);
                    return true;
                }
            }
        }
    }
    return Promise.reject('No emulator -t target name specified!');
};

const getSubplatformDevices = async (allTizenEmulators: string[], neededPlatform: string) => {
    // subplatform meaning tizen, tizenwatch or tizenmobile
    const specificEmulators = [];
    for (let i = 0; i < allTizenEmulators.length; i++) {
        try {
            const detailString = await execCLI(CLI_TIZEN_EMULATOR, 'detail -n ' + allTizenEmulators[i]);
            if (detailString === undefined) continue;

            const detailLines = detailString // turn the command return into array
                .split('\n')
                .map((line: string) => line.trim())
                .filter((line: string) => line !== '');

            const detailObj = detailLines.reduce<{ [key: string]: string }>((acc: any, line: string) => {
                // make it into a readable object
                const [key, ...value] = line.split(':');
                if (key && value) {
                    acc[key.trim()] = value.join(':').trim();
                }
                return acc;
            }, {});

            const TizenEmulatorTemplate = detailObj.Template.toLowerCase();
            if (
                (neededPlatform === 'tizen' &&
                    (TizenEmulatorTemplate.includes('tizen') || TizenEmulatorTemplate.includes('tv'))) ||
                (neededPlatform === 'tizenwatch' && TizenEmulatorTemplate.includes('wearable')) ||
                (neededPlatform === 'tizenmobile' && TizenEmulatorTemplate.includes('mobile'))
            ) {
                specificEmulators.push(allTizenEmulators[i]);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return specificEmulators;
};

export const listTizenTargets = async (platform: string) => {
    const emulatorsString = await execCLI(CLI_TIZEN_EMULATOR, 'list-vm');
    const devicesString = await execCLI(CLI_SDB_TIZEN, 'devices');
    const devicesArr = devicesString
        .split('\n')
        .slice(1)
        .map((line: string) => line.split(' ')[0]);
    // turns devices string: '  List of devices attached \n192.168.0.105:26101     device          UE43NU7192' to only the '192.168.0.105:26101'

    const allDownloadedEmulators = emulatorsString.split('\n'); // all tizen, tizenwatch and tizenmobile emulators
    const specificPlatformEmulators = await getSubplatformDevices(allDownloadedEmulators.concat(devicesArr), platform); // tizen, tizenwatch, tizenmobile - only 1 of them
    let targetStr = '';
    const finalTargetList = specificPlatformEmulators.concat(devicesArr);
    finalTargetList.forEach((_, i) => {
        targetStr += `[${i}]> ${finalTargetList[i]}\n`;
    });
    logToSummary(`Tizen Targets:\n${targetStr}`);
};

export const createDevelopTizenCertificate = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logDefault('createDevelopTizenCertificate');

        const certDirPath = c.paths.workspace.dir;
        const certFilename = DEFAULT_CERTIFICATE_NAME;
        const certPassword = '1234';

        execCLI(
            CLI_TIZEN,
            `certificate -- ${certDirPath} -a rnv -f ${certFilename} -p ${certPassword}`
            // { privateParams: [certPassword] },
        )
            .then(() =>
                addDevelopTizenCertificate(c, {
                    profileName: DEFAULTS.certificateProfile,
                    certPath: path.join(certDirPath, `${certFilename}.p12`),
                    certPassword,
                })
            )
            .then(() => resolve())
            .catch((e) => {
                logError(e);
                resolve();
            });
    });

export const addDevelopTizenCertificate = (c: RnvContext, secureProfileConfig: TizenSecurityConfig) =>
    new Promise<void>((resolve) => {
        logDefault('addDevelopTizenCertificate');

        const { profileName, certPath, certPassword } = secureProfileConfig || {};
        execCLI(CLI_TIZEN, `security-profiles add -n ${profileName} -a ${certPath} -p ${certPassword}`, {
            privateParams: [certPassword],
        })
            .then(() => resolve())
            .catch((e) => {
                logError(e);
                resolve();
            });
    });

const _getDeviceID = async (target: string) => {
    const c = getContext();
    const { device } = c.program.opts();

    if (device) {
        let connectResponse: string;
        try {
            connectResponse = await execCLI(CLI_SDB_TIZEN, `connect ${target}`);
        } catch (e) {
            if (typeof e === 'string') {
                connectResponse = e;
            } else if (e instanceof Error) {
                connectResponse = e.message;
            } else {
                connectResponse = 'Unknown error';
            }
        }
        if (connectResponse.includes('EPERM')) {
            throw new Error(
                "We can't connect to this device even though it is reachable. Please make sure you have enabled Developer Mode and you have added your IP in the Host PC IP section. For more information consult https://developer.samsung.com/tv/develop/getting-started/using-sdk/tv-device"
            );
        }
        if (connectResponse.includes('failed to connect to remote target')) {
            throw new Error(
                `Failed to connect to ${target}. Make sure the IP is correct and you are connected on the same network.`
            );
        }
        if (connectResponse.includes('error')) throw new Error(connectResponse);
    }

    const devicesList = await execCLI(CLI_SDB_TIZEN, 'devices');
    if (devicesList.includes(target)) {
        const lines = devicesList.trim().split(/\r?\n/);
        const devices = lines.filter((line) => line.includes(target));

        if (devices.length > 1) {
            // @todo handle more than one
        }

        const deviceID = devices[0].split('device')[1].trim();
        return deviceID;
    }
    return Promise.reject(`No device matching ${target} could be found.`);
};

const _getRunningDevices = async (c: RnvContext) => {
    const { platform } = c.program.opts();
    const devicesList = await execCLI(CLI_SDB_TIZEN, 'devices');
    const lines = devicesList
        .trim()
        .split(/\r?\n/)
        .filter((line) => !line.includes('List of devices'));
    const devices: Array<TizenDevice> = [];

    await Promise.all(
        lines.map(async (line) => {
            const words = line.replace(/\t/g, '').split('    ');
            if (words.length >= 3) {
                const name = words[0].trim();
                const deviceInfoXML = await execCLI(
                    CLI_SDB_TIZEN,
                    `-s ${name} shell cat /etc/config/model-config.xml`,
                    { ignoreErrors: true }
                );

                let deviceInfo;
                let deviceType = 'tv';

                if (deviceInfoXML !== '') {
                    // for some reason the tv does not connect through sdb

                    const parseObj = await parser.parseStringPromise(deviceInfoXML);

                    deviceInfo = formatXMLObject(parseObj);
                    deviceType = deviceInfo['tizen.org/feature/profile'];
                }

                if (
                    (platform === 'tizenmobile' && deviceType === 'mobile') ||
                    (platform === 'tizenwatch' && deviceType === 'wearable') ||
                    (platform === 'tizen' && (!deviceType || deviceType === 'tv'))
                ) {
                    devices.push({
                        name,
                        type: words[1].trim(),
                        id: words[2].trim(),
                        deviceType,
                    });
                }
            }
        })
    );
    return devices;
};

const _waitForEmulatorToBeReady = (target: string): Promise<boolean> =>
    waitForExecCLI(CLI_SDB_TIZEN, 'devices', (res) => {
        if (typeof res === 'string') {
            const lines = res.trim().split(/\r?\n/);
            const devices = lines.filter((line) => line.includes(target) && line.includes('device'));
            return devices.length > 0;
        }
        return res;
    });

const _composeDevicesString = (devices: Array<Pick<TizenDevice, 'id' | 'name'>>) =>
    devices.map((device) => ({
        key: device.id,
        name: device.name,
        value: device.id,
    }));

// const startHostedServerIfRequired = (c) => {
//     if (Context.isWebHostEnabled) {
//         return rnvStart(c);
//     }
// };

export const runTizenSimOrDevice = async () => {
    const c = getContext();
    const { target } = c.runtime;
    const { platform } = c;
    let isRunningEmulator = false;

    if (!platform) return;

    const appName = getConfigProp('appName');

    if (!appName) {
        throw new Error(
            `runTizen: ${chalk().grey(platform)}.appName not defined in your ${chalk().bold.white(
                c.paths.appConfig.config
            )}`
        );
    }

    const bundleAssets = getConfigProp('bundleAssets') === true;
    const tDir = getPlatformProjectDir()!;
    // use build folder only if webpack is used, i.e. bundleAssets is true
    const tBuild = bundleAssets ? path.join(tDir, 'build') : tDir;
    const intermediate = path.join(tDir, 'intermediate');
    const tOut = path.join(tDir, 'output');
    const tId = getConfigProp('id');
    const certProfile = getConfigProp('certificateProfile') || DEFAULTS.certificateProfile;

    const wgt = `${appName}.wgt`;
    // the tizen CLI cannot handle .wgt files with spaces correctly.
    const wgtClean = `${appName.replace(/[^a-z0-9]/gi, '_')}.wgt`;

    let deviceID: string;

    if (!tId) return Promise.reject(`Tizen platform requires "id" filed in platforms.tizen`);

    const askForEmulator = async () => {
        const { startEmulator } = await inquirerPrompt({
            name: 'startEmulator',
            type: 'confirm',
            message: `Could not find or connect to the specified target (${target}). Would you like to start an emulator?`,
        });

        if (startEmulator) {
            isRunningEmulator = true;
            const defaultTarget = c.files.workspace.config?.defaultTargets?.[platform];
            if (!defaultTarget) {
                logError('No default target found for tizen. please provide one using -t option');
                return;
            }
            try {
                await launchTizenEmulator(defaultTarget);
                deviceID = defaultTarget;
                await _waitForEmulatorToBeReady(defaultTarget);
                return continueLaunching();
            } catch (e) {
                logDebug(`askForEmulator:ERRROR: ${e}`);
                try {
                    await execCLI(CLI_TIZEN_EMULATOR, `create -n ${defaultTarget} -p tv-samsung-5.0-x86`);
                    await launchTizenEmulator(defaultTarget);
                    deviceID = defaultTarget;
                    await _waitForEmulatorToBeReady(defaultTarget);
                    return continueLaunching();
                } catch (err) {
                    logDebug(err);
                    logError(
                        `Could not find the specified target and could not create the emulator automatically.
Please create one and then edit the default target from ${c.paths.workspace.dir}/${RnvFileName.renative}`
                    );
                }
            }
        }
    };

    const continueLaunching = async () => {
        let hasDevice = false;

        await execCLI(CLI_TIZEN, `build-web -- "${tBuild}" -out "${intermediate}"`);
        await execCLI(CLI_TIZEN, `package -- "${intermediate}" -s ${certProfile} -t wgt -o "${tOut}"`);

        try {
            const packageID = platform === 'tizenwatch' || platform === 'tizenmobile' ? tId.split('.')[0] : tId;
            await execCLI(CLI_TIZEN, `uninstall -p ${packageID} -t ${deviceID}`, { ignoreErrors: true });
            hasDevice = true;
        } catch (e) {
            if (typeof e === 'string' && e.includes('No device matching')) {
                if (target) {
                    isRunningEmulator = true;
                    await launchTizenEmulator(target);
                    hasDevice = await _waitForEmulatorToBeReady(target);
                } else {
                    return Promise.reject('Not target specified. (-t)');
                }
            }
        }
        try {
            if (wgtClean !== wgt) {
                logInfo(
                    `Your app name contains characters like spaces, changing output from "${wgt}" to "${wgtClean}"`
                );
                fsRenameSync(path.join(tOut, wgt), path.join(tOut, wgtClean));
            }
        } catch (err) {
            logError(err);
        }
        try {
            await execCLI(CLI_TIZEN, `install -- "${tOut}" -n ${wgtClean} -t ${deviceID}`);
            hasDevice = true;
        } catch (err) {
            logError(err);
            logWarning(
                `There is no target connected! Let's try to launch it. "${chalk().white.bold(
                    `rnv target launch -p ${platform} -t ${target}`
                )}"`
            );

            if (target) {
                isRunningEmulator = true;
                await launchTizenEmulator(target);
                hasDevice = await _waitForEmulatorToBeReady(target);
            } else {
                return Promise.reject('Not target specified. (-t)');
            }
        }

        const toReturn = true;

        // if (isHosted) {
        //     toReturn = startHostedServerIfRequired(c);
        //     await waitForHost();
        // }

        if (platform !== 'tizenwatch' && platform !== 'tizenmobile' && hasDevice) {
            // change id for for emulator because tizen 8+ fails to run app
            await execCLI(CLI_TIZEN, `run -p ${isRunningEmulator ? tId.split('.')[0] : tId} -t ${deviceID}`);
        } else if ((platform === 'tizenwatch' || platform === 'tizenmobile') && hasDevice) {
            const packageID = tId.split('.');
            await execCLI(CLI_TIZEN, `run -p ${packageID[0]} -t ${deviceID}`);
        }
        return toReturn;
    };

    // Check if target is present or it's the default one
    const isTargetSpecified = !!target;

    // Check for running devices
    const devices = await _getRunningDevices(c);

    if (isTargetSpecified) {
        // The user requested a specific target, searching for it in active ones
        if (net.isIP(target)) {
            deviceID = await _getDeviceID(target);
            return continueLaunching();
        }

        if (devices.length > 0) {
            const targetDevice = devices.find((device) => device.id === target || device.name === target);
            if (targetDevice) {
                deviceID = targetDevice.id;
                return continueLaunching();
            }
        }
        try {
            // try to launch it, see if it's a emulator that's not started yet
            isRunningEmulator = true;
            await launchTizenEmulator(target);
            await _waitForEmulatorToBeReady(target);
            deviceID = target;
            return continueLaunching();
        } catch (e) {
            return askForEmulator();
        }
    } else {
        if (devices.length === 1) {
            deviceID = devices[0].id;
            return continueLaunching();
        }
        if (devices.length > 1) {
            const choices = _composeDevicesString(devices);
            const { chosenEmulator } = await inquirerPrompt({
                name: 'chosenEmulator',
                type: 'list',
                message: 'On what target would you like to run the app?',
                choices,
            });
            deviceID = chosenEmulator;
            return continueLaunching();
        }
        return askForEmulator();
    }
};
