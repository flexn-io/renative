
import { Common, EngineManager, Exec, Logger } from 'rnv';

const { logTask } = Logger;
const { executeAsync } = Exec;
const { getPlatformBuildDir } = Common;
const { generateEnvVars } = EngineManager;

export const runTizenProject = async (c, target) => {
    logTask('runTizenProject', `target:${target}`);

    await executeAsync(c, 'lng dev', { stdio: 'inherit', silent: true, env: { LNG_BUILD_FOLDER: getPlatformBuildDir(c, true), ...generateEnvVars(c) } });
    return true;
};

export const buildTizenProject = async () => {
    logTask('buildTizenProject');


    return true;
};


export const configureTizenProject = async () => {
    logTask('configureTizenProject');
};
