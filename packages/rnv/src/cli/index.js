import chalk from 'chalk';
import { logTask } from '../common';
import { listWorkspaces } from '../projectTools/workspace';
import { createNewProject } from '../projectTools/projectGenerator';


const COMMANDS = {
    start: {
        fn: listWorkspaces
    },
    build: {},
    export: {},
    app: {},
    new: {
        fn: createNewProject
    },
    configure: {},
    switch: {},
    link: {},
    platform: {},
    run: {},
    package: {},
    deploy: {},
    target: {},
    plugin: {},
    log: {},
    hooks: {},
    status: {},
    fix: {},
    clean: {},
    tool: {},
    template: {},
    debug: {},
    crypto: {},
    workspace: {
        subCommands: {
            list: {
                fn: listWorkspaces
            }
        }
    }
};


// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('cli');

    const cmd = COMMANDS[c.command];
    const cmdFn = cmd?.fn;
    const subCmdFn = cmd?.subCommands?.[c.subCommand]?.fn;

    if (cmd) {
        if (cmdFn) {
            if (subCmdFn) {
                return subCmdFn(c);
            }
            return cmdFn(c);
        }
        if (subCmdFn) {
            return subCmdFn(c);
        }
        return _handleUnknownSubCommand(c);
    }
    return _handleUnknownCommand(c);
};

const _handleUnknownSubCommand = async (c) => {
    logTask('_handleUnknownSubCommand');
    // TODO GIVE OPTIONS INSTEAD OF REJECT
    return Promise.reject(`cli: Command ${chalk.white.bold(c.command)} does not support method ${chalk.white.bold(c.subCommand)}!`);
};

const _handleUnknownCommand = async (c) => {
    logTask('_handleUnknownCommand');
    // TODO GIVE OPTIONS INSTEAD OF REJECT
    return Promise.reject(`cli: Command ${chalk.white.bold(c.command)} not supported!`);
};


// else if (program.help) {
//     // program.help();
//     logError(`Command ${chalk.white(cmd)} is not supported by ReNative CLI. Here is some help:`);
//     logHelp();
//     logComplete(true);
// } else {
//     logError(`Command ${chalk.white(cmd)} is not supported by ReNative CLI. run ${chalk.white('rnv')} for help`, true);
// }

// .then(() => {
//     if (program.debug) logInfo('You started a debug build. Make sure you have the debugger started or start it with `rnv debug`');
//     logComplete(true);
// })

// ##########################################
// PRIVATE
// ##########################################

export default run;
