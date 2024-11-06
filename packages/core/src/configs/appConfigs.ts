import path from 'path';

import { fsExistsSync, fsReaddirSync, fsLstatSync, readObjectSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { RnvFileName } from '../enums/fileName';
import { getContext } from '../context/provider';
import { ConfigFileApp } from '../schema/types';
import { getUpdatedConfigFile } from './utils';

const IGNORE_FOLDERS = ['.git'];

export const listAppConfigsFoldersAsync = async (ignoreHiddenConfigs: boolean, appConfigsDirPath?: string) => {
    logDefault('listAppConfigsFoldersAsync', `ignoreHiddenConfigs:${!!ignoreHiddenConfigs}`);
    const c = getContext();

    if (!c.paths?.project) return [];

    const dirPath = appConfigsDirPath || c.paths.project.appConfigsDir;
    if (!fsExistsSync(dirPath)) return [];
    const appConfigsDirs: Array<string> = [];

    for (const dir of fsReaddirSync(dirPath)) {
        const appConfigDir = path.join(dirPath, dir);

        if (!IGNORE_FOLDERS.includes(dir) && fsLstatSync(appConfigDir).isDirectory()) {
            if (ignoreHiddenConfigs) {
                const isNewConfigPath = fsExistsSync(path.join(appConfigDir, RnvFileName.rnv));
                const appConfig = path.join(appConfigDir, isNewConfigPath ? RnvFileName.rnv : RnvFileName.renative);
                if (fsExistsSync(appConfig)) {
                    try {
                        const config = readObjectSync<ConfigFileApp>(appConfig);
                        if (config) {
                            const updatedConfig = await getUpdatedConfigFile(config, appConfig, 'app');

                            if (updatedConfig?.app?.hidden !== true) {
                                appConfigsDirs.push(dir);
                            }
                        }
                    } catch (e) {
                        logWarning(`_listAppConfigsFoldersAsync: ${e}`);
                    }
                }
            } else {
                appConfigsDirs.push(dir);
            }
        }
    }
    return appConfigsDirs;
};
