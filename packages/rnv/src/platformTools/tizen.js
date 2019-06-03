/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { execCLI } from '../systemTools/exec';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
    logWarning,
    logInfo,
    logSuccess,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
    writeCleanFile,
    getAppTemplateFolder,
    copyBuildsFolder,
} from '../common';
import { copyFolderContentsRecursiveSync } from '../systemTools/fileutils';
import { buildWeb } from './web';

const configureTizenGlobal = c => new Promise((resolve, reject) => {
    logTask('configureTizenGlobal');
    // Check Tizen Cert
    // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
    const tizenAuthorCert = path.join(c.paths.globalConfigFolder, 'tizen_author.p12');
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

    if (name) {
        return execCLI(c, CLI_TIZEN_EMULATOR, `launch --name ${name}`);
    }
    return Promise.reject('No simulator -t target name specified!');
}

const copyTizenAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyTizenAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.paths.appConfigFolder, 'assets', platform);
    const destPath = path.join(getAppFolder(c, platform));

    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const createDevelopTizenCertificate = c => new Promise((resolve, reject) => {
    logTask('createDevelopTizenCertificate');

    execCLI(c, CLI_TIZEN, 'certificate -- ~/.rnv -a rnv -f tizen_author -p 1234')
        .then(() => addDevelopTizenCertificate(c))
        .then(() => resolve())
        .catch((e) => {
            logError(e);
            resolve();
        });
});

const addDevelopTizenCertificate = c => new Promise((resolve) => {
    logTask('addDevelopTizenCertificate');

    execCLI(c, CLI_TIZEN, 'security-profiles add -n RNVanillaCert -a ~/.rnv/tizen_author.p12 -p 1234')
        .then(() => resolve())
        .catch((e) => {
            logError(e);
            resolve();
        });
});

const getDeviceID = async (c, target) => {
    const connectResponse = await execCLI(c, CLI_SDB_TIZEN, `connect ${target}`, logTask);
    if (connectResponse.includes('failed to connect to remote target')) throw new Error(connectResponse);
    const devicesList = await execCLI(c, CLI_SDB_TIZEN, 'devices', logTask);
    if (devicesList.includes(target)) {
        const lines = devicesList.trim().split(/\r?\n/);
        const devices = lines.filter(line => line.includes(target));

        if (!devices.length) {
            // @todo handle nothing found
            throw new Error(`No device matching ${target} could be found.`);
        }

        if (devices.length > 1) {
            // @todo handle more than one
        }

        const deviceID = devices[0].split('device')[1].trim();
        return deviceID;
    }
    // @todo handle no device
};

const runTizen = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`runTizen:${platform}:${target}`);

    const platformConfig = c.files.appConfigFile.platforms[platform];
    const tDir = getAppFolder(c, platform);

    const tOut = path.join(tDir, 'output');
    const tBuild = path.join(tDir, 'build');
    const tId = platformConfig.id;
    const gwt = `${platformConfig.appName}.wgt`;
    const certProfile = platformConfig.certificateProfile;

    let deviceID;
    const TIZEN_UNINSTALL_APP = `uninstall -p ${tId} -t ${deviceID}`;
    const TIZEN_INSTALL_APP = `install -- ${tOut} -n ${gwt} -t ${deviceID}`;
    const TIZEN_RUN_APP = `run -p ${tId} -t ${deviceID}`;

    configureTizenProject(c, platform)
        .then(() => buildWeb(c, platform))
        .then(() => execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`, logTask))
        .then(() => execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`, logTask))
        .then(() => getDeviceID(c, target).then((device) => { deviceID = device; }))
        .then(() => execCLI(c, CLI_TIZEN, `uninstall -p ${tId} -t ${deviceID}`, logTask))
        .then(() => execCLI(c, CLI_TIZEN, `install -- ${tOut} -n ${gwt} -t ${deviceID}`, logTask))
        .then(() => execCLI(c, CLI_TIZEN, `run -p ${tId} -t ${deviceID}`, logTask))
        .then(() => resolve())
        .catch((e) => {
            if (e && e.includes && e.includes(TIZEN_UNINSTALL_APP)) {
                execCLI(c, CLI_TIZEN, TIZEN_INSTALL_APP, logTask)
                    .then(() => execCLI(c, CLI_TIZEN, TIZEN_RUN_APP, logTask))
                    .then(() => resolve())
                    .catch((err) => {
                        logError(err);
                        logWarning(
                            `Looks like there is no emulator or device connected! Let's try to launch it. "${chalk.white.bold(
                                `rnv target launch -p ${platform} -t ${target}`
                            )}"`
                        );

                        launchTizenSimulator(c, target)
                            .then(() => {
                                logInfo(
                                    `Once simulator is ready run: "${chalk.white.bold(
                                        `rnv run -p ${platform} -t ${target}`
                                    )}" again`
                                );
                                resolve();
                            })
                            .catch(reject);
                    });
            } else {
                reject(e);
            }
        });
});

const buildTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildTizenProject:${platform}`);

    const platformConfig = c.files.appConfigFile.platforms[platform];
    const tDir = getAppFolder(c, platform);

    const tOut = path.join(tDir, 'output');
    const tBuild = path.join(tDir, 'build');
    const certProfile = platformConfig.certificateProfile;

    configureTizenProject(c, platform)
        .then(() => buildWeb(c, platform))
        .then(() => execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`, logTask))
        .then(() => execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`, logTask))
        .then(() => {
            logSuccess(`Your GWT package is located in ${chalk.white(tOut)}.`);
            return resolve();
        })
        .catch(e => reject(e));
});

const configureTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureTizenProject');

    if (!isPlatformActive(c, platform, resolve)) return;

    // configureIfRequired(c, platform)
    //     .then(() => copyTizenAssets(c, platform))
    copyTizenAssets(c, platform)
        .then(() => copyBuildsFolder(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const configFile = 'config.xml';
    const p = c.files.appConfigFile.platforms[platform];
    writeCleanFile(path.join(getAppTemplateFolder(c, platform), configFile), path.join(appFolder, configFile), [
        { pattern: '{{PACKAGE}}', override: p.package },
        { pattern: '{{ID}}', override: p.id },
        { pattern: '{{APP_NAME}}', override: p.appName },
    ]);

    resolve();
});

export {
    launchTizenSimulator,
    copyTizenAssets,
    configureTizenProject,
    createDevelopTizenCertificate,
    addDevelopTizenCertificate,
    runTizen,
    buildTizenProject,
    configureTizenGlobal,
};
