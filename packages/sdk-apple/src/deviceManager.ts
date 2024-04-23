import {
    chalk,
    logToSummary,
    logDefault,
    logWarning,
    executeAsync,
    RnvContext,
    inquirerPrompt,
    RnvPlatform,
    ExecOptionsPresets,
    logInfo,
    logSuccess,
    getContext,
} from '@rnv/core';
import { AppiumAppleDevice, AppleDevice } from './types';
import { execFileSync } from 'child_process';
import listIOSDevices from '@react-native-community/cli-platform-ios/build/tools/listIOSDevices';

const ERROR_MSG = {
    TARGET_EXISTS: 'Unable to boot device in current state: Booted',
};

export const getAppleDevices = async (c: RnvContext, ignoreDevices?: boolean, ignoreSimulators?: boolean) => {
    const { platform } = c;

    logDefault('getAppleDevices', `ignoreDevices:${ignoreDevices} ignoreSimulators:${ignoreSimulators}`);
    const { skipTargetCheck } = c.program.opts();

    const connectedDevicesArray = await listIOSDevices();
    const allDevicesAndSims = _parseNewIOSDevicesList(connectedDevicesArray);

    let filteredTargets = allDevicesAndSims;

    if (ignoreDevices) {
        filteredTargets = allDevicesAndSims.filter((d) => !d.isDevice);
    }

    if (ignoreSimulators) {
        filteredTargets = allDevicesAndSims.filter((d) => d.isDevice);
    }

    if (!skipTargetCheck) {
        return filteredTargets
            .filter((d) => !d.modelUTI?.includes('watch-')) // filter watches
            .filter((d) => !d.name?.includes('My Mac')) // filter mac
            .filter((d) => {
                // filter other platforms
                if (platform === 'ios' && (d.icon?.includes('Phone') || d.icon?.includes('Tablet'))) {
                    return true;
                }
                if (platform === 'tvos' && d.icon?.includes('TV')) return true;
                return false;
            });
    }
    return filteredTargets;
};

const _parseNewIOSDevicesList = (rawDevices: Array<AppiumAppleDevice>) => {
    const decideIcon = (device: AppiumAppleDevice) => {
        const { modelUTI } = device;
        if (modelUTI?.includes('iphone') || modelUTI?.includes('ipod')) {
            return 'Phone 📱';
        }
        if (modelUTI?.includes('ipad')) {
            return 'Tablet 💊';
        }
        if (modelUTI?.includes('apple-tv')) {
            return 'TV 📺';
        }
        return 'Apple Device';
    };

    return rawDevices.map((device): AppleDevice => {
        const { name, version, udid, type, modelUTI } = device;
        const icon = decideIcon(device);
        return {
            udid,
            name,
            icon,
            version,
            modelUTI,
            isDevice: type === 'device',
        };
    });
};

export const launchAppleSimulator = async (target: string | boolean) => {
    const c = getContext();
    logDefault('launchAppleSimulator', `${target}`);

    const devicesArr = await getAppleDevices(c, true);

    let selectedDevice;
    for (let i = 0; i < devicesArr.length; i++) {
        if (devicesArr[i].name === target) {
            selectedDevice = devicesArr[i];
        }
    }

    if (selectedDevice) {
        logInfo(`Launching: ${chalk().bold(selectedDevice.name)} (use -t to use different target)...`);
        await _launchSimulator(selectedDevice);
        return selectedDevice.name;
    } else if (target !== true && target !== undefined) {
        logWarning(`Your specified simulator target ${chalk().bold(target)} doesn't exist`);
    }

    const devices = devicesArr.map((v) => ({
        name: `${v.name} | ${v.icon} | v: ${chalk().green(v.version)} | udid: ${chalk().grey(v.udid)}${
            v.isDevice ? chalk().red(' (device)') : ''
        }`,
        value: v,
    }));

    const { sim } = await inquirerPrompt({
        name: 'sim',
        message: 'Select the simulator you want to launch',
        type: 'list',
        choices: devices,
    });

    if (sim) {
        await _launchSimulator(sim);
        return sim.name;
    }
    return Promise.reject('Action canceled!');
};

const _launchSimulator = async (selectedDevice: AppleDevice) => {
    if (!selectedDevice.udid) {
        logWarning(`Cannot launch simulator: ${selectedDevice.name} . missing udid`);
        return false;
    }

    // We need to have simulator app launched for "xcrun simctl boot" to take effect
    const developerDir = execFileSync('xcode-select', ['-p'], {
        encoding: 'utf8',
    }).trim();
    execFileSync('open', [
        `${developerDir}/Applications/Simulator.app`,
        '--args',
        '-CurrentDeviceUDID',
        selectedDevice.udid,
    ]);

    try {
        await executeAsync(
            `xcrun simctl boot ${selectedDevice.udid}`,
            ExecOptionsPresets.NO_SPINNER_FULL_ERROR_SUMMARY
        );
    } catch (e) {
        if (typeof e === 'string') {
            if (e.includes(ERROR_MSG.TARGET_EXISTS)) {
                logToSummary(`Target with udid ${chalk().red(selectedDevice.udid)} already running. SKIPPING.`);
                return true;
            }
        }
        return Promise.reject(e);
    }

    logSuccess(`Succesfully launched ${selectedDevice.name}`);
    return true;
};

export const listAppleDevices = async () => {
    logDefault('listAppleDevices');
    const c = getContext();
    const { platform } = c;
    const devicesArr = await getAppleDevices(c);
    let devicesString = '';
    devicesArr.forEach((v, i) => {
        devicesString += ` [${i + 1}]> ${chalk().bold(v.name)} | ${v.icon} | v: ${chalk().green(
            v.version
        )} | udid: ${chalk().grey(v.udid)}${v.isDevice ? chalk().red(' (device)') : ''}\n`;
    });

    logToSummary(`${platform} Targets:\n\n${devicesString}`);
};
