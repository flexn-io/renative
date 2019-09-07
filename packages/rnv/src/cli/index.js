import chalk from 'chalk';
import inquirer from 'inquirer';
import { logWarning, logTask } from '../systemTools/logger';
import { listWorkspaces } from '../projectTools/workspace';
import { createNewProject } from '../projectTools/projectGenerator';
import { templateAdd, templateApply, templateList } from '../templateTools';


const COMMANDS = {
    start: {
        fn: listWorkspaces
    },
    build: {},
    export: {},
    app: {},
    new: {
        fn: createNewProject,
        desc: 'Creates new project',
        params: ['mono', 'ci']
    },
    help: {
        fn: logHelp
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
    template: {
        desc: 'Manages rnv and project templates',
        subCommands: {
            add: {
                fn: templateAdd
            },
            list: {
                fn: templateList
            },
            apply: {
                fn: templateApply
            }
        }
    },
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
    const subCmd = cmd?.subCommands?.[c.subCommand];
    const subCmdFn = subCmd?.fn;

    if (cmd) {
        if (c.subCommand === 'help') {
            return _execCommandHep(c, cmd);
        }
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

const _execCommandHep = async (c, cmd) => {
    let opts = '';
    let subCommands = '';

    if (cmd.subCommands) {
        subCommands = '\nSub Commands: \n';
        subCommands += Object.keys(cmd.subCommands).join(', ');
        subCommands += '\n';
    }

    if (cmd.params) {
        opts = 'Options:\n';
        opts += (cmd.params || []).reduce((t, v) => `${t}--${v}\n`, '');
    }

    console.log(`
Command: ${c.command}

Description: ${cmd.desc}. More info at https://renative.org/docs/rnv-${c.command}
${subCommands}
${opts}
`);
    return Promise.resolve();
};

const _handleUnknownSubCommand = async (c) => {
    logTask('_handleUnknownSubCommand');
    // TODO GIVE OPTIONS INSTEAD OF REJECT
    return Promise.reject(`cli: Command ${chalk.white.bold(c.command)} does not support method ${chalk.white.bold(c.subCommand)}!`);
};

const _handleUnknownCommand = async (c) => {
    logTask('_handleUnknownCommand');
    // TODO GIVE OPTIONS INSTEAD OF REJECT
    // return Promise.reject(`cli: Command ${chalk.white.bold(c.command)} not supported!`);
    logWarning(`cli: Command ${chalk.white.bold(c.command)} not supported!`);
    const { command } = await inquirer.prompt({
        type: 'list',
        name: 'command',
        message: 'Pick a command',
        choices: Object.keys(COMMANDS)
    });

    c.command = command;
    return run(c);
};


export const logHelp = () => {
    let cmdsString = '';
    for (const key in COMMANDS) {
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


// ##########################################
// PRIVATE
// ##########################################

export default run;
