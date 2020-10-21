import * as Common from './core/common';
import * as CoreUtils from './core/utils';
import * as Logger from './core/systemManager/logger';
import * as Prompt from './cli/prompt';
import * as ConfigParser from './core/configManager/configParser';
import * as Constants from './core/constants';
import * as Exec from './core/systemManager/exec';
import * as FileUtils from './core/systemManager/fileutils';
import * as Doctor from './core/systemManager/doctor';
import * as PluginTools from './core/pluginManager';
import * as SetupTools from './core/setupManager';
import * as Resolver from './core/resolve';
import * as EngineManager from './core/engineManager';
import * as SchemaParser from './core/schemaManager/schemaParser';
import Analytics from './core/systemManager/analytics';
import Config from './core/configManager/config';
import CLI from './cli';

import 'source-map-support/register';

Analytics.initialize();

export const initializeBuilder = async (cmd, subCmd, process, program) => {
    FileUtils.configureFilesystem(Resolver.getConfigProp, Resolver.doResolve, CoreUtils.isSystemWin);
    const c = ConfigParser.createRnvConfig(program, process, cmd, subCmd);

    Logger.configureLogger(c, Analytics);
    Logger.logInitialize();

    return c;
};

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => Config.initializeConfig(c))
        .then(c => CLI(c))
        .then(() => Logger.logComplete(!Config.getConfig().runtime.keepSessionActive))
        .catch(e => Logger.logError(e, true));
};


export {
    Constants,
    Common,
    Exec,
    FileUtils,
    Doctor,
    Config,
    PluginTools,
    SetupTools,
    Prompt,
    Logger,
    Resolver,
    EngineManager,
    SchemaParser,
    run,
    CLI
};

export const { doResolve } = Resolver;
export const { doResolvePath } = Resolver;

export default { run, Config };
