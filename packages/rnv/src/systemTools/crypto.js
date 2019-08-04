import path from 'path';
import tar from 'tar';
import chalk from 'chalk';
import fs from 'fs';
import { logWarning, logInfo, logError, logTask, logDebug } from '../common';
import { getRealPath, removeFilesSync, getFileListSync, copyFileSync, mkdirSync } from './fileutils';
import { executeAsync } from './exec';

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
            ]))
            .then(() => {
                removeFilesSync([destTemp]);
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
        ])
            .then(() => {
                tar.x(
                    {
                        file: destTemp,
                        cwd: c.paths.globalConfigFolder
                    }
                ).then(() => {
                    removeFilesSync([destTemp]);
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

    mobileprovisionArr.forEach((v) => {
        copyFileSync(v, ppFolder);
    });

    copyFileSync(c.paths.rnvRootFolder, 'src/platformTools/apple/supportFiles/AppleWWDRCA.cer', ppFolder);

    executeAsync('security', ['create-keychain', '-p', tempPass, kChain])
        .then(() => executeAsync('security', ['default-keychain', '-s', kChain]))
        .then(() => executeAsync('security', ['unlock-keychain', '-p', tempPass, kChain]))
        .then(() => executeAsync('security', ['set-keychain-settings', '-t', '3600', '-l', kChainPath]))
        .then(() => Promise.all(cerArr.map(v => executeAsync('security', [
            'import',
            v,
            '-k',
            tempPass,
            '-A'
        ]))))
        .then(() => resolve())
        .catch(e => reject(e));
});
