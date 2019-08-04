import path from 'path';
import tar from 'tar';
import { logWarning, logInfo, logError, logTask } from '../common';
import { getRealPath } from './fileutils';
import { executeAsync } from './exec';

export const encrypt = c => new Promise((resolve, reject) => {
    logTask('encrypt');

    // const source = c.paths.globalProjectFolder;
    const source = `./${c.files.projectPackage.name}`;

    const destRaw = c.files.projectConfig?.crypto?.encrypt?.dest;

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'encrypt.dest')}.tgz.enc`;
        const destTemp = `${path.join(c.paths.globalConfigFolder, c.files.projectPackage.name.replace('/', '-'))}.tgz`;
        console.log('BOOO', dest, destTemp, c.program.key);
        if (!c.program.key) {
            reject(`encrypt: You must pass ${chalk.white('--key')}`);
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
                c.program.key
            ]))
            .then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            });
    } else {
        logWarning('You don\'t have crypto.encrypt');
        resolve();
    }
    // const dest = path.join(c.paths.projectRootFolder, 'travis/globalConfig.tgz');
});

export const decrypt = c => new Promise((resolve, reject) => {

});
