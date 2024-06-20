import { createTaskOptionsMap, createTaskOptionsPreset } from './creators';

export const RnvTaskOptions = createTaskOptionsMap([
    // CORE --------------------------------
    {
        key: 'help',
        shortcut: 'h',
        description: 'Displays help info for particular command',
    },
    {
        key: 'info',
        shortcut: 'i',
        isValueType: true,
        description: 'Show full debug Info',
    },
    {
        key: 'printExec',
        // altKey: 'printExec',
        description: 'Print exec commands in full',
    },
    {
        key: 'platform',
        shortcut: 'p',
        isValueType: true,
        description: 'select specific Platform',
    },
    {
        key: 'skipTasks',
        // key: 'skip-tasks',
        isValueType: true,
        isRequired: true,
        description: 'List tasks which you want to skip during rnv execution',
        examples: ['--skipTasks "configure,export"', '--skipTasks deploy'],
    },
    {
        key: 'only',
        shortcut: 'o',
        description: 'run Only top command (Skip dependencies)',
    },
    {
        key: 'ci',
        description: 'CI/CD flag so it wont ask questions',
    },
    {
        key: 'mono',
        description: 'Monochrome console output without chalk',
    },
    {
        key: 'maxErrorLength',
        // key: 'max-error-length',
        isValueType: true,
        isRequired: true,
        description: 'Specify how many characters each error should display. Default 200',
    },
    {
        key: 'json',
        description: 'Outputs the result as json',
    },
    {
        key: 'yes',
        description: 'Default all prompts to yes',
    },
    {
        key: 'telemetryDebug',
        // key: 'telemetry-debug',
        description: 'If you have telemetry enabled, will print out exactly what is being collected into the console',
    },
    // OTHERS 1st --------------------------------
    // Still present in core
    {
        key: 'packageManager',
        // key: 'package-manager',
        isValueType: true,
        isRequired: true,
        // options: ['yarn', 'npm'],
        description: 'Set specific package manager to use',
        examples: ['--packageManager yarn', '--packageManager npm'],
    },
    {
        key: 'npxMode',
        // key: 'npx-mode',
        description: 'Ensures you can use local npx rnv version after the command is done',
    },
    {
        key: 'unlinked',
        description: 'Force engines to be loaded from node_modules rather than locally',
    },
    {
        key: 'configName',
        // key: 'config-name',
        isValueType: true,
        isRequired: true,
        description: 'Use custom name for ./renative.json. (applies only at root level)',
    },
    {
        key: 'skipDependencyCheck',
        // key: 'skip-dependency-check',
        description: 'Skips auto update of npm dependencies if mismatch found',
    },
    {
        key: 'appConfigID',
        // key: 'app-config-id',
        shortcut: 'c',
        isValueType: true,
        description: 'select specific app Config id',
    },
    {
        key: 'skipRnvCheck',
        // key: 'skip-rnv-check',
        description: 'Skips auto update of rnv dependencies if mismatch found',
    },
    {
        key: 'scheme',
        shortcut: 's',
        isValueType: true,
        description: 'select build Scheme',
    },
    {
        key: 'engine',
        shortcut: 'e',
        isValueType: true,
        isRequired: true,
        description: 'engine to be used ie "engine-rn"',
    },
    {
        key: 'exeMethod',
        // key: 'exe-method',
        shortcut: 'x',
        isValueType: true,
        description: 'eXecutable method in buildHooks',
    },
    {
        key: 'reset',
        shortcut: 'r',
        description: 'also perform reset of platform build',
    },
    {
        key: 'resetHard',
        // key: 'reset-hard',
        shortcut: 'R',
        description: 'also perform reset of platform platform and platform assets',
    },
    {
        key: 'resetAssets',
        // key: 'reset-assets',
        shortcut: 'a',
        description: 'also perform reset of platform assets',
    },
    {
        key: 'hooks',
        description: 'Force rebuild hooks',
    },
    // OTHERS 2nd --------------------------------
    // Still present in core but ONLY in runtime defaults
    {
        // key: 'host-ip',
        key: 'hostIp',
        isValueType: true,
        isRequired: true,
        description: 'Custom IP override',
    },
    {
        key: 'target',
        shortcut: 't',
        isValueType: true,
        description: 'select specific Target device/simulator',
    },
    {
        key: 'host',
        shortcut: 'H',
        isValueType: true,
        isRequired: true,
        description: 'custom Host ip',
    },
    {
        key: 'port',
        shortcut: 'P',
        isValueType: true,
        isRequired: true,
        description: 'custom Port',
    },
    {
        key: 'hosted',
        description: 'Run in a hosted environment (skip budleAssets)',
    },
    {
        key: 'device',
        shortcut: 'd',
        isValueType: true,
        description: 'select connected Device',
    },
    // SDK-WEBPACK --------------------------------
    {
        // key: 'debug-ip',
        key: 'debugIp',
        isValueType: true,
        isRequired: true,
        description: '(optional) overwrite the ip to which the remote debugger will connect',
    },
    {
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
]);

export type ProgramOptionsKey = keyof typeof RnvTaskOptions;

export const RnvTaskCoreOptionPresets = createTaskOptionsPreset({
    withCore: [
        RnvTaskOptions.scheme, // temporary workaround
        RnvTaskOptions.engine, // temporary workaround
        RnvTaskOptions.platform, // platform is necessary to be accepted as base for the `rnv` command to work with enginie plugins
        RnvTaskOptions.info,
        RnvTaskOptions.ci,
        RnvTaskOptions.mono,
        RnvTaskOptions.maxErrorLength,
        RnvTaskOptions.only,
        RnvTaskOptions.yes,
        RnvTaskOptions.help,
        RnvTaskOptions.printExec,
        RnvTaskOptions.telemetryDebug,
        RnvTaskOptions.json,
    ],
});

export const RnvTaskOptionPresets = createTaskOptionsPreset({
    withConfigure: [
        RnvTaskOptions.reset,
        RnvTaskOptions.resetHard,
        RnvTaskOptions.resetAssets,
        RnvTaskOptions.appConfigID,
        RnvTaskOptions.packageManager,
    ],
    withRun: [
        RnvTaskOptions.target,
        RnvTaskOptions.device,
        RnvTaskOptions.hosted,
        RnvTaskOptions.port,
        RnvTaskOptions.debugIp,
        RnvTaskOptions.host,
    ],
});
