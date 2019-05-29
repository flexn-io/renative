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
} from '../common';
import { RNV_APP_CONFIG_NAME } from '../constants';

const DEPLOY_TARGET_FTP = 'ftp';
const DEPLOY_TARGET_NOW = 'now';

const _runDeployment = (c, platform, deployType) => new Promise((resolve, reject) => {
    switch (deployType) {
    case DEPLOY_TARGET_FTP:
        deployToFtp(c, platform).then(resolve).catch(reject);
        return;
    case DEPLOY_TARGET_NOW:
        deployToNow(c, platform).then(resolve).catch(reject);
        return;
    default:
        reject(new Error(`Deploy Type not supported ${dt}`));
    }
});

const selectWebToolAndDeploy = (c, platform) => new Promise((resolve, reject) => {
    const argv = require('minimist')(c.process.argv.slice(2));
    const deployType = argv.t;
    const targetConfig = c.files.appConfigFile.platforms[platform];

    if (deployType || (targetConfig && targetConfig.deploy && targetConfig.deploy.type)) {
        _runDeployment(c, platform, deployType || targetConfig.deploy.type)
            .then(resolve).catch(reject);
    } else {
        askQuestion(`Which type of deploy would you like for ${platform}:\n${Object.values([DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW])
            .map((t, i) => `-[${i}] ${chalk.white(t)}\n`)}`)
            .then((v) => {
                finishQuestion();
                let selectedDeployTarget;
                if (isNaN(v)) {
                    selectedDeployTarget = Object.values(
                        [DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW]
                    ).indexOf(v) ? v : null;
                } else {
                    selectedDeployTarget = Object.values([DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW])[v];
                }

                if (selectedDeployTarget) {
                    const configFilePath = path.resolve(
                        c.files.projectConfig.appConfigsFolder,
                        c.defaultAppConfigId,
                        RNV_APP_CONFIG_NAME
                    );

                    if (Object.values(
                        [DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW]
                    ).indexOf(selectedDeployTarget) === -1) {
                        reject(new Error(`Invalid deploy target ${selectedDeployTarget}`));
                    }

                    logInfo(`Setting your appconfig for ${platform} to include deploy type: ${selectedDeployTarget}
                            on ${configFilePath}
                    `);

                    _runDeployment(c, platform, selectedDeployTarget).then(resolve).catch(reject);
                } else {
                    reject();
                }
            })
            .catch(e => reject(e));
    }
});

export {
    selectWebToolAndDeploy,
    DEPLOY_TARGET_FTP,
    DEPLOY_TARGET_NOW,
};
