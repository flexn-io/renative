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
import * as PlatformManager from './core/platformManager';
import * as Resolver from './core/resolve';
import * as EngineManager from './core/engineManager';
import * as SetupManager from './core/setupManager';
import * as SchemaParser from './core/schemaManager/schemaParser';

// SDKS
import * as SDKWebpack from './sdk-webpack';
import * as SDKWebos from './sdk-webos';
import * as SDKTizen from './sdk-tizen';
import * as SDKElectron from './sdk-electron';
import * as SDKAndroid from './sdk-android';
import * as SDKXcode from './sdk-xcode';
import * as SDKFirefox from './sdk-firefox';

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

// LEGACY
const SetupTools = SetupManager;

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
    PluginTools,
    SetupTools,
    Prompt,
    Logger,
    Resolver,
    SchemaParser,
    // MANAGERS
    EngineManager,
    PlatformManager,
    SetupManager,
    // SDK
    SDKWebpack,
    SDKWebos,
    SDKAndroid,
    SDKXcode,
    SDKElectron,
    SDKFirefox,
    SDKTizen,
    run,
    CLI
};

export default { run, Config };
