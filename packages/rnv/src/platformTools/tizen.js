/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import net from 'net';
import parser from 'xml2json';

import { execCLI } from '../systemTools/exec';
import { RENATIVE_CONFIG_NAME, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_SDB_TIZEN } from '../constants';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
    logWarning,
    logDebug,
    logSuccess,
    writeCleanFile,
    getAppTemplateFolder,
    getConfigProp,
    waitForEmulator
} from '../common';
import { copyAssetsFolder, copyBuildsFolder } from '../projectTools/projectParser';
import { copyFolderContentsRecursiveSync } from '../systemTools/fileutils';
import { buildWeb } from './web';

const CHECK_INTEVAL = 2000;

const formatXMLObject = obj => ({
    ...obj['model-config'].platform.key.reduce((acc, cur, i) => {
        acc[cur.name] = cur.$t;
        return acc;
    }, {})
});

const configureTizenGlobal = c => new Promise((resolve, reject) => {
    logTask('configureTizenGlobal');
    // Check Tizen Cert
    // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
    const tizenAuthorCert = path.join(c.paths.private.dir, 'tizen_author.p12');
    if (fs.existsSync(tizenAuthorCert)) {
        console.log('tizen_author.p12 file exists!');
        resolve();
    } else {
        console.log('tizen_author.p12 file missing! Creating one for you...');
        createDevelopTizenCertificate(c)
            .then(() => resolve())
            .catch(e => reject(e));
    }
    // }
});

function launchTizenSimulator(c, name) {
    logTask(`launchTizenSimulator:${name}`);
    const { maxErrorLength } = c.program;

    if (name) {
        return execCLI(c, CLI_TIZEN_EMULATOR, `launch --name ${name}`, { detached: true, maxErrorLength });
    }
    return Promise.reject('No simulator -t target name specified!');
}

const createDevelopTizenCertificate = c => new Promise((resolve, reject) => {
    logTask('createDevelopTizenCertificate');
    const { maxErrorLength } = c.program;

    execCLI(c, CLI_TIZEN, `certificate -- ${c.paths.private.dir} -a rnv -f tizen_author -p 1234`, { maxErrorLength })
        .then(() => addDevelopTizenCertificate(c))
        .then(() => resolve())
        .catch((e) => {
            logError(e);
            resolve();
        });
});

const addDevelopTizenCertificate = c => new Promise((resolve) => {
    logTask('addDevelopTizenCertificate');
    const { maxErrorLength } = c.program;

    execCLI(c, CLI_TIZEN, `security-profiles add -n RNVanillaCert -a ${path.join(c.paths.private.dir, 'tizen_author.p12')} -p 1234`, { maxErrorLength })
        .then(() => resolve())
        .catch((e) => {
            logError(e);
            resolve();
        });
});

const getDeviceID = async (c, target) => {
    const { device, maxErrorLength } = c.program;

    if (device) {
        const connectResponse = await execCLI(c, CLI_SDB_TIZEN, `connect ${target}`, { maxErrorLength });
        if (connectResponse.includes('failed to connect to remote target')) throw new Error(connectResponse);
    }

    const devicesList = await execCLI(c, CLI_SDB_TIZEN, 'devices', { maxErrorLength });
    if (devicesList.includes(target)) {
        const lines = devicesList.trim().split(/\r?\n/);
        const devices = lines.filter(line => line.includes(target));

        if (devices.length > 1) {
            // @todo handle more than one
        }

        const deviceID = devices[0].split('device')[1].trim();
        return deviceID;
    }
    throw `No device matching ${target} could be found.`;
};

const getRunningDevices = async (c) => {
    const { platform, maxErrorLength } = c.program;
    const devicesList = await execCLI(c, CLI_SDB_TIZEN, 'devices', { maxErrorLength });
    const lines = devicesList.trim().split(/\r?\n/).filter(line => !line.includes('List of devices'));
    const devices = [];

    await Promise.all(lines.map(async (line) => {
        const words = line.replace(/\t/g, '').split('    ');
        if (words.length >= 3) {
            const name = words[0].trim();
            const deviceInfoXML = await execCLI(c, CLI_SDB_TIZEN, `-s ${name} shell cat /etc/config/model-config.xml`, { ignoreErrors: true });

            let deviceInfo,
                deviceType;

            if (deviceInfoXML !== true) {
                // for some reason the tv does not connect through sdb
                deviceInfo = formatXMLObject(parser.toJson(deviceInfoXML, { object: true, reversible: false }));
                deviceType = deviceInfo['tizen.org/feature/profile'];
            }

            if ((platform === 'tizenmobile' && deviceType === 'mobile') || (platform === 'tizenwatch' && deviceType === 'wearable') || (platform === 'tizen' && !deviceType)) {
                devices.push({
                    name,
                    type: words[1].trim(),
                    id: words[2].trim(),
                    deviceType,
                });
            }
        }
    }));

    return devices;
};

const waitForEmulatorToBeReady = (c, target) => waitForEmulator(c, CLI_SDB_TIZEN, 'devices', (res) => {
    const lines = res.trim().split(/\r?\n/);
    const devices = lines.filter(line => line.includes(target) && line.includes('device'));
    return devices.length > 0;
});

const composeDevicesString = devices => devices.map(device => ({ key: device.id, name: device.name, value: device.id }));

const runTizen = async (c, platform, target) => {
    logTask(`runTizen:${platform}:${target}`);

    const platformConfig = c.buildConfig.platforms[platform];
    const { hosted, maxErrorLength } = c.program;

    const isHosted = hosted || !getConfigProp(c, platform, 'bundleAssets');

    if (!platformConfig) {
        throw new Error(`runTizen: ${chalk.blue(platform)} not defined in your ${chalk.white(c.paths.appConfig.config)}`);
    }
    if (!platformConfig.appName) {
        throw new Error(`runTizen: ${chalk.blue(platform)}.appName not defined in your ${chalk.white(c.paths.appConfig.config)}`);
    }

    const tDir = getAppFolder(c, platform);
    const tBuild = path.join(tDir, 'build');
    const tOut = path.join(tDir, 'output');
    const tId = platformConfig.id;
    const gwt = `${platformConfig.appName}.wgt`;
    const certProfile = platformConfig.certificateProfile;


    let deviceID;

    const askForEmulator = async () => {
        const { startEmulator } = await inquirer.prompt([{
            name: 'startEmulator',
            type: 'confirm',
            message: `Could not find or connect to the specified target (${target}). Would you like to start an emulator?`,
        }]);

        if (startEmulator) {
            const defaultTarget = c.files.private.config.defaultTargets[platform];
            try {
                await launchTizenSimulator(c, defaultTarget);
                deviceID = defaultTarget;
                await waitForEmulatorToBeReady(c, defaultTarget);
                return continueLaunching();
            } catch (e) {
                logDebug(`askForEmulator:ERRROR: ${e}`);
                try {
                    await execCLI(c, CLI_TIZEN_EMULATOR, `create -n ${defaultTarget} -p tv-samsung-5.0-x86`, { maxErrorLength });
                    await launchTizenSimulator(c, defaultTarget);
                    deviceID = defaultTarget;
                    await waitForEmulatorToBeReady(c, defaultTarget);
                    return continueLaunching();
                } catch (err) {
                    logDebug(err);
                    logError(`Could not find the specified target and could not create the emulator automatically. Please create one and then edit the default target from ${c.paths.private.dir}/${RENATIVE_CONFIG_NAME}`);
                }
            }
        }
    };

    const continueLaunching = async () => {
        let hasDevice = false;
        const { maxErrorLength } = c.program;

        !isHosted && await buildWeb(c, platform);
        await execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`, { maxErrorLength });
        await execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`, { maxErrorLength });

        try {
            const packageID = platform === 'tizenwatch' || platform === 'tizenmobile' ? tId.split('.')[0] : tId;
            await execCLI(c, CLI_TIZEN, `uninstall -p ${packageID} -t ${deviceID}`, { ignoreErrors: true });
            hasDevice = true;
        } catch (e) {
            if (e && e.includes && e.includes('No device matching')) {
                await launchTizenSimulator(c, target);
                hasDevice = await waitForEmulatorToBeReady(c, target);
            }
        }
        try {
            await execCLI(c, CLI_TIZEN, `install -- ${tOut} -n ${gwt} -t ${deviceID}`, { maxErrorLength });
            hasDevice = true;
        } catch (err) {
            logError(err);
            logWarning(
                `Looks like there is no emulator or device connected! Let's try to launch it. "${chalk.white.bold(
                    `rnv target launch -p ${platform} -t ${target}`
                )}"`
            );

            await launchTizenSimulator(c, target);
            hasDevice = await waitForEmulatorToBeReady(c, target);
        }

        if (platform !== 'tizenwatch' && platform !== 'tizenmobile' && hasDevice) {
            await execCLI(c, CLI_TIZEN, `run -p ${tId} -t ${deviceID}`, { maxErrorLength });
        } else if ((platform === 'tizenwatch' || platform === 'tizenmobile') && hasDevice) {
            const packageID = tId.split('.');
            await execCLI(c, CLI_TIZEN, `run -p ${packageID[0]} -t ${deviceID}`, { maxErrorLength });
        }
        return true;
    };

    // Check if target is present or it's the default one
    const isTargetSpecified = c.program.target;

    // Check for running devices
    const devices = await getRunningDevices(c);

    if (isTargetSpecified) {
        // The user requested a specific target, searching for it in active ones
        if (net.isIP(target)) {
            deviceID = await getDeviceID(c, target);
            return continueLaunching();
        }

        if (devices.length > 0) {
            const targetDevice = devices.find(device => device.id === target || device.name === target);
            if (targetDevice) {
                deviceID = targetDevice.id;
                return continueLaunching();
            }
        }
        try {
            // try to launch it, see if it's a simulator that's not started yet
            await launchTizenSimulator(c, target);
            await waitForEmulatorToBeReady(c, target);
            deviceID = target;
            return continueLaunching();
        } catch (e) {
            return askForEmulator();
        }
    } else {
        if (devices.length === 1) {
            deviceID = devices[0].id;
            return continueLaunching();
        } if (devices.length > 1) {
            const choices = composeDevicesString(devices);
            const { chosenEmulator } = await inquirer.prompt([{
                name: 'chosenEmulator',
                type: 'list',
                message: 'On what emulator would you like to run the app?',
                choices
            }]);
            deviceID = chosenEmulator;
            return continueLaunching();
        }
        return askForEmulator();
    }
};

const buildTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildTizenProject:${platform}`);

    const platformConfig = c.buildConfig.platforms[platform];
    const tDir = getAppFolder(c, platform);
    const { maxErrorLength } = c.program;
    const tOut = path.join(tDir, 'output');
    const tBuild = path.join(tDir, 'build');
    const certProfile = platformConfig.certificateProfile;

    buildWeb(c, platform)
        .then(() => execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`, { maxErrorLength }))
        .then(() => execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`, { maxErrorLength }))
        .then(() => {
            logSuccess(`Your GWT package is located in ${chalk.white(tOut)} .`);
            return resolve();
        })
        .catch(e => reject(e));
});

const configureTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureTizenProject');

    if (!isPlatformActive(c, platform, resolve)) return;

    copyAssetsFolder(c, platform)
        .then(() => copyBuildsFolder(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const configFile = 'config.xml';
    const p = c.buildConfig.platforms[platform];
    writeCleanFile(path.join(getAppTemplateFolder(c, platform), configFile), path.join(appFolder, configFile), [
        { pattern: '{{PACKAGE}}', override: p.package },
        { pattern: '{{ID}}', override: p.id },
        { pattern: '{{APP_NAME}}', override: p.appName },
    ]);

    resolve();
});

export {
    launchTizenSimulator,
    configureTizenProject,
    createDevelopTizenCertificate,
    addDevelopTizenCertificate,
    runTizen,
    buildTizenProject,
    configureTizenGlobal,
};
