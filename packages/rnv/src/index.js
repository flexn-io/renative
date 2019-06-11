import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import Webpack from 'webpack';
import Common, { initializeBuilder, logComplete, logError, logWelcome } from './common';
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

const commands = {
    start: Runner,
    build: Runner,
    export: Runner,
    app: App,
    new: App,
    configure: App,
    link: Linker,
    platform: Platform,
    run: Runner,
    package: Runner,
    deploy: Runner,
    target: Target,
    plugin: Plugin,
    log: Runner,
    hooks: Hooks,
    fix: Tools,
    clean: Tools,
    tool: Tools,
    template: Template
};

const run = (cmd, subCmd, program, process) => {
    checkWelcome(cmd, subCmd)
        .then(() => initializeBuilder(cmd, subCmd, process, program))
        .then((v) => {
            if (commands[cmd]) {
                commands[cmd](v)
                    .then(() => logComplete(true))
                    .catch(e => logError(e, true));
            } else if (program.help) {
                // program.help();
                logError(`Command ${chalk.white(cmd)} is not supported by ReNativeCLI. Here is some help:`);
                logHelp();
                logComplete(true);
            } else {
                logError(`Command ${chalk.white(cmd)} is not supported by ReNativeCLI. run ${chalk.white('rnv')} for help`, true);
            }
        })
        .catch(e => logError(e, true));
};

const checkWelcome = (cmd, subCmd) => new Promise((resolve, reject) => {
    if (!cmd && !subCmd) {
        logWelcome();

        logHelp();
    } else {
        resolve();
    }
});

const logHelp = () => {
    let cmdsString = '';
    for (const key in commands) {
        cmdsString += `${key}, `;
    }

    console.log(`
${chalk.bold.white('COMMANDS:')}

${cmdsString}

${chalk.bold.white('OPTIONS:')}

'-i, --info', 'Show full debug info'
'-u, --update', 'Force update dependencies (iOS only)'
'-p, --platform <value>', 'Select specific platform' // <ios|android|web|...>
'-c, --appConfigID <value>', 'Select specific appConfigID' // <ios|android|web|...>
'-t, --target <value>', 'Select specific simulator' // <.....>
'-d, --device [value]', 'Select connected device'
'-s, --scheme <value>', 'Select build scheme' // <Debug | Release>
'-f, --filter <value>', 'Filter Value'
'-l, --list', 'Return list of items related to command' // <alpha|beta|prod>
'-r, --reset', 'Also perform reset'
'-b, --blueprint', 'Blueprint for targets'
'-h, --host <value>', 'Custom Host IP'
'-x, --exeMethod <value>', 'Executable method in buildHooks'
'-P, --port <value>', 'Custom Port'
'-H, --help', 'Help'
`);
};

export {
    Constants, Runner, App, Platform, Target, Common, Exec, FileUtils,
    PlatformTools, Doctor,
    run
};

export default { run };
