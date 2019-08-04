import path from 'path';
import tar from 'tar';
import chalk from 'chalk';
import { logWarning, logInfo, logError, logTask, logDebug } from '../common';
import { getRealPath, removeFilesSync } from './fileutils';
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
