import inquirer from 'inquirer';
import chalk from 'chalk';
import child_process from 'child_process';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug
} from '../../common';
import { IOS, TVOS } from '../../constants';

export const getAppleDevices = (c, platform, ignoreDevices, ignoreSimulators) => {
    logTask(`getAppleDevices:${platform},ignoreDevices:${ignoreDevices},ignoreSimulators${ignoreSimulators}`);
    const devices = child_process.execFileSync('xcrun', ['instruments', '-s'], {
        encoding: 'utf8',
    });

    const devicesArr = _parseIOSDevicesList(devices, platform, ignoreDevices, ignoreSimulators);
    return devicesArr;
};

const _parseIOSDevicesList = (text, platform, ignoreDevices = false, ignoreSimulators = false) => {
    const devices = [];
    text.split('\n').forEach((line) => {
        const s1 = line.match(/\[.*?\]/);
        const s2 = line.match(/\(.*?\)/g);
        const s3 = line.substring(0, line.indexOf('(') - 1);
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

            if ((isDevice && !ignoreDevices) || (!isDevice && !ignoreSimulators)) {
                switch (platform) {
                case IOS:
                    if (name.includes('iPhone') || name.includes('iPad') || name.includes('iPod') || isDevice) {
                        let icon = 'Phone 📱';
                        if (name.includes('iPad')) icon = 'Tablet 💊';
                        devices.push({ udid, name, version, isDevice, icon });
                    }
                    break;
                case TVOS:
                    if ((name.includes('Apple TV') || isDevice) && !name.includes('iPhone') && !name.includes('iPad')) {
                        devices.push({ udid, name, version, isDevice, icon: 'TV 📺' });
                    }
                    break;
                default:
                    devices.push({ udid, name, version, isDevice });
                    break;
                }
            }
        }
    });

    return devices;
};

export const launchAppleSimulator = async (c, platform, target) => {
    logTask(`launchAppleSimulator:${platform}:${target}`);

    const devicesArr = getAppleDevices(c, platform, true);
    let selectedDevice;
    for (let i = 0; i < devicesArr.length; i++) {
        if (devicesArr[i].name === target) {
            selectedDevice = devicesArr[i];
        }
    }
    if (selectedDevice) {
        _launchSimulator(selectedDevice);
        return selectedDevice.name;
    }

    logWarning(`Your specified simulator target ${chalk.white(target)} doesn't exists`);
    const devices = devicesArr.map(v => ({ name: `${v.name} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.grey(v.udid)}${v.isDevice ? chalk.red(' (device)') : ''}`, value: v }));

    const { sim } = await inquirer.prompt({
        name: 'sim',
        message: 'Select the simulator you want to launch',
        type: 'list',
        choices: devices
    });

    if (sim) {
        _launchSimulator(sim);
        return sim.name;
    }
    return Promise.reject('Action canceled!');
};

const _launchSimulator = (selectedDevice) => {
    try {
        child_process.spawnSync('xcrun', ['instruments', '-w', selectedDevice.udid]);
    } catch (e) {
        // instruments always fail with 255 because it expects more arguments,
        // but we want it to only launch the simulator
    }
};

export const listAppleDevices = (c, platform) => new Promise((resolve) => {
    logTask(`listAppleDevices:${platform}`);

    const devicesArr = getAppleDevices(c, platform);
    let devicesString = '\n';
    devicesArr.forEach((v, i) => {
        devicesString += ` [${i + 1}]> ${chalk.bold(v.name)} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.grey(v.udid)}${
            v.isDevice ? chalk.red(' (device)') : ''
        }\n`;
    });
    console.log(devicesString);
});
