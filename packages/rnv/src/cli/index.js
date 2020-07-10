/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import { printTable } from 'console-table-printer';
import {
    logTask,
    rnvStatus,
    logToSummary,
    logAppInfo,
    logError,
    logWarning
} from '../systemTools/logger';
import {
    rnvWorkspaceList,
    rnvWorkspaceAdd,
    rnvWorkspaceConnect,
    rnvWorkspaceUpdate
} from '../projectTools/workspace';
import { createNewProject } from '../projectTools/projectGenerator';
import {
    rnvTemplateAdd,
    rnvTemplateApply,
    rnvTemplateList,
    applyTemplate,
    checkIfTemplateInstalled
} from '../templateTools';
import {
    rnvTargetLaunch,
    rnvTargetList
} from '../platformTools/target';
import {
    rnvPluginAdd,
    rnvPluginList,
    rnvPluginUpdate,
    configurePlugins
} from '../pluginTools';
import {
    rnvPlatformEject,
    rnvPlatformList,
    rnvPlatformConnect,
    rnvPlatformConfigure,
    rnvPlatformSetup
} from '../platformTools';
import {
    executePipe,
    rnvHooksList,
    rnvHooksRun,
    rnvHooksPipes
} from '../projectTools/buildHooks';
import { rnvConfigure, rnvSwitch, rnvLink } from '../projectTools';
import {
    rnvCryptoDecrypt,
    rnvCryptoEncrypt,
    rnvCryptoInstallCerts,
    rnvCryptoUpdateProfile,
    rnvCryptoUpdateProfiles,
    rnvCryptoInstallProfiles,
    checkCrypto
} from '../systemTools/crypto';
import { rnvFastlane } from '../deployTools/fastlane';
import { rnvClean } from '../systemTools/cleaner';
import { inquirerPrompt } from '../systemTools/prompt';
import {
    rnvRun,
    rnvBuild,
    rnvPackage,
    rnvExport,
    rnvLog,
    rnvDeploy,
    rnvStart
} from '../platformTools/runner';
import { getEngineByPlatform } from '../engineTools';
import { isSystemWin } from '../utils';
import {
    PLATFORMS,
    SUPPORTED_PLATFORMS,
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TIZEN_MOBILE,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    configSchema
} from '../constants';
// import { getBinaryPath } from '../common';
import Config from '../config';
import { checkAndMigrateProject } from '../projectTools/migrator';
import {
    parseRenativeConfigs,
    updateConfig,
    fixRenativeConfigsSync,
    configureRnvGlobal,
    checkIsRenativeProject
} from '../configTools/configParser';
import {
    configureNodeModules,
    checkAndCreateProjectPackage,
} from '../projectTools/projectParser';
import rnvPublish from '../projectTools/publish';
import rnvPkg from '../projectTools/package';

export const rnvHelp = () => {
    let cmdsString = '';
    Object.keys(COMMANDS).forEach((key) => {
        cmdsString += `${key}, `;
    });

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
'-G, --global', 'Flag for setting a config value for all RNV projects'
'--hosted', 'Run in a hosted environment (skip bundleAssets)'
'--debugIp <value>', '(optional) overwrite the ip to which the remote debugger will connect'
`);
};

const _rnvConfigHandler = () => {
    const [, key, value] = Config.rnvArguments; // first arg is config so it's useless
    if (key === 'list') {
        const rows = [];
        Object.keys(configSchema).forEach(k => rows.push(Config.listConfigValue(k)));

        printTable([].concat(...rows));
        return true;
    }

    // validate args
    if (!key) {
        // @todo add inquirer with list of options
        logWarning('Please specify a config');
        return true;
    }
    if (!configSchema[key]) {
        logWarning(`Unknown config ${key}`);
        return true;
    }

    if (!value) {
        // list the value
        printTable(Config.listConfigValue(key));
    } else if (Config.setConfigValue(key, value)) { printTable(Config.listConfigValue(key)); }

    return true;
};

const COMMANDS = {
    start: {
        fn: rnvStart,
        platforms: SUPPORTED_PLATFORMS
    },
    config: {
        fn: _rnvConfigHandler,
        desc: 'Edit or display RNV configs'
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
        platforms: [
            IOS,
            TVOS,
            MACOS,
            WINDOWS,
            WEB,
            ANDROID,
            ANDROID_TV,
            ANDROID_WEAR
        ],
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
            },
            setup: {
                fn: rnvPlatformSetup
            }
        }
    },
    target: {
        desc: 'Manages simulators and emulators',
        platforms: [
            IOS,
            ANDROID,
            ANDROID_TV,
            ANDROID_WEAR,
            TIZEN,
            TIZEN_MOBILE,
            TVOS,
            WEBOS,
            TIZEN_WATCH
        ],
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
        desc:
            'Manages project based build hooks. This allows you to extend functionality of RNV CLI',
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
        desc:
            'Automatically removes all node_modules and lock in your project and its dependencies',
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
        desc:
            'Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information',
        subCommands: {
            encrypt: {
                fn: rnvCryptoEncrypt
            },
            decrypt: {
                fn: rnvCryptoDecrypt
            },
            installCerts: {
                platforms: [IOS, TVOS],
                fn: rnvCryptoInstallCerts
            },
            updateProfile: {
                requiredParams: ['scheme', 'platform'],
                platforms: [IOS, TVOS],
                fn: rnvCryptoUpdateProfile
            },
            updateProfiles: {
                platforms: [IOS, TVOS],
                fn: rnvCryptoUpdateProfiles
            },
            installProfiles: {
                platforms: [IOS, TVOS],
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
    },
    fastlane: {
        desc:
            'Run fastlane commands on currectly active app/platform directly via rnv command',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TVOS],
        fn: rnvFastlane
    },
    publish: {
        desc:
            'Provides help deploying a new version, like tagging a commit, pushing it, etc',
        fn: rnvPublish
    },
    pkg: {
        desc:
            'Provides help deploying a new version, like tagging a commit, pushing it, etc',
        fn: rnvPkg
    }
};
export const NO_OP_COMMANDS = [
    'fix',
    'clean',
    'tool',
    'status',
    'log',
    'new',
    'target',
    'help',
    'config'
];
export const SKIP_APP_CONFIG_CHECK = ['crypto', 'config'];

const _handleUnknownPlatform = async (c, platforms) => {
    logTask('_handleUnknownPlatform');
    const { platform } = await inquirerPrompt({
        type: 'list',
        name: 'platform',
        message: 'pick one of the following',
        choices: platforms,
        logMessage: `cli: Command ${chalk.grey(
            c.command
        )} does not support platform ${chalk.grey(c.platform)}. `
    });

    c.platform = platform;
    return run(c);
};

// ##########################################
// PRIVATE API
// ##########################################

let _builderStarted = false;
export const _startBuilder = async (c) => {
    logTask('_startBuilder', `isActive:${!!_builderStarted}`);

    if (_builderStarted) return;

    _builderStarted = true;

    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);

    if (!c.command) {
        if (!c.paths.project.configExists) {
            const { command } = await inquirerPrompt({
                type: 'list',
                default: 'new',
                name: 'command',
                message: 'Pick a command',
                choices: NO_OP_COMMANDS.sort(),
                pageSize: 15,
                logMessage:
                    'You need to tell rnv what to do. NOTE: your current directory is not ReNative project. RNV options will be limited'
            });
            c.command = command;
        }
    }

    if (NO_OP_COMMANDS.includes(c.command)) {
        await configureRnvGlobal(c);
        return c;
    }

    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);
    await checkIsRenativeProject(c);
    await checkAndCreateProjectPackage(c);
    await configureRnvGlobal(c);
    await checkIfTemplateInstalled(c);
    await fixRenativeConfigsSync(c);
    await configureNodeModules(c);
    await applyTemplate(c);
    await configurePlugins(c);
    await configureNodeModules(c);
    await checkCrypto(c);

    if (!SKIP_APP_CONFIG_CHECK.includes(c.command)) {
        await updateConfig(c, c.runtime.appId);
    }
    await logAppInfo(c);
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
        logMessage: `cli: Command ${chalk.bold(
            c.command
        )} does not support method ${chalk.bold(c.subCommand)}!`
    });

    c.subCommand = subCommand;
    return run(c);
};

const _handleUnknownCommand = async (c) => {
    logTask('_handleUnknownCommand');

    c.program.scheme = true;

    const { command } = await inquirerPrompt({
        type: 'list',
        name: 'command',
        message: 'Pick a command',
        pageSize: 7,
        choices: Object.keys(COMMANDS).sort(),
        logMessage: `cli: Command ${chalk.bold(c.command)} not supported!`
    });
    c.command = command;
    return run(c);
};

const _arrayMergeOverride = (destinationArray, sourceArray) => sourceArray;

const merge = require('deepmerge');

export const _spawnCommand = (c, overrideParams) => {
    const newCommand = {};

    Object.keys(c).forEach((k) => {
        if (
            typeof newCommand[k] === 'object'
            && !(newCommand[k] instanceof 'String')
        ) {
            newCommand[k] = { ...c[k] };
        } else {
            newCommand[k] = c[k];
        }
    });

    Object.keys(overrideParams).forEach((k) => {
        if (newCommand[k] && typeof overrideParams[k] === 'object') {
            newCommand[k] = merge(newCommand[k], overrideParams[k], {
                arrayMerge: _arrayMergeOverride
            });
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
// PUBLIC API
// ##########################################

const run = async (c, spawnC, skipStartBuilder) => {
    let currC = c;
    const cmd = COMMANDS[currC.command];
    const cmdFn = cmd?.fn;
    const subCmd = cmd?.subCommands?.[currC.subCommand];
    const subCmdFn = subCmd?.fn;


    logTask('cli', `cmd:${currC.command} subCmd:${currC.subCommand} skipStartBuilder:${!!skipStartBuilder}`);

    setDefaults(currC);
    if (!skipStartBuilder) await _startBuilder(currC);

    if (spawnC) {
        currC = _spawnCommand(currC, spawnC);
        Config.initializeConfig(currC);
    }


    if (cmd) {
        if (currC.subCommand === 'help') {
            await _execCommandHep(currC, cmd);
        } else if (cmdFn) {
            if (subCmdFn) {
                await _execute(currC, subCmdFn, cmd);
            } else {
                // There is no subCommand function available so reset the key not to confuse pipe hooks
                currC.subCommand = null;
                await _execute(currC, cmdFn, cmd);
            }
        } else if (subCmdFn) {
            await _execute(currC, subCmdFn, cmd);
        } else {
            await _handleUnknownSubCommand(currC);
        }
    } else {
        await _handleUnknownCommand(currC);
    }
    // if (spawnC) Config.initializeConfig(oldC);
};

const _execute = async (c, cmdFn, cmd) => {
    logTask('_execute', `command:${c.command} subCommand:${c.subCommand}`);

    // engine handling
    if (c.program.engine === 'next') {
        logError('-e next is no longer supported. use { "web": { "engine": "engine-rn-next" } } in your renative.json instead');
    }

    if (cmd.platforms && !cmd.platforms.includes(c.platform)) {
        await _handleUnknownPlatform(c, cmd.platforms);
        return;
    }

    let subCmd = '';
    if (c.subCommand) {
        subCmd = `:${c.subCommand}`;
        const requiredPlatforms = cmd.subCommands?.[c.subCommand]?.platforms;
        if (requiredPlatforms && !requiredPlatforms.includes(c.platform)) {
            await _handleUnknownPlatform(c, requiredPlatforms);
            return;
        }
        // TODO: Required params
        // const requiredParams = cmd.subCommands?.[c.subCommand]?.requiredParams;
        // if (requiredParams) {
        //     for (let i = 0; i < requiredParams.length; i++) {
        //         const requiredParam = requiredParams[i];
        //
        //     }
        // }
    }

    setDefaults(c);

    const { plugins } = c.buildConfig;
    if ((!plugins || (plugins && Object.keys(plugins).length < 2)) && !NO_OP_COMMANDS.includes(c.command)) {
        logError(`No plugins were injected into your app. your app will most likely fail. did you run ${chalk.white('rnv template apply')} ?`);
    }

    const pipeEnabled = !NO_OP_COMMANDS.includes(c.command)
        && !SKIP_APP_CONFIG_CHECK.includes(c.command);
    if (pipeEnabled) await executePipe(c, `${c.command}${subCmd}:before`);
    await cmdFn(c);
    if (pipeEnabled) await executePipe(c, `${c.command}${subCmd}:after`);
};

const setDefaults = (c) => {
    c.runtime.port = c.program.port
    || c.buildConfig?.defaults?.ports?.[c.platform]
    || PLATFORMS[c.platform]?.defaultPort;
    if (c.program.target !== true) {
        c.runtime.target = c.program.target
        || c.files.workspace.config?.defaultTargets?.[c.platform];
    } else c.runtime.target = c.program.target;
    c.runtime.scheme = c.program.scheme || 'debug';
    c.runtime.localhost = isSystemWin ? '127.0.0.1' : '0.0.0.0';
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    c.runtime.engine = getEngineByPlatform(c, c.platform);
    // const { scheme } = c.program;
    // if (scheme !== true) {
    //     const isSchemePresent = !!c.buildConfig?.platforms[c.platform]?.buildSchemes[scheme || 'debug'];
    //     c.runtime.scheme = isSchemePresent ? scheme : undefined;
    // }
};

export default run;
