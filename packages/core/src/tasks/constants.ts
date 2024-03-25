import { RnvTaskName } from '../enums/taskName';
import type { RnvTaskOption } from './types';

export const DEFAULT_TASK_DESCRIPTIONS: Record<string, string> = {
    [RnvTaskName.run]: 'Run your app on target device or emulator',
    [RnvTaskName.package]: 'Package source files into bundle',
    [RnvTaskName.build]: 'Build project binary',
    [RnvTaskName.configure]: 'Configure current project',
    [RnvTaskName.start]: 'Starts bundler / server',
    [RnvTaskName.export]: 'Export the app into deployable binary',
};

const _RnvTaskOptions = {
    // CORE --------------------------------
    help: {
        shortcut: 'h',
        description: 'Displays help info for particular command',
    },
    info: {
        shortcut: 'i',
        isValueType: true,
        description: 'Show full debug Info',
    },
    printExec: {
        key: 'print-exec',
        description: 'Print exec commands in full',
    },
    platform: {
        shortcut: 'p',
        isValueType: true,
        description: 'select specific Platform',
    },
    skipTasks: {
        key: 'skip-tasks',
        isValueType: true,
        isRequired: true,
        description: 'List tasks which you want to skip during rnv execution',
        examples: ['--skipTasks "configure,export"', '--skipTasks deploy'],
    },
    only: {
        shortcut: 'o',
        description: 'run Only top command (Skip dependencies)',
    },
    ci: {
        description: 'CI/CD flag so it wont ask questions',
    },
    mono: {
        description: 'Monochrome console output without chalk',
    },
    maxErrorLength: {
        key: 'max-error-length',
        isValueType: true,
        isRequired: true,
        description: 'Specify how many characters each error should display. Default 200',
    },
    json: {
        description: 'Outputs the result as json',
    },
    yes: {
        description: 'Default all prompts to yes',
    },
    telemetryDebug: {
        description: 'If you have telemetry enabled, will print out exactly what is being collected into the console',
    },
    // OTHERS 1st --------------------------------
    // Still present in core
    packageManager: {
        isValueType: true,
        isRequired: true,
        options: ['yarn', 'npm'],
        description: 'Set specific package manager to use',
        examples: ['--packageManager yarn', '--packageManager npm'],
    },
    npxMode: {
        key: 'npx-mode',
        description: 'Ensures you can use local npx rnv version after the command is done',
    },
    unlinked: {
        description: 'Force engines to be loaded from node_modules rather than locally',
    },
    configName: {
        isValueType: true,
        isRequired: true,
        description: 'Use custom name for ./renative.json. (applies only at root level)',
    },
    skipDependencyCheck: {
        description: 'Skips auto update of npm dependencies if mismatch found',
    },
    appConfigID: {
        shortcut: 'c',
        isValueType: true,
        description: 'select specific app Config id',
    },
    skipRnvCheck: {
        description: 'Skips auto update of rnv dependencies if mismatch found',
    },
    scheme: {
        shortcut: 's',
        isValueType: true,
        description: 'select build Scheme',
    },
    engine: {
        shortcut: 'e',
        isValueType: true,
        isRequired: true,
        description: 'engine to be used ie "engine-rn"',
    },
    exeMethod: {
        shortcut: 'x',
        isValueType: true,
        description: 'eXecutable method in buildHooks',
    },
    reset: {
        shortcut: 'r',
        description: 'also perform reset of platform build',
    },
    resetHard: {
        shortcut: 'R',
        description: 'also perform reset of platform platform and platform assets',
    },
    resetAssets: {
        shortcut: 'a',
        description: 'also perform reset of platform assets',
    },
    hooks: {
        description: 'Force rebuild hooks',
    },
    // OTHERS 2nd --------------------------------
    // Still present in core but ONLY in runtime defaults
    hostIp: {
        isValueType: true,
        isRequired: true,
        description: 'Custom IP override',
    },
    target: {
        shortcut: 't',
        isValueType: true,
        description: 'select specific Target device/simulator',
    },
    host: {
        shortcut: 'H',
        isValueType: true,
        isRequired: true,
        description: 'custom Host ip',
    },
    port: {
        shortcut: 'P',
        isValueType: true,
        isRequired: true,
        description: 'custom Port',
    },
    hosted: {
        description: 'Run in a hosted environment (skip budleAssets)',
    },
    // ENGINE-CORE --------------------------------
    sourceAppConfigID: {
        isValueType: true,
        isRequired: true,
        description: 'name of source appConfig folder to copy from',
    },
    gitEnabled: {
        description: 'Enable git in your newly created project',
        isValueType: true,
    },
    answer: {
        isValueType: true,
        isVariadic: true,
        description: 'Pass in answers to prompts',
        examples: ['--answer question=response question2=response2', '--answer question=\'{"some": "json"}\''],
    },
    workspace: {
        isValueType: true,
        description: 'select the workspace for the new project',
    },
    template: {
        shortcut: 'T',
        isValueType: true,
        isRequired: true,
        description: 'select specific template',
    },
    projectName: {
        isValueType: true,
        description: 'select the name of the new project',
    },
    projectTemplate: {
        isValueType: true,
        description: 'select the template of new project',
    },
    templateVersion: {
        isValueType: true,
        description: 'select the template version',
    },
    title: {
        isValueType: true,
        description: 'select the title of the app',
    },
    appVersion: {
        isValueType: true,
        description: 'select the version of the app',
    },
    id: {
        isValueType: true,
        description: 'select the id of the app',
    },
    // ENGINE-CORE + SDK-APPLE --------------------------------
    key: {
        shortcut: 'k',
        isValueType: true,
        isRequired: true,
        description: 'Pass the key/password',
    },
    // SDK-WEBPACK --------------------------------
    debugIp: {
        isValueType: true,
        isRequired: true,
        description: '(optional) overwrite the ip to which the remote debugger will connect',
    },
    debug: {
        shortcut: 'D',
        isValueType: true,
        description: 'enable or disable remote debugger.',
        examples: [
            '--debug weinre //run remote debug with weinre as preference',
            '--debug chii //run remote debug with chii as preference',
            '--debug false //force disable remote debug',
            '--debug //run remote debug with default preference (chii)',
        ],
    },
    // SDK-APPLE --------------------------------
    updatePods: {
        shortcut: 'u',
        description: 'Force update dependencies (iOS only)',
    },
    keychain: {
        isValueType: true,
        isRequired: true,
        description: 'Name of the keychain',
    },
    provisioningStyle: {
        isValueType: true,
        isRequired: true,
        description: 'Set provisioningStyle (Automatic | Manual)',
    },
    codeSignIdentity: {
        isValueType: true,
        isRequired: true,
        description: 'Set codeSignIdentity (ie iPhone Distribution)',
    },
    provisionProfileSpecifier: {
        isValueType: true,
        isRequired: true,
        description: 'Name of provisionProfile',
    },
    xcodebuildArgs: {
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    xcodebuildArchiveArgs: {
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    xcodebuildExportArgs: {
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    // SDK-APPLE + SDK-ANDROID --------------------------------
    skipTargetCheck: {
        description: 'Skip Android target check, just display the raw adb devices to choose from',
    },
    filter: {
        shortcut: 'f',
        isValueType: true,
        isRequired: true,
        description: 'Filter value',
    },
    device: {
        shortcut: 'd',
        isValueType: true,
        description: 'select connected Device',
    },
    // SDK-ANDROID --------------------------------
    resetAdb: {
        description: 'Forces to reset android adb',
    },

    // DEPRECATED --------------------------------

    // global: {
    //     shortcut: 'G',
    //     description: 'Flag for setting a config value for all RNV projects',
    // },
    // skipNotifications: {
    //     description: 'Skip sending any integrated notifications',
    // },
    // analyzer: {
    //     description: 'Enable real-time bundle analyzer',
    // },
    // blueprint: {
    //     shortcut: 'b',
    //     isValueType: true,
    //     description: 'Blueprint for targets',
    // },
    // list: {
    //     shortcut: 'l',
    //     description: 'return List of items related to command',
    // },
};

type ParamKeysType = typeof _RnvTaskOptions;

export type ProgramOptionsKey = keyof ParamKeysType;

export const RnvTaskOptions = _RnvTaskOptions as Record<ProgramOptionsKey, RnvTaskOption>;

//TODO: make this properly typed. Pass integration type to getContext?
type ParamType = any; //boolean | string | undefined

export type ParamKeys<ExtraKeys extends string = ProgramOptionsKey> = Partial<
    Record<ProgramOptionsKey | ExtraKeys, ParamType>
>;

(Object.keys(RnvTaskOptions) as ProgramOptionsKey[]).forEach((k) => {
    RnvTaskOptions[k].key = k;
});

export const RnvTaskCoreOptionPresets = {
    withCore: (arr?: Array<RnvTaskOption>) =>
        [
            RnvTaskOptions.info,
            RnvTaskOptions.ci,
            RnvTaskOptions.mono,
            RnvTaskOptions.maxErrorLength,
            RnvTaskOptions.only,
            RnvTaskOptions.yes,
            // platform is necessary to be accepted as base for the `rnv` command to work with enginie plugins
            RnvTaskOptions.platform,
            RnvTaskOptions.help,
            RnvTaskOptions.printExec,
        ].concat(arr || []),
};

export const RnvTaskOptionPresets = {
    withConfigure: (arr?: Array<RnvTaskOption>) =>
        [
            RnvTaskOptions.reset,
            RnvTaskOptions.resetHard,
            RnvTaskOptions.engine,
            RnvTaskOptions.resetAssets,
            RnvTaskOptions.appConfigID,
            RnvTaskOptions.scheme,
            // RnvTaskOptions.platform,
        ].concat(arr || []),
    withRun: (arr?: Array<RnvTaskOption>) =>
        [
            RnvTaskOptions.target,
            RnvTaskOptions.device,
            RnvTaskOptions.hosted,
            RnvTaskOptions.port,
            // RnvTaskOptions.debug,
            RnvTaskOptions.debugIp,
            RnvTaskOptions.skipTargetCheck,
            RnvTaskOptions.host,
        ].concat(arr || []),
    withAll: (arr?: Array<RnvTaskOption>) => Object.values(RnvTaskOptions).concat(arr || []),
    all: Object.keys(RnvTaskOptions),
};
