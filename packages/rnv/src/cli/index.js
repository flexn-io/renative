/* eslint-disable import/no-cycle */

import { taskRnvLink } from '../engine-core/task.rnv.link';
import { taskRnvSwitch } from '../engine-core/task.rnv.switch';
import { taskRnvCryptoDecrypt } from '../engine-core/task.rnv.crypto.decrypt';
import { taskRnvCryptoEncrypt } from '../engine-core/task.rnv.crypto.encrypt';
import { taskRnvCryptoInstallCerts } from '../engine-core/task.rnv.crypto.installCerts';
import { taskRnvCryptoUpdateProfile } from '../engine-core/task.rnv.crypto.updateProfile';
import { taskRnvCryptoUpdateProfiles } from '../engine-core/task.rnv.crypto.updateProfiles';
import { taskRnvCryptoInstallProfiles } from '../engine-core/task.rnv.crypto.installProfiles';
import { taskRnvTargetList } from '../engine-core/task.rnv.target.list';
import { taskRnvTargetLaunch } from '../engine-core/task.rnv.target.launch';
import { taskRnvPlatformEject } from '../engine-core/task.rnv.platform.eject';
import { taskRnvPlatformConnect } from '../engine-core/task.rnv.platform.connect';
import { taskRnvPlatformList } from '../engine-core/task.rnv.platform.list';
import { taskRnvPlatformConfigure } from '../engine-core/task.rnv.platform.configure';
import { taskRnvPlatformSetup } from '../engine-core/task.rnv.platform.setup';
import { taskRnvTemplateAdd } from '../engine-core/task.rnv.template.add';
import { taskRnvTemplateApply } from '../engine-core/task.rnv.template.apply';
import { taskRnvTemplateList } from '../engine-core/task.rnv.template.list';
import { taskRnvPluginAdd } from '../engine-core/task.rnv.plugin.add';
import { taskRnvPluginList } from '../engine-core/task.rnv.plugin.list';
import { taskRnvPluginUpdate } from '../engine-core/task.rnv.plugin.update';
import { taskRnvWorkspaceList } from '../engine-core/task.rnv.workspace.list';
import { taskRnvWorkspaceAdd } from '../engine-core/task.rnv.workspace.add';
import { taskRnvWorkspaceConnect } from '../engine-core/task.rnv.workspace.connect';
import { taskRnvWorkspaceUpdate } from '../engine-core/task.rnv.workspace.update';
import { taskRnvHooksList } from '../engine-core/task.rnv.hooks.list';
import { taskRnvHooksRun } from '../engine-core/task.rnv.hooks.run';
import { taskRnvHooksPipes } from '../engine-core/task.rnv.hooks.pipes';
import { taskRnvClean } from '../engine-core/task.rnv.clean';
import { rnvFastlane } from '../integration-fastlane/task.rnv.fastlane';
import { taskRnvPublish } from '../engine-core/task.rnv.publish';
import { taskRnvPkg } from '../engine-core/task.rnv.pkg';
import { taskRnvStatus } from '../engine-core/task.rnv.status';
import { taskRnvConfig } from '../engine-core/task.rnv.config';
import { taskRnvHelp } from '../engine-core/task.rnv.help';
import { taskRnvNew } from '../engine-core/task.rnv.new';

import {
    rnvRun,
    rnvBuild,
    rnvPackage,
    rnvExport,
    rnvLog,
    rnvDeploy,
    rnvStart,
    taskRnvConfigure
} from '../core/taskManager';

import {
    chalk,
    logTask,
    logToSummary,
    logAppInfo,
    logError
} from '../core/systemManager/logger';
import { applyTemplate, checkIfTemplateInstalled } from '../core/templateManager';
import { configurePlugins } from '../core/pluginManager';
import { executePipe } from '../core/projectManager/buildHooks';
import { checkCrypto } from '../core/systemManager/crypto';
import { inquirerPrompt } from './prompt';
import { getEngineByPlatform } from '../core/engineManager';
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
} from '../core/constants';
import { checkAndMigrateProject } from '../core/projectManager/migrator';
import {
    parseRenativeConfigs,
    updateConfig,
    fixRenativeConfigsSync,
    configureRnvGlobal,
    checkIsRenativeProject
} from '../core/configManager/configParser';
import {
    configureNodeModules,
    checkAndCreateProjectPackage,
} from '../core/projectManager/projectParser';

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

const _generateCommands = () => ({
    start: {
        fn: rnvStart,
        platforms: SUPPORTED_PLATFORMS
    },
    config: {
        fn: taskRnvConfig,
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
        fn: taskRnvNew,
        desc: 'Creates new project',
        params: ['mono', 'ci']
    },
    help: {
        desc: 'Displays help',
        fn: taskRnvHelp
    },
    configure: {
        desc: 'Configures app config',
        fn: taskRnvConfigure,
        params: ['appConfigID', 'mono', 'ci']
    },
    switch: {
        desc: 'Switches to app confing without rebuilding',
        fn: taskRnvSwitch,
        params: ['appConfigID', 'mono', 'ci']
    },
    link: {
        desc: 'Local dependency linking of your project',
        fn: taskRnvLink
    },
    platform: {
        desc: 'Manages native platform projects',
        subCommands: {
            eject: {
                fn: taskRnvPlatformEject
            },
            list: {
                fn: taskRnvPlatformList
            },
            connect: {
                fn: taskRnvPlatformConnect
            },
            configure: {
                fn: taskRnvPlatformConfigure
            },
            setup: {
                fn: taskRnvPlatformSetup
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
                fn: taskRnvTargetLaunch
            },
            list: {
                fn: taskRnvTargetList
            }
        }
    },
    plugin: {
        desc: 'Manages all plugins',
        subCommands: {
            add: {
                fn: taskRnvPluginAdd
            },
            list: {
                fn: taskRnvPluginList
            },
            update: {
                fn: taskRnvPluginUpdate
            }
        }
    },
    hooks: {
        desc:
              'Manages project based build hooks. This allows you to extend functionality of RNV CLI',
        subCommands: {
            run: {
                fn: taskRnvHooksRun
            },
            list: {
                fn: taskRnvHooksList
            },
            pipes: {
                fn: taskRnvHooksPipes
            }
        }
    },
    status: {
        desc: 'Prints out summary of your project',
        fn: taskRnvStatus
    },
    clean: {
        desc:
              'Automatically removes all node_modules and lock in your project and its dependencies',
        fn: taskRnvClean
    },
    template: {
        desc: 'Manages rnv and project templates',
        subCommands: {
            add: {
                fn: taskRnvTemplateAdd
            },
            list: {
                fn: taskRnvTemplateList
            },
            apply: {
                fn: taskRnvTemplateApply
            }
        }
    },
    crypto: {
        desc:
              'Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information',
        subCommands: {
            encrypt: {
                fn: taskRnvCryptoEncrypt
            },
            decrypt: {
                fn: taskRnvCryptoDecrypt
            },
            installCerts: {
                platforms: [IOS, TVOS],
                fn: taskRnvCryptoInstallCerts
            },
            updateProfile: {
                requiredParams: ['scheme', 'platform'],
                platforms: [IOS, TVOS],
                fn: taskRnvCryptoUpdateProfile
            },
            updateProfiles: {
                platforms: [IOS, TVOS],
                fn: taskRnvCryptoUpdateProfiles
            },
            installProfiles: {
                platforms: [IOS, TVOS],
                fn: taskRnvCryptoInstallProfiles
            }
        }
    },
    workspace: {
        desc: 'Manages global workspaces for ReNative projects',
        subCommands: {
            add: {
                fn: taskRnvWorkspaceAdd
            },
            connect: {
                fn: taskRnvWorkspaceConnect
            },
            list: {
                fn: taskRnvWorkspaceList
            },
            update: {
                fn: taskRnvWorkspaceUpdate
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
        fn: taskRnvPublish
    },
    pkg: {
        desc:
              'Provides help deploying a new version, like tagging a commit, pushing it, etc',
        fn: taskRnvPkg
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
    const currC = c;
    const cmd = c.COMMANDS[currC.command];
    const cmdFn = cmd?.fn;
    const subCmd = cmd?.subCommands?.[currC.subCommand];
    const subCmdFn = subCmd?.fn;

    logTask('cli', `cmd:${currC.command} subCmd:${currC.subCommand}`);

    setDefaults(currC);
    await _startBuilder(currC);

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
