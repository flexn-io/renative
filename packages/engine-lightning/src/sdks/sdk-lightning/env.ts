import { getConfigProp, getContext, getPlatformBuildDir } from '@rnv/core';

export const EnvVars = {
    LNG_BUILD_FOLDER: () => {
        const ctx = getContext();

        return { LNG_BUILD_FOLDER: getAppFolder(ctx, true) };
    },
    LNG_ENTRY_FILE: () => {
        const ctx = getContext();

        const entryFile = getConfigProp(ctx, ctx.platform, 'entryFile');
        return { LNG_ENTRY_FILE: entryFile };
    },
    LNG_SERVE_PORT: () => {
        const ctx = getContext();
        return {
            LNG_SERVE_PORT: ctx.runtime.currentPlatform?.defaultPort,
        };
    },
    LNG_DIST_FOLDER: () => {
        const ctx = getContext();
        return { LNG_DIST_FOLDER: getAppFolder(ctx, true) };
    },
};
