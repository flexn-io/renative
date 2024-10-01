import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { writeFileSync } from '../system/fs';

export const generateLocalConfig = (resetAppId?: boolean) => {
    logDefault('generateLocalConfig', `resetAppId:${!!resetAppId}`);
    const c = getContext();
    // TODO ADD AS NAMESPACE ???????
    const configLocal = c.files.project.configLocal || {};
    configLocal.local = configLocal.local || {};
    configLocal.local._meta = configLocal.local._meta || {};
    if (resetAppId) {
        delete configLocal.local._meta.currentAppConfigId;
    } else {
        configLocal.local._meta.currentAppConfigId = c.runtime.appId;
    }
    c.files.project.configLocal = configLocal;
    writeFileSync(c.paths.project.configLocal, configLocal);
};
