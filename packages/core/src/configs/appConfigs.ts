import path from 'path';

import { RENATIVE_CONFIG_NAME } from '../constants';
import { fsExistsSync, fsReaddirSync, fsLstatSync, readObjectSync } from '../system/fs';

import { logTask, logWarning } from '../logger';

import { RnvContext } from '../context/types';
import { ConfigFileApp } from '../schema/configFiles/types';

const IGNORE_FOLDERS = ['.git'];

export const listAppConfigsFoldersSync = (c: RnvContext, ignoreHiddenConfigs: boolean, appConfigsDirPath?: string) => {
    logTask('listAppConfigsFoldersSync', `ignoreHiddenConfigs:${!!ignoreHiddenConfigs}`);

    if (!c.paths?.project) return [];

    const dirPath = appConfigsDirPath || c.paths.project.appConfigsDir;

    if (!fsExistsSync(dirPath)) return [];
    const appConfigsDirs: Array<string> = [];
    fsReaddirSync(dirPath).forEach((dir) => {
        const appConfigDir = path.join(dirPath, dir);
        if (!IGNORE_FOLDERS.includes(dir) && fsLstatSync(appConfigDir).isDirectory()) {
            if (ignoreHiddenConfigs) {
                const appConfig = path.join(appConfigDir, RENATIVE_CONFIG_NAME);
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
