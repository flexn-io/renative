import chalk from 'chalk';
import inquirer from 'inquirer';
import { logWarning, logTask, rnvStatus, logEnd, logToSummary } from '../systemTools/logger';
import { rnvWorkspaceList, rnvWorkspaceAdd, rnvWorkspaceConnect, rnvWorkspaceUpdate } from '../projectTools/workspace';
import { createNewProject } from '../projectTools/projectGenerator';
import { rnvTemplateAdd, rnvTemplateApply, rnvTemplateList } from '../templateTools';
import { targetCreate, rnvTargetLaunch, rnvTargetList } from '../platformTools/target';
import { rnvPluginAdd, rnvPluginList, rnvPluginUpdate, rnvLink } from '../pluginTools';
import { rnvPlatformEject, rnvPlatformList, rnvPlatformConnect, rnvPlatformConfigure } from '../platformTools';
import { executePipe, rnvHooksList, rnvHooksRun, rnvHooksPipes } from '../projectTools/buildHooks';
import { rnvConfigure, rnvSwitch } from '../projectTools';
import { rnvCryptoDecrypt, rnvCryptoEncrypt, rnvCryptoInstallCerts, rnvCryptoUpdateProfile, rnvCryptoUpdateProfiles, rnvCryptoInstallProfiles } from '../systemTools/crypto';
import { rnvClean } from '../systemTools/cleaner';
import { inquirerPrompt } from '../systemTools/prompt';
import { rnvRun, rnvBuild, rnvPackage, rnvExport, rnvLog, rnvDeploy, rnvStart } from '../platformTools/runner';
import { SUPPORTED_PLATFORMS, IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TIZEN_MOBILE, TVOS,
    WEBOS, MACOS, WINDOWS, TIZEN_WATCH, KAIOS, FIREFOX_OS, FIREFOX_TV } from '../constants';
import Config from '../config';

export const rnvHelp = () => {
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

const COMMANDS = {
    start: {
        fn: rnvStart
    },
    run: {
        desc: 'Run your app on target device or emulator',
        fn: rnvRun
    },
    package: {
        desc: 'Package JS Code',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TVOS],
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
        platforms: [IOS, TVOS],
        fn: rnvExport
    },
    log: {
        desc: 'Attach logger to device or emulator and print out logs',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TVOS],
        fn: rnvLog
    },
    new: {
        fn: createNewProject,
        desc: 'Creates new project',
        params: ['mono', 'ci']
    },
    help: {
        desc: 'Displays help',
        fn: rnvHelp
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
                fn: rnvPlatformEject
            },
            list: {
                fn: rnvPlatformList
            },
            connect: {
                fn: rnvPlatformConnect
            },
            configure: {
                fn: rnvPlatformConfigure
            }
        }
    },
    target: {
        desc: 'Manages simulators and emulators',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TIZEN, TIZEN_MOBILE, TVOS, WEBOS, TIZEN_WATCH],
        subCommands: {
            launch: {
                fn: rnvTargetLaunch
            },
            list: {
                fn: rnvTargetList
            }
        }
    },
    plugin: {
        desc: 'Manages all plugins',
        subCommands: {
            add: {
                fn: rnvPluginAdd
            },
            list: {
                fn: rnvPluginList
            },
            update: {
                fn: rnvPluginUpdate
            }
        }
    },
    hooks: {
        desc: 'Manages project based build hooks. This allows you to extend functionality of RNV CLI',
        subCommands: {
            run: {
                fn: rnvHooksRun
            },
            list: {
                fn: rnvHooksList
            },
            pipes: {
                fn: rnvHooksPipes
            }
        }
    },
    status: {
        desc: 'Prints out summary of your project',
        fn: rnvStatus
    },
    clean: {
        desc: 'Automatically removes all node_modules and lock in your project and its dependencies',
        fn: rnvClean
    },
    template: {
        desc: 'Manages rnv and project templates',
        subCommands: {
            add: {
                fn: rnvTemplateAdd
            },
            list: {
                fn: rnvTemplateList
            },
            apply: {
                fn: rnvTemplateApply
            }
        }
    },
    crypto: {
        desc: 'Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information',
        platforms: [IOS, TVOS],
        subCommands: {
            encrypt: {
                fn: rnvCryptoEncrypt
            },
            decrypt: {
                fn: rnvCryptoDecrypt
            },
            installCerts: {
                fn: rnvCryptoInstallCerts
            },
            updateProfile: {
                fn: rnvCryptoUpdateProfile
            },
            updateProfiles: {
                fn: rnvCryptoUpdateProfiles
            },
            installProfiles: {
                fn: rnvCryptoInstallProfiles
            }
        }
    },
    workspace: {
        desc: 'Manages global workspaces for ReNative projects',
        subCommands: {
            add: {
                fn: rnvWorkspaceAdd
            },
            connect: {
                fn: rnvWorkspaceConnect
            },
            list: {
                fn: rnvWorkspaceList
            },
            update: {
                fn: rnvWorkspaceUpdate
            }
        }
    }
};


// ##########################################
// PUBLIC API
// ##########################################

const run = async (c, spawnC) => {
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
                await _execute(c, subCmdFn, cmd, c.command, c.subCommand, spawnC);
            } else {
                await _execute(c, cmdFn, cmd, c.command, c.subCommand, spawnC);
            }
        } else if (subCmdFn) {
            await _execute(c, subCmdFn, cmd, c.command, c.subCommand, spawnC);
        } else {
            await _handleUnknownSubCommand(c);
        }
    } else {
        await _handleUnknownCommand(c);
    }
    return c;
};

const _execute = async (c, cmdFn, cmd, command, subCommand, spawnC) => {
    if (cmd.platforms && !cmd.platforms.includes(c.platform)) {
        await _handleUnknownPlatform(c, cmd.platforms);
        return;
    }
    let subCmd = subCommand ? `:${c.subCommand}` : '';
    if (spawnC) {
        const oldC = c;
        const spawnedC = _spawnCommand(c, spawnC);
        subCmd = c.subCommand || '';
        console.log('DJHDKJDHDK', spawnC, spawnedC.command);
        Config.initializeConfig(spawnedC);
        await executePipe(spawnedC, `${spawnedC.command}${subCmd}:before`);
        await cmdFn(spawnedC);
        await executePipe(spawnedC, `${c.command}${subCmd}:after`);
        Config.initializeConfig(oldC);
        return;
    }

    await executePipe(c, `${c.command}${subCmd}:before`);
    await cmdFn(c);
    await executePipe(c, `${c.command}${subCmd}:after`);
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
More info at ${chalk.grey(`https://renative.org/docs/rnv-${c.command}`)}
`);
    return Promise.resolve();
};

const _handleUnknownSubCommand = async (c) => {
    logTask('_handleUnknownSubCommand');
    const cmds = COMMANDS[c.command]?.subCommands;

    const { subCommand } = await inquirerPrompt({
        type: 'list',
        name: 'subCommand',
        message: 'Pick a subCommand',
        choices: Object.keys(cmds),
        logMessage: `cli: Command ${chalk.bold(c.command)} does not support method ${chalk.bold(c.subCommand)}!`
    });

    c.subCommand = subCommand;
    return run(c);
};

const _handleUnknownCommand = async (c) => {
    logTask('_handleUnknownCommand');

    const { command } = await inquirerPrompt({
        type: 'list',
        name: 'command',
        message: 'Pick a command',
        choices: Object.keys(COMMANDS),
        logMessage: `cli: Command ${chalk.bold(c.command)} not supported!`
    });
    c.command = command;
    return run(c);
};


const _handleUnknownPlatform = async (c, platforms) => {
    logTask('_handleUnknownPlatform');
    const { platform } = await inquirerPrompt({
        type: 'list',
        name: 'platform',
        message: 'pick one of the following',
        choices: platforms,
        logMessage: `cli: Command ${chalk.grey(c.command)} does not support platform ${chalk.grey(c.platform)}. `
    });

    c.platform = platform;
    return run(c);
};

const _arrayMergeOverride = (destinationArray, sourceArray, mergeOptions) => sourceArray;

export const _spawnCommand = (c, overrideParams) => {
    const newCommand = {};

    Object.keys(c).forEach((k) => {
        if (typeof newCommand[k] === 'object' && !(newCommand[k] instanceof 'String')) {
            newCommand[k] = { ...c[k] };
        } else {
            newCommand[k] = c[k];
        }
    });

    const merge = require('deepmerge');

    Object.keys(overrideParams).forEach((k) => {
        if (newCommand[k] && typeof overrideParams[k] === 'object') {
            newCommand[k] = merge(newCommand[k], overrideParams[k], { arrayMerge: _arrayMergeOverride });
        } else {
            newCommand[k] = overrideParams[k];
        }
    });

    // This causes stack overflow on Linux
    // const merge = require('deepmerge');
    // const newCommand = merge(c, overrideParams, { arrayMerge: _arrayMergeOverride });
    return newCommand;
};


// ##########################################
// PRIVATE
// ##########################################

export default run;
