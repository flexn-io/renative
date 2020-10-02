import path from 'path';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { fsExistsSync, fsWriteFileSync, fsReadFileSync } from '../core/systemManager/fileutils';
import { executeAsync } from '../core/systemManager/exec';
import { getAppFolder, getConfigProp } from '../core/common';
import { chalk, logInfo, logTask } from '../core/systemManager/logger';
import { PARAMS } from '../core/constants';

const _runDeploymentTask = (c, nowConfigPath) => new Promise((resolve, reject) => {
    dotenv.config();
    const defaultBuildFolder = path.join(getAppFolder(c, c.platform), c.platform.includes('next') ? 'out' : 'public');
    const params = [defaultBuildFolder, '-A', nowConfigPath];
    if (process.env.NOW_TOKEN) params.push('-t', process.env.NOW_TOKEN);
    const nowIsProduction = getConfigProp(c, c.platform, 'nowIsProduction', false) === true;

    if (nowIsProduction) params.push('--prod');

    executeAsync(c, `now ${params.join(' ')}`, { interactive: true })
        .then(() => resolve())
        .catch(error => reject(error));
});

const _createConfigFiles = async (
    configFilePath,
    envConfigPath,
    nowParamsExists = false,
    _envContent = ''
) => {
    let envContent = _envContent;
    if (!fsExistsSync(configFilePath)) {
        const content = { public: true, version: 2 };
        logInfo(
            `${chalk().white(
                'now.json'
            )} file does not exist. Creating one for you`
        );

        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your project name?',
                validate: i => !!i || 'Please enter a name'
            },
            {
                type: 'input',
                name: 'token',
                message:
                    'Do you have now token? If no leave empty and you will be asked to create one'
            }
        ]);

        content.name = name;

        if (!nowParamsExists) {
            const { token } = await inquirer.prompt({
                type: 'input',
                name: 'token',
                message:
                    'Do you have now token? If no leave empty and you will be asked to create one'
            });
            if (token) {
                envContent += `NOW_TOKEN=${token}\n`;
                fsWriteFileSync(envConfigPath, envContent);
            }
            return fsWriteFileSync(
                configFilePath,
                JSON.stringify(content, null, 2)
            );
        }
        return fsWriteFileSync(
            configFilePath,
            JSON.stringify(content, null, 2)
        );
    }
};

export const taskRnvDeployNow = async (c) => {
    logTask('taskRnvDeployNow');

    const nowConfigPath = path.resolve(c.paths.project.dir, 'configs', `now.${c.platform}.json`);
    const envConfigPath = path.resolve(c.paths.project.dir, '.env');

    let envContent;
    try {
        envContent = fsReadFileSync(envConfigPath).toString();
    } catch (err) {
        envContent = '';
    }

    let matched = false;
    envContent
        .split('\n')
        .map(line => line.split('='))
        .forEach(([key]) => {
            if (['NOW_TOKEN'].indexOf(key) > -1) {
                matched = true;
            }
        });

    await _createConfigFiles(
        nowConfigPath,
        envConfigPath,
        matched,
        envContent
    );
    await _runDeploymentTask(c, nowConfigPath);
};

export default {
    description: '',
    fn: taskRnvDeployNow,
    task: 'deploy now',
    params: PARAMS.withBase(),
    platforms: [],
};
