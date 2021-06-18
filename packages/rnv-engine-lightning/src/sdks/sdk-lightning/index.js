
import { Common, EngineManager, Exec, Logger } from 'rnv';

const { logTask } = Logger;
const { executeAsync } = Exec;
const { getPlatformBuildDir } = Common;
const { generateEnvVars } = EngineManager;

export const runLightningProject = async (c, target) => {
    logTask('runLightningProject', `target:${target}`);

    await executeAsync(c, 'lng dev', {
        stdio: 'inherit',
        silent: false,
        env: {
            LNG_BUILD_FOLDER: getPlatformBuildDir(c, true),
            LNG_SERVE_PORT: c.runtime.currentPlatform?.defaultPort,
            ...generateEnvVars(c)
        }
    });
    return true;
};

export const buildLightningProject = async (c) => {
    logTask('buildLightningProject');

    await executeAsync(c, 'lng dist', {
        stdio: 'inherit',
        silent: false,
        env: {
            LNG_DIST_FOLDER: getPlatformBuildDir(c, true),
            ...generateEnvVars(c),
        }
    });
    return true;
};


export const configureLightningProject = async () => {
    logTask('configureLightningProject');
};
