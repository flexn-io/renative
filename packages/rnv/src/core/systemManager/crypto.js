/* eslint-disable import/no-cycle */
import path from 'path';
import tar from 'tar';
import { promisify } from 'util';
import fs from 'fs';
import {
    chalk,
    logWarning,
    logError,
    logTask,
    logDebug,
    logSuccess,
    logInfo
} from './logger';
import { isSystemWin } from '../utils';
import {
    listAppConfigsFoldersSync,
    setAppConfig
} from '../configManager/configParser';
import { IOS, TVOS } from '../constants';
import {
    getRealPath,
    removeFilesSync,
    getFileListSync,
    copyFileSync,
    mkdirSync,
    writeFileSync,
    fsWriteFileSync,
    cleanFolder
} from './fileutils';
import { executeAsync } from './exec';
import { updateProfile } from '../../sdk-xcode/fastlane';
import { inquirerPrompt } from '../../cli/prompt';

const iocane = require('iocane');

const readdirAsync = promisify(fs.readdir);

const getEnvVar = (c) => {
    const p1 = c.paths.workspace.dir
        .split('/')
        .pop()
        .replace('.', '');
    const p2 = c.files.project.package.name
        .replace('@', '')
        .replace('/', '_')
        .replace(/-/g, '_');
    const envVar = `CRYPTO_${p1}_${p2}`.toUpperCase();
    logDebug('encrypt looking for env var:', envVar);
    return envVar;
};

export const rnvCryptoUpdateProfile = async (c) => {
    await updateProfile(c);
};

const generateRandomKey = length => Array(length)
    .fill(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*'
    )
    .map(x => x[Math.floor(Math.random() * x.length)])
    .join('');

const _getEnvExportCmd = (envVar, key) => {
    if (isSystemWin) {
        return `${chalk().white(`setx ${envVar} "${key}"`)}`;
    }
    return `${chalk().white(`export ${envVar}="${key}"`)}`;
};

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
    if (!fs.existsSync(sourceFolder)) {
        logInfo(
            `It seems you are running encrypt for the first time. Directory ${chalk().white(
                sourceFolder
            )} does not exist yet.
RNV will create it for you, make sure you add whatever you want encrypted in it and then run the command again`
        );

        mkdirSync(sourceFolder);
        mkdirSync(path.join(sourceFolder, 'certs'));
        writeFileSync(path.join(sourceFolder, 'renative.private.json'), {});

        const configDirs = await readdirAsync(c.paths.project.appConfigsDir);

        configDirs.forEach((item) => {
            const appConfigDir = path.join(sourceFolder, item);
            mkdirSync(appConfigDir);
            mkdirSync(path.join(appConfigDir, 'certs'));
            writeFileSync(path.join(appConfigDir, 'renative.private.json'), {});
        });

        // writeFileSync(path.join(sourceFolder), c.files.project.config);
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: 'Once ready, Continue?'
        });

        if (confirm) return true;
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

${_getEnvExportCmd(envVar, 'REPLACE_WITH_ENV_VARIABLE')}

`);
        }
        if (keyGenerated) {
            logSuccess(`The files were encrypted with key ${chalk().red(
                key
            )}. Make sure you keep it safe! Pass it with --key on decryption or set it as following env variable:

${_getEnvExportCmd(envVar, key)}

`);
            c.process.env[envVar] = key;
        }
    }
};

export const rnvCryptoEncrypt = async (c) => {
    logTask('rnvCryptoEncrypt');

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
        const destFolder = path.join(dest, '../');
        !fs.existsSync(destFolder) && mkdirSync(destFolder);

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
            .encrypt(fs.readFileSync(destTemp), key);

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
                c.paths.projectConfig
            )}`
        );
    }
};

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
    if (fs.existsSync(ts)) {
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

export const rnvCryptoDecrypt = async (c) => {
    logTask('rnvCryptoDecrypt');

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

        if (fs.existsSync(destTemp)) {
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

${_getEnvExportCmd(envVar, 'REPLACE_WITH_ENV_VARIABLE')}

`);
        }
        if (!fs.existsSync(source)) {
            return Promise.reject(
                `Can't decrypt. ${chalk().white(source)} is missing!`
            );
        }

        let data;
        try {
            data = await iocane.createSession()
                .use('cbc')
                .decrypt(fs.readFileSync(source), key);
        } catch (e) {
            if (e?.message?.includes) {
                if (e.message.includes('Signature mismatch')) {
                    const err = `Looks like you're trying to decode crypto file encoded with previous version of crypto.
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
check if your ENV VAR is correct: ${_getEnvExportCmd(envVar, '***********')}
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
                c.paths.projectConfig
            )}`
        );
        return true;
    }
};

// const _getOpenSllPath = (c) => {
//     const {
//         process: { platform }
//     } = c;
//     let defaultOpenssl = 'openssl';
//     // if (platform === 'linux') defaultOpenssl = path.join(c.paths.rnv.dir, 'bin/openssl-linux');
//     if (isSystemMac) { defaultOpenssl = path.join(c.paths.rnv.dir, 'bin/openssl-osx'); }
//     // if (fs.existsSync(defaultOpenssl)) {
//     //     return defaultOpenssl;
//     // }
//     // logWarning(`${defaultOpenssl} is missing. will use default one`);

//     return defaultOpenssl;
// };

export const rnvCryptoInstallProfiles = c => new Promise((resolve) => {
    logTask('rnvCryptoInstallProfiles');
    if (c.platform !== 'ios') {
        logError(
            `rnvCryptoInstallProfiles: platform ${c.platform} not supported`
        );
        resolve();
        return;
    }

    const ppFolder = path.join(
        c.paths.home.dir,
        'Library/MobileDevice/Provisioning Profiles'
    );

    if (!fs.existsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.workspace.project.dir);
    const mobileprovisionArr = list.filter(v => v.endsWith('.mobileprovision'));

    try {
        mobileprovisionArr.forEach((v) => {
            logDebug(`rnvCryptoInstallProfiles: Installing: ${v}`);
            copyFileSync(v, ppFolder);
        });
    } catch (e) {
        logError(e);
    }

    resolve();
});

export const rnvCryptoInstallCerts = c => new Promise((resolve) => {
    logTask('rnvCryptoInstallCerts');

    if (c.platform !== 'ios') {
        logError(`_installTempCerts: platform ${c.platform} not supported`);
        resolve();
        return;
    }
    const kChain = c.program.keychain || 'ios-build.keychain';

    const list = getFileListSync(c.paths.workspace.project.dir);
    const cerArr = list.filter(v => v.endsWith('.cer'));

    Promise.all(
        cerArr.map(v => executeAsync(c, `security import ${v} -k ${kChain} -A`))
    )
        .then(() => resolve())
        .catch((e) => {
            logWarning(e);
            resolve();
        });
});

export const rnvCryptoUpdateProfiles = async (c) => {
    logTask('rnvCryptoUpdateProfiles');
    switch (c.platform) {
        case IOS:
        case TVOS:
            await _updateProfiles(c);
            await setAppConfig(c, c.runtime?.appId);
            break;
        default:
            return true;
    }
    return Promise.reject(
        `updateProfiles: Platform ${c.platform} not supported`
    );
};

const _updateProfiles = (c) => {
    logTask('_updateProfiles', chalk().grey);
    const acList = listAppConfigsFoldersSync(c, true);

    return acList.reduce(
        (previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)),
        Promise.resolve()
    );
};

const _updateProfile = (c, v) => new Promise((resolve, reject) => {
    logTask(`_updateProfile:${v}`, chalk().grey);
    updateProfile(c, v)
        .then(() => resolve())
        .catch(e => reject(e));
});

export const checkCrypto = async (c) => {
    logTask('checkCrypto');

    if (c.program.ci) return;

    const sourceRaw = c.files.project.config?.crypto?.decrypt?.source;
    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;

    if (destRaw) {
        if (sourceRaw && destRaw) {
            const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
            const tsProjectPath = `${source}.timestamp`;
            const wsPath = path.join(
                c.paths.workspace.dir,
                c.files.project.package.name
            );
            const tsWorkspacePath = path.join(wsPath, 'timestamp');
            if (!fs.existsSync(source)) {
                logWarning(
                    "This project uses encrypted files but you don't have them installed"
                );
            } else {
                let tsWorkspace = 0;
                let tsProject = 0;
                if (fs.existsSync(tsWorkspacePath)) {
                    tsWorkspace = parseInt(
                        fs.readFileSync(tsWorkspacePath).toString(),
                        10
                    );
                }

                if (fs.existsSync(tsProjectPath)) {
                    tsProject = parseInt(
                        fs.readFileSync(tsProjectPath).toString(),
                        10
                    );
                }

                if (tsProject > tsWorkspace) {
                    logWarning(`Your ${tsWorkspacePath} is out of date.
project timestamp: ${chalk().grey(`${tsProject} - ${new Date(tsProject)}`)}
workspace timestamp: ${chalk().grey(`${tsWorkspace} - ${new Date(tsWorkspace)}`)}
you should run decrypt`);
                    await rnvCryptoDecrypt(c);
                    return;
                }

                if (tsProject < tsWorkspace) {
                    logWarning(
                        `Your ${tsWorkspacePath} is newer than your project one.`
                    );
                }
            }
        }
    }
};
