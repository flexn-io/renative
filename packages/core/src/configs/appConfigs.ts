import path from 'path';

import { fsExistsSync, fsReaddirSync, fsLstatSync, readObjectSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { RnvFileName } from '../enums/fileName';
import { getContext } from '../context/provider';
import { ConfigFileApp } from '../schema/types';

const IGNORE_FOLDERS = ['.git'];

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
                const appConfig = path.join(appConfigDir, RnvFileName.rnv);
                if (fsExistsSync(appConfig)) {
                    try {
                        const config = readObjectSync<ConfigFileApp>(appConfig);
                        if (config?.app?.hidden !== true) {
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
