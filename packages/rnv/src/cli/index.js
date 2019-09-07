import chalk from 'chalk';
import inquirer from 'inquirer';
import { logWarning, logTask, logStatus, logEnd, logToSummary } from '../systemTools/logger';
import { listWorkspaces } from '../projectTools/workspace';
import { createNewProject } from '../projectTools/projectGenerator';
import { templateAdd, templateApply, templateList } from '../templateTools';
import { targetCreate, targetLaunch, targetList } from '../platformTools/target';
import { pluginAdd, pluginList, pluginUpdate, rnvLink } from '../pluginTools';
import { platformEject, platformList, platformConnect, platformConfigure } from '../platformTools';
import { executePipe, listHooks, executeHook, listPipes } from '../projectTools/buildHooks';
import { rnvConfigure, rnvSwitch } from '../projectTools';
import { rnvCrypto } from '../systemTools/crypto';
import { cleanProjectModules } from '../systemTools/cleaner';
import { rnvRun, rnvBuild, rnvPackage, rnvExport, rnvLog, rnvDeploy } from '../platformTools/runner';


const COMMANDS = {
    start: {
        fn: listWorkspaces
    },
    run: {
        desc: 'Run your app on target device or emulator',
        fn: rnvRun
    },
    package: {
        desc: 'Package JS Code',
        fn: rnvPackage
    },
    deploy: {
        desc: 'Deploy whole app via preconfigured or custom integration',
        fn: rnvDeploy
    },
    build: {
        desc: 'Build your app',
        fn: rnvBuild
    },
    export: {
        desc: 'Export your app (ios only)',
        fn: rnvExport
    },
    log: {
        desc: 'Attach logger to device or emulator and print out logs',
        fn: rnvLog
    },
    new: {
        fn: createNewProject,
        desc: 'Creates new project',
        params: ['mono', 'ci']
    },
    help: {
        fn: logHelp
    },
    configure: {
        desc: 'Configures app config',
        fn: rnvConfigure,
        params: ['appConfigID', 'mono', 'ci']
    },
    switch: {
        desc: 'Switches to app confing without rebuilding',
        fn: rnvSwitch,
        params: ['appConfigID', 'mono', 'ci']
    },
    link: {
        desc: 'Local dependency linking of your project',
        fn: rnvLink
    },
    platform: {
        desc: 'Manages native platform projects',
        subCommands: {
            eject: {
                fn: platformEject
            },
            list: {
                fn: platformList
            },
            connect: {
                fn: platformConnect
            },
            configure: {
                fn: platformConfigure
            }
        }
    },
    target: {
        desc: 'Manages simulators and emulators',
        subCommands: {
            launch: {
                fn: targetLaunch
            },
            list: {
                fn: targetList
            }
        }
    },
    plugin: {
        desc: 'Manages all plugins',
        subCommands: {
            add: {
                fn: pluginAdd
            },
            list: {
                fn: pluginList
            },
            update: {
                fn: pluginUpdate
            }
        }
    },
    hooks: {
        desc: 'Manages project based build hooks. This allows you to extend functionality of RNV CLI',
        subCommands: {
            run: {
                fn: executeHook
            },
            list: {
                fn: listHooks
            },
            pipes: {
                fn: listPipes
            }
        }
    },
    status: {
        desc: 'Prints out summary of your project',
        fn: logStatus
    },
    clean: {
        desc: 'Automatically removes all node_modules and lock in your project and its dependencies',
        fn: cleanProjectModules
    },
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

    crypto: {
        desc: 'Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information',
        fn: rnvCrypto
    },
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

const run = async (c) => {
    logTask('cli');

    const cmd = COMMANDS[c.command];
    const cmdFn = cmd?.fn;
    const subCmd = cmd?.subCommands?.[c.subCommand];
    const subCmdFn = subCmd?.fn;

    if (cmd) {
        if (c.subCommand === 'help') {
            await _execCommandHep(c, cmd);
        } else if (cmdFn) {
            if (subCmdFn) {
                await subCmdFn(c);
            } else {
                await cmdFn(c);
            }
        } else if (subCmdFn) {
            await subCmdFn(c);
        } else {
            await _handleUnknownSubCommand(c);
        }
    } else {
        await _handleUnknownCommand(c);
    }
};

// ##########################################
// PRIVATE API
// ##########################################

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

    logToSummary(`
Command: ${c.command}

Description: ${cmd.desc}.
${subCommands}
${opts}
More info at ${chalk.blue(`https://renative.org/docs/rnv-${c.command}`)}
`);
    return Promise.resolve();
};

const _handleUnknownSubCommand = async (c) => {
    logTask('_handleUnknownSubCommand');
    logWarning(`cli: Command ${chalk.white.bold(c.command)} does not support method ${chalk.white.bold(c.subCommand)}!`);

    const cmds = COMMANDS[c.command]?.subCommands;

    const { subCommand } = await inquirer.prompt({
        type: 'list',
        name: 'subCommand',
        message: 'Pick a subCommand',
        choices: Object.keys(cmds)
    });

    c.subCommand = subCommand;
    return run(c);
};

const _handleUnknownCommand = async (c) => {
    logTask('_handleUnknownCommand');
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

    logToSummary(`
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
