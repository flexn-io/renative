import {
    type ConfigFileApp,
    getContext,
    listAppConfigsFoldersSync,
    readObjectSync,
    logInfo,
    chalk,
    RnvFileName,
    writeFileSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { inputs } = data;
    // Update appConfigs with new appTitle and appID
    const appConfigs = listAppConfigsFoldersSync(true);
    if (appConfigs && appConfigs.length > 0) {
        appConfigs.forEach((appConfigID) => {
            const appCnfPath = path.join(c.paths.project.appConfigsDir, appConfigID, RnvFileName.renative);
            const appConfig = readObjectSync<ConfigFileApp>(appCnfPath);
            if (appConfig) {
                appConfig.common = appConfig.common || {};
                appConfig.common.title = inputs.appTitle;
                appConfig.common.id = inputs.appID;
                appConfig.common.description = `This is ${inputs.appTitle} app!`;
                logInfo(
                    `Updating appConfig ${chalk().bold(appConfigID)} with title: ${chalk().bold(
                        inputs.appTitle
                    )} and id: ${chalk().bold(inputs.appID)}`
                );
                writeFileSync(appCnfPath, appConfig);
            }
        });
    }
};

export default Question;
