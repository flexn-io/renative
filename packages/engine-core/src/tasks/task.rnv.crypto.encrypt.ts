import path from 'path';
import tar from 'tar';
import { promisify } from 'util';
import {
    chalk,
    logWarning,
    logTask,
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
    getEnvVar,
    getEnvExportCmd,
    executeTask,
    TASK_CRYPTO_ENCRYPT,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvContext,
    RnvTaskFn,
    copyFileSync,
    RnvTask,
} from '@rnv/core';
import { statSync } from 'fs';

const iocane = require('iocane');

const readdirAsync = promisify(fsReaddir);

const generateRandomKey = (length: number) =>
    Array(length)
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*')
        .map((x) => x[Math.floor(Math.random() * x.length)])
        .join('');

const initializeCryptoDirectory = async (c: RnvContext, sourceFolder: string) => {
    const configDir = path.join(sourceFolder, 'appConfigs');
    const targetFile = 'renative.private.json';
    mkdirSync(sourceFolder);
    mkdirSync(configDir);

    if (c.paths.project.configPrivateExists) {
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
                c.paths.project.configPrivate
            )}. What to do next?`,
        });
        if (option === options[0]) {
            copyFileSync(c.paths.project.configPrivate, path.join(sourceFolder, targetFile));
            removeFilesSync([c.paths.project.configPrivate]);
        } else if (option === options[1]) {
            copyFileSync(c.paths.project.configPrivate, path.join(sourceFolder, targetFile));
        }
    }
    const appConfigsDirs = await readdirAsync(c.paths.project.appConfigsDir);

    appConfigsDirs.forEach(async (item: string) => {
        if (item == targetFile) {
            copyFileSync(path.join(c.paths.project.appConfigsDir, item), path.join(configDir, targetFile));
        }
        const appConfigDir = path.join(configDir, item);
        const itemPath = path.join(c.paths.project.appConfigsDir, item);

        const stat = statSync(itemPath);
        if (stat && stat.isDirectory()) {
            const existingFiles: string[] = await readdirAsync(itemPath);

            existingFiles.map((file) => {
                if (file === targetFile) {
                    mkdirSync(appConfigDir);
                    mkdirSync(path.join(appConfigDir, 'certs'));

                    copyFileSync(
                        path.join(c.paths.project.appConfigsDir, item, targetFile),
                        path.join(appConfigDir, targetFile)
                    );
                }
            });
        }
    });
};

const _checkAndConfigureCrypto = async (c: RnvContext) => {
    // handle missing config
    const source = `./${c.files.project.config?.projectName}`;

    const cnf = c.files.project.config_original;
    if (!cnf) return;
    const envVar = getEnvVar(c);
    if (!envVar) return;

    if (c.files.project.config && !c.files.project.config.crypto) {
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
        c.files.project.config.crypto = cnf.crypto;

        writeFileSync(c.paths.project.config, cnf);
    }

    // check if src folder actually exists
    const sourceFolder = path.join(c.paths.workspace.dir, source);

    if (!fsExistsSync(sourceFolder)) {
        logInfo(
            `It seems you are running encrypt for the first time. Directory ${chalk().white(
                sourceFolder
            )} does not exist yet.
RNV will create it for you, make sure you add whatever you want encrypted in it and then run the command again`
        );
        await initializeCryptoDirectory(c, sourceFolder);
        // writeFileSync(path.join(sourceFolder), c.files.project.config);
        await inquirerPrompt({
            type: 'confirm',
            message: 'Once ready, Continue?',
        });

        // if (confirm) return true;
    }

    let key = c.program.key || c.process.env[envVar];
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
            return Promise.reject(`encrypt: You must pass ${chalk().white('--key')} or have env var defined:

${getEnvExportCmd(envVar, 'REPLACE_WITH_ENV_VARIABLE')}

`);
        }
        if (keyGenerated) {
            logSuccess(`The files were encrypted with key ${chalk().red(
                key
            )}. Make sure you keep it safe! Pass it with --key on decryption or set it as following env variable:

${getEnvExportCmd(envVar, key)}

`);
            c.process.env[envVar] = key;
        }
    }
};

export const taskRnvCryptoEncrypt: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoEncrypt');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_ENCRYPT, originTask);

    const projectName = c.files.project.config?.projectName;

    if (!projectName) return;

    const source = `./${projectName}`;

    await _checkAndConfigureCrypto(c);

    const destRaw = c.files.project.config?.crypto?.path;
    const tsWorkspacePath = path.join(c.paths.workspace.dir, projectName, 'timestamp');
    const envVar = getEnvVar(c);

    if (!envVar) return;

    const key = c.program.key || c.process.env[envVar];

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'crypto.path')}`;
        const destTemp = `${path.join(c.paths.workspace.dir, projectName.replace('/', '-'))}.tgz`;
        const timestamp = new Date().getTime();

        // check if dest folder actually exists
        const destFolder = dest.slice(0, dest.lastIndexOf('/'));

        !fsExistsSync(destFolder) && mkdirSync(destFolder);

        await tar.c(
            {
                gzip: true,
                file: destTemp,
                cwd: c.paths.workspace.dir,
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
        logWarning(`You don't have {{ crypto.path }} specificed in ${chalk().white(c.paths.appConfigBase)}`);
    }
};

const Task: RnvTask = {
    description: 'Encrypts secure files from `~/<wokspace>/<project>/..` to project',
    fn: taskRnvCryptoEncrypt,
    task: TASK_CRYPTO_ENCRYPT,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
