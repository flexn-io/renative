import path from 'path';
import inquirer from 'inquirer';
import { listAppConfigsFoldersSync } from '../../core/configManager';
import { updateRenativeConfigs } from '../../core/runtimeManager';
import { TASK_APP_CONFIGURE, PARAMS } from '../../core/constants';
import { writeFileSync, fsExistsSync, fsReadFileSync, fsRenameSync } from '../../core/systemManager/fileutils';
import { chalk, logError, logTask, logWarning, logDebug, logInfo, logAppInfo } from '../../core/systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';

const _loadAppConfigIDfromDir = (dirName, appConfigsDir) => {
    logDebug(`_loadAppConfigIDfromDir:${dirName}:${appConfigsDir}`, chalk().grey);
    const filePath = path.join(appConfigsDir, 'renative.json');
    if (fsExistsSync(filePath)) {
        try {
            const renativeConf = JSON.parse(fsReadFileSync(filePath));
            return { dir: dirName, id: renativeConf.id };
        } catch (e) {
            logError(`File ${filePath} is MALFORMED:\n${e}`);
        }
    }
    return { dir: dirName, id: null };
};

const _askUserAboutConfigs = async (c, dir, id, basePath) => {
    logTask('_askUserAboutConfigs');
    logWarning(
        `AppConfig error - It seems you have a mismatch between appConfig folder name (${dir}) and the id defined in renative.json (${id}). They must match.`
    );
    if (c.program.ci === true) {
        throw new Error('You cannot continue if you set --ci flag. please fix above error first');
    }
    const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'You must choose what you want to keep',
        choices: [
            // {
            //     name: `Keep ID from renative.json (${id}) and rename the folder (${dir} -> ${id})`,
            //     value: 'keepID'
            // },
            {
                name: `Keep folder name (${dir}) and rename the ID from renative.json (${id} -> ${dir})`,
                value: 'keepFolder',
            },
            new inquirer.Separator(),
            {
                name: "I'll do it manually",
                value: 'manually',
            },
        ],
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

    const { appConfigsDirs, appConfigsDirNames } = c.paths.project;

    const acIndex = appConfigsDirNames.indexOf(appConfigID);
    if (acIndex !== -1) {
        let conf = _loadAppConfigIDfromDir(appConfigID, appConfigsDirs[acIndex]);
        const { dir, id } = conf;
        if (id !== dir) {
            conf = await _askUserAboutConfigs(c, conf.dir, conf.id, path.join(appConfigsDirs[acIndex], '..'));
        }

        return conf.id;
    }
    return false;
};

const _findAndSwitchAppConfigDir = async (c) => {
    logTask('_findAndSwitchAppConfigDir');
    const { appConfigsDirNames } = c.paths.project;
    if (appConfigsDirNames.length) {
        if (appConfigsDirNames.length === 1) {
            // we have only one, skip the question
            logInfo(`Found only one app config available. Will use ${chalk().white(appConfigsDirNames[0])}`);
            _setAppId(c, appConfigsDirNames[0]);
            return true;
        }

        const { conf } = await inquirerPrompt({
            name: 'conf',
            type: 'list',
            message: 'Which one would you like to pick?',
            choices: appConfigsDirNames,
            pageSize: 50,
            logMessage: 'ReNative found multiple existing appConfigs',
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

    const appConfigsDirsExt = c.buildConfig?.paths?.appConfigsDirs;
    if (appConfigsDirsExt) {
        appConfigsDirsExt.forEach((apePath) => {
            const appConfigsExt = listAppConfigsFoldersSync(c, true, apePath);
            appConfigsExt.forEach((appExtName) => {
                c.paths.project.appConfigsDirNames.push(appExtName);
                c.paths.project.appConfigsDirs.push(path.join(apePath, appExtName));
            });
        });
    }

    // Reset appId if appConfig no longer exists but renative.local.json still has reference to it
    if (!c.paths.project.appConfigsDirNames.includes(c.runtime.appId)) {
        c.runtime.appId = null;
    }

    if (c.program.appConfigID === true || (!c.program.appConfigID && !c.runtime.appId)) {
        const hasAppConfig = await _findAndSwitchAppConfigDir(c);
        if (!hasAppConfig) {
            // await executeTask(c, TASK_APP_CREATE, TASK_APP_CONFIGURE);
            // return Promise.reject('No app configs found for this project');
            logWarning('No app configs found for this project');
            return true;
        }
    } else if (c.program.appConfigID) {
        const aid = await matchAppConfigID(c, c.program.appConfigID);
        if (!aid) {
            logWarning(`Cannot find app config ${chalk().white(c.program.appConfigID)}`);
            const hasAppConfig = await _findAndSwitchAppConfigDir(c);
            if (!hasAppConfig) {
                // await executeTask(c, TASK_APP_CREATE, TASK_APP_CONFIGURE);
                // return Promise.reject('No app configs found for this project');
                logWarning('No app configs found for this project');
                return true;
            }
        }
        _setAppId(c, aid);
    }

    // Generate true path to appConfig (ensure external appConfigsDirs are included)
    c.runtime.appConfigDir =
        c.paths.project.appConfigsDirs[c.paths.project.appConfigsDirNames.indexOf(c.runtime.appId)];

    await updateRenativeConfigs(c);
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
