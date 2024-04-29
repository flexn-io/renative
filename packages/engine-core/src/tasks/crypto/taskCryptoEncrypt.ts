import path from 'path';
import tar from 'tar';
import { promisify } from 'util';
import {
    chalk,
    logWarning,
    logSuccess,
    logInfo,
    getRealPath,
    removeFilesSync,
    mkdirSync,
    writeFileSync,
    fsWriteFileSync,
    fsExistsSync,
    fsReadFileSync,
    fsReaddir,
    inquirerPrompt,
    copyFileSync,
    RnvTaskName,
    createTask,
} from '@rnv/core';
import { statSync } from 'fs';
import { TaskOptions, getEnvExportCmd, getEnvVar } from './common';
import { getContext } from '../../getContext';

const iocane = require('iocane');

const readdirAsync = promisify(fsReaddir);

const generateRandomKey = (length: number) =>
    Array(length)
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*')
        .map((x) => x[Math.floor(Math.random() * x.length)])
        .join('');

const initializeCryptoDirectory = async (sourceFolder: string) => {
    const ctx = getContext();
    const targetFile = 'renative.private.json';
    mkdirSync(sourceFolder);

    if (ctx.paths.project.configPrivateExists) {
        const options = [
            'Move renative.private.json into encrypted folder (Recommended)',
            'Copy renative.private.json into encrypted folder',
            'Skip',
        ];
        const { option } = await inquirerPrompt({
            name: 'option',
            type: 'list',
            choices: options,
            message: `Found existing private config in your project ${chalk().grey(
                ctx.paths.project.configPrivate
            )}. What to do next?`,
        });
        if (option === options[0]) {
            copyFileSync(ctx.paths.project.configPrivate, path.join(sourceFolder, targetFile));
            removeFilesSync([ctx.paths.project.configPrivate]);
        } else if (option === options[1]) {
            copyFileSync(ctx.paths.project.configPrivate, path.join(sourceFolder, targetFile));
        }
    }

    if (fsExistsSync(ctx.paths.project.appConfigsDir)) {
        const configDir = path.join(sourceFolder, 'appConfigs');
        mkdirSync(configDir);
        const appConfigsDirs = await readdirAsync(ctx.paths.project.appConfigsDir);
        appConfigsDirs.forEach(async (item: string) => {
            if (item == targetFile) {
                copyFileSync(path.join(ctx.paths.project.appConfigsDir, item), path.join(configDir, targetFile));
            }
            const appConfigDir = path.join(configDir, item);
            const itemPath = path.join(ctx.paths.project.appConfigsDir, item);

            const stat = statSync(itemPath);
            if (stat && stat.isDirectory()) {
                const existingFiles: string[] = await readdirAsync(itemPath);

                existingFiles.map((file) => {
                    if (file === targetFile) {
                        mkdirSync(appConfigDir);
                        mkdirSync(path.join(appConfigDir, 'certs'));

                        copyFileSync(
                            path.join(ctx.paths.project.appConfigsDir, item, targetFile),
                            path.join(appConfigDir, targetFile)
                        );
                    }
                });
            }
        });
    }
};

const _checkAndConfigureCrypto = async () => {
    const ctx = getContext();
    // handle missing config
    const source = `./${ctx.files.project.config?.projectName}`;

    const cnf = ctx.files.project.config_original;
    if (!cnf) return;
    const envVar = getEnvVar();
    if (!envVar) return;

    if (ctx.files.project.config && !ctx.files.project.config.crypto) {
        const { location } = await inquirerPrompt({
            type: 'input',
            name: 'location',
            message:
                'Where would you like your secrets to be residing? (path relative to renative project root, without leading or trailing slash. Ex. `myPrivateConfig/encrypt`)',
            default: 'secrets',
        });
        cnf.crypto = {
            path: `./${location}/privateConfigs.enc`,
        };
        ctx.files.project.config.crypto = cnf.crypto;

        writeFileSync(ctx.paths.project.config, cnf);
    }

    // check if src folder actually exists
    const sourceFolder = path.join(ctx.paths.workspace.dir, source);

    if (!fsExistsSync(sourceFolder)) {
        logInfo(
            `It seems you are running encrypt for the first time. Directory ${chalk().bold(
                sourceFolder
            )} does not exist yet.
RNV will create it for you, make sure you add whatever you want encrypted in it and then run the command again`
        );
        await initializeCryptoDirectory(sourceFolder);
        // writeFileSync(path.join(sourceFolder), ctx.files.project.config);
        await inquirerPrompt({
            type: 'confirm',
            message: 'Once ready, Continue?',
        });

        // if (confirm) return true;
    }

    let key = ctx.program.opts().key || ctx.process.env[envVar];
    let keyGenerated = false;
    if (!key) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: `You haven't passed a key with --key or set an env variable named ${chalk().yellow(
                envVar
            )} for the encryption key. Would you like to generate one?`,
        });
        if (confirm) {
            key = generateRandomKey(20);
            keyGenerated = true;
        } else {
            return Promise.reject(`encrypt: You must pass ${chalk().bold('--key')} or have env var defined:

${getEnvExportCmd(envVar, 'REPLACE_WITH_ENV_VARIABLE')}

Make sure you take into account special characters that might need to be escaped

`);
        }
        if (keyGenerated) {
            logSuccess(`The files were encrypted with key ${chalk().red(
                key
            )}. Make sure you keep it safe! Pass it with --key on decryption or set it as following env variable:

${getEnvExportCmd(envVar, key)} 

Make sure you take into account special characters that might need to be escaped

`);
            ctx.process.env[envVar] = key;
        }
    }
};

export default createTask({
    description: 'Encrypts secure files from `~/<wokspace>/<project>/..` to project',
    fn: async ({ ctx }) => {
        const projectName = ctx.files.project.config?.projectName;
        if (!projectName) {
            return Promise.reject(
                `projectName is missing. Make sure you're in a ReNative project or integration and have projectName defined.`
            );
        }

        const source = `./${projectName}`;

        await _checkAndConfigureCrypto();

        const destRaw = ctx.files.project.config?.crypto?.path;
        const tsWorkspacePath = path.join(ctx.paths.workspace.dir, projectName, 'timestamp');
        const envVar = getEnvVar();

        if (!envVar) return;

        const key = ctx.program.opts().key || ctx.process.env[envVar];

        if (destRaw) {
            const dest = `${getRealPath(destRaw, 'crypto.path')}`;
            const destTemp = `${path.join(ctx.paths.workspace.dir, projectName.replace('/', '-'))}.tgz`;
            const timestamp = new Date().getTime();

            // check if dest folder actually exists
            const destFolder = dest.slice(0, dest.lastIndexOf('/'));

            !fsExistsSync(destFolder) && mkdirSync(destFolder);

            await tar.c(
                {
                    gzip: true,
                    file: destTemp,
                    cwd: ctx.paths.workspace.dir,
                },
                [source]
            );

            const data = await iocane.createSession().use('cbc').encrypt(fsReadFileSync(destTemp), key);

            fsWriteFileSync(dest, data);

            // await executeAsync(
            //     c,
            //     `${_getOpenSllPath(
            //         c
            //     )} enc -aes-256-cbc -md md5 -salt -in ${destTemp} -out ${dest} -k ${key}`,
            //     { privateParams: [key] }
            // );
            removeFilesSync([destTemp]);
            fsWriteFileSync(`${dest}.timestamp`, `${timestamp}`);
            fsWriteFileSync(`${tsWorkspacePath}`, `${timestamp}`);
            logSuccess(`Files succesfully encrypted into ${dest}`);
        } else {
            logWarning(`You don't have {{ crypto.path }} specificed in ${chalk().bold(ctx.paths.appConfigBase)}`);
        }
    },
    options: [TaskOptions.key],
    task: RnvTaskName.cryptoEncrypt,
});
