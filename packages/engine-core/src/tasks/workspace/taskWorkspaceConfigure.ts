import path from 'path';
import merge from 'deepmerge';
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
    // getUpdatedConfigFile,
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
            logDebug(`${paths.workspace.dir}/${RnvFileName.rnv} file exists!`);
        } else {
            const oldGlobalConfigPath = path.join(paths.workspace.dir, 'config.json');
            if (fsExistsSync(oldGlobalConfigPath)) {
                logWarning('Found old version of your config. will copy it to new renative.json config');
                copyFileSync(oldGlobalConfigPath, paths.workspace.config);
            } else {
                logInfo(`${paths.workspace.dir}/${RnvFileName.rnv} file missing! Creating one for you...`);
                writeFileSync(paths.workspace.config, '{}');
            }
        }

        if (fsExistsSync(paths.workspace.config)) {
            const configFile = JSON.parse(fsReadFileSync(paths.workspace.config).toString());
            // const updatedFile = await getUpdatedConfigFile(configFile, paths.workspace.config, 'workspace');
            // console.log('updatedFile', updatedFile);
            files.workspace.config = configFile;

            if (files.workspace.config?.workspace?.appConfigsPath) {
                if (!fsExistsSync(files.workspace.config.workspace?.appConfigsPath)) {
                    logWarning(
                        `Your custom global appConfig is pointing to ${chalk().bold.white(
                            files.workspace.config.workspace.appConfigsPath
                        )} which doesn't exist! Make sure you create one in that location`
                    );
                } else {
                    logInfo(
                        `Found custom appConfing location pointing to ${chalk().bold.white(
                            files.workspace.config.workspace.appConfigsPath
                        )}. ReNativewill now swith to that location!`
                    );
                    paths.project.appConfigsDir = files.workspace.config.workspace.appConfigsPath;
                }
            }
            // Check config sanity
            if (files.workspace.config?.workspace?.defaultTargets === undefined) {
                logWarning(
                    `You're missing defaultTargets in your config ${chalk().bold.white(
                        paths.workspace.config
                    )}. Let's add them!`
                );
                const newConfig = merge(files.workspace.config || {}, { workspace: { defaultTargets: {} } });
                fsWriteFileSync(paths.workspace.config, JSON.stringify(newConfig, null, 2));
            }
        }

        return true;
    },
    task: RnvTaskName.workspaceConfigure,
    isGlobalScope: true,
});
