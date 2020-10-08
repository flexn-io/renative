import path from 'path';
import { promisify } from 'util';
import inquirer from 'inquirer';
import { parseRenativeConfigs, listAppConfigsFoldersSync } from '../../core/configManager/configParser';
import { TASK_APP_CONFIGURE, PARAMS } from '../../core/constants';
import {
    writeFileSync,
    fsExistsSync,
    fsReaddir,
    fsReadFileSync,
    fsRenameSync,
    fsStatSync,
} from '../../core/systemManager/fileutils';
import {
    chalk,
    logError,
    logTask,
    logWarning,
    logDebug,
    logInfo,
    logAppInfo,
} from '../../core/systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';

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

const _askUserAboutConfigs = async (c, dir, id, basePath) => {
    logTask('_askUserAboutConfigs');
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

    const conf = { id, dir };

    if (choice === 'keepID') {
        conf.dir = path.join(basePath, id);
        fsRenameSync(path.join(basePath, dir), conf.dir);
    }

    if (choice === 'keepFolder') {
        const filePath = path.join(basePath, dir, 'renative.json');
        const fileContents = JSON.parse(fsReadFileSync(filePath));
        fileContents.id = dir;
        conf.id = dir;

        writeFileSync(filePath, fileContents);
    }

    return conf;
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
            let confId;
            await Promise.all(
                appConfigs.map(async (_conf) => {
                    let conf = _conf;
                    confId = conf.id;
                    const { dir } = conf;
                    // find mismatches
                    if (confId !== dir) {
                        conf = await _askUserAboutConfigs(
                            c,
                            conf.dir,
                            conf.id,
                            appConfigsDir
                        );
                    }
                    confId = conf.id;
                    if (ids.includes(confId)) {
                        throw new Error(
                            `AppConfig error - You have 2 duplicate app configs with ID ${
                                confId
                            }. Keep in mind that ID is case insensitive.
Please edit one of them in /appConfigs/<folder>/renative.json`
                        );
                    }
                    ids.push(confId);
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
                cfg => cfg.id === appConfigID || cfg.dir === appConfigID
            );
            if (foundConfig.length) return foundConfig[0].id;
        }
    }
    return false;
};

const _findAndSwitchAppConfigDir = async (c) => {
    logTask('_findAndSwitchAppConfigDir');
    const { appConfigsDirNames } = c.paths.project;
    if (appConfigsDirNames.length) {
        if (appConfigsDirNames.length === 1) {
            // we have only one, skip the question
            logInfo(
                `Found only one app config available. Will use ${chalk().white(
                    appConfigsDirNames[0]
                )}`
            );
            _setAppId(c, appConfigsDirNames[0]);
            return true;
        }

        const { conf } = await inquirerPrompt({
            name: 'conf',
            type: 'list',
            message: 'Which one would you like to pick?',
            choices: appConfigsDirNames,
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
    const currentAppConfigId = c.files.project?.configLocal?._meta?.currentAppConfigId;

    logTask('_setAppId', `appId:${appId} runtime.appId:${c.runtime.appId} _meta.appId:${currentAppConfigId}`);
    c.runtime.appId = appId || c.runtime.appId || currentAppConfigId;
    c.runtime.appDir = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}`);
};

export const taskRnvAppConfigure = async (c) => {
    logTask('taskRnvAppConfigure');

    c.paths.project.appConfigsDirNames = listAppConfigsFoldersSync(c, true);
    c.paths.project.appConfigsDirNames.forEach((dirName) => {
        c.paths.project.appConfigsDirs.push(path.join(c.paths.project.appConfigsDir, dirName));
    });

    // Reset appId if appConfig no longer exists but renative.local.json still has reference to it
    if (!c.paths.project.appConfigsDirNames.includes(c.runtime.appId)) {
        c.runtime.appId = null;
    }


    if (c.program.appConfigID === true || (!c.program.appConfigID && !c.runtime.appId)) {
        const hasAppConfig = await _findAndSwitchAppConfigDir(c);
        if (!hasAppConfig) {
            // await executeTask(c, TASK_APP_CREATE, TASK_APP_CONFIGURE);
            return Promise.reject('No app configs found for this project');
        }
    } else if (c.program.appConfigID) {
        const aid = await matchAppConfigID(c, c.program.appConfigID);
        if (!aid) {
            logWarning(`Cannot find app config ${chalk().white(c.program.appConfigID)}`);
            const hasAppConfig = await _findAndSwitchAppConfigDir(c);
            if (!hasAppConfig) {
                // await executeTask(c, TASK_APP_CREATE, TASK_APP_CONFIGURE);
                return Promise.reject('No app configs found for this project');
            }
        }
        _setAppId(c, aid);
    }

    await parseRenativeConfigs(c);
    logAppInfo(c);

    return true;
};

export default {
    description: 'Configure project with specific appConfig',
    fn: taskRnvAppConfigure,
    task: TASK_APP_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [],
};
