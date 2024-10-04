import { doResolve, executeAsync, getContext, logDefault, writeFileSync } from '@rnv/core';

export const jetifyIfRequired = async () => {
    const c = getContext();
    logDefault('jetifyIfRequired');
    if (c.files.project.configLocal?.local?._meta?.requiresJetify) {
        if (doResolve('jetifier')) {
            await executeAsync('npx jetify');
            c.files.project.configLocal.local._meta.requiresJetify = false;
            writeFileSync(c.paths.project.configLocal, c.files.project.configLocal);
        }
    }
    return true;
};
