import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { initializeBuilder, logComplete, logError } from './common';
import Runner from './cli/runner';
import App from './cli/app';
import Platform from './cli/platform';
import Setup from './cli/setup';

// const ADD_PLATFORM = 'addPlatform';
// const REMOVE_PLATFORM = 'removePlatform';
// const RUN = 'run';
// const UPDATE = 'update';
// const CREATE_PLATFORMS = 'createPlatforms';
//
// const TARGET_CREATE = 'target:create';
// const TARGET_REMOVE = 'target:remove';
// const TARGET_START = 'target:start';
// const TARGET_QUIT = 'target:quit';
// const TARGET_LIST = 'target:list';
//
// const PLATFORM_CONFIGURE = 'platform:configure';
// const PLATFORM_UPDATE = 'platform:update';
// const PLATFORM_ADD = 'platform:add';
// const PLATFORM_REMOVE = 'platform:remove';
// const PLATFORM_LIST = 'platform:list';
//
// const APP_CONFIGURE = 'app:configure';
// const APP_SWITCH = 'app:switch';
// const APP_REMOVE = 'app:remove';
// const APP_CREATE = 'app:create';
// const APP_LIST = 'app:list';
// const APP_INFO = 'app:info';
//
// const PLUGIN_ADD = 'plugin:add';
// const PLUGIN_REMOVE = 'plugin:remove';
// const PLUGIN_LIST = 'plugin:list';

// const SETUP = 'setup';
// const APP = 'app';

const commands = {
    setup: Setup,
    app: App,
    platform: Platform,
    run: Runner,
};

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program).then((v) => {
        commands[cmd](v).then(() => logComplete()).catch(e => logError(e));
    });
};


export default { run };
