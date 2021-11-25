import path from 'path';
import { TASK_APP_CREATE, PARAMS } from '../../core/constants';
import {
    logInfo,
    logTask,
} from '../../core/systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';
import { configureRuntimeDefaults } from '../../core/runtimeManager';
import { copyFolderContentsRecursive, fsExistsSync, fsLstatSync, fsReaddirSync, readObjectSync, writeFileSync } from '../../core/systemManager/fileutils';
import { doResolve } from '../../core/systemManager/resolve';


export const taskRnvAppCreate = async (c) => {
    logTask('taskRnvAppCreate');


    await configureRuntimeDefaults(c);


    const appConfigChoicesObj = {};
    const appConfigChoices = [];

    // Project Configs
    const acDirs = fsReaddirSync(c.paths.project.appConfigsDir);
    acDirs.forEach((v) => {
        if (v !== 'base') {
            const pth = path.join(c.paths.project.appConfigsDir, v);
            if (fsLstatSync(pth).isDirectory()) {
                const key = `project>${v}`;
                appConfigChoices.push(key);
                appConfigChoicesObj[key] = {
                    path: pth
                };
            }
        }
    });

    // Template Configs
    const tacPath = doResolve(c.buildConfig.currentTemplate);
    if (fsExistsSync(tacPath)) {
        const tacDirsPath = path.join(tacPath, 'appConfigs');
        const tacDirs = fsReaddirSync(tacDirsPath);
        tacDirs.forEach((v) => {
            if (v !== 'base') {
                const pth = path.join(tacDirsPath, v);
                if (fsLstatSync(pth).isDirectory()) {
                    const key = `template>${v}`;
                    appConfigChoices.push(key);
                    appConfigChoicesObj[key] = {
                        path: pth
                    };
                }
            }
        });
    }


    const { sourceAppConfig } = await inquirerPrompt({
        name: 'sourceAppConfig',
        type: 'list',
        choices: appConfigChoices,
        message: 'Which App config to use as copy source?',
    });


    const sourcePath = appConfigChoicesObj[sourceAppConfig].path;

    const { confName } = await inquirerPrompt({
        name: 'confName',
        type: 'input',
        message: 'Type name of app config (lowercase)',
    });

    const destPath = path.join(c.paths.project.appConfigsDir, confName.toLowerCase());

    logInfo('Copying new app config...');
    await copyFolderContentsRecursive(sourcePath, destPath);
    logInfo('Copying new app config...DONE');

    const confObjPath = path.join(destPath, 'renative.json');
    const confObj = readObjectSync(confObjPath);

    confObj.id = confName.toLowerCase();
    confObj.common = confObj.common || {};

    const { confTitle } = await inquirerPrompt({
        name: 'confTitle',
        type: 'input',
        default: confObj.common?.title || '',
        message: 'Type the title of the app',
    });


    confObj.common.title = confTitle;

    const { confId } = await inquirerPrompt({
        name: 'confId',
        type: 'input',
        default: confObj.common?.id || '',
        message: 'Type the id of the app (bundle identifier)',
    });

    confObj.common.id = confId;


    writeFileSync(confObjPath, confObj);

    return true;
};

export default {
    description: 'Create new app config',
    fn: taskRnvAppCreate,
    task: TASK_APP_CREATE,
    params: PARAMS.withBase(),
    skipPlatforms: true,
    platforms: [],
};
