import path from 'path';
import {
    copyFileSync,
    mkdirSync,
    fsWriteFileSync,
    fsExistsSync,
    fsReadFileSync,
    chalk,
    logWarning,
    logDebug,
    logInfo,
    createTask,
    RnvTaskName,
    RnvFileName,
} from '@rnv/core';
import { writeFileSync } from 'fs';

export default createTask({
    description: 'Preconfigures your current workspace defined via "workspaceID" prop in renative config file',
    fn: async ({ ctx }) => {
        const { paths, files } = ctx;
        // Check globalConfig Dir
        if (fsExistsSync(paths.workspace.dir)) {
            logDebug(`${paths.workspace.dir} folder exists!`);
        } else {
            logInfo(`${paths.workspace.dir} folder missing! Creating one for you...`);
            mkdirSync(paths.workspace.dir);
        }

        // Check globalConfig
        if (fsExistsSync(paths.workspace.config)) {
            logDebug(`${paths.workspace.dir}/${RnvFileName.renative} file exists!`);
        } else {
            const oldGlobalConfigPath = path.join(paths.workspace.dir, 'config.json');
            if (fsExistsSync(oldGlobalConfigPath)) {
                logWarning('Found old version of your config. will copy it to new renative.json config');
                copyFileSync(oldGlobalConfigPath, paths.workspace.config);
            } else {
                logInfo(`${paths.workspace.dir}/${RnvFileName.renative} file missing! Creating one for you...`);
                writeFileSync(paths.workspace.config, '{}');
            }
        }

        if (fsExistsSync(paths.workspace.config)) {
            files.workspace.config = JSON.parse(fsReadFileSync(paths.workspace.config).toString());

            if (files.workspace.config?.appConfigsPath) {
                if (!fsExistsSync(files.workspace.config.appConfigsPath)) {
                    logWarning(
                        `Your custom global appConfig is pointing to ${chalk().bold(
                            files.workspace.config.appConfigsPath
                        )} which doesn't exist! Make sure you create one in that location`
                    );
                } else {
                    logInfo(
                        `Found custom appConfing location pointing to ${chalk().bold(
                            files.workspace.config.appConfigsPath
                        )}. ReNativewill now swith to that location!`
                    );
                    paths.project.appConfigsDir = files.workspace.config.appConfigsPath;
                }
            }

            // Check config sanity
            if (files.workspace.config?.defaultTargets === undefined) {
                logWarning(
                    `You're missing defaultTargets in your config ${chalk().bold(
                        paths.workspace.config
                    )}. Let's add them!`
                );

                const newConfig = {
                    ...files.workspace.config,
                    defaultTargets: {},
                };
                fsWriteFileSync(paths.workspace.config, JSON.stringify(newConfig, null, 2));
            }
        }

        return true;
    },
    task: RnvTaskName.workspaceConfigure,
    isGlobalScope: true,
});
