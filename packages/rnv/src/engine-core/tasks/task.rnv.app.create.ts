import path from 'path';
import { TASK_APP_CREATE, PARAMS } from '../../core/constants';
import { logInfo, logTask } from '../../core/systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';
import { configureRuntimeDefaults } from '../../core/runtimeManager';
import {
    copyFolderContentsRecursive,
    fsExistsSync,
    fsLstatSync,
    fsReaddirSync,
    readObjectSync,
    writeFileSync,
} from '../../core/systemManager/fileutils';
import { doResolve } from '../../core/systemManager/resolve';
import { RnvTaskFn } from '../../core/taskManager/types';

export const taskRnvAppCreate: RnvTaskFn = async (c) => {
    logTask('taskRnvAppCreate');

    await configureRuntimeDefaults(c);

    let sourcePath: string | undefined;

    if (c.program.sourceAppConfigID) {
        const sourceAppConfigDirPath = path.join(c.paths.project.appConfigsDir, c.program.sourceAppConfigID);

        if (fsExistsSync(sourceAppConfigDirPath)) {
            sourcePath = sourceAppConfigDirPath;
        }
    } else if (c.program.ci) {
        const tacPath = doResolve(c.buildConfig.currentTemplate);
        if (tacPath && fsExistsSync(tacPath)) {
            const tacDirsPath = path.join(tacPath, 'appConfigs');
            const tacDirs = fsReaddirSync(tacDirsPath);
            tacDirs.forEach((v) => {
                if (v !== 'base') {
                    const pth = path.join(tacDirsPath, v);
                    if (fsLstatSync(pth).isDirectory()) {
                        sourcePath = pth;
                    }
                }
            });
        }
    } else {
        const appConfigChoicesObj: Record<
            string,
            {
                path: string;
            }
        > = {};
        const appConfigChoices: Array<string> = [];
        // Project Configs
        const acDirs = fsReaddirSync(c.paths.project.appConfigsDir);
        acDirs.forEach((v) => {
            if (v !== 'base') {
                const pth = path.join(c.paths.project.appConfigsDir, v);
                if (fsLstatSync(pth).isDirectory()) {
                    const key = `project>${v}`;
                    appConfigChoices.push(key);
                    appConfigChoicesObj[key] = {
                        path: pth,
                    };
                }
            }
        });

        // Template Configs
        const tacPath = doResolve(c.buildConfig.currentTemplate);
        if (tacPath && fsExistsSync(tacPath)) {
            const tacDirsPath = path.join(tacPath, 'appConfigs');
            const tacDirs = fsReaddirSync(tacDirsPath);
            tacDirs.forEach((v) => {
                if (v !== 'base') {
                    const pth = path.join(tacDirsPath, v);
                    if (fsLstatSync(pth).isDirectory()) {
                        const key = `template>${v}`;
                        appConfigChoices.push(key);
                        appConfigChoicesObj[key] = {
                            path: pth,
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

        sourcePath = appConfigChoicesObj[sourceAppConfig].path;
    }

    let destPath;
    let appConfigId;
    if (c.program.appConfigID) {
        appConfigId = c.program.appConfigID.toLowerCase();
        destPath = path.join(c.paths.project.appConfigsDir, appConfigId);
    } else {
        const { confName } = await inquirerPrompt({
            name: 'confName',
            type: 'input',
            message: 'Type name of app config (lowercase)',
        });
        appConfigId = confName.toLowerCase();
        destPath = path.join(c.paths.project.appConfigsDir, appConfigId);
    }

    logInfo('Copying new app config...');
    if (sourcePath) await copyFolderContentsRecursive(sourcePath, destPath);
    logInfo('Copying new app config...DONE');

    const confObjPath = path.join(destPath, 'renative.json');
    const confObj = readObjectSync(confObjPath);

    confObj.id = appConfigId;
    confObj.common = confObj.common || {};

    let appConfigTitle;
    if (c.program.title) {
        appConfigTitle = c.program.title;
    } else if (c.program.ci) {
        // Ignore
    } else {
        const { confTitle } = await inquirerPrompt({
            name: 'confTitle',
            type: 'input',
            default: confObj.common?.title || '',
            message: 'Type the title of the app',
        });
        appConfigTitle = confTitle;
    }
    confObj.common.title = appConfigTitle || confObj.common.title;

    let bundleId;
    if (c.program.id) {
        bundleId = c.program.id;
    } else if (c.program.ci) {
        // Ignore
    } else {
        const { confId } = await inquirerPrompt({
            name: 'confId',
            type: 'input',
            default: confObj.common?.id || '',
            message: 'Type the id of the app (bundle identifier)',
        });
        bundleId = confId;
    }
    confObj.common.id = bundleId || confObj.common.id;

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
