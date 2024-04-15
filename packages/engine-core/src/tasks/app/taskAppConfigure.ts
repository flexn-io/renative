import path from 'path';

import {
    chalk,
    logError,
    logTask,
    logWarning,
    logDebug,
    logInfo,
    logAppInfo,
    writeFileSync,
    fsExistsSync,
    fsReadFileSync,
    fsRenameSync,
    RnvTaskOptionPresets,
    listAppConfigsFoldersSync,
    updateRenativeConfigs,
    inquirerPrompt,
    RnvContext,
    inquirerSeparator,
    RnvTaskName,
    createTask,
} from '@rnv/core';

const _loadAppConfigIDfromDir = (dirName: string, appConfigsDir: string) => {
    logDebug(`_loadAppConfigIDfromDir:${dirName}:${appConfigsDir}`, chalk().grey);
    const filePath = path.join(appConfigsDir, 'renative.json');
    if (fsExistsSync(filePath)) {
        try {
            const renativeConf = JSON.parse(fsReadFileSync(filePath).toString());
            return { dir: dirName, id: renativeConf.id };
        } catch (e) {
            logError(`File ${filePath} is MALFORMED:\n${e}`);
        }
    }
    return { dir: dirName, id: null };
};

const _askUserAboutConfigs = async (ctx: RnvContext, dir: string, id: string, basePath: string) => {
    logTask('_askUserAboutConfigs');
    logWarning(
        `AppConfig error - It seems you have a mismatch between appConfig folder name (${dir}) and the id defined in renative.json (${id}). They must match.`
    );
    if (ctx.program.opts().ci === true) {
        throw new Error('You cannot continue if you set --ci flag. please fix above error first');
    }
    const { choice } = await inquirerPrompt({
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
            inquirerSeparator(),
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
        const fileContents = JSON.parse(fsReadFileSync(filePath).toString());
        fileContents.id = dir;
        conf.id = dir;

        writeFileSync(filePath, fileContents);
    }

    return conf;
};

/* eslint-disable no-await-in-loop */
const matchAppConfigID = async (ctx: RnvContext, appConfigID: string) => {
    logTask('matchAppConfigID', `appId:${appConfigID}`);

    if (!appConfigID) return false;

    const { appConfigsDirs, appConfigsDirNames } = ctx.paths.project;

    const acIndex = appConfigsDirNames.indexOf(appConfigID);
    if (acIndex !== -1) {
        let conf = _loadAppConfigIDfromDir(appConfigID, appConfigsDirs[acIndex]);
        const { dir, id } = conf;
        if (id !== dir) {
            conf = await _askUserAboutConfigs(ctx, conf.dir, conf.id, path.join(appConfigsDirs[acIndex], '..'));
        }

        return conf.id;
    }
    return false;
};

const _findAndSwitchAppConfigDir = async (ctx: RnvContext) => {
    logTask('_findAndSwitchAppConfigDir');
    const { appConfigsDirNames } = ctx.paths.project;
    if (appConfigsDirNames.length) {
        if (appConfigsDirNames.length === 1) {
            // we have only one, skip the question
            logInfo(`Found only one app config available. Will use ${chalk().bold(appConfigsDirNames[0])}`);
            _setAppId(ctx, appConfigsDirNames[0]);
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
            _setAppId(ctx, conf);
            return true;
        }
    }

    return false;
};

const _setAppId = (ctx: RnvContext, appId: string) => {
    const currentAppConfigId = ctx.files.project?.configLocal?._meta?.currentAppConfigId;

    logTask('_setAppId', `appId:${appId} runtime.appId:${ctx.runtime.appId} _meta.appId:${currentAppConfigId}`);
    ctx.runtime.appId = appId || ctx.runtime.appId || currentAppConfigId;
    ctx.runtime.appDir = path.join(ctx.paths.project.builds.dir, `${ctx.runtime.appId}_${ctx.platform}`);
};

export default createTask({
    description: 'Configure project with specific appConfig',
    fn: async ({ ctx }) => {
        ctx.paths.project.appConfigsDirNames = listAppConfigsFoldersSync(true);
        ctx.paths.project.appConfigsDirNames.forEach((dirName) => {
            ctx.paths.project.appConfigsDirs.push(path.join(ctx.paths.project.appConfigsDir, dirName));
        });

        const appConfigsDirsExt = ctx.buildConfig?.paths?.appConfigsDirs;
        if (appConfigsDirsExt) {
            appConfigsDirsExt.forEach((apePath) => {
                const appConfigsExt = listAppConfigsFoldersSync(true, apePath);
                appConfigsExt.forEach((appExtName) => {
                    ctx.paths.project.appConfigsDirNames.push(appExtName);
                    ctx.paths.project.appConfigsDirs.push(path.join(apePath, appExtName));
                });
            });
        }

        // Reset appId if appConfig no longer exists but renative.local.json still has reference to it
        if (ctx.runtime.appId && !ctx.paths.project.appConfigsDirNames.includes(ctx.runtime.appId)) {
            ctx.runtime.appId = undefined;
        }

        if (ctx.program.opts().appConfigID === true || (!ctx.program.opts().appConfigID && !ctx.runtime.appId)) {
            const hasAppConfig = await _findAndSwitchAppConfigDir(ctx);
            if (!hasAppConfig) {
                // await executeTask(c, RnvTaskName.appCreate, RnvTaskName.appConfigure);
                // return Promise.reject('No app configs found for this project');
                logWarning('No app configs found for this project');
                return true;
            }
        } else if (ctx.program.opts().appConfigID) {
            const aid = await matchAppConfigID(ctx, ctx.program.opts().appConfigID);
            if (!aid) {
                logWarning(`Cannot find app config ${chalk().bold(ctx.program.opts().appConfigID)}`);
                const hasAppConfig = await _findAndSwitchAppConfigDir(ctx);
                if (!hasAppConfig) {
                    // await executeTask(c, RnvTaskName.appCreate, RnvTaskName.appConfigure);
                    // return Promise.reject('No app configs found for this project');
                    logWarning('No app configs found for this project');
                    return true;
                }
            }
            _setAppId(ctx, aid);
        }

        // Generate true path to appConfig (ensure external appConfigsDirs are included)
        if (ctx.runtime.appId) {
            ctx.runtime.appConfigDir =
                ctx.paths.project.appConfigsDirs[ctx.paths.project.appConfigsDirNames.indexOf(ctx.runtime.appId)];
        }

        await updateRenativeConfigs();
        logAppInfo(ctx);

        return true;
    },
    task: RnvTaskName.appConfigure,
    options: RnvTaskOptionPresets.withConfigure(),
});
