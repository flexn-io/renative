import chalk from 'chalk';
import Common, { initializeBuilder, startBuilder } from './common';
import { logComplete, logError, logWelcome, logInfo, configureLogger, logInitialize } from './systemTools/logger';
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

const commands = {
    start: Runner,
    build: Runner,
    export: Runner,
    app: App,
    new: App,
    configure: App,
    switch: App,
    link: Linker,
    platform: Platform,
    run: Runner,
    package: Runner,
    deploy: Runner,
    target: Target,
    plugin: Plugin,
    log: Runner,
    hooks: Hooks,
    status: Tools,
    fix: Tools,
    clean: Tools,
    tool: Tools,
    template: Template,
    debug: Runner,
    crypto: Tools
};

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => checkWelcome(c))
        .then(c => startBuilder(c))
        .then((v) => {
            if (commands[cmd]) {
                commands[cmd](v)
                    .then(() => {
                        if (program.debug) logInfo('You started a debug build. Make sure you have the debugger started or start it with `rnv debug`');
                        logComplete(true);
                    })
                    .catch(e => logError(e, true));
            } else if (program.help) {
                // program.help();
                logError(`Command ${chalk.white(cmd)} is not supported by ReNative CLI. Here is some help:`);
                logHelp();
                logComplete(true);
            } else {
                logError(`Command ${chalk.white(cmd)} is not supported by ReNative CLI. run ${chalk.white('rnv')} for help`, true);
            }
        })
        .catch(e => logError(e, true));
};

const checkWelcome = c => new Promise((resolve, reject) => {
    if (!c.command && !c.subCommand) {
        logWelcome();

        logHelp();
    } else {
        resolve(c);
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
'-D, --debug', 'enable remote debugger'
'--hosted', 'Run in a hosted environment (skip bundleAssets)'
'--debugIp <value>', '(optional) overwrite the ip to which the remote debugger will connect'
`);
};

export {
    Constants, Runner, App, Platform, Target, Common, Exec, FileUtils,
    PlatformTools, Doctor, PluginTools, SetupTools,
    run
};

export default { run };
