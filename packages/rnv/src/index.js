import chalk from 'chalk';
import Common, { initializeBuilder, startBuilder } from './common';
import Logger, { logComplete, logError, logWelcome, logInfo, configureLogger, logInitialize } from './systemTools/logger';
import CLI, { rnvHelp } from './cli';
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
        .then(() => logComplete(true))
        .catch(e => logError(e, true));
};

const checkWelcome = c => new Promise((resolve, reject) => {
    if ((!c.command && !c.subCommand) || c.command === 'help') {
        logWelcome();
        rnvHelp();
        logComplete(true);
    } else {
        resolve(c);
    }
});


export {
    Constants, Common, Exec, FileUtils,
    PlatformTools, Doctor, PluginTools, SetupTools, Logger,
    run, CLI
};

export default { run };
