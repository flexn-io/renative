import path from 'path';

import {
    copyFolderContentsRecursive,
    fsExistsSync,
    fsLstatSync,
    fsReaddirSync,
    readObjectSync,
    writeFileSync,
    configureRuntimeDefaults,
    inquirerPrompt,
    logInfo,
    logTask,
    ConfigFileApp,
    RnvTaskName,
    getContext,
    createTask,
} from '@rnv/core';

export default createTask({
    description: 'Create new app config',
    fn: async () => {
        logTask('taskAppCreate');

        await configureRuntimeDefaults();

        let sourcePath: string | undefined;

        const c = getContext<any, 'sourceAppConfigID'>();

        if (c.program.opts().sourceAppConfigID) {
            const sourceAppConfigDirPath = path.join(c.paths.project.appConfigsDir, c.program.opts().sourceAppConfigID);

            if (fsExistsSync(sourceAppConfigDirPath)) {
                sourcePath = sourceAppConfigDirPath;
            }
        } else if (c.program.opts().ci) {
            if (c.paths.template.appConfigsDir) {
                if (fsExistsSync(c.paths.template.appConfigsDir)) {
                    const tacDirs = fsReaddirSync(c.paths.template.appConfigsDir);
                    tacDirs.forEach((v) => {
                        if (v !== 'base') {
                            const pth = path.join(c.paths.template.appConfigsDir, v);
                            if (fsLstatSync(pth).isDirectory()) {
                                sourcePath = pth;
                            }
                        }
                    });
                }
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
            if (c.paths.template.appConfigsDir) {
                const tacDirs = fsReaddirSync(c.paths.template.appConfigsDir);
                tacDirs.forEach((v) => {
                    if (v !== 'base') {
                        const pth = path.join(c.paths.template.appConfigsDir, v);
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
        if (c.program.opts().appConfigID) {
            appConfigId = c.program.opts().appConfigID.toLowerCase();
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
        const confObj = readObjectSync<ConfigFileApp>(confObjPath) || {};

        confObj.id = appConfigId;
        confObj.common = confObj.common || {};

        let appConfigTitle;
        if (c.program.opts().title) {
            appConfigTitle = c.program.opts().title;
        } else if (c.program.opts().ci) {
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
        if (c.program.opts().id) {
            bundleId = c.program.opts().id;
        } else if (c.program.opts().ci) {
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
    },
    options: [
        {
            key: 'sourceAppConfigID',
            isValueType: true,
            isRequired: true,
            description: 'name of source appConfig folder to copy from',
        },
    ],
    task: RnvTaskName.appCreate,
});
