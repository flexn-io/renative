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
        key: 'help',
        shortcut: 'h',
        description: 'Displays help info for particular command',
    },
    info: {
        key: 'info',
        shortcut: 'i',
        isValueType: true,
        description: 'Show full debug Info',
    },
    printExec: {
        key: 'print-exec',
        description: 'Print exec commands in full',
    },
    platform: {
        key: 'platform',
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
        key: 'only',
        shortcut: 'o',
        description: 'run Only top command (Skip dependencies)',
    },
    ci: {
        key: 'ci',
        description: 'CI/CD flag so it wont ask questions',
    },
    mono: {
        key: 'mono',
        description: 'Monochrome console output without chalk',
    },
    maxErrorLength: {
        key: 'max-error-length',
        isValueType: true,
        isRequired: true,
        description: 'Specify how many characters each error should display. Default 200',
    },
    json: {
        key: 'json',
        description: 'Outputs the result as json',
    },
    yes: {
        key: 'yes',
        description: 'Default all prompts to yes',
    },
    telemetryDebug: {
        key: 'telemetry-debug',
        description: 'If you have telemetry enabled, will print out exactly what is being collected into the console',
    },
    // OTHERS 1st --------------------------------
    // Still present in core
    packageManager: {
        key: 'package-manager',
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
        key: 'unlinked',
        description: 'Force engines to be loaded from node_modules rather than locally',
    },
    configName: {
        key: 'config-name',
        isValueType: true,
        isRequired: true,
        description: 'Use custom name for ./renative.json. (applies only at root level)',
    },
    skipDependencyCheck: {
        key: 'skip-dependency-check',
        description: 'Skips auto update of npm dependencies if mismatch found',
    },
    appConfigID: {
        key: 'app-config-id',
        shortcut: 'c',
        isValueType: true,
        description: 'select specific app Config id',
    },
    skipRnvCheck: {
        key: 'skip-rnv-check',
        description: 'Skips auto update of rnv dependencies if mismatch found',
    },
    scheme: {
        key: 'scheme',
        shortcut: 's',
        isValueType: true,
        description: 'select build Scheme',
    },
    engine: {
        key: 'engine',
        shortcut: 'e',
        isValueType: true,
        isRequired: true,
        description: 'engine to be used ie "engine-rn"',
    },
    exeMethod: {
        key: 'exe-method',
        shortcut: 'x',
        isValueType: true,
        description: 'eXecutable method in buildHooks',
    },
    reset: {
        key: 'reset',
        shortcut: 'r',
        description: 'also perform reset of platform build',
    },
    resetHard: {
        key: 'reset-hard',
        shortcut: 'R',
        description: 'also perform reset of platform platform and platform assets',
    },
    resetAssets: {
        key: 'reset-assets',
        shortcut: 'a',
        description: 'also perform reset of platform assets',
    },
    hooks: {
        key: 'hooks',
        description: 'Force rebuild hooks',
    },
    // OTHERS 2nd --------------------------------
    // Still present in core but ONLY in runtime defaults
    hostIp: {
        key: 'host-ip',
        isValueType: true,
        isRequired: true,
        description: 'Custom IP override',
    },
    target: {
        key: 'target',
        shortcut: 't',
        isValueType: true,
        description: 'select specific Target device/simulator',
    },
    host: {
        key: 'host',
        shortcut: 'H',
        isValueType: true,
        isRequired: true,
        description: 'custom Host ip',
    },
    port: {
        key: 'port',
        shortcut: 'P',
        isValueType: true,
        isRequired: true,
        description: 'custom Port',
    },
    hosted: {
        key: 'hosted',
        description: 'Run in a hosted environment (skip budleAssets)',
    },
    // SDK-WEBPACK --------------------------------
    debugIp: {
        key: 'debug-ip',
        isValueType: true,
        isRequired: true,
        description: '(optional) overwrite the ip to which the remote debugger will connect',
    },
    debug: {
        key: 'debug',
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
    // SDK-APPLE + SDK-ANDROID --------------------------------
    skipTargetCheck: {
        key: 'skip-target-check',
        description: 'Skip Android target check, just display the raw adb devices to choose from',
    },
    filter: {
        key: 'filter',
        shortcut: 'f',
        isValueType: true,
        isRequired: true,
        description: 'Filter value',
    },
    device: {
        key: 'device',
        shortcut: 'd',
        isValueType: true,
        description: 'select connected Device',
    },
    // SDK-ANDROID --------------------------------
    resetAdb: {
        key: 'reset-adb',
        description: 'Forces to reset android adb',
    },
};

export type ProgramOptionsKey = keyof typeof _RnvTaskOptions;

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
            RnvTaskOptions.platform, // platform is necessary to be accepted as base for the `rnv` command to work with enginie plugins
            RnvTaskOptions.info,
            RnvTaskOptions.ci,
            RnvTaskOptions.mono,
            RnvTaskOptions.maxErrorLength,
            RnvTaskOptions.only,
            RnvTaskOptions.yes,
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
            RnvTaskOptions.packageManager,
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
