import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { executeAsync } from '../exec';
import {
    logInfo,
    getAppFolder,
    askQuestion,
    finishQuestion,
} from '../common';

const _runDeploymentTask = (c, nowConfigPath) => new Promise((resolve, reject) => {
    require('dotenv').config();
    const defaultBuildFolder = path.join(getAppFolder(c, 'web'), 'public');
    const params = [defaultBuildFolder, '-A', nowConfigPath];
    if (process.env.NOW_TOKEN) params.push('-t', process.env.NOW_TOKEN);
    executeAsync('now', params)
        .then(() => resolve())
        .catch(error => reject(error));
});

const _createConfigFiles = (configFilePath, envConfigPath, nowParamsExists = false, envContent = '') => new Promise((resolve, reject) => {
    if (!fs.existsSync(configFilePath)) {
        const content = { public: true, version: 2 };
        logInfo('now.json file does not exist. Creating one for you');
        askQuestion('What is your project name?')
            .then((v) => {
                finishQuestion();
                content.name = v;
                if (!nowParamsExists) {
                    askQuestion('Now token? Leave empty and we will create one for you')
                        .then((v) => {
                            finishQuestion();
                            if (v) {
                                envContent += `NOW_TOKEN=${v}\n`;
                                fs.writeFileSync(envConfigPath, envContent);
                            }
                            fs.writeFileSync(configFilePath, JSON.stringify(content, null, 4));
                            resolve();
                        });
                    return;
                }
                fs.writeFileSync(configFilePath, JSON.stringify(content, null, 4));
                resolve();
            });
        return;
    }
    resolve();
});

const deployToNow = c => new Promise((resolve, reject) => {
    const nowConfigPath = path.resolve(c.paths.projectRootFolder, 'now.json');
    const envConfigPath = path.resolve(c.paths.projectRootFolder, '.env');

    let envContent;
    try {
        envContent = fs.readFileSync('foo.bar');
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
