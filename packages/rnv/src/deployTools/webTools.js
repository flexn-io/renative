import chalk from 'chalk';
import minimist from 'minimist';
import inquirer from 'inquirer';
import path from 'path';

import { deployToNow } from './now';
import { deployToFtp } from './ftp';
import {
    importPackageFromProject
} from '../common';
import {
    logInfo
} from '../systemTools/logger';
import { configureDeploymentIfRequired, configureExportIfRequired } from './configure';

const DEPLOY_TARGET_DOCKER = 'docker';
const DEPLOY_TARGET_FTP = 'ftp';
const DEPLOY_TARGET_NOW = 'now';
const DEPLOY_TARGET_NONE = 'none';

const _runDeployment = async (c, platform, deployType) => {
    switch (deployType) {
        case DEPLOY_TARGET_FTP:
            return deployToFtp(c, platform);
        case DEPLOY_TARGET_NOW:
            return deployToNow(c, platform);
        case DEPLOY_TARGET_NONE:
            return Promise.resolve();
        case DEPLOY_TARGET_DOCKER:
            const rnvPath = process.mainModule.filename.split('/bin/index.js')[0];
            const deployToDocker = importPackageFromProject('@rnv/deploy-docker');
            deployToDocker.setRNVPath(rnvPath);
            return deployToDocker.doDeploy();
        default:
            return Promise.reject(new Error(`Deploy Type not supported ${deployType}`));
    }
};

const _runExport = (c, platform, deployType) => {
    switch (deployType) {
        case DEPLOY_TARGET_DOCKER:
            const rnvPath = process.mainModule.filename.split('/bin/index.js')[0];
            const deployToDocker = importPackageFromProject('@rnv/deploy-docker');
            deployToDocker.setRNVPath(rnvPath);
            return deployToDocker.doExport();
        default:
            return Promise.reject(new Error(`Deploy Type not supported ${deployType}`));
    }
};

const selectToolAndExecute = async ({
    c, platform, choices, configFunction, executeFunction, isDeploy = true
}) => {
    const argv = minimist(c.process.argv.slice(2));
    const type = argv.t;
    const targetConfig = c.buildConfig.platforms[platform];

    if (type || (targetConfig && targetConfig.deploy && targetConfig.deploy.type)) {
        await configFunction(type || targetConfig.deploy.type);
        return executeFunction(c, platform, type || targetConfig.deploy.type);
    }
    const { selectedTarget } = await inquirer.prompt({
        name: 'selectedTarget',
        type: 'list',
        choices,
        message: `Which type of ${isDeploy ? 'deploy' : 'export'} option would you like to use for ${chalk.white(platform)}?`
    });

    await configFunction(selectedTarget);

    logInfo(`Setting your appconfig for ${chalk.white(platform)} to include ${isDeploy ? 'deploy' : 'export'} type: ${chalk.white(selectedTarget)} at ${chalk.white(c.paths.appConfig.config)}`);
    return executeFunction(c, platform, selectedTarget);
};

const selectWebToolAndDeploy = (c, platform) => selectToolAndExecute({
    c,
    platform,
    choices: [DEPLOY_TARGET_DOCKER, DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW, DEPLOY_TARGET_NONE],
    configFunction: configureDeploymentIfRequired,
    executeFunction: _runDeployment
});

const selectWebToolAndExport = (c, platform) => selectToolAndExecute({
    c,
    platform,
    choices: [DEPLOY_TARGET_DOCKER],
    configFunction: configureExportIfRequired,
    executeFunction: _runExport,
    isDeploy: false
});

export {
    selectWebToolAndDeploy,
    selectWebToolAndExport,
    DEPLOY_TARGET_FTP,
    DEPLOY_TARGET_NOW,
    DEPLOY_TARGET_NONE
};
