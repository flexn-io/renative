import path from 'path';
import tar from 'tar';
import chalk from 'chalk';
import fs from 'fs';
import { logWarning, logError, logTask, logDebug, logSuccess } from './logger';
import { isSystemMac } from '../utils';
import { listAppConfigsFoldersSync, generateBuildConfig, setAppConfig } from '../configTools/configParser';
import { IOS, TVOS } from '../constants';
import { getRealPath, removeFilesSync, getFileListSync, copyFileSync, mkdirSync, readObjectSync } from './fileutils';
import { executeAsync } from './exec';
import { updateProfile } from '../platformTools/apple/fastlane';
import { inquirerPrompt } from './prompt';
import { cleanFolder } from '../../dist/systemTools/fileutils';

const getEnvVar = (c) => {
    const p1 = c.paths.workspace.dir.split('/').pop().replace('.', '');
    const p2 = c.files.project.package.name.replace('@', '').replace('/', '_').replace(/-/g, '_');
    const envVar = `CRYPTO_${p1}_${p2}`.toUpperCase();
    logDebug('encrypt looking for env var:', envVar);
    return envVar;
};

export const rnvCryptoUpdateProfile = async (c) => {
    await updateProfile(c);
};

export const rnvCryptoEncrypt = c => new Promise((resolve, reject) => {
    logTask('rnvCryptoEncrypt');

    const source = `./${c.files.project.package.name}`;
    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;
    const tsWorkspacePath = path.join(c.paths.workspace.dir, c.files.project.package.name, 'timestamp');

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'encrypt.dest')}`;
        const destTemp = `${path.join(c.paths.workspace.dir, c.files.project.package.name.replace('/', '-'))}.tgz`;
        const timestamp = (new Date()).getTime();
        const envVar = getEnvVar(c);
        const key = c.program.key || c.process.env[envVar];
        if (!key) {
            reject(`encrypt: You must pass ${chalk.white('--key')} or have env var ${chalk.white(envVar)} defined`);
            return;
        }
        tar.c(
            {
                gzip: true,
                file: destTemp,
                cwd: c.paths.workspace.dir
            },
            [source]
        )
            .then(() => executeAsync(c, `${_getOpenSllPath(c)} enc -aes-256-cbc -md md5 -salt -in ${destTemp} -out ${dest} -k ${key}`, { privateParams: [key] }))
            .then(() => {
                removeFilesSync([destTemp]);
                fs.writeFileSync(`${dest}.timestamp`, timestamp);
                fs.writeFileSync(`${tsWorkspacePath}`, timestamp);
                logSuccess(`Files succesfully encrypted into ${dest}`);
                resolve();
            }).catch((e) => {
                reject(e);
            });
    } else {
        logWarning(`You don't have {{ crypto.encrypt.dest }} specificed in ${chalk.white(c.paths.projectConfig)}`);
        resolve();
    }
});

export const rnvCryptoDecrypt = async (c) => {
    logTask('rnvCryptoDecrypt');

    const sourceRaw = c.files.project.config?.crypto?.decrypt?.source;

    if (sourceRaw) {
        const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
        const ts = `${source}.timestamp`;
        const destFolder = path.join(c.paths.workspace.dir, c.files.project.package.name);
        const destTemp = `${path.join(c.paths.workspace.dir, c.files.project.package.name.replace('/', '-'))}.tgz`;
        const envVar = getEnvVar(c);


        const wsPath = path.join(c.paths.workspace.dir, c.files.project.package.name);
        if (c.program.ci !== true && c.program.reset !== true) {
            const options = [
                'Yes - override (recommended)',
                'Yes - merge',
                'Skip'
            ];
            const { option } = await inquirerPrompt({
                name: 'option',
                type: 'list',
                choices: options,
                message: `How to decrypt to ${chalk.white(destFolder)} ?`
            });
            if (option === options[0]) {
                await cleanFolder(wsPath);
            } else if (option === options[2]) {
                return true;
            }
        } else {
            await cleanFolder(wsPath);
        }


        const key = c.program.key || c.process.env[envVar];
        if (!key) {
            return Promise.reject(`encrypt: You must pass ${chalk.white('--key')} or have env var ${chalk.white(envVar)} defined`);
        }
        if (!fs.existsSync(source)) {
            return Promise.reject(`Can't decrypt. ${chalk.white(source)} is missing!`);
        }

        await executeAsync(c, `${_getOpenSllPath(c)} enc -aes-256-cbc -md md5 -d -in ${source} -out ${destTemp} -k ${key}`, { privateParams: [key] });

        await tar.x({
            file: destTemp,
            cwd: c.paths.workspace.dir
        });

        removeFilesSync([destTemp]);
        if (fs.existsSync(ts)) {
            copyFileSync(ts, path.join(c.paths.workspace.dir, c.files.project.package.name, 'timestamp'));
        }
        logSuccess(`Files succesfully extracted into ${destFolder}`);
    } else {
        logWarning(`You don't have {{ crypto.encrypt.dest }} specificed in ${chalk.white(c.paths.projectConfig)}`);
        return true;
    }
};

const _getOpenSllPath = (c) => {
    const { process: { platform } } = c;
    let defaultOpenssl = 'openssl';
    // if (platform === 'linux') defaultOpenssl = path.join(c.paths.rnv.dir, 'bin/openssl-linux');
    if (isSystemMac) defaultOpenssl = path.join(c.paths.rnv.dir, 'bin/openssl-osx');
    // if (fs.existsSync(defaultOpenssl)) {
    //     return defaultOpenssl;
    // }
    // logWarning(`${defaultOpenssl} is missing. will use default one`);

    return defaultOpenssl;
};

export const rnvCryptoInstallProfiles = c => new Promise((resolve, reject) => {
    logTask('rnvCryptoInstallProfiles');
    if (c.platform !== 'ios') {
        logError(`rnvCryptoInstallProfiles: platform ${c.platform} not supported`);
        resolve();
        return;
    }

    const ppFolder = path.join(c.paths.home.dir, 'Library/MobileDevice/Provisioning Profiles');

    if (!fs.existsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.workspace.project.dir);
    const mobileprovisionArr = list.filter(v => v.endsWith('.mobileprovision'));

    try {
        mobileprovisionArr.forEach((v) => {
            console.log(`rnvCryptoInstallProfiles: Installing: ${v}`);
            copyFileSync(v, ppFolder);
        });
    } catch (e) {
        logError(e);
    }

    resolve();
});

export const rnvCryptoInstallCerts = c => new Promise((resolve, reject) => {
    logTask('rnvCryptoInstallCerts');
    const { maxErrorLength } = c.program;

    if (c.platform !== 'ios') {
        logError(`_installTempCerts: platform ${c.platform} not supported`);
        resolve();
        return;
    }
    const kChain = c.program.keychain || 'ios-build.keychain';
    const kChainPath = path.join(c.paths.home.dir, 'Library/Keychains', kChain);
    const list = getFileListSync(c.paths.workspace.project.dir);
    const cerPromises = [];
    const cerArr = list.filter(v => v.endsWith('.cer'));

    Promise.all(cerArr.map(v => executeAsync(c, `security import ${v} -k ${kChain} -A`)))
        .then(() => resolve())
        .catch((e) => {
            logWarning(e);
            resolve();
        });
});


export const rnvCryptoUpdateProfiles = async (c) => {
    logTask('rnvCryptoUpdateProfiles');
    switch (c.platform) {
        case IOS:
        case TVOS:
            const { appId } = c.runtime;
            await _updateProfiles(c);
            await setAppConfig(c, appId);
        default:
            return true;
    }
    return Promise.reject(`updateProfiles: Platform ${c.platform} not supported`);
};

const _updateProfiles = (c) => {
    logTask('_updateProfiles', chalk.grey);
    const acList = listAppConfigsFoldersSync(c, true);
    const fullList = [];
    const currentAppId = c.runtime.appId;

    return acList.reduce((previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)), Promise.resolve());
};

const _updateProfile = (c, v) => new Promise((resolve, reject) => {
    logTask(`_updateProfile:${v}`, chalk.grey);
    updateProfile(c, v)
        .then(() => resolve())
        .catch(e => reject(e));
});

export const checkCrypto = async (c) => {
    logTask('checkCrypto');

    if (c.program.ci) return;

    const sourceRaw = c.files.project.config?.crypto?.decrypt?.source;
    const source = `./${c.files.project.package.name}`;
    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;

    if (destRaw) {
        if (sourceRaw && destRaw) {
            const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
            const tsProjectPath = `${source}.timestamp`;
            const wsPath = path.join(c.paths.workspace.dir, c.files.project.package.name);
            const tsWorkspacePath = path.join(wsPath, 'timestamp');
            if (!fs.existsSync(source)) {
                logWarning('This project uses encrypted files but you don\'t have them installed');
            } else {
                let tsWorkspace = 0;
                let tsProject = 0;
                if (fs.existsSync(tsWorkspacePath)) {
                    tsWorkspace = parseInt(fs.readFileSync(tsWorkspacePath).toString());
                }

                if (fs.existsSync(tsProjectPath)) {
                    tsProject = parseInt(fs.readFileSync(tsProjectPath).toString());
                }

                if (tsProject > tsWorkspace) {
                    logWarning(`Your ${tsWorkspacePath} is out of date. you should run decrypt`);
                    await rnvCryptoDecrypt(c);
                    return;
                }

                if (tsProject < tsWorkspace) {
                    logWarning(`Your ${tsWorkspacePath} is newer than your project one.`);
                }
            }
        }
    }
};
