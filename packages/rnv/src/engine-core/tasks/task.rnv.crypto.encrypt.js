import path from 'path';
import tar from 'tar';
import { promisify } from 'util';
import {
    chalk,
    logWarning,
    logTask,
    logSuccess,
    logInfo
} from '../../core/systemManager/logger';
import {
    getRealPath,
    removeFilesSync,
    mkdirSync,
    writeFileSync,
    fsWriteFileSync,
    fsExistsSync,
    fsReadFileSync,
    fsReaddir
} from '../../core/systemManager/fileutils';
import { inquirerPrompt } from '../../cli/prompt';
import { getEnvVar, getEnvExportCmd } from '../../core/systemManager/crypto';
import { executeTask } from '../../core/engineManager';
import { TASK_CRYPTO_ENCRYPT, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


const iocane = require('iocane');

const readdirAsync = promisify(fsReaddir);

const generateRandomKey = length => Array(length)
    .fill(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*'
    )
    .map(x => x[Math.floor(Math.random() * x.length)])
    .join('');

const _checkAndConfigureCrypto = async (c) => {
    // handle missing config
    const source = `./${c.files.project.package.name}`;

    if (c.files.project.config && !c.files.project.config.crypto) {
        const { location } = await inquirerPrompt({
            type: 'input',
            name: 'location',
            message:
                'Where would you like your secrets to be residing? (path relative to root, without leading or trailing slash. Ex. `myPrivateConfig/encrypt`)',
            default: 'secrets'
        });
        c.files.project.config.crypto = {
            encrypt: {
                dest: `PROJECT_HOME/${location}/privateConfigs.enc`
            },
            decrypt: {
                source: `PROJECT_HOME/${location}/privateConfigs.enc`
            }
        };
        writeFileSync(c.paths.project.config, c.files.project.config);
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

        mkdirSync(sourceFolder);
        mkdirSync(path.join(sourceFolder, 'certs'));
        writeFileSync(path.join(sourceFolder, 'renative.private.json'), {});

        const appConfigsDirs = await readdirAsync(c.paths.project.appConfigsDir);

        appConfigsDirs.forEach((item) => {
            const appConfigDir = path.join(sourceFolder, item);
            mkdirSync(appConfigDir);
            mkdirSync(path.join(appConfigDir, 'certs'));
            writeFileSync(path.join(appConfigDir, 'renative.private.json'), {});
        });

        // writeFileSync(path.join(sourceFolder), c.files.project.config);
        await inquirerPrompt({
            type: 'confirm',
            message: 'Once ready, Continue?'
        });

        // if (confirm) return true;
    }

    const envVar = getEnvVar(c);
    let key = c.program.key || c.process.env[envVar];
    let keyGenerated = false;
    if (!key) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: `You haven't passed a key with --key or set an env variable named ${chalk().yellow(
                envVar
            )} for the encryption key. Would you like to generate one?`
        });
        if (confirm) {
            key = generateRandomKey(20);
            keyGenerated = true;
        } else {
            return Promise.reject(`encrypt: You must pass ${chalk().white(
                '--key'
            )} or have env var defined:

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

export const taskRnvCryptoEncrypt = async (c, parentTask, originTask) => {
    logTask('taskRnvCryptoEncrypt');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_ENCRYPT, originTask);

    const source = `./${c.files.project.package.name}`;

    await _checkAndConfigureCrypto(c);

    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;
    const tsWorkspacePath = path.join(
        c.paths.workspace.dir,
        c.files.project.package.name,
        'timestamp'
    );
    const envVar = getEnvVar(c);
    const key = c.program.key || c.process.env[envVar];

    if (destRaw) {
        const dest = `${getRealPath(c, destRaw, 'encrypt.dest')}`;
        const destTemp = `${path.join(
            c.paths.workspace.dir,
            c.files.project.package.name.replace('/', '-')
        )}.tgz`;
        const timestamp = new Date().getTime();

        // check if dest folder actually exists
        const destFolder = path.join(dest, '../../core/');
        !fsExistsSync(destFolder) && mkdirSync(destFolder);

        await tar.c(
            {
                gzip: true,
                file: destTemp,
                cwd: c.paths.workspace.dir
            },
            [source]
        );


        const data = await iocane.createSession()
            .use('cbc')
            .encrypt(fsReadFileSync(destTemp), key);

        fsWriteFileSync(dest, data);

        // await executeAsync(
        //     c,
        //     `${_getOpenSllPath(
        //         c
        //     )} enc -aes-256-cbc -md md5 -salt -in ${destTemp} -out ${dest} -k ${key}`,
        //     { privateParams: [key] }
        // );
        removeFilesSync([destTemp]);
        fsWriteFileSync(`${dest}.timestamp`, timestamp);
        fsWriteFileSync(`${tsWorkspacePath}`, timestamp);
        logSuccess(`Files succesfully encrypted into ${dest}`);
    } else {
        logWarning(
            `You don't have {{ crypto.encrypt.dest }} specificed in ${chalk().white(
                c.paths.appConfigBase
            )}`
        );
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
