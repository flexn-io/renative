import path from 'path';
import {
    PARAMS,
    copyFileSync,
    mkdirSync,
    fsWriteFileSync,
    fsExistsSync,
    fsReadFileSync,
    chalk,
    logTask,
    logWarning,
    logDebug,
    logInfo,
    RnvTaskFn,
    RnvTask,
    TaskKey,
    ConfigName,
} from '@rnv/core';

const taskWorkspaceConfigure: RnvTaskFn = async (c) => {
    logTask('taskWorkspaceConfigure');

    // Check globalConfig Dir
    if (fsExistsSync(c.paths.workspace.dir)) {
        logDebug(`${c.paths.workspace.dir} folder exists!`);
    } else {
        logInfo(`${c.paths.workspace.dir} folder missing! Creating one for you...`);
        mkdirSync(c.paths.workspace.dir);
    }

    // Check globalConfig
    if (fsExistsSync(c.paths.workspace.config)) {
        logDebug(`${c.paths.workspace.dir}/${ConfigName.renative} file exists!`);
    } else {
        const oldGlobalConfigPath = path.join(c.paths.workspace.dir, 'config.json');
        if (fsExistsSync(oldGlobalConfigPath)) {
            logWarning('Found old version of your config. will copy it to new renative.json config');
            copyFileSync(oldGlobalConfigPath, c.paths.workspace.config);
        } else {
            logInfo(`${c.paths.workspace.dir}/${ConfigName.renative} file missing! Creating one for you...`);
            copyFileSync(
                path.join(c.paths.rnv.dir, 'coreTemplateFiles', 'global-config-template.json'),
                c.paths.workspace.config
            );
        }
    }

    if (fsExistsSync(c.paths.workspace.config)) {
        c.files.workspace.config = JSON.parse(fsReadFileSync(c.paths.workspace.config).toString());

        if (c.files.workspace.config?.appConfigsPath) {
            if (!fsExistsSync(c.files.workspace.config.appConfigsPath)) {
                logWarning(
                    `Your custom global appConfig is pointing to ${chalk().white(
                        c.files.workspace.config.appConfigsPath
                    )} which doesn't exist! Make sure you create one in that location`
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk().white(
                        c.files.workspace.config.appConfigsPath
                    )}. ReNativewill now swith to that location!`
                );
                c.paths.project.appConfigsDir = c.files.workspace.config.appConfigsPath;
            }
        }

        // Check config sanity
        if (c.files.workspace.config?.defaultTargets === undefined) {
            logWarning(
                `You're missing defaultTargets in your config ${chalk().white(
                    c.paths.workspace.config
                )}. Let's add them!`
            );
            const defaultConfig = JSON.parse(
                fsReadFileSync(
                    path.join(c.paths.rnv.dir, 'coreTemplateFiles', 'global-config-template.json')
                ).toString()
            );
            const newConfig = {
                ...c.files.workspace.config,
                defaultTargets: defaultConfig.defaultTargets,
            };
            fsWriteFileSync(c.paths.workspace.config, JSON.stringify(newConfig, null, 2));
        }
    }

    return true;
};

const Task: RnvTask = {
    description: 'Preconfigures your current workspace defined via "workspaceID" prop in renative config file',
    fn: taskWorkspaceConfigure,
    task: TaskKey.workspaceConfigure,
    options: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
