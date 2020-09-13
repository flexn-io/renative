/* eslint-disable import/no-cycle */
import path from 'path';
import inquirer from 'inquirer';
import {
    fsExistsSync,
    writeFileSync,
    fsWriteFileSync,
    fsReadFile
} from '../core/systemManager/fileutils';
import { logInfo, logTask } from '../core/systemManager/logger';
import { DEPLOY_TARGET_FTP } from '../core/deployManager/webTools';
import { PARAMS } from '../core/constants';

const FtpDeploy = require('ftp-deploy');
const dotEnv = require('dotenv');

const _deployToFtp = (c, platform) => new Promise((resolve, reject) => {
    logTask('_deployToFtp');
    let promise;
    const envPath = path.resolve(c.paths.project.dir, '.env');
    if (!fsExistsSync(envPath)) {
        logInfo('.env file does not exist. Creating one for you');
        promise = _createEnvFtpConfig(envPath);
    } else {
        promise = new Promise((resolve2) => {
            fsReadFile(envPath, (err, data) => {
                if (err) return reject(err);
                resolve2(data.toString());
            });
        });
    }
    promise
        .then((envContent) => {
            let matches = 0;
            const targetMatches = 2;
            envContent
                .split('\n')
                .map(line => line.split('='))
                .forEach(([key]) => {
                    if (
                        [
                            'RNV_DEPLOY_WEB_FTP_SERVER',
                            'RNV_DEPLOY_WEB_FTP_USER'
                        ].indexOf(key) > -1
                    ) {
                        matches++;
                    }
                });
            let envPromise;
            if (matches >= targetMatches) {
                envPromise = Promise.resolve();
            } else {
                logInfo(
                    '.env file does not contain all needed FTP config, helping you to set it up'
                );
                envPromise = _createEnvFtpConfig(
                    envPath,
                    `${envContent}\n`
                );
            }
            return envPromise;
        })
        .then(() => {
            dotEnv.config();
            const config = {
                user: process.env.RNV_DEPLOY_WEB_FTP_USER,
                password: process.env.RNV_DEPLOY_WEB_FTP_PASSWORD, // optional, prompted if none given
                host: process.env.RNV_DEPLOY_WEB_FTP_SERVER,
                port: process.env.RNV_DEPLOY_WEB_FTP_PORT || 21,
                localRoot:
                        c.buildConfig.platforms[platform].deploy[
                            DEPLOY_TARGET_FTP
                        ].localRoot,
                remoteRoot:
                        c.buildConfig.platforms[platform].deploy[
                            DEPLOY_TARGET_FTP
                        ].remoteRoot || '/',
                include: c.buildConfig.platforms[platform].deploy[
                    DEPLOY_TARGET_FTP
                ].include || ['*', '**/*'], // this would upload everything except dot files
                exclude:
                        c.buildConfig.platforms[platform].deploy[
                            DEPLOY_TARGET_FTP
                        ].exclude || [], // e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude **
                deleteRemote:
                        c.buildConfig.platforms[platform].deploy[
                            DEPLOY_TARGET_FTP
                        ].exclude.deleteRemote || false, // delete ALL existing files at destination before uploading, if true
                forcePasv: true // Passive mode is forced (EPSV command is not sent)
            };
            return config;
        })
        .then((config) => {
            const ftpDeploy = new FtpDeploy();
            return ftpDeploy.deploy(config);
        })
        .catch(reject);
});

const _createEnvFtpConfig = async (configFilePath, previousContent = '') => {
    let envContent = previousContent || '';

    const { host, user, password, port } = await inquirer.prompt([
        {
            name: 'host',
            type: 'input',
            message: 'Type your FTP host',
            validate: i => !!i || 'No FTP server provided'
        },
        {
            name: 'port',
            type: 'number',
            message: 'Type your FTP port',
            default: 21,
            validate: i => !!i || 'No FTP server provided'
        },
        {
            name: 'user',
            message: 'Type your FTP user',
            type: 'input',
            validate: i => !!i || 'No FTP user provided'
        },
        {
            name: 'password',
            message:
                'Type your FTP password (or press ENTER for prompting every time)',
            type: 'password'
        }
    ]);

    envContent += `RNV_DEPLOY_WEB_FTP_SERVER=${host}\n`;
    envContent += `RNV_DEPLOY_WEB_FTP_USER=${user}\n`;
    envContent += `RNV_DEPLOY_WEB_FTP_PASSWORD=${password}\n`;
    envContent += `RNV_DEPLOY_WEB_FTP_PORT=${port}`;

    fsWriteFileSync(configFilePath, envContent);
    logInfo(`Writing .env config to ${configFilePath}`);
};

const _createDeployConfig = async (c, platform) => {
    logTask('_createDeployConfig');

    const deploy = c.buildConfig.platforms[platform].deploy || {};

    deploy[DEPLOY_TARGET_FTP] = {};
    deploy[DEPLOY_TARGET_FTP].type = DEPLOY_TARGET_FTP;

    deploy[DEPLOY_TARGET_FTP].localRoot = path.resolve(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${platform}`
    );
    const {
        remoteRoot,
        deleteRemote,
        include,
        exclude,
        excludeSourcemaps
    } = await inquirer.prompt([
        {
            name: 'remoteRoot',
            type: 'input',
            message: 'Folder on the ftp to upload the project',
            default: '/'
        },
        {
            name: 'deleteRemote',
            type: 'confirm',
            message:
                'Delete all contents of that folder when deploying versions?'
        },
        {
            name: 'include',
            type: 'input',
            message: 'Included files pattern, comma separated',
            default: "'*','**/*'"
        },
        {
            name: 'exclude',
            type: 'input',
            message: 'Excluded files pattern, comma separated',
            default: '[]'
        },
        {
            name: 'excludeSourcemaps',
            type: 'confirm',
            message: 'Exclude sourcemaps?'
        }
    ]);

    deploy[DEPLOY_TARGET_FTP].remoteRoot = remoteRoot || '/';
    deploy[DEPLOY_TARGET_FTP].deleteRemote = deleteRemote;
    deploy[DEPLOY_TARGET_FTP].include = include
        ? include.split(',')
        : ['*', '**/*'];
    deploy[DEPLOY_TARGET_FTP].exclude = exclude ? exclude.split(',') : [];
    deploy[DEPLOY_TARGET_FTP].exclude = deploy[
        DEPLOY_TARGET_FTP
    ].exclude.concat(excludeSourcemaps ? ['**/*.map'] : []);

    logInfo(`Setting your appconfig for ${platform} to include deploy type: ${DEPLOY_TARGET_FTP}
                    on ${c.paths.appConfig.config}
                `);

    // TODO: Review this (where to put what props renative.*.json)
    c.files.appConfig.config.platforms[platform].deploy = deploy;
    writeFileSync(c.paths.appConfig.config, c.files.appConfig.config);
};

const deployToFtp = (c, platform) => {
    logTask('checkDeployConfigTarget');
    const targetConfig = c.buildConfig.platforms[platform];
    if (targetConfig?.deploy?.[DEPLOY_TARGET_FTP]?.type) {
        return _deployToFtp(c, platform);
    }
    return _createDeployConfig(c, platform).then(() => _deployToFtp(c, platform));
};

export { deployToFtp };


export default {
    description: '',
    fn: deployToFtp,
    task: 'deploy ftp',
    params: PARAMS.withBase(),
    platforms: [],
};
