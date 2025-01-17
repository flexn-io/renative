import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { writeFileSync } from '../system/fs';

/**
 * Generates or updates the local configuration file for the project.
 *
 * This function manages the local configuration by either updating or resetting
 * the current application configuration ID. It operates on the configLocal object
 * within the project files and persists changes to the filesystem.
 *
 * @param resetAppId - Optional boolean flag. When true, removes the currentAppConfigId
 *                     from the configuration. When false or undefined, sets the
 *                     currentAppConfigId to the current runtime appId.
 */
export const generateLocalConfig = (resetAppId?: boolean) => {
    logDefault('generateLocalConfig', `resetAppId:${!!resetAppId}`);
    const c = getContext();

    const configLocal = c.files.project.configLocal || {};
    configLocal._meta = configLocal._meta || {};
    if (resetAppId) {
        delete configLocal._meta.currentAppConfigId;
    } else {
        configLocal._meta.currentAppConfigId = c.runtime.appId;
    }
    c.files.project.configLocal = configLocal;
    writeFileSync(c.paths.project.configLocal, configLocal);
};
