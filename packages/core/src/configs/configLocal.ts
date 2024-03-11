import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { writeFileSync } from '../system/fs';

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
