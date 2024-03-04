import { RnvContext } from '../context/types';
import { logDefault } from '../logger';
import { writeFileSync } from '../system/fs';

export const generateLocalConfig = (c: RnvContext, resetAppId?: boolean) => {
    logDefault('generateLocalConfig', `resetAppId:${!!resetAppId}`);
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
