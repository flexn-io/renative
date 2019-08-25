import path from 'path';
import tar from 'tar';
import chalk from 'chalk';
import fs from 'fs';
import { logWarning, logInfo, logError, logTask, logDebug, logSuccess } from '../common';
import { listAppConfigsFoldersSync, generateBuildConfig, setAppConfig } from '../configTools/configParser';
import { IOS, TVOS, RENATIVE_CONFIG_NAME } from '../constants';
import { getRealPath, removeFilesSync, getFileListSync, copyFileSync, mkdirSync, readObjectSync } from './fileutils';
import { executeAsync } from './exec';
import { updateProfile } from '../platformTools/apple/fastlane';

const getEnvVar = (c) => {
    const p1 = c.paths.private.dir.split('/').pop().replace('.', '');
    const p2 = c.files.project.package.name.replace('@', '').replace('/', '_').replace(/-/g, '_');
    const envVar = `CRYPTO_${p1}_${p2}`.toUpperCase();
    logDebug('encrypt looking for env var:', envVar);
    return envVar;
};

export const encrypt = c => new Promise((resolve, reject) => {
    logTask('encrypt');

    const source = `./${c.files.project.package.name}`;
    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;
    const { maxErrorLength } = c.program;

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'encrypt.dest')}`;
        const destTemp = `${path.join(c.paths.private.dir, c.files.project.package.name.replace('/', '-'))}.tgz`;

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
                cwd: c.paths.private.dir
            },
            [source]
        )
            .then(() => executeAsync(`openssl enc -aes-256-cbc -salt -in ${destTemp} -out ${dest} -k %s`, { privateParams: [key], maxErrorLength }))
            .then(() => {
                removeFilesSync([destTemp]);
                fs.writeFileSync(`${dest}.timestamp`, (new Date()).getTime());
                logSuccess(`Files succesfully encrypted into ${dest}`);
                resolve();
            }).catch((e) => {
                reject(e);
            });
    } else {
        logWarning(`You don\'t have {{ crypto.encrypt.dest }} specificed in ${chalk.white(c.paths.projectConfig)}`);
        resolve();
    }
});

export const decrypt = c => new Promise((resolve, reject) => {
    logTask('encrypt');

    const sourceRaw = c.files.project.config?.crypto?.decrypt?.source;
    const { maxErrorLength } = c.program;

    if (sourceRaw) {
        const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
        const ts = `${source}.timestamp`;
        const destTemp = `${path.join(c.paths.private.dir, c.files.project.package.name.replace('/', '-'))}.tgz`;
        const envVar = getEnvVar(c);

        const key = c.program.key || c.process.env[envVar];
        if (!key) {
            reject(`encrypt: You must pass ${chalk.white('--key')} or have env var ${chalk.white(envVar)} defined`);
            return;
        }
        executeAsync(`openssl enc -aes-256-cbc -d -in ${source} -out ${destTemp} -k %s`, { privateParams: [key], maxErrorLength })
            .then(() => {
                tar.x(
                    {
                        file: destTemp,
                        cwd: c.paths.private.dir
                    }
                ).then(() => {
                    removeFilesSync([destTemp]);
                    if (fs.existsSync(ts)) {
                        copyFileSync(ts, path.join(c.paths.private.dir, c.files.project.package.name, 'timestamp'));
                    }
                    logSuccess(`Files succesfully extracted into ${c.paths.private.dir}`);
                    resolve();
                })
                    .catch(e => reject(e));
            }).catch((e) => {
                reject(e);
            });
    } else {
        logWarning(`You don't have {{ crypto.encrypt.dest }} specificed in ${chalk.white(c.paths.projectConfig)}`);
        resolve();
    }
});

export const installProfiles = c => new Promise((resolve, reject) => {
    logTask('installProfiles');
    if (c.platform !== 'ios') {
        logError(`installProfiles: platform ${c.platform} not supported`);
        resolve();
        return;
    }

    const ppFolder = path.join(c.paths.home.dir, 'Library/MobileDevice/Provisioning Profiles');

    if (!fs.existsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.private.project.dir);
    const mobileprovisionArr = list.filter(v => v.endsWith('.mobileprovision'));

    try {
        mobileprovisionArr.forEach((v) => {
            console.log(`installProfiles: Installing: ${v}`);
            copyFileSync(v, ppFolder);
        });
    } catch (e) {
        logError(e);
    }

    resolve();
});

export const installCerts = c => new Promise((resolve, reject) => {
    logTask('installCerts');
    const { maxErrorLength } = c.program;

    if (c.platform !== 'ios') {
        logError(`_installTempCerts: platform ${c.platform} not supported`);
        resolve();
        return;
    }
    const kChain = c.program.keychain || 'ios-build.keychain';
    const kChainPath = path.join(c.paths.home.dir, 'Library/Keychains', kChain);
    const list = getFileListSync(c.paths.private.project.dir);
    const cerPromises = [];
    const cerArr = list.filter(v => v.endsWith('.cer'));

    Promise.all(cerArr.map(v => executeAsync(`security import ${v} -k ${kChain} -A`, { maxErrorLength })))
        .then(() => resolve())
        .catch((e) => {
            logWarning(e);
            resolve();
        });
});


export const updateProfiles = (c) => {
    logTask('updateProfiles');
    switch (c.platform) {
    case IOS:
    case TVOS:
        const appId = c.runtime.appId;
        return _updateProfiles(c)
            .then(() => {
                setAppConfig(c, appId);
            });
    }
    return Promise.reject(`updateProfiles: Platform ${c.platform} not supported`);
};

export const _updateProfiles = (c) => {
    logTask('_updateProfiles', chalk.grey);
    const acList = listAppConfigsFoldersSync(c);
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
