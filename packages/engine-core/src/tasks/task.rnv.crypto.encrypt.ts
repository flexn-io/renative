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
} from '@rnv/core';

const iocane = require('iocane');

const readdirAsync = promisify(fsReaddir);

const generateRandomKey = (length: number) =>
    Array(length)
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*')
        .map((x) => x[Math.floor(Math.random() * x.length)])
        .join('');

const _checkAndConfigureCrypto = async (c: RnvContext) => {
    // handle missing config
    const source = `./${c.files.project.package.name}`;

    const cnf = c.files.project.config_original;
    if (!cnf) return;
    const envVar = getEnvVar(c);
    if (!envVar) return;

    if (c.files.project.config && !c.files.project.config.crypto) {
        const { location } = await inquirerPrompt({
            type: 'input',
            name: 'location',
            message:
                'Where would you like your secrets to be residing? (path relative to root, without leading or trailing slash. Ex. `myPrivateConfig/encrypt`)',
            default: 'secrets',
        });
        cnf.crypto = {
            encrypt: {
                dest: `PROJECT_HOME/${location}/privateConfigs.enc`,
            },
            decrypt: {
                source: `PROJECT_HOME/${location}/privateConfigs.enc`,
            },
        };
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
        const configDir = path.join(sourceFolder, 'appConfigs');
        mkdirSync(sourceFolder);
        mkdirSync(configDir);

        const appConfigsDirs = await readdirAsync(c.paths.project.appConfigsDir);
        appConfigsDirs.forEach(async (item: string) => {
            const targetFile = 'renative.private.json';
            const appConfigDir = path.join(configDir, item);

            const existingFiles: string[] = await readdirAsync(`${c.paths.project.appConfigsDir}/${item}`);

            existingFiles.map((file) => {
                if (file === targetFile) {
                    mkdirSync(appConfigDir);
                    mkdirSync(path.join(appConfigDir, 'certs'));

                    copyFileSync(
                        path.join(c.paths.project.appConfigsDir, item, targetFile),
                        path.join(appConfigDir, 'renative.private.json')
                    );
                }
            });
        });

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

    if (!c.files.project.package.name) return;

    const source = `./${c.files.project.package.name}`;

    await _checkAndConfigureCrypto(c);

    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;
    const tsWorkspacePath = path.join(c.paths.workspace.dir, c.files.project.package.name, 'timestamp');
    const envVar = getEnvVar(c);

    if (!envVar) return;

    const key = c.program.key || c.process.env[envVar];

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'encrypt.dest')}`;
        const destTemp = `${path.join(c.paths.workspace.dir, c.files.project.package.name.replace('/', '-'))}.tgz`;
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
        logWarning(`You don't have {{ crypto.encrypt.dest }} specificed in ${chalk().white(c.paths.appConfigBase)}`);
    }
};

export default {
    description: 'Encrypts secure files from ~/<wokspace>/<project>/.. to project',
    fn: taskRnvCryptoEncrypt,
    task: TASK_CRYPTO_ENCRYPT,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
