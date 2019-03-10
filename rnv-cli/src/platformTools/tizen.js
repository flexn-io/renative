import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { execShellAsync, execCLI } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, checkSdk, logWarning, configureIfRequired,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
    writeCleanFile, getAppTemplateFolder,
} from '../common';
import { TIZEN, TIZEN_WATCH } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import { buildWeb } from './web';

const configureTizenGlobal = c => new Promise((resolve, reject) => {
    logTask('configureTizenGlobal');
    // Check Tizen Cert
    // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
    const tizenAuthorCert = path.join(c.globalConfigFolder, 'tizen_author.p12');
    if (fs.existsSync(tizenAuthorCert)) {
        console.log('tizen_author.p12 file exists!');
        resolve();
    } else {
        console.log('tizen_author.p12 file missing! Creating one for you...');
        createDevelopTizenCertificate(c).then(() => resolve()).catch(e => reject(e));
    }
    // }
});

function launchTizenSimulator(c, name) {
    logTask('launchTizenSimulator');

    if (name) {
        return execCLI(c, CLI_TIZEN_EMULATOR, `launch --name ${name}`);
    }
    return Promise.reject('No simulator -t target name specified!');
}

const copyTizenAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyTizenAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.appConfigFolder, 'assets', platform);
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

const addDevelopTizenCertificate = c => new Promise((resolve, reject) => {
    logTask('addDevelopTizenCertificate');

    execCLI(c, CLI_TIZEN, 'security-profiles add -n RNVanillaCert -a ~/.rnv/tizen_author.p12 -p 1234')
        .then(() => resolve())
        .catch((e) => {
            logError(e);
            resolve();
        });
});

const runTizen = (c, platform) => new Promise((resolve, reject) => {
    logTask(`runTizen:${platform}`);

    const platformConfig = c.appConfigFile.platforms[platform];
    const tDir = getAppFolder(c, platform);

    const tOut = path.join(tDir, 'output');
    const tBuild = path.join(tDir, 'build');
    const tId = platformConfig.id;
    const tSim = c.program.target || 'T-samsung-5.0-x86';
    const gwt = `${platformConfig.appName}.wgt`;
    const certProfile = platformConfig.certificateProfile;


    const TIZEN_UNINSTALL_APP = `uninstall -p ${tId} -t ${tSim}`;
    const TIZEN_INSTALL_APP = `install -- ${tOut} -n ${gwt} -t ${tSim}`;
    const TIZEN_RUN_APP = `run -p ${tId} -t ${tSim}`;

    buildWeb(c, platform)
        .then(() => execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`, logTask))
        .then(() => execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`, logTask))
        .then(() => execCLI(c, CLI_TIZEN, TIZEN_UNINSTALL_APP, logTask))
        .then(() => execCLI(c, CLI_TIZEN, TIZEN_INSTALL_APP, logTask))
        .then(() => execCLI(c, CLI_TIZEN, TIZEN_RUN_APP, logTask))
        .then(() => resolve())
        .catch((e) => {
            if (e && e.includes(TIZEN_UNINSTALL_APP)) {
                execCLI(c, CLI_TIZEN, TIZEN_INSTALL_APP, logTask)
                    .then(() => execCLI(c, CLI_TIZEN, TIZEN_RUN_APP, logTask))
                    .then(() => resolve())
                    .catch((e) => {
                        logWarning(`Looks like there is no emulator or device connected! Try launch one first! "${
                            chalk.white.bold('rnv target launch -p tizen -t <EMULATOR_NAME>')}"`);
                        reject(e);
                    });
            } else {
                reject(e);
            }
        });
});

const configureTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureTizenProject');

    if (!isPlatformActive(c, platform, resolve)) return;

    configureIfRequired(c, platform)
        .then(() => copyTizenAssets(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const configFile = 'config.xml';
    const p = c.appConfigFile.platforms[platform];
    writeCleanFile(path.join(getAppTemplateFolder(c, platform), configFile),
        path.join(appFolder, configFile),
        [
            { pattern: '{{PACKAGE}}', override: p.package },
            { pattern: '{{ID}}', override: p.id },
            { pattern: '{{APP_NAME}}', override: p.appName },
        ]);


    resolve();
});

export {
    launchTizenSimulator, copyTizenAssets, configureTizenProject,
    createDevelopTizenCertificate, addDevelopTizenCertificate, runTizen,
    configureTizenGlobal,
};
