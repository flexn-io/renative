import { getAppFolder, getConfigProp, getContext } from '@rnv/core';

export const EnvVars = {
    LNG_BUILD_FOLDER: () => {
        return { LNG_BUILD_FOLDER: getAppFolder(true) };
    },
    LNG_ENTRY_FILE: () => {
        const entryFile = getConfigProp('entryFile');
        return { LNG_ENTRY_FILE: entryFile };
    },
    LNG_SERVE_PORT: () => {
        const ctx = getContext();
        return {
            LNG_SERVE_PORT: ctx.runtime.currentPlatform?.defaultPort,
        };
    },
    LNG_DIST_FOLDER: () => {
        return { LNG_DIST_FOLDER: getAppFolder(true) };
    },
};
