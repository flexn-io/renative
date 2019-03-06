import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { initializeBuilder, logComplete, logError, checkAndConfigureRootProject } from './common';
import Runner from './cli/runner';
import App from './cli/app';
import Platform from './cli/platform';
import Setup from './cli/setup';
import Target from './cli/target';

const commands = {
    setup: Setup,
    init: Setup,
    // bootstrap: Setup,
    app: App,
    platform: Platform,
    run: Runner,
    target: Target,
};

const run = (cmd, subCmd, program, process) => {
    checkAndConfigureRootProject(cmd, subCmd, process, program)
        .then(v => initializeBuilder(cmd, subCmd, process, program))
        .then((v) => {
            if (commands[cmd]) {
                commands[cmd](v).then(() => logComplete(true)).catch(e => logError(e, true));
            } else {
                logError(`Command ${chalk.bold.white(cmd)} is not supported by RNV CLI. run ${chalk.bold.white('rnv -h')} for help`, true);
            }
        }).catch(e => logError(e, true));
};


export default { run };
