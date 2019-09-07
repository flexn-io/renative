import chalk from 'chalk';
import Common, { initializeBuilder, startBuilder } from './common';
import Logger, { logComplete, logError, logWelcome, logInfo, configureLogger, logInitialize } from './systemTools/logger';
import CLI, { logHelp } from './cli';
import Runner from './cli/runner';
import Tools from './cli/tools';
import App from './cli/app';
import Platform from './cli/platform';
import Hooks from './cli/hooks';
import Target from './cli/target';
import Linker from './cli/linker';
import Plugin from './cli/plugin';
import Template from './cli/template';
import Constants from './constants';
import Exec from './systemTools/exec';
import FileUtils from './systemTools/fileutils';
import Doctor from './systemTools/doctor';
import PlatformTools from './platformTools';
import PluginTools from './pluginTools';
import SetupTools from './setupTools';

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => checkWelcome(c))
        .then(c => startBuilder(c))
        .then(v => CLI(v))
        .catch(e => logError(e, true));
};

const checkWelcome = c => new Promise((resolve, reject) => {
    if ((!c.command && !c.subCommand) || c.command === 'help') {
        logWelcome();

        logHelp();
    } else {
        resolve(c);
    }
});


export {
    Constants, Runner, App, Platform, Target, Common, Exec, FileUtils,
    PlatformTools, Doctor, PluginTools, SetupTools, Logger,
    run
};

export default { run };
