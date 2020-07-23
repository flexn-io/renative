/* eslint-disable import/no-cycle */
import path from 'path';
import { promisify } from 'util';
import inquirer from 'inquirer';
import { parseRenativeConfigs, listAppConfigsFoldersSync } from '../core/configManager/configParser';
import { TASK_APP_CONFIGURE } from '../core/constants';
import {
    writeFileSync,
    fsExistsSync,
    fsReaddir,
    fsReadFileSync,
    fsRenameSync,
    fsStatSync,
} from '../core/systemManager/fileutils';
import {
    chalk,
    logError,
    logTask,
    logWarning,
    logDebug,
    logInfo,
    logAppInfo,
} from '../core/systemManager/logger';
import { inquirerPrompt } from '../cli/prompt';

const readdirAsync = promisify(fsReaddir);


const _loadAppConfigIDfromDir = (dir, appConfigsDir) => {
    logDebug(`_loadAppConfigIDfromDir:${dir}:${appConfigsDir}`, chalk().grey);
    const filePath = path.join(appConfigsDir, dir, 'renative.json');
    if (fsExistsSync(filePath)) {
        try {
            const renativeConf = JSON.parse(fsReadFileSync(filePath));
            return { dir, id: renativeConf.id };
        } catch (e) {
            logError(`File ${filePath} is MALFORMED:\n${e}`);
        }
    }
    return { dir, id: null };
};

// const _findAndSwitchAppConfigDir = (c, appId) => {
//     logTask('_findAndSwitchAppConfigDir', `appId:${appId}`);
//
//     c.paths.project.appConfigsDir = getRealPath(
//         c,
//         c.buildConfig.paths?.appConfigsDir,
//         'appConfigsDir',
//         c.paths.project.appConfigsDir
//     );
//     const appConfigsDirs = c.buildConfig.paths?.appConfigsDirs;
//     if (appConfigsDirs && appConfigsDirs.forEach && appId) {
//         appConfigsDirs.forEach((v) => {
//             const altPath = path.join(v, appId);
//             if (fsExistsSync(altPath)) {
//                 logInfo(
//                     `Found config in following location: ${altPath}. Will use it`
//                 );
//                 c.paths.project.appConfigsDir = v;
//             }
//         });
//     }
// };

// export const updateConfig = async (c, appConfigId) => {
//     logTask('updateConfig', `appId:${appConfigId}`);
//
//     await setAppConfig(c, appConfigId);
//
//     const isPureRnv = !c.command && !c.subCommand;
//
//     if (!fsExistsSync(c.paths.appConfig.dir) || isPureRnv) {
//         const configDirs = listAppConfigsFoldersSync(c, true);
//
//         if (!appConfigId) {
//             logWarning("It seems you don't have any appConfig active");
//         } else if (appConfigId !== true && appConfigId !== true && !isPureRnv) {
//             logWarning(
//                 `It seems you don't have appConfig named ${chalk().white(
//                     appConfigId
//                 )} present in your config folder: ${chalk().white(
//                     c.paths.project.appConfigsDir
//                 )} !
// checked path: ${c.paths.appConfig.dir}`
//             );
//         }
//
//         if (configDirs.length) {
//             if (configDirs.length === 1) {
//                 // we have only one, skip the question
//                 logInfo(
//                     `Found only one app config available. Will use ${chalk().white(
//                         configDirs[0]
//                     )}`
//                 );
//                 await setAppConfig(c, configDirs[0]);
//                 return true;
//             }
//
//             const { conf } = await inquirerPrompt({
//                 name: 'conf',
//                 type: 'list',
//                 message: 'Which one would you like to pick?',
//                 choices: configDirs,
//                 pageSize: 50,
//                 logMessage: 'ReNative found multiple existing appConfigs'
//             });
//
//             if (conf) {
//                 await setAppConfig(c, conf);
//                 return true;
//             }
//         }
//
//         const { conf } = await inquirerPrompt({
//             name: 'conf',
//             type: 'confirm',
//             message: 'Do you want ReNative to create new sample appConfig for you?',
//             warningMessage: `No app configs found for this project \nMaybe you forgot to run ${chalk().white('rnv template apply')} ?`
//         });
//
//         if (conf) {
//             // taskRnvTemplateApply(c);
//             await executeTask(c, TASK_TEMPLATE_APPLY);
//
//             await setAppConfig(c);
//         }
//     }
//     return true;
// };

const _askUserAboutConfigs = async (c, dir, id, basePath) => {
    logWarning(
        `AppConfig error - It seems you have a mismatch between appConfig folder name (${
            dir
        }) and the id defined in renative.json (${id}). They must match.`
    );
    if (c.program.ci === true) {
        throw new Error(
            'You cannot continue if you set --ci flag. please fix above error first'
        );
    }
    const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'You must choose what you want to keep',
        choices: [
            {
                name: `Keep ID from renative.json (${id}) and rename the folder (${dir} -> ${id})`,
                value: 'keepID'
            },
            {
                name: `Keep folder name (${dir}) and rename the ID from renative.json (${id} -> ${dir})`,
                value: 'keepFolder'
            },
            new inquirer.Separator(),
            {
                name: "I'll do it manually",
                value: 'manually'
            }
        ]
    });

    if (choice === 'manually') {
        throw new Error('Please do the changes and rerun the command');
    }

    if (choice === 'keepID') {
        fsRenameSync(path.join(basePath, dir), path.join(basePath, id));
    }

    if (choice === 'keepFolder') {
        const filePath = path.join(basePath, dir, 'renative.json');
        const fileContents = JSON.parse(fsReadFileSync(filePath));
        fileContents.id = dir;

        writeFileSync(filePath, fileContents);
    }
};

/* eslint-disable no-await-in-loop */
const matchAppConfigID = async (c, appConfigID) => {
    logTask('matchAppConfigID', `appId:${appConfigID}`);

    if (!appConfigID) return false;

    const appConfigsDirs = c.buildConfig?.paths?.appConfigsDirs || [
        c.paths.project?.appConfigsDir
    ];


    for (let i = 0; i < appConfigsDirs.length; i++) {
        const appConfigsDir = appConfigsDirs[i];
        if (fsExistsSync(appConfigsDir)) {
            const appConfigDirContents = await (await readdirAsync(
                appConfigsDir
            )).filter(folder => fsStatSync(path.join(appConfigsDir, folder)).isDirectory());

            const appConfigs = appConfigDirContents
                .map(dir => _loadAppConfigIDfromDir(dir, appConfigsDir))
                .filter(conf => conf.id !== null);
            // find duplicates
            const ids = [];
            const dirs = [];
            await Promise.all(
                appConfigs.map(async (conf) => {
                    const id = conf.id.toLowerCase();
                    const dir = conf.dir.toLowerCase();
                    // find mismatches
                    if (id !== dir) {
                        await _askUserAboutConfigs(
                            c,
                            conf.dir,
                            conf.id,
                            appConfigsDir
                        );
                    }
                    if (ids.includes(id)) {
                        throw new Error(
                            `AppConfig error - You have 2 duplicate app configs with ID ${
                                id
                            }. Keep in mind that ID is case insensitive.
Please edit one of them in /appConfigs/<folder>/renative.json`
                        );
                    }
                    ids.push(id);
                    if (dirs.includes(dir)) {
                        throw new Error(
                            `AppConfig error - You have 2 duplicate app config folders named ${
                                dir
                            }. Keep in mind that folder names are case insensitive.
Please rename one /appConfigs/<folder>`
                        );
                    }
                    dirs.push(dir);
                })
            );

            const foundConfig = appConfigs.filter(
                cfg => cfg.id === appConfigID
                  || cfg.id.toLowerCase() === appConfigID
                  || cfg.dir === appConfigID
                  || cfg.dir.toLowerCase() === appConfigID
            );
            if (foundConfig.length) return foundConfig[0].id.toLowerCase();
        }
    }
    return false;
};

const _findAndSwitchAppConfigDir = async (c) => {
    const configDirs = listAppConfigsFoldersSync(c, true);
    if (configDirs.length) {
        if (configDirs.length === 1) {
            // we have only one, skip the question
            logInfo(
                `Found only one app config available. Will use ${chalk().white(
                    configDirs[0]
                )}`
            );
            _setAppId(c, configDirs[0]);
            return true;
        }

        const { conf } = await inquirerPrompt({
            name: 'conf',
            type: 'list',
            message: 'Which one would you like to pick?',
            choices: configDirs,
            pageSize: 50,
            logMessage: 'ReNative found multiple existing appConfigs'
        });

        if (conf) {
            _setAppId(c, conf);
            return true;
        }
    }

    return false;
};

const _setAppId = (c, appId) => {
    c.runtime.appId = appId || c.runtime.appId || c.files.project?.configLocal?._meta?.currentAppConfigId;
    c.runtime.appDir = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}`);
};

export const taskAppConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigSet', `parent:${parentTask} origin:${originTask}`);

    if (c.program.appConfigID === true || !c.runtime.appId) {
        const hasAppConfig = await _findAndSwitchAppConfigDir(c);
        if (!hasAppConfig) {
            // const { conf } = await inquirerPrompt({
            //     name: 'conf',
            //     type: 'confirm',
            //     message: 'Do you want ReNative to create new sample appConfig for you?',
            //     warningMessage: `No app configs found for this project \nMaybe you forgot to run ${chalk().white('rnv template apply')} ?`
            // });
            return Promise.reject('No app configs found for this project');
        }
    } else if (c.program.appConfigID) {
        const aid = await matchAppConfigID(c, c.program.appConfigID?.toLowerCase?.());
        if (!aid) {
            logWarning('Cannot find app config ');
        }
        _setAppId(c, aid);
    }

    await parseRenativeConfigs(c);
    await logAppInfo(c);


    return true;
};

export default {
    description: 'Sets current app config',
    fn: taskAppConfigure,
    task: TASK_APP_CONFIGURE,
    params: [],
    platforms: [],
};
