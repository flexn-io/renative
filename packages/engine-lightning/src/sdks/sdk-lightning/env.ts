import { getAppFolder, getConfigProp, getContext } from '@rnv/core';
import { join } from 'path';

export const EnvVars = {
    LNG_BUILD_FOLDER: () => {
        const ctx = getContext();
        const folder = join(getAppFolder(ctx, true), 'build');
        return { LNG_BUILD_FOLDER: folder };
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
        const folder = join(getAppFolder(ctx, true), 'build');
        return { LNG_DIST_FOLDER: folder };
    },
    LNG_AUTO_UPDATE: () => {
        return { LNG_AUTO_UPDATE: false };
    },
    LNG_STATIC_FOLDER: () => {
        const ctx = getContext();
        const folder = join(getAppFolder(ctx, true), 'static');
        return { LNG_STATIC_FOLDER: folder };
    },
};
