import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { deployToNow } from './now';
import { deployToFtp } from './ftp';
import {
    askQuestion,
    finishQuestion,
    logTask,
    logComplete,
    logError,
    logInfo,
    generateOptions
} from '../common';
import { RNV_APP_CONFIG_NAME } from '../constants';

const DEPLOY_TARGET_FTP = 'ftp';
const DEPLOY_TARGET_NOW = 'now';
const DEPLOY_TARGET_NONE = 'none';

const _runDeployment = (c, platform, deployType) => new Promise((resolve, reject) => {
    switch (deployType) {
    case DEPLOY_TARGET_FTP:
        deployToFtp(c, platform).then(resolve).catch(reject);
        return;
    case DEPLOY_TARGET_NOW:
        deployToNow(c, platform).then(resolve).catch(reject);
        return;
    case DEPLOY_TARGET_NONE:
        resolve();
        return;
    default:
        reject(new Error(`Deploy Type not supported ${deployType}`));
    }
});

const selectWebToolAndDeploy = (c, platform) => new Promise((resolve, reject) => {
    const argv = require('minimist')(c.process.argv.slice(2));
    const deployType = argv.t;
    const targetConfig = c.buildConfig.platforms[platform];

    if (deployType || (targetConfig && targetConfig.deploy && targetConfig.deploy.type)) {
        _runDeployment(c, platform, deployType || targetConfig.deploy.type)
            .then(resolve).catch(reject);
    } else {
        const opts = generateOptions([DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW, DEPLOY_TARGET_NONE]);
        askQuestion(`Which type of deploy option would you like to use for ${chalk.white(platform)} deployment:\n${opts.asString}`)
            .then(v => opts.pick(v))
            .then((selectedDeployTarget) => {
                finishQuestion();
                const configFilePath = path.resolve(
                    c.buildConfig.appConfigsFolder,
                    c.defaultAppConfigId,
                    RNV_APP_CONFIG_NAME
                );
                logInfo(`Setting your appconfig for ${chalk.white(platform)} to include deploy type: ${chalk.white(selectedDeployTarget)} at ${chalk.white(configFilePath)}`);
                _runDeployment(c, platform, selectedDeployTarget).then(resolve).catch(reject);
            })
            .catch(e => reject(e));
    }
});

export {
    selectWebToolAndDeploy,
    DEPLOY_TARGET_FTP,
    DEPLOY_TARGET_NOW,
    DEPLOY_TARGET_NONE
};
