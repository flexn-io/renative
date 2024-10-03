import path from 'path';
import { getConfigRootProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { writeFileSync } from '../system/fs';
import { RnvFileName } from '../enums/fileName';

export const generateLocalConfig = (resetAppId?: boolean) => {
    logDefault('generateLocalConfig', `resetAppId:${!!resetAppId}`);
    const c = getContext();
    const isMonorepo = getConfigRootProp('isMonorepo');

    const schemePath = isMonorepo
        ? path.join(c.paths.project.dir, '../.rnv', 'schema', RnvFileName.schema)
        : path.join(c.paths.project.dir, '.rnv/schema', RnvFileName.schema);
    const relativeShemePath = path.relative(c.paths.project.configLocal, schemePath);

    const configLocal = c.files.project.configLocal || {};
    if (!configLocal?.$schema) {
        configLocal.$schema = relativeShemePath;
    }
    if (!configLocal?.local) {
        configLocal.local = {};
    }

    configLocal.local._meta = configLocal.local._meta || {};

    if (resetAppId) {
        delete configLocal.local._meta.currentAppConfigId;
    } else {
        configLocal.local._meta.currentAppConfigId = c.runtime.appId;
    }
    c.files.project.configLocal = configLocal;
    writeFileSync(c.paths.project.configLocal, configLocal);
};
