import * as Common from './core/common';
import * as CoreUtils from './core/utils';
import * as Prompt from './cli/prompt';
import * as Constants from './core/constants';
import * as Resolver from './core/resolve';
import CLI from './cli';

import 'source-map-support/register';

// MANAGERS
import * as EngineManager from './core/engineManager';
import * as SetupManager from './core/setupManager';
import * as PlatformManager from './core/platformManager';
import * as PluginManager from './core/pluginManager';

// SUB-MODULES
import * as SchemaParser from './core/schemaManager/schemaParser';
import * as NPMUtils from './core/systemManager/npmUtils';
import * as Exec from './core/systemManager/exec';
import * as FileUtils from './core/systemManager/fileutils';
import * as Doctor from './core/systemManager/doctor';
import * as ConfigParser from './core/configManager/configParser';
import * as Logger from './core/systemManager/logger';
import Analytics from './core/systemManager/analytics';
import Config from './core/configManager/config';

// SDKS
import * as SDKWebpack from './sdk-webpack';
import * as SDKNext from './sdk-webpack/webNext';
import * as SDKWebos from './sdk-webos';
import * as SDKTizen from './sdk-tizen';
import * as SDKElectron from './sdk-electron';
import * as SDKAndroid from './sdk-android';
import * as SDKXcode from './sdk-xcode';
import * as SDKFirefox from './sdk-firefox';

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

// LEGACY
const SetupTools = SetupManager;
const PluginTools = PluginManager;

export const { doResolve } = Resolver;
export const { doResolvePath } = Resolver;
// LEGACY

export {
    Constants,
    Common,
    Exec,
    FileUtils,
    Doctor,
    Config,
    Prompt,
    Logger,
    Resolver,
    SchemaParser,
    NPMUtils,
    // MANAGERS
    EngineManager,
    PlatformManager,
    SetupManager,
    PluginManager,
    // SDK
    SDKWebpack,
    SDKWebos,
    SDKAndroid,
    SDKXcode,
    SDKElectron,
    SDKFirefox,
    SDKTizen,
    SDKNext,
    // LEGACY
    PluginTools,
    SetupTools,
    run,
    CLI
};

export default { run, Config };
