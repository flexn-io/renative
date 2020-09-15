import Common, { getConfigProp } from './core/common';
import { isSystemWin } from './core/utils';
import Logger, { logComplete, logError, configureLogger, logInitialize } from './core/systemManager/logger';
import { createRnvConfig } from './core/configManager/configParser';
import CLI from './cli';
import * as Constants from './core/constants';
import Exec from './core/systemManager/exec';
import FileUtils, { configureFilesystem } from './core/systemManager/fileutils';
import Doctor from './core/systemManager/doctor';
import PluginTools from './core/pluginManager';
import SetupTools from './core/setupManager';
import Config from './core/configManager/config';
import { doResolve, doResolvePath } from './core/resolve';
import Analytics from './core/systemManager/analytics';
import EngineManager from './core/engineManager';

import 'source-map-support/register';

Analytics.initialize();

export const initializeBuilder = async (cmd, subCmd, process, program) => {
    configureFilesystem(getConfigProp, doResolve, isSystemWin);
    const c = createRnvConfig(program, process, cmd, subCmd);

    configureLogger(c, Analytics);
    logInitialize();

    return c;
};

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => Config.initializeConfig(c))
        .then(c => CLI(c))
        .then(() => logComplete(!Config.getConfig().runtime.keepSessionActive))
        .catch(e => logError(e, true));
};

export {
    Constants,
    Common,
    Exec,
    FileUtils,
    Doctor,
    PluginTools,
    SetupTools,
    Logger,
    EngineManager,
    run,
    CLI,
    doResolve,
    doResolvePath
};

export default { run, Config };
