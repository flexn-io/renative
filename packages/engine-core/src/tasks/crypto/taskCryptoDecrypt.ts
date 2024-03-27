import path from 'path';
import tar from 'tar';
import {
    chalk,
    logWarning,
    logSuccess,
    getRealPath,
    removeFilesSync,
    copyFileSync,
    fsWriteFileSync,
    cleanFolder,
    fsExistsSync,
    fsReadFileSync,
    inquirerPrompt,
    RnvContext,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { getEnvExportCmd, getEnvVar } from './common';

const iocane = require('iocane');

const _unzipAndCopy = async (
    ctx: RnvContext,
    shouldCleanFolder: boolean,
    destTemp: string,
    wsPath: string,
    ts: string,
    destFolder: string
) => {
    if (shouldCleanFolder) {
        await cleanFolder(wsPath);
    }

    await tar.x({
        file: destTemp,
        cwd: ctx.paths.workspace.dir,
    });

    removeFilesSync([destTemp]);
    if (ctx.files.project.package.name && fsExistsSync(ts)) {
        copyFileSync(ts, path.join(ctx.paths.workspace.dir, ctx.files.project.package.name, 'timestamp'));
    }
    logSuccess(`Files succesfully extracted into ${destFolder}`);
};

const Task: RnvTask = {
    description: 'Decrypt encrypted project files into local `~/<wokspace>/<project>/..`',
    fn: async ({ ctx }) => {
        const crypto = ctx.files.project.config?.crypto;
        const sourceRaw = crypto?.path;
        const projectName = ctx.files.project.config?.projectName;

        if (!crypto?.isOptional && sourceRaw) {
            const envVar = getEnvVar();
            if (!projectName || !envVar) return;

            const source = `${getRealPath(sourceRaw, 'crypto.path')}`;
            const ts = `${source}.timestamp`;
            const destFolder = path.join(ctx.paths.workspace.dir, projectName);
            const destTemp = `${path.join(ctx.paths.workspace.dir, projectName.replace('/', '-'))}.tgz`;

            let shouldCleanFolder = false;
            const wsPath = path.join(ctx.paths.workspace.dir, projectName);
            const isCryptoReset = ctx.command === 'crypto' && ctx.program.opts().reset === true;

            if (ctx.program.opts().ci !== true && !isCryptoReset && fsExistsSync(destFolder)) {
                const options = ['Yes - override (recommended)', 'Yes - merge', 'Skip'];
                const { option } = await inquirerPrompt({
                    name: 'option',
                    type: 'list',
                    choices: options,
                    message: `How to decrypt to ${chalk().bold(destFolder)} ?`,
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
                    message: `Found existing decrypted file at ${chalk().bold(
                        destTemp
                    )}. want to use it and skip decrypt ?`,
                });
                if (confirm) {
                    await _unzipAndCopy(ctx, shouldCleanFolder, destTemp, wsPath, ts, destFolder);
                    return true;
                }
            }

            const key = ctx.program.opts().key || ctx.process.env[envVar];
            if (!key) {
                return Promise.reject(`encrypt: You must pass ${chalk().bold('--key')} or have env var defined:

${getEnvExportCmd(envVar, 'REPLACE_WITH_ENV_VARIABLE')}

Make sure you take into account special characters that might need to be escaped.
`);
            }
            if (!fsExistsSync(source)) {
                return Promise.reject(`Can't decrypt. ${chalk().bold(source)} is missing!`);
            }

            let data;
            try {
                data = await iocane.createSession().use('cbc').decrypt(fsReadFileSync(source), key);
            } catch (e) {
                if (e instanceof Error) {
                    if (e?.message?.includes) {
                        if (e.message.includes('Signature mismatch')) {
                            const err = `You're trying to decode crypto file encoded with previous version of crypto.
this change was introduced in "rnv@0.29.0"

${e}

      ${chalk().green('SUGGESTION:')}

      ${chalk().yellow('STEP 1:')}
      run: ${chalk().bold('rnv crypto encrypt')} locally at least once and commit the result back to your repository

      ${chalk().yellow('STEP 2:')}
      you should be able to use: ${chalk().bold('rnv crypto decrypt')} properly now

      ${chalk().yellow('IF ALL HOPE IS LOST:')}
      Raise new issue and copy this SUMMARY box output at:
      ${chalk().bold('https://github.com/flexn-io/renative/issues')}
      and we will try to help!

      `;

                            return Promise.reject(err);
                        }
                        if (e.message.includes('Authentication failed')) {
                            return Promise.reject(`It seems like you provided invalid decryption key.

${e.stack}

${chalk().green('SUGGESTION:')}

${chalk().yellow('STEP 1:')}
check if your ENV VAR is correct: ${getEnvExportCmd(envVar, '***********')}
Make sure you take into account special characters that might need to be escaped
or if someone did not encrypt ${chalk().bold(source)} with a different key

${chalk().yellow('STEP 2:')}
run crypto decrypt again

${chalk().yellow('IF ALL HOPE IS LOST:')}
Raise new issue and copy this SUMMARY box output at:
${chalk().bold('https://github.com/flexn-io/renative/issues')}
and we will try to help!

`);
                        }
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
            //             const cmd1 = chalk().bold(
            //                 `openssl enc -aes-256-cbc -md md5 -d -in ${source} -out ${destTemp} -k $${envVar}`
            //             );
            //             return Promise.reject(`${e}

            // ${chalk().green('SUGGESTION:')}

            // ${chalk().yellow('STEP 1:')}
            // ${cmd1}

            // ${chalk().yellow('STEP 2:')}
            // ${chalk().bold(
            //         'run your previous command again and choose to skip openssl once asked'
            //     )}`);
            //         }

            await _unzipAndCopy(ctx, shouldCleanFolder, destTemp, wsPath, ts, destFolder);
        } else {
            logWarning(`You don't have {{ crypto.path }} specificed in ${chalk().bold(ctx.paths.appConfigBase)}`);
            return true;
        }
    },
    task: RnvTaskName.cryptoDecrypt,
};

export default Task;
