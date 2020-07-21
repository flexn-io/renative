/* eslint-disable import/no-cycle */


import { taskRnvInstall } from '../engine-core/task.rnv.install';

import { isPlatformSupported } from '../core/platformManager';
import { isBuildSchemeSupported } from '../core/common';
import { checkSdk } from '../core/sdkManager';
import { resolvePluginDependants, configurePlugins } from '../core/pluginManager';
import { chalk, logTask, logToSummary, logAppInfo, logError } from '../core/systemManager/logger';
import { applyTemplate, checkIfTemplateInstalled } from '../core/templateManager';
import { executePipe } from '../core/projectManager/buildHooks';
import { checkCrypto } from '../core/systemManager/crypto';
import { inquirerPrompt } from './prompt';
import { getEngineByPlatform, initializeTask } from '../core/engineManager';
import { isSystemWin } from '../core/utils';
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
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT,
    TASK_DEPLOY, TASK_START, TASK_LOG, TASK_CONFIGURE
} from '../core/constants';
import { checkAndMigrateProject } from '../core/projectManager/migrator';
import {
    parseRenativeConfigs,
    updateConfig,
    fixRenativeConfigsSync,
    configureRnvGlobal,
    checkIsRenativeProject
} from '../core/configManager/configParser';
import { checkAndCreateProjectPackage } from '../core/projectManager/projectParser';

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

export const RUN_COMMANDS = [
    'run',
    'build',
    'package',
    'export',
    'log',
    'deploy',
    'start',
    'configure'
];

const _generateCommands = () => ({
    start: {
        fn: c => initializeTask(c, TASK_START),
        platforms: SUPPORTED_PLATFORMS
    },
    config: {
        fn: c => initializeTask(c, 'config'),
        desc: 'Edit or display RNV configs'
    },
    run: {
        desc: 'Run your app on target device or emulator',
        fn: c => initializeTask(c, TASK_RUN)
    },
    package: {
        desc: 'Package JS Code',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TVOS],
        fn: c => initializeTask(c, TASK_PACKAGE)
    },
    deploy: {
        desc: 'Deploy whole app via preconfigured or custom integration',
        fn: c => initializeTask(c, TASK_DEPLOY)
    },
    build: {
        desc: 'Build your app',
        fn: c => initializeTask(c, TASK_BUILD)
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
        fn: c => initializeTask(c, TASK_EXPORT)
    },
    log: {
        desc: 'Attach logger to device or emulator and print out logs',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TVOS],
        fn: c => initializeTask(c, TASK_LOG)
    },
    new: {
        fn: c => initializeTask(c, 'new'),
        desc: 'Creates new project',
        params: ['mono', 'ci']
    },
    help: {
        desc: 'Displays help',
        fn: c => initializeTask(c, 'help')
    },
    configure: {
        desc: 'Configures app config',
        fn: c => initializeTask(c, TASK_CONFIGURE),
        params: ['appConfigID', 'mono', 'ci']
    },
    switch: {
        desc: 'Switches to app confing without rebuilding',
        fn: c => initializeTask(c, 'switch'),
        params: ['appConfigID', 'mono', 'ci']
    },
    link: {
        desc: 'Local dependency linking of your project',
        fn: c => initializeTask(c, 'link')
    },
    platform: {
        desc: 'Manages native platform projects',
        subCommands: {
            eject: {
                fn: c => initializeTask(c, 'platform eject')
            },
            list: {
                fn: c => initializeTask(c, 'platform list')
            },
            connect: {
                fn: c => initializeTask(c, 'platform connect')
            },
            configure: {
                fn: c => initializeTask(c, 'platform configure')
            },
            setup: {
                fn: c => initializeTask(c, 'platform setup')
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
                fn: c => initializeTask(c, 'target launch')
            },
            list: {
                fn: c => initializeTask(c, 'target list')
            }
        }
    },
    plugin: {
        desc: 'Manages all plugins',
        subCommands: {
            add: {
                fn: c => initializeTask(c, 'plugin add')
            },
            list: {
                fn: c => initializeTask(c, 'plugin list')
            },
            update: {
                fn: c => initializeTask(c, 'plugin update')
            }
        }
    },
    hooks: {
        desc:
              'Manages project based build hooks. This allows you to extend functionality of RNV CLI',
        subCommands: {
            run: {
                fn: c => initializeTask(c, 'hooks run')
            },
            list: {
                fn: c => initializeTask(c, 'hooks list')
            },
            pipes: {
                fn: c => initializeTask(c, 'hooks pipes')
            }
        }
    },
    status: {
        desc: 'Prints out summary of your project',
        fn: c => initializeTask(c, 'status')
    },
    clean: {
        desc:
              'Automatically removes all node_modules and lock in your project and its dependencies',
        fn: c => initializeTask(c, 'clean')
    },
    template: {
        desc: 'Manages rnv and project templates',
        subCommands: {
            add: {
                fn: c => initializeTask(c, 'template add')
            },
            list: {
                fn: c => initializeTask(c, 'template list')
            },
            apply: {
                fn: c => initializeTask(c, 'template apply')
            }
        }
    },
    crypto: {
        desc:
              'Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information',
        subCommands: {
            encrypt: {
                fn: c => initializeTask(c, 'crypto encrypt')
            },
            decrypt: {
                fn: c => initializeTask(c, 'crypto decrypt')
            },
            installCerts: {
                platforms: [IOS, TVOS],
                fn: c => initializeTask(c, 'crypto installCerts')
            },
            updateProfile: {
                requiredParams: ['scheme', 'platform'],
                platforms: [IOS, TVOS],
                fn: c => initializeTask(c, 'crypto updateProfile')
            },
            updateProfiles: {
                platforms: [IOS, TVOS],
                fn: c => initializeTask(c, 'crypto updateProfiles')
            },
            installProfiles: {
                platforms: [IOS, TVOS],
                fn: c => initializeTask(c, 'crypto installProfiles')
            }
        }
    },
    workspace: {
        desc: 'Manages global workspaces for ReNative projects',
        subCommands: {
            add: {
                fn: c => initializeTask(c, 'workspace add')
            },
            connect: {
                fn: c => initializeTask(c, 'workspace connect')
            },
            list: {
                fn: c => initializeTask(c, 'workspace list')
            },
            update: {
                fn: c => initializeTask(c, 'workspace update')
            }
        }
    },
    fastlane: {
        desc:
              'Run fastlane commands on currectly active app/platform directly via rnv command',
        platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, TVOS],
        fn: c => initializeTask(c, 'fastlane')
    },
    publish: {
        desc:
              'Provides help deploying a new version, like tagging a commit, pushing it, etc',
        fn: c => initializeTask(c, 'publish')
    },
    pkg: {
        desc:
              'Provides help deploying a new version, like tagging a commit, pushing it, etc',
        fn: c => initializeTask(c, 'pkg')
    }
});

const _handleUnknownPlatform = async (c, platforms) => {
    logTask('_handleUnknownPlatform');
    const { platform } = await inquirerPrompt({
        type: 'list',
        name: 'platform',
        message: 'pick one of the following',
        choices: platforms,
        logMessage: `cli: Command ${chalk().grey(
            c.command
        )} does not support platform ${chalk().grey(c.platform)}. `
    });

    c.platform = platform;
    return run(c);
};

// ##########################################
// PRIVATE API
// ##########################################

let _builderStarted = false;
const _startBuilder = async (c) => {
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
    await taskRnvInstall(c);
    await applyTemplate(c);
    await configurePlugins(c);
    await taskRnvInstall(c);
    await checkCrypto(c);

    if (!SKIP_APP_CONFIG_CHECK.includes(c.command)) {
        await updateConfig(c, c.runtime.appId);
    }
    await logAppInfo(c);

    if (RUN_COMMANDS.includes(c.command)) {
        await isPlatformSupported(c);
        await isBuildSchemeSupported(c);
        await checkSdk(c);
        await resolvePluginDependants(c);
        await taskRnvInstall(c);
    }
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
More info at ${chalk().grey(`https://renative.org/docs/rnv-${c.command}`)}
`);
    return Promise.resolve();
};

const _handleUnknownSubCommand = async (c) => {
    logTask('_handleUnknownSubCommand');
    const cmds = c.COMMANDS[c.command]?.subCommands;

    const { subCommand } = await inquirerPrompt({
        type: 'list',
        name: 'subCommand',
        message: 'Pick a subCommand',
        choices: Object.keys(cmds),
        logMessage: `cli: Command ${chalk().bold(
            c.command
        )} does not support method ${chalk().bold(c.subCommand)}!`
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
        choices: Object.keys(c.COMMANDS).sort(),
        logMessage: `cli: Command ${chalk().bold(c.command)} not supported!`
    });
    c.command = command;
    return run(c);
};

const run = async (c) => {
    c.COMMANDS = _generateCommands();
    const cmd = c.COMMANDS[c.command];
    const cmdFn = cmd?.fn;
    const subCmd = cmd?.subCommands?.[c.subCommand];
    const subCmdFn = subCmd?.fn;

    logTask('cli', `cmd:${c.command} subCmd:${c.subCommand}`);

    setDefaults(c);
    await _startBuilder(c);

    if (cmd) {
        if (c.subCommand === 'help') {
            await _execCommandHep(c, cmd);
        } else if (cmdFn) {
            if (subCmdFn) {
                await _execute(c, subCmdFn, cmd);
            } else {
                // There is no subCommand function available so reset the key not to confuse pipe hooks
                c.subCommand = null;
                await _execute(c, cmdFn, cmd);
            }
        } else if (subCmdFn) {
            await _execute(c, subCmdFn, cmd);
        } else {
            await _handleUnknownSubCommand(c);
        }
    } else {
        await _handleUnknownCommand(c);
    }
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
        logError(`No plugins were injected into your app. your app will most likely fail. did you run ${chalk().white('rnv template apply')} ?`);
    }

    const pipeEnabled = !NO_OP_COMMANDS.includes(c.command)
        && !SKIP_APP_CONFIG_CHECK.includes(c.command);
    if (pipeEnabled) await executePipe(c, `${c.command}${subCmd}:beforeAll`);
    await cmdFn(c);
    if (pipeEnabled) await executePipe(c, `${c.command}${subCmd}:afterAll`);
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
