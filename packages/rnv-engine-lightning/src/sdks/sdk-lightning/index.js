
import { Common, EngineManager, Exec, Logger } from 'rnv';

const { logTask } = Logger;
const { executeAsync } = Exec;
const { getPlatformBuildDir, getConfigProp } = Common;
const { generateEnvVars } = EngineManager;

export const runLightningProject = async (c, target) => {
    logTask('runLightningProject', `target:${target}`);
    const entryFile = getConfigProp(c, c.platform, 'entryFile');

    await executeAsync(c, 'lng dev', {
        stdio: 'inherit',
        silent: false,
        env: {
            LNG_BUILD_FOLDER: getPlatformBuildDir(c, true),
            LNG_ENTRY_FILE: entryFile,
            LNG_SERVE_PORT: c.runtime.currentPlatform?.defaultPort,
            ...generateEnvVars(c)
        }
    });
    return true;
};

export const buildLightningProject = async (c) => {
    const { platform } = c;
    logTask('buildLightningProject');
    const entryFile = getConfigProp(c, c.platform, 'entryFile');
    const target = getConfigProp(c, platform, 'target', 'es6');

    await executeAsync(c, `lng dist --${target}`, {
        stdio: 'inherit',
        silent: false,
        env: {
            LNG_DIST_FOLDER: getPlatformBuildDir(c, true),
            LNG_ENTRY_FILE: entryFile,
            ...generateEnvVars(c),
        }
    });
    return true;
};


export const configureLightningProject = async () => {
    logTask('configureLightningProject');
};
