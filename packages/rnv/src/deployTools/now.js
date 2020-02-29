import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import dotenv from 'dotenv';

import { executeAsync } from '../systemTools/exec';
import { getAppFolder, getConfigProp } from '../common';
import { logInfo } from '../systemTools/logger';

const _runDeploymentTask = (c, nowConfigPath) => new Promise((resolve, reject) => {
    dotenv.config();
    const defaultBuildFolder = path.join(getAppFolder(c, 'web'), 'public');
    const params = [defaultBuildFolder, '-A', nowConfigPath];
    if (process.env.NOW_TOKEN) params.push('-t', process.env.NOW_TOKEN);
    const nowIsProduction = getConfigProp(c, c.platform, 'nowIsProduction', false) === true;

    if (nowIsProduction) params.push('--prod');

    executeAsync(c, `now ${params.join(' ')}`)
        .then(() => resolve())
        .catch(error => reject(error));
});

const _createConfigFiles = async (configFilePath, envConfigPath, nowParamsExists = false, envContent = '') => {
    if (!fs.existsSync(configFilePath)) {
        const content = { public: true, version: 2 };
        logInfo(`${chalk.white('now.json')} file does not exist. Creating one for you`);

        const { name } = await inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'What is your project name?',
            validate: i => !!i || 'Please enter a name'
        }, {
            type: 'input',
            name: 'token',
            message: 'Do you have now token? If no leave empty and you will be asked to create one'
        }]);

        content.name = name;

        if (!nowParamsExists) {
            const { token } = await inquirer.prompt({
                type: 'input',
                name: 'token',
                message: 'Do you have now token? If no leave empty and you will be asked to create one'
            });
            if (token) {
                envContent += `NOW_TOKEN=${token}\n`;
                fs.writeFileSync(envConfigPath, envContent);
            }
            return fs.writeFileSync(configFilePath, JSON.stringify(content, null, 2));
        }
        return fs.writeFileSync(configFilePath, JSON.stringify(content, null, 2));
    }
};

const deployToNow = c => new Promise((resolve, reject) => {
    const nowConfigPath = path.resolve(c.paths.project.dir, 'now.json');
    const envConfigPath = path.resolve(c.paths.project.dir, '.env');

    let envContent;
    try {
        envContent = fs.readFileSync(envConfigPath).toString();
    } catch (err) {
        envContent = '';
    }

    let matched = false;
    envContent.split('\n').map(line => line.split('=')).forEach(([key]) => {
        if (['NOW_TOKEN'].indexOf(key) > -1) {
            matched = true;
        }
    });

    _createConfigFiles(nowConfigPath, envConfigPath, matched, envContent)
        .then(() => {
            _runDeploymentTask(c, nowConfigPath)
                .then(() => {
                    resolve();
                })
                .catch(err => reject(err));
        });
});

export { deployToNow };
