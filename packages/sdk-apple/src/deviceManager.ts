import child_process from 'child_process';
import { utilities } from 'appium-ios-device';
import {
    chalk,
    logToSummary,
    logTask,
    logWarning,
    logDebug,
    IOS,
    TVOS,
    executeAsync,
    inquirerPrompt,
    RnvPlatform,
} from '@rnv/core';
import { AppiumAppleDevice, AppleDevice, Context } from './types';

export const getAppleDevices = async (c: Context, ignoreDevices?: boolean, ignoreSimulators?: boolean) => {
    const { platform } = c;

    logTask('getAppleDevices', `ignoreDevices:${ignoreDevices} ignoreSimulators:${ignoreSimulators}`);

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
            if (platform === IOS && (d.icon?.includes('Phone') || d.icon?.includes('Tablet'))) {
                return true;
            }
            if (platform === TVOS && d.icon?.includes('TV')) return true;
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
            case IOS:
                if (name?.includes('iPhone') || name?.includes('iPad') || name?.includes('iPod')) {
                    let icon = 'Phone 📱';
                    if (name.includes('iPad')) icon = 'Tablet 💊';
                    return icon;
                }
                return undefined;
            case TVOS:
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

export const launchAppleSimulator = async (c: Context, target: string) => {
    logTask('launchAppleSimulator', `${target}`);

    const devicesArr = await getAppleDevices(c, true);

    let selectedDevice;
    for (let i = 0; i < devicesArr.length; i++) {
        if (devicesArr[i].name === target) {
            selectedDevice = devicesArr[i];
        }
    }
    if (selectedDevice) {
        await _launchSimulator(selectedDevice);
        return selectedDevice.name;
    }

    logWarning(`Your specified simulator target ${chalk().white(target)} doesn't exists`);
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
    try {
        if (selectedDevice.udid) child_process.spawnSync('xcrun', ['simctl', 'boot', selectedDevice.udid]);
    } catch (e) {
        // instruments always fail with 255 because it expects more arguments,
        // but we want it to only launch the simulator
    }

    return true;
};

export const listAppleDevices = async (c: Context) => {
    logTask('listAppleDevices');
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
