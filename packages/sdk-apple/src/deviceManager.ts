import { utilities } from 'appium-ios-device';
import {
    chalk,
    logToSummary,
    logDefault,
    logWarning,
    logDebug,
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

const ERROR_MSG = {
    TARGET_EXISTS: 'Unable to boot device in current state: Booted',
};

export const getAppleDevices = async (c: RnvContext, ignoreDevices?: boolean, ignoreSimulators?: boolean) => {
    const { platform } = c;

    logDefault('getAppleDevices', `ignoreDevices:${ignoreDevices} ignoreSimulators:${ignoreSimulators}`);

    const {
        program: { skipTargetCheck },
    } = c;

    const connectedDevicesIds = await utilities.getConnectedDevices();
    const connectedDevicesArray = await Promise.all(
        connectedDevicesIds.map(async (id: string) => {
            const info = await utilities.getDeviceInfo(id);
            return {
                udid: id,
                ...info,
            };
        })
    );

    const res = await executeAsync('xcrun simctl list --json');
    const simctl = JSON.parse(res.toString());
    const availableSims: Array<AppleDevice> = [];
    if (simctl.devices) {
        Object.keys(simctl.devices).forEach((runtime) => {
            logDebug('runtime', runtime);
            simctl.devices[runtime].forEach((device: AppleDevice) => {
                if (device.isAvailable) {
                    availableSims.push({
                        ...device,
                        version: runtime.split('.').pop(),
                    });
                }
            });
        });
    }

    const devicesArr = _parseNewIOSDevicesList(connectedDevicesArray, platform, ignoreDevices);

    const simulatorsArr = _parseIOSDevicesList(availableSims, platform, ignoreDevices, ignoreSimulators);
    let allDevices = [...devicesArr, ...simulatorsArr];

    if (!skipTargetCheck) {
        // filter watches
        allDevices = allDevices.filter((d) => !d.version?.includes('watchOS'));
        // filter other platforms
        allDevices = allDevices.filter((d) => {
            if (platform === 'ios' && (d.icon?.includes('Phone') || d.icon?.includes('Tablet'))) {
                return true;
            }
            if (platform === 'tvos' && d.icon?.includes('TV')) return true;
            return false;
        });
    }
    return allDevices;
};

const _parseNewIOSDevicesList = (
    rawDevices: Array<AppiumAppleDevice>,
    platform: RnvPlatform,
    ignoreDevices = false
) => {
    const devices: Array<AppleDevice> = [];
    if (ignoreDevices) return devices;
    const decideIcon = (device: AppiumAppleDevice) => {
        const { ProductName, DeviceClass } = device;
        if (ProductName?.includes('iPhone') || ProductName?.includes('iPad') || ProductName?.includes('iPod')) {
            let icon = 'Phone 📱';
            if (DeviceClass?.includes('iPad')) icon = 'Tablet 💊';
            return icon;
        }
        if (ProductName?.includes('TV') && !ProductName?.includes('iPhone') && !ProductName?.includes('iPad')) {
            return 'TV 📺';
        }
        return 'Apple Device';
    };

    return rawDevices.map((device) => {
        const { DeviceName, ProductVersion, udid } = device;
        const version = ProductVersion;
        const icon = decideIcon(device);
        return {
            udid,
            name: DeviceName,
            icon,
            version,
            isDevice: true,
        };
    });
};

const _parseIOSDevicesList = (
    rawDevices: string | Array<AppleDevice>,
    platform: RnvPlatform,
    ignoreDevices = false,
    ignoreSimulators = false
) => {
    const devices: Array<AppleDevice> = [];
    const decideIcon = (device: AppleDevice) => {
        const { name, isDevice } = device;
        switch (platform) {
            case 'ios':
                if (name?.includes('iPhone') || name?.includes('iPad') || name?.includes('iPod')) {
                    let icon = 'Phone 📱';
                    if (name.includes('iPad')) icon = 'Tablet 💊';
                    return icon;
                }
                return undefined;
            case 'tvos':
                if (name?.includes('TV') && !name?.includes('iPhone') && !name?.includes('iPad')) {
                    return 'TV 📺';
                }
                return undefined;
            default:
                if (isDevice) {
                    return 'Apple Device';
                }
                return undefined;
        }
    };
    if (typeof rawDevices === 'string' && !ignoreDevices) {
        rawDevices.split('\n').forEach((line) => {
            const s1 = line.match(/\[.*?\]/);
            const s2 = line.match(/\(.*?\)/g);
            // const s3 = line.substring(0, line.indexOf('(') - 1);
            const s4 = line.substring(0, line.indexOf('[') - 1);
            let isSim = false;
            if (s2 && s1) {
                if (s2[s2.length - 1] === '(Simulator)') {
                    isSim = true;
                    s2.pop();
                }
                const version = s2.pop();
                let name = `${s4.substring(0, s4.lastIndexOf('(') - 1)}`;
                name = name || 'undefined';
                const udid = s1[0].replace(/\[|\]/g, '');
                const isDevice = !isSim;
                if (!isDevice) return; // only take care of devices.

                if (!ignoreDevices) {
                    const device = { udid, name, version, isDevice };
                    devices.push({ ...device, icon: decideIcon(device) });
                }
            }
        });
    } else if (typeof rawDevices === 'object' && !ignoreSimulators) {
        rawDevices.forEach((d) => {
            const { name, udid, version } = d;
            const device = {
                name,
                udid,
                isDevice: false,
                version,
            };
            devices.push({ ...device, icon: decideIcon(device) });
        });
    }

    return devices;
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

export const listAppleDevices = async (c: RnvContext) => {
    logDefault('listAppleDevices');
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
