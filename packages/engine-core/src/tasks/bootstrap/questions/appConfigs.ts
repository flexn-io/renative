import {
    type ConfigFileApp,
    getContext,
    listAppConfigsFoldersAsync,
    readObjectSync,
    logInfo,
    chalk,
    RnvFileName,
    writeFileSync,
    getUpdatedConfigFile,
    fsExistsSync,
    removeFilesSync,
    generateNewSchemaPath,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { inputs } = data;
    // Update appConfigs with new appTitle and appID

    const appConfigs = await listAppConfigsFoldersAsync(true);
    if (appConfigs && appConfigs.length > 0) {
        for (const appConfigID of appConfigs) {
            const isNewConfigPath = fsExistsSync(
                path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.rnv)
            );

            const appCnfPath = isNewConfigPath
                ? path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.rnv)
                : path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.renative);
            const appConfig = readObjectSync<ConfigFileApp & { $schema: string }>(appCnfPath);
            const updatedAppConfig = await getUpdatedConfigFile(appConfig!, appCnfPath, 'app');

            if (updatedAppConfig) {
                updatedAppConfig.project = updatedAppConfig.project || {};
                updatedAppConfig.project.common = updatedAppConfig.app.common || updatedAppConfig.project.common || {};
                updatedAppConfig.project.common.title = inputs.appTitle;
                updatedAppConfig.project.common.id = inputs.appID;
                updatedAppConfig.project.common.description = `This is ${inputs.appTitle} app!`;
                updatedAppConfig.$schema = generateNewSchemaPath(
                    path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.rnv)
                );
                logInfo(
                    `Updating appConfig ${chalk().bold.white(appConfigID)} with title: ${chalk().bold.white(
                        inputs.appTitle
                    )} and id: ${chalk().bold.white(inputs.appID)}`
                );

                writeFileSync(path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.rnv), updatedAppConfig);
                if (!isNewConfigPath) {
                    removeFilesSync([appCnfPath]);
                }
                if (fsExistsSync(path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.renative))) {
                    removeFilesSync([path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.renative)]);
                }
            }
        }
    }
};

export default Question;
