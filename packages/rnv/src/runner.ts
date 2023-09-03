import Analytics from './core/systemManager/analytics';
import Config from './core/context/context';
import { configureFilesystem } from './core/systemManager/fileutils';
import { createRnvConfig } from './core/configManager';
import { logComplete, logError, logInitialize } from './core/systemManager/logger';
import CLI from './cli';

global.RNV_ANALYTICS = Analytics;

export const initializeBuilder = async (cmd: string, subCmd: string, process: any, program: any) => {
    // set mono and ci if json is enabled
    if (program.json) {
        program.mono = true;
        program.ci = true;
    }

    Analytics.initialize();
    configureFilesystem(getConfigProp, doResolve, isSystemWin);
    const c = createRnvConfig(program, process, cmd, subCmd);
    logInitialize();

    //@ts-ignore
    global.fetch = await import('node-fetch');
    //@ts-ignore
    global.Headers = global.fetch.Headers;

    return c;
};

export const run = (cmd: string, subCmd: string, program: any, process: any) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then((c) => Config.initializeConfig(c))
        .then((c) => CLI(c))
        .then(() => logComplete(!Config.getConfig().runtime.keepSessionActive))
        .catch((e) => logError(e, true));
};
