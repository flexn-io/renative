import chalk from 'chalk';
import minimist from 'minimist';
import inquirer from 'inquirer';
import path from 'path';

import { deployToNow } from './now';
import { deployToFtp } from './ftp';
import {
    logInfo
} from '../systemTools/logger';
import { configureDeploymentIfRequired } from './configure';

const DEPLOY_TARGET_DOCKER = 'docker';
const DEPLOY_TARGET_FTP = 'ftp';
const DEPLOY_TARGET_NOW = 'now';
const DEPLOY_TARGET_NONE = 'none';
const DEPLOY_TARGET_AWS = 'aws';

const _runDeployment = async (c, platform, deployType) => {
    switch (deployType) {
    case DEPLOY_TARGET_FTP:
        return deployToFtp(c, platform);
    case DEPLOY_TARGET_NOW:
        return deployToNow(c, platform);
    case DEPLOY_TARGET_NONE:
        return Promise.resolve();
    case DEPLOY_TARGET_AWS:
    case DEPLOY_TARGET_DOCKER:
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const deployPackage = require(path.join(c.paths.project.nodeModulesDir, `/@rnv/deploy-${deployType}`)).default;
        return deployPackage();
    default:
        return Promise.reject(new Error(`Deploy Type not supported ${deployType}`));
    }
};

const selectWebToolAndDeploy = async (c, platform) => {
    const argv = minimist(c.process.argv.slice(2));
    const deployType = argv.t;
    const targetConfig = c.buildConfig.platforms[platform];

    if (deployType || (targetConfig && targetConfig.deploy && targetConfig.deploy.type)) {
        await configureDeploymentIfRequired(deployType || targetConfig.deploy.type);
        return _runDeployment(c, platform, deployType || targetConfig.deploy.type);
    }
    const choices = [DEPLOY_TARGET_DOCKER, DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW, DEPLOY_TARGET_NONE, DEPLOY_TARGET_AWS];

    const { selectedDeployTarget } = await inquirer.prompt({
        name: 'selectedDeployTarget',
        type: 'list',
        choices,
        message: `Which type of deploy option would you like to use for ${chalk.white(platform)} deployment?`
    });

    await configureDeploymentIfRequired(selectedDeployTarget);

    logInfo(`Setting your appconfig for ${chalk.white(platform)} to include deploy type: ${chalk.white(selectedDeployTarget)} at ${chalk.white(c.paths.appConfig.config)}`);
    return _runDeployment(c, platform, selectedDeployTarget);
};

export {
    selectWebToolAndDeploy,
    DEPLOY_TARGET_FTP,
    DEPLOY_TARGET_NOW,
    DEPLOY_TARGET_NONE
};
