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
                appConfig.app.common = appConfig.app.common || {};
                appConfig.app.common.title = inputs.appTitle;
                appConfig.app.common.id = inputs.appID;
                appConfig.app.common.description = `This is ${inputs.appTitle} app!`;
                logInfo(
                    `Updating appConfig ${chalk().bold.white(appConfigID)} with title: ${chalk().bold.white(
                        inputs.appTitle
                    )} and id: ${chalk().bold.white(inputs.appID)}`
                );
                writeFileSync(appCnfPath, appConfig);
            }
        });
    }
};

export default Question;
