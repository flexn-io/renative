import path from 'path';
import tar from 'tar';
import chalk from 'chalk';
import fs from 'fs';
import { logWarning, logInfo, logError, logTask, logDebug, logSuccess, listAppConfigsFoldersSync } from '../common';
import { IOS, TVOS } from '../constants';
import { getRealPath, removeFilesSync, getFileListSync, copyFileSync, mkdirSync, readObjectSync } from './fileutils';
import { executeAsync } from './exec';
import { updateProfile } from '../platformTools/apple/fastlane';

const getEnvVar = (c) => {
    const p1 = c.paths.globalConfigFolder.split('/').pop().replace('.', '');
    const p2 = c.files.projectPackage.name.replace('@', '').replace('/', '_').replace(/-/g, '_');
    const envVar = `CRYPTO_${p1}_${p2}`.toUpperCase();
    logDebug('encrypt looking for env var:', envVar);
    return envVar;
};

export const encrypt = c => new Promise((resolve, reject) => {
    logTask('encrypt');

    const source = `./${c.files.projectPackage.name}`;
    const destRaw = c.files.projectConfig?.crypto?.encrypt?.dest;

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'encrypt.dest')}`;
        const destTemp = `${path.join(c.paths.globalConfigFolder, c.files.projectPackage.name.replace('/', '-'))}.tgz`;

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
                cwd: c.paths.globalConfigFolder
            },
            [source]
        )
            .then(() => executeAsync('openssl', [
                'enc',
                '-aes-256-cbc',
                '-salt',
                '-in',
                destTemp,
                '-out',
                dest,
                '-k',
                key
            ], { privateParams: ['-k'] }))
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

    const sourceRaw = c.files.projectConfig?.crypto?.decrypt?.source;

    if (sourceRaw) {
        const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
        const ts = `${source}.timestamp`;
        const destTemp = `${path.join(c.paths.globalConfigFolder, c.files.projectPackage.name.replace('/', '-'))}.tgz`;
        const envVar = getEnvVar(c);

        const key = c.program.key || c.process.env[envVar];
        if (!key) {
            reject(`encrypt: You must pass ${chalk.white('--key')} or have env var ${chalk.white(envVar)} defined`);
            return;
        }
        executeAsync('openssl', [
            'enc',
            '-aes-256-cbc',
            '-d',
            '-in',
            source,
            '-out',
            destTemp,
            '-k',
            key
        ], { privateParams: ['-k'] })
            .then(() => {
                tar.x(
                    {
                        file: destTemp,
                        cwd: c.paths.globalConfigFolder
                    }
                ).then(() => {
                    removeFilesSync([destTemp]);
                    if (fs.existsSync(ts)) {
                        copyFileSync(ts, path.join(c.paths.globalConfigFolder, c.files.projectPackage.name, 'timestamp'));
                    }
                    logSuccess(`Files succesfully extracted into ${c.paths.globalConfigFolder}`);
                    resolve();
                })
                    .catch(e => reject(e));
            }).catch((e) => {
                reject(e);
            });
    } else {
        logWarning(`You don\'t have {{ crypto.encrypt.dest }} specificed in ${chalk.white(c.paths.projectConfig)}`);
        resolve();
    }
});

export const setupCI = (c) => {
    logTask('setupCI');
    if (c.platform === 'ios') return _setupAppleCI(c);

    logError(`setupCI: platform ${c.platform} not supported`);
    return Promise.resolve();
};

const _setupAppleCI = c => new Promise((resolve, reject) => {
    logTask('_setupAppleCI');
    const ppFolder = path.join(c.paths.homeFolder, 'Library/MobileDevice/Provisioning Profiles');
    const kChain = 'ios-build.keychain';
    const kChainPath = path.join(c.paths.homeFolder, 'Library/Keychains', kChain);
    const tempPass = '***********';

    if (!fs.existsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.globalProjectFolder);
    const cerPromises = [];
    const mobileprovisionArr = list.filter(v => v.endsWith('.mobileprovision'));
    const cerArr = list.filter(v => v.endsWith('.cer'));

    try {
        mobileprovisionArr.forEach((v) => {
            copyFileSync(v, ppFolder);
        });
        copyFileSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/supportFiles/AppleWWDRCA.cer'), ppFolder);
    } catch (e) {
        logError(e);
    }

    // KEYCHAIN
    // console.log('kChainPath', kChainPath);
    // executeAsync('security', ['create-keychain', '-p', tempPass, kChain])
    //     .then(() => executeAsync('security', ['default-keychain', '-s', kChain]))
    //     .then(() => executeAsync('security', ['unlock-keychain', '-p', tempPass, kChain]))
    //     .then(() => executeAsync('security', ['set-keychain-settings', '-t', '3600', '-l', kChainPath]))
    Promise.all(cerArr.map(v => executeAsync('security', [
        'import',
        v,
        '-k',
        kChain,
        '-A'
    ])))
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
        const savedAppConfig = c.files.appConfigFile;
        const scheme = c.program.scheme;
        const appId = c.appId;
        return _updateProfiles(c)
            .then(() => {
                c.files.appConfigFile = savedAppConfig;
                c.appId = appId;
                c.program.scheme = scheme;
            });
    }
    return Promise.reject(`updateProfiles: Platform ${c.platform} not supported`);
};

export const _updateProfiles = (c) => {
    logTask('_updateProfiles', chalk.grey);
    const acList = listAppConfigsFoldersSync(c);
    const fullList = [];
    acList.forEach((v) => {
        const appConfigFile = readObjectSync(path.join(c.paths.appConfigsFolder, v, 'config.json'));

        const buildSchemes = appConfigFile.platforms[c.platform]?.buildSchemes;

        Object.keys(buildSchemes).forEach((scheme) => {
            fullList.push({
                appConfigFile,
                appId: v,
                scheme
            });
        });
    });
    // return Promise.resolve();
    return fullList.reduce((previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)), Promise.resolve());
};

const _updateProfile = (c, v) => new Promise((resolve, reject) => {
    logTask(`_updateProfile:${v}`, chalk.grey);
    c.files.appConfigFile = v.appConfigFile;
    c.program.scheme = v.scheme;
    c.appId = v.appId;
    updateProfile(c)
        .then(() => resolve())
        .catch(e => reject(e));
});
