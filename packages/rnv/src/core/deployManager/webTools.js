/* eslint-disable import/no-cycle */
import minimist from 'minimist';

import { taskRnvDeployNow } from '../../integration-now';
import { deployToFtp } from '../../integration-ftp';
import { importPackageFromProject, getConfigProp } from '../common';
import { chalk, logInfo } from '../systemManager/logger';
import {
    configureDeploymentIfRequired,
    configureExportIfRequired
} from './configure';
import { inquirerPrompt } from '../../cli/prompt';

const DEPLOY_TARGET_DOCKER = 'docker';
const DEPLOY_TARGET_AWS = 'aws';
const DEPLOY_TARGET_FTP = 'ftp';
const DEPLOY_TARGET_NOW = 'now';
const DEPLOY_TARGET_NONE = 'none';

const _runDeployment = async (c, platform, deployType) => {
    switch (deployType) {
        case DEPLOY_TARGET_FTP:
            return deployToFtp(c);
        case DEPLOY_TARGET_NOW:
            return taskRnvDeployNow(c);
        case DEPLOY_TARGET_NONE:
            return Promise.resolve();
        case DEPLOY_TARGET_DOCKER: {
            const deployToDocker = importPackageFromProject(
                '@rnv/deploy-docker'
            );
            deployToDocker.setRNVPath(
                process.mainModule.filename.split(
                    '/bin/index.js'
                )[0]
            );
            return deployToDocker.doDeploy();
        }
        case DEPLOY_TARGET_AWS: {
            const deployerPackage = importPackageFromProject('@rnv/deploy-aws');
            deployerPackage.setRNVPath(process.mainModule.filename.split('/bin/index.js')[0]);
            return deployerPackage.doDeploy();
        }
        default:
            return Promise.reject(
                new Error(`Deploy Type not supported ${deployType}`)
            );
    }
};

const _runExport = (c, platform, exportType) => {
    switch (exportType) {
        case DEPLOY_TARGET_DOCKER: {
            const rnvPath = process.mainModule.filename.split(
                '/bin/index.js'
            )[0];
            const deployToDocker = importPackageFromProject(
                '@rnv/deploy-docker'
            );
            deployToDocker.setRNVPath(rnvPath);
            return deployToDocker.doExport();
        }
        case DEPLOY_TARGET_NONE:
            return Promise.resolve();
        default:
            return Promise.reject(
                new Error(`Export Type not supported ${exportType}`)
            );
    }
};

const selectToolAndExecute = async ({
    c,
    platform,
    choices,
    configFunction,
    executeFunction,
    isDeploy = true,
    defaultChoice
}) => {
    const argv = minimist(c.process.argv.slice(2));
    const type = argv.t;
    const deployConfig = getConfigProp(c, c.platform, 'deploy');

    if (type || (deployConfig?.type)
    ) {
        await configFunction(type || deployConfig.type);
        return executeFunction(c, platform, type || deployConfig.type);
    }
    const { selectedTarget } = await inquirerPrompt({
        name: 'selectedTarget',
        type: 'list',
        choices,
        default: defaultChoice,
        message: `Which type of ${
            isDeploy ? 'deploy' : 'export'
        } option would you like to use for ${chalk().white(c.platform)}?`
    });

    await configFunction(c, selectedTarget);

    logInfo(
        `Setting your appconfig for ${chalk().white(platform)} to include ${
            isDeploy ? 'deploy' : 'export'
        } type: ${chalk().white(selectedTarget)} at ${chalk().white(
            c.paths.appConfig.config
        )}`
    );
    return executeFunction(c, platform, selectedTarget);
};

const selectWebToolAndDeploy = (c, platform) => selectToolAndExecute({
    c,
    platform,
    choices: [DEPLOY_TARGET_DOCKER, DEPLOY_TARGET_AWS, DEPLOY_TARGET_FTP, DEPLOY_TARGET_NOW, DEPLOY_TARGET_NONE],
    configFunction: configureDeploymentIfRequired,
    executeFunction: _runDeployment
});

const selectWebToolAndExport = (c, platform) => selectToolAndExecute({
    c,
    platform,
    choices: [DEPLOY_TARGET_DOCKER, DEPLOY_TARGET_NONE],
    configFunction: configureExportIfRequired,
    executeFunction: _runExport,
    isDeploy: false,
    defaultChoice: DEPLOY_TARGET_NONE,
});

export {
    selectWebToolAndDeploy,
    selectWebToolAndExport,
    DEPLOY_TARGET_FTP,
    DEPLOY_TARGET_NOW,
    DEPLOY_TARGET_AWS,
    DEPLOY_TARGET_NONE
};
