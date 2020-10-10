import path from 'path';
import tar from 'tar';
import {
    chalk,
    logWarning,
    logTask,
    logSuccess,
} from '../../core/systemManager/logger';
import {
    getRealPath,
    removeFilesSync,
    copyFileSync,
    fsWriteFileSync,
    cleanFolder,
    fsExistsSync,
    fsReadFileSync
} from '../../core/systemManager/fileutils';
import { inquirerPrompt } from '../../cli/prompt';
import { getEnvVar, getEnvExportCmd } from '../../core/systemManager/crypto';
import { executeTask } from '../../core/engineManager';
import { TASK_CRYPTO_DECRYPT, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


const iocane = require('iocane');

const _unzipAndCopy = async (
    c,
    shouldCleanFolder,
    destTemp,
    wsPath,
    ts,
    destFolder
) => {
    if (shouldCleanFolder) {
        await cleanFolder(wsPath);
    }

    await tar.x({
        file: destTemp,
        cwd: c.paths.workspace.dir
    });

    removeFilesSync([destTemp]);
    if (fsExistsSync(ts)) {
        copyFileSync(
            ts,
            path.join(
                c.paths.workspace.dir,
                c.files.project.package.name,
                'timestamp'
            )
        );
    }
    logSuccess(`Files succesfully extracted into ${destFolder}`);
};

export const taskRnvCryptoDecrypt = async (c, parentTask, originTask) => {
    logTask('taskRnvCryptoDecrypt');

    if (!parentTask) {
        await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_DECRYPT, originTask);
    }

    const sourceRaw = c.files.project.config?.crypto?.decrypt?.source;

    if (sourceRaw) {
        const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
        const ts = `${source}.timestamp`;
        const destFolder = path.join(
            c.paths.workspace.dir,
            c.files.project.package.name
        );
        const destTemp = `${path.join(
            c.paths.workspace.dir,
            c.files.project.package.name.replace('/', '-')
        )}.tgz`;
        const envVar = getEnvVar(c);
        let shouldCleanFolder = false;
        const wsPath = path.join(
            c.paths.workspace.dir,
            c.files.project.package.name
        );
        const isCryptoReset = c.command === 'crypto' && c.program.reset === true;

        if (c.program.ci !== true && !isCryptoReset) {
            const options = [
                'Yes - override (recommended)',
                'Yes - merge',
                'Skip'
            ];
            const { option } = await inquirerPrompt({
                name: 'option',
                type: 'list',
                choices: options,
                message: `How to decrypt to ${chalk().white(destFolder)} ?`
            });
            if (option === options[0]) {
                shouldCleanFolder = true;
            } else if (option === options[2]) {
                return true;
            }
        } else {
            shouldCleanFolder = true;
        }

        if (fsExistsSync(destTemp)) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: `Found existing decrypted file at ${chalk().white(
                    destTemp
                )}. want to use it and skip decrypt ?`
            });
            if (confirm) {
                await _unzipAndCopy(
                    c,
                    shouldCleanFolder,
                    destTemp,
                    wsPath,
                    ts,
                    destFolder
                );
                return true;
            }
        }

        const key = c.program.key || c.process.env[envVar];
        if (!key) {
            return Promise.reject(`encrypt: You must pass ${chalk().white(
                '--key'
            )} or have env var defined:

${getEnvExportCmd(envVar, 'REPLACE_WITH_ENV_VARIABLE')}

`);
        }
        if (!fsExistsSync(source)) {
            return Promise.reject(
                `Can't decrypt. ${chalk().white(source)} is missing!`
            );
        }

        let data;
        try {
            data = await iocane.createSession()
                .use('cbc')
                .decrypt(fsReadFileSync(source), key);
        } catch (e) {
            if (e?.message?.includes) {
                if (e.message.includes('Signature mismatch')) {
                    const err = `You're trying to decode crypto file encoded with previous version of crypto.
this change was introduced in "rnv@0.29.0"

${e}

      ${chalk().green('SUGGESTION:')}

      ${chalk().yellow('STEP 1:')}
      run: ${chalk().white('rnv crypto encrypt')} locally at least once and commit the result back to your repository

      ${chalk().yellow('STEP 2:')}
      you should be able to use: ${chalk().white('rnv crypto decrypt')} properly now

      ${chalk().yellow('IF ALL HOPE IS LOST:')}
      Raise new issue and copy this SUMMARY box output at:
      ${chalk().white('https://github.com/pavjacko/renative/issues')}
      and we will try to help!

      `;

                    return Promise.reject(err);
                } if (e.message.includes('Authentication failed')) {
                    return Promise.reject(`It seems like you provided invalid decryption key.

${e.stack}

${chalk().green('SUGGESTION:')}

${chalk().yellow('STEP 1:')}
check if your ENV VAR is correct: ${getEnvExportCmd(envVar, '***********')}
or if someone did not encrypt ${chalk().white(source)} with a different key

${chalk().yellow('STEP 2:')}
run crypto decrypt again

${chalk().yellow('IF ALL HOPE IS LOST:')}
Raise new issue and copy this SUMMARY box output at:
${chalk().white('https://github.com/pavjacko/renative/issues')}
and we will try to help!

`);
                }
            }

            return Promise.reject(e);
        }


        fsWriteFileSync(destTemp, data);

        //         try {
        //             await executeAsync(
        //                 c,
        //                 `${_getOpenSllPath(
        //                     c
        //                 )} enc -aes-256-cbc -md md5 -d -in ${source} -out ${destTemp} -k ${key}`,
        //                 { privateParams: [key] }
        //             );
        //         } catch (e) {
        //             const cmd1 = chalk().white(
        //                 `openssl enc -aes-256-cbc -md md5 -d -in ${source} -out ${destTemp} -k $${envVar}`
        //             );
        //             return Promise.reject(`${e}

        // ${chalk().green('SUGGESTION:')}

        // ${chalk().yellow('STEP 1:')}
        // ${cmd1}

        // ${chalk().yellow('STEP 2:')}
        // ${chalk().white(
        //         'run your previous command again and choose to skip openssl once asked'
        //     )}`);
        //         }

        await _unzipAndCopy(
            c,
            shouldCleanFolder,
            destTemp,
            wsPath,
            ts,
            destFolder
        );
    } else {
        logWarning(
            `You don't have {{ crypto.encrypt.dest }} specificed in ${chalk().white(
                c.paths.appConfigBase
            )}`
        );
        return true;
    }
};

export default {
    description: 'Decrypt encrypted project files into local ~/<wokspace>/<project>/..',
    fn: taskRnvCryptoDecrypt,
    task: TASK_CRYPTO_DECRYPT,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
