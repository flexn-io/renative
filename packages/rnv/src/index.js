
import * as Common from './core/common';
import * as Utils from './core/systemManager/utils';
import * as Prompt from './cli/prompt';
import * as Constants from './core/constants';
import CLI from './cli';

import 'source-map-support/register';

// MANAGERS
import * as EngineManager from './core/engineManager';
import * as SetupManager from './core/setupManager';
import * as PlatformManager from './core/platformManager';
import * as PluginManager from './core/pluginManager';
import * as ProjectManager from './core/projectManager';
import * as ConfigManager from './core/configManager';
import * as SchemaManager from './core/schemaManager';
import * as SDKManager from './core/sdkManager';
import * as TemplateManager from './core/templateManager';
import * as TaskManager from './core/taskManager';

// SUB-MODULES
import * as NPMUtils from './core/systemManager/npmUtils';
import * as ObjectUtils from './core/systemManager/objectUtils';
import * as Exec from './core/systemManager/exec';
import * as FileUtils from './core/systemManager/fileutils';
import * as Doctor from './core/systemManager/doctor';
import * as Logger from './core/systemManager/logger';
import * as Resolver from './core/systemManager/resolve';
import Analytics from './core/systemManager/analytics';
import Config from './core/configManager/config';
import * as WebpackUtils from './core/sdkManager/webpackUtils';

global.RNV_ANALYTICS = Analytics.initialize();

export const initializeBuilder = async (cmd, subCmd, process, program) => {
    FileUtils.configureFilesystem(Resolver.getConfigProp, Resolver.doResolve, Utils.isSystemWin);
    const c = ConfigManager.createRnvConfig(program, process, cmd, subCmd);

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

export const { doResolve } = Resolver;
export const { doResolvePath } = Resolver;
// END LEGACY

export {
    Constants,
    Common,
    Prompt,
    // MANAGERS
    EngineManager,
    PlatformManager,
    SetupManager,
    PluginManager,
    ProjectManager,
    ConfigManager,
    SchemaManager,
    SDKManager,
    TemplateManager,
    TaskManager,
    // SUBMODULES
    WebpackUtils,
    Exec,
    FileUtils,
    ObjectUtils,
    Doctor,
    Config,
    Logger,
    NPMUtils,
    Resolver,
    Utils,
    run,
    CLI
};

export default { run, Config };
