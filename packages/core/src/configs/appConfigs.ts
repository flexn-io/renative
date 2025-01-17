import path from 'path';

import { fsExistsSync, fsReaddirSync, fsLstatSync, readObjectSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { RnvFileName } from '../enums/fileName';
import { getContext } from '../context/provider';
import { ConfigFileApp } from '../schema/types';

const IGNORE_FOLDERS = ['.git'];

/**
 * Lists all application configuration folders in the specified directory or project's appConfigsDir
 *
 * @param ignoreHiddenConfigs - If true, excludes configurations marked as hidden in their renative.json file
 * @param appConfigsDirPath - Optional custom path to look for app configs. If not provided, uses project's appConfigsDir
 * @returns Array of folder names containing valid app configurations
 *
 * The function:
 * 1. Validates project path exists
 * 2. Scans the specified directory for subdirectories
 * 3. Filters out ignored folders (like .git)
 * 4. If ignoreHiddenConfigs is true, checks each folder's renative.json file
 *    and excludes those marked with hidden: true
 * 5. Returns an array of valid app config folder names
 */
export const listAppConfigsFoldersSync = (ignoreHiddenConfigs: boolean, appConfigsDirPath?: string) => {
    logDefault('listAppConfigsFoldersSync', `ignoreHiddenConfigs:${!!ignoreHiddenConfigs}`);
    const c = getContext();

    if (!c.paths?.project) return [];

    const dirPath = appConfigsDirPath || c.paths.project.appConfigsDir;

    if (!fsExistsSync(dirPath)) return [];
    const appConfigsDirs: Array<string> = [];
    fsReaddirSync(dirPath).forEach((dir) => {
        const appConfigDir = path.join(dirPath, dir);
        if (!IGNORE_FOLDERS.includes(dir) && fsLstatSync(appConfigDir).isDirectory()) {
            if (ignoreHiddenConfigs) {
                const appConfig = path.join(appConfigDir, RnvFileName.renative);
                if (fsExistsSync(appConfig)) {
                    try {
                        const config = readObjectSync<ConfigFileApp>(appConfig);
                        if (config?.hidden !== true) {
                            appConfigsDirs.push(dir);
                        }
                    } catch (e) {
                        logWarning(`_listAppConfigsFoldersSync: ${e}`);
                    }
                }
            } else {
                appConfigsDirs.push(dir);
            }
        }
    });
    return appConfigsDirs;
};
