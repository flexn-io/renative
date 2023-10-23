import path from 'path';

import {
    RnvContext,
    PARAMS,
    WEB,
    logTask,
    logInfo,
    fsExistsSync,
    writeFileSync,
    fsWriteFileSync,
    fsReadFile,
    inquirerPrompt,
    RnvPlatform,
    getConfigProp,
} from '@rnv/core';

const DEPLOY_TARGET_FTP = 'ftp';

const FtpDeploy = require('ftp-deploy');
const dotEnv = require('dotenv');

const _deployToFtp = (c: RnvContext, platform: RnvPlatform) =>
    new Promise((resolve, reject) => {
        logTask('_deployToFtp');
        let promise;
        const envPath = path.resolve(c.paths.project.dir, '.env');
        if (!fsExistsSync(envPath)) {
            logInfo('.env file does not exist. Creating one for you');
            promise = _createEnvFtpConfig(envPath);
        } else {
            promise = new Promise((resolve2) => {
                fsReadFile(envPath, (err: unknown, data) => {
                    if (err) return reject(err);
                    resolve2(data.toString());
                });
            });
        }
        promise
            .then((envContent) => {
                let matches = 0;
                const targetMatches = 2;
                if (typeof envContent === 'string') {
                    envContent
                        .split('\n')
                        .map((line: string) => line.split('='))
                        .forEach(([key]: any) => {
                            if (['RNV_DEPLOY_WEB_FTP_SERVER', 'RNV_DEPLOY_WEB_FTP_USER'].indexOf(key) > -1) {
                                matches++;
                            }
                        });
                }

                let envPromise;
                if (matches >= targetMatches) {
                    envPromise = Promise.resolve();
                } else {
                    logInfo('.env file does not contain all needed FTP config, helping you to set it up');
                    envPromise = _createEnvFtpConfig(envPath, `${envContent}\n`);
                }
                return envPromise;
            })
            .then(() => {
                if (platform) {
                    dotEnv.config();
                    const ftp = getConfigProp(c, c.platform, 'custom')?.deploy?.[DEPLOY_TARGET_FTP];

                    const config = {
                        user: process.env.RNV_DEPLOY_WEB_FTP_USER,
                        password: process.env.RNV_DEPLOY_WEB_FTP_PASSWORD, // optional, prompted if none given
                        host: process.env.RNV_DEPLOY_WEB_FTP_SERVER,
                        port: process.env.RNV_DEPLOY_WEB_FTP_PORT || 21,
                        localRoot: ftp?.localRoot,
                        remoteRoot: ftp?.remoteRoot || '/',
                        include: ftp?.include || ['*', '**/*'], // this would upload everything except dot files
                        exclude: ftp?.exclude || [], // e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude **
                        deleteRemote: ftp?.deleteRemote || false, // delete ALL existing files at destination before uploading, if true
                        forcePasv: true, // Passive mode is forced (EPSV command is not sent)
                    };
                    return config;
                }
            })
            .then((config) => {
                const ftpDeploy = new FtpDeploy();
                return ftpDeploy.deploy(config);
            })
            .catch(reject);
    });

const _createEnvFtpConfig = async (configFilePath: string, previousContent = '') => {
    let envContent = previousContent || '';

    const { host } = await inquirerPrompt({
        name: 'host',
        type: 'input',
        message: 'Type your FTP host',
        validate: (i) => !!i || 'No FTP server provided',
    });

    const { port } = await inquirerPrompt({
        name: 'port',
        type: 'number',
        message: 'Type your FTP port',
        default: 21,
        validate: (i) => !!i || 'No FTP server provided',
    });

    const { user } = await inquirerPrompt({
        name: 'user',
        message: 'Type your FTP user',
        type: 'input',
        validate: (i) => !!i || 'No FTP user provided',
    });

    const { password } = await inquirerPrompt({
        name: 'password',
        message: 'Type your FTP password (or press ENTER for prompting every time)',
        type: 'password',
    });

    envContent += `RNV_DEPLOY_WEB_FTP_SERVER=${host}\n`;
    envContent += `RNV_DEPLOY_WEB_FTP_USER=${user}\n`;
    envContent += `RNV_DEPLOY_WEB_FTP_PASSWORD=${password}\n`;
    envContent += `RNV_DEPLOY_WEB_FTP_PORT=${port}`;

    fsWriteFileSync(configFilePath, envContent);
    logInfo(`Writing .env config to ${configFilePath}`);
};

const _createDeployConfig = async (c: RnvContext, platform: RnvPlatform) => {
    logTask('_createDeployConfig');

    if (!platform) return;

    const deploy = getConfigProp(c, c.platform, 'custom')?.deploy || {};

    deploy[DEPLOY_TARGET_FTP] = {};
    deploy[DEPLOY_TARGET_FTP].type = DEPLOY_TARGET_FTP;

    deploy[DEPLOY_TARGET_FTP].localRoot = path.resolve(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);

    const { remoteRoot } = await inquirerPrompt({
        name: 'remoteRoot',
        type: 'input',
        message: 'Folder on the ftp to upload the project',
        default: '/',
    });

    const { deleteRemote } = await inquirerPrompt({
        name: 'deleteRemote',
        type: 'confirm',
        message: 'Delete all contents of that folder when deploying versions?',
    });

    const { include } = await inquirerPrompt({
        name: 'include',
        type: 'input',
        message: 'Included files pattern, comma separated',
        default: "'*','**/*'",
    });

    const { exclude } = await inquirerPrompt({
        name: 'exclude',
        type: 'input',
        message: 'Excluded files pattern, comma separated',
        default: '[]',
    });

    const { excludeSourcemaps } = await inquirerPrompt({
        name: 'excludeSourcemaps',
        type: 'confirm',
        message: 'Exclude sourcemaps?',
    });

    deploy[DEPLOY_TARGET_FTP].remoteRoot = remoteRoot || '/';
    deploy[DEPLOY_TARGET_FTP].deleteRemote = deleteRemote;
    deploy[DEPLOY_TARGET_FTP].include = include ? include.split(',') : ['*', '**/*'];
    deploy[DEPLOY_TARGET_FTP].exclude = exclude ? exclude.split(',') : [];
    deploy[DEPLOY_TARGET_FTP].exclude = deploy?.[DEPLOY_TARGET_FTP]?.exclude?.concat(
        excludeSourcemaps ? ['**/*.map'] : []
    );

    logInfo(`Setting your appconfig for ${platform} to include deploy type: ${DEPLOY_TARGET_FTP}
                    on ${c.paths.appConfig.config}
                `);

    const configFile = c.files.appConfig.config;
    const plat = configFile?.platforms?.[platform];
    if (configFile && plat?.custom) {
        // TODO: Review this (where to put what props renative.*.json)
        plat.custom.deploy = deploy;
        //TODO: we need to override config_original
        writeFileSync(c.paths.appConfig.config, configFile);
    }
};

const taskRnvFtpDeploy = (c: RnvContext) => {
    logTask('taskRnvFtpDeploy');
    if (!c.platform) return;
    const targetConfig = c.buildConfig.platforms?.[c.platform];
    if (targetConfig?.custom?.deploy?.[DEPLOY_TARGET_FTP]?.type) {
        return _deployToFtp(c, c.platform);
    }
    return _createDeployConfig(c, c.platform).then(() => _deployToFtp(c, c.platform));
};

export default {
    description: '',
    fn: taskRnvFtpDeploy,
    task: 'ftp deploy',
    params: PARAMS.withBase(),
    platforms: [WEB],
};
