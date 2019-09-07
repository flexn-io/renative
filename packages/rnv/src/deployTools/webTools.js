import chalk from 'chalk';
import minimist from 'minimist';
import inquirer from 'inquirer';

import { deployToNow } from './now';
import { deployToFtp } from './ftp';
import {
    logTask,
    logComplete,
    logError,
    logInfo
} from '../common';
import { generateOptions } from '../systemTools/prompt';

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

const selectWebToolAndDeploy = async (c, platform) => {
    const argv = minimist(c.process.argv.slice(2));
    const deployType = argv.t;
    const targetConfig = c.buildConfig.platforms[platform];

    if (deployType || (targetConfig && targetConfig.deploy && targetConfig.deploy.type)) {
        return _runDeployment(c, platform, deployType || targetConfig.deploy.type);
    }
    const opts = generateOptions([DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW, DEPLOY_TARGET_NONE]);

    const { selectedDeployTarget } = await inquirer.prompt({
        name: 'selectedDeployTarget',
        type: 'list',
        choices: opts.keysAsArray,
        message: `Which type of deploy option would you like to use for ${chalk.white(platform)} deployment?`
    });

    logInfo(`Setting your appconfig for ${chalk.white(platform)} to include deploy type: ${chalk.white(selectedDeployTarget)} at ${chalk.white(c.paths.appConfig.config)}`);
    return _runDeployment(c, platform, selectedDeployTarget);
};

export {
    selectWebToolAndDeploy,
    DEPLOY_TARGET_FTP,
    DEPLOY_TARGET_NOW,
    DEPLOY_TARGET_NONE
};
