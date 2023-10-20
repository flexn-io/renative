import type { RnvTaskParameter } from './types';

const PARAM_KEYS_ENUM = {
    info: {
        shortcut: 'i',
        value: 'value',
        description: 'Show full debug Info',
    },
    showEnv: {
        description: 'Show exec commands with env info',
    },
    updatePods: {
        shortcut: 'u',
        description: 'Force update dependencies (iOS only)',
    },
    platform: {
        shortcut: 'p',
        value: 'value',
        description: 'select specific Platform',
    },
    appConfigID: {
        shortcut: 'c',
        value: 'value',
        description: 'select specific app Config id',
    },
    target: {
        shortcut: 't',
        value: 'value',
        description: 'select specific Target device/simulator',
    },
    projectName: {
        value: 'value',
        description: 'select the name of the new project',
    },
    projectTemplate: {
        value: 'value',
        description: 'select the template of new project',
    },
    templateVersion: {
        value: 'value',
        description: 'select the template version',
    },
    title: {
        value: 'value',
        description: 'select the title of the app',
    },
    id: {
        value: 'value',
        description: 'select the id of the app',
    },
    appVersion: {
        value: 'value',
        description: 'select the version of the app',
    },
    workspace: {
        value: 'value',
        description: 'select the workspace for the new project',
    },
    template: {
        shortcut: 'T',
        value: 'value',
        isRequired: true,
        description: 'select specific template',
    },
    device: {
        shortcut: 'd',
        value: 'value',
        description: 'select connected Device',
    },
    scheme: {
        shortcut: 's',
        value: 'value',
        description: 'select build Scheme',
    },
    filter: {
        shortcut: 'f',
        value: 'value',
        isRequired: true,
        description: 'Filter value',
    },
    list: {
        shortcut: 'l',
        description: 'return List of items related to command',
    },
    only: {
        shortcut: 'o',
        description: 'run Only top command (Skip dependencies)',
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
    key: {
        shortcut: 'k',
        value: 'value',
        isRequired: true,
        description: 'Pass the key/password',
    },
    blueprint: {
        shortcut: 'b',
        value: 'value',
        description: 'Blueprint for targets',
    },
    help: {
        shortcut: 'h',
        description: 'Displays help info for particular command',
    },
    host: {
        shortcut: 'H',
        value: 'value',
        isRequired: true,
        description: 'custom Host ip',
    },
    exeMethod: {
        shortcut: 'x',
        value: 'value',
        description: 'eXecutable method in buildHooks',
    },
    port: {
        shortcut: 'P',
        value: 'value',
        isRequired: true,
        description: 'custom Port',
    },
    debug: {
        shortcut: 'D',
        value: 'value',
        description: 'enable or disable remote debugger.',
        examples: [
            '--debug weinre //run remote debug with weinre as preference',
            '--debug chii //run remote debug with chii as preference',
            '--debug false //force disable remote debug',
            '--debug //run remote debug with default preference (chii)',
        ],
    },
    global: {
        shortcut: 'G',
        description: 'Flag for setting a config value for all RNV projects',
    },
    engine: {
        shortcut: 'e',
        value: 'value',
        isRequired: true,
        description: 'engine to be used (next)',
    },
    debugIp: {
        value: 'value',
        isRequired: true,
        description: '(optional) overwrite the ip to which the remote debugger will connect',
    },
    ci: {
        description: 'CI/CD flag so it wont ask questions',
    },
    mono: {
        description: 'Monochrome console output without chalk',
    },
    skipNotifications: {
        description: 'Skip sending any integrated notifications',
    },
    keychain: {
        value: 'value',
        isRequired: true,
        description: 'Name of the keychain',
    },
    provisioningStyle: {
        value: 'value',
        isRequired: true,
        description: 'Set provisioningStyle <Automatic | Manual>',
    },
    codeSignIdentity: {
        value: 'value',
        isRequired: true,
        description: 'Set codeSignIdentity ie <iPhone Distribution>',
    },
    provisionProfileSpecifier: {
        value: 'value',
        isRequired: true,
        description: 'Name of provisionProfile',
    },
    hosted: {
        description: 'Run in a hosted environment (skip budleAssets)',
    },
    hooks: {
        description: 'Force rebuild hooks',
    },
    maxErrorLength: {
        value: 'number',
        isRequired: true,
        description: 'Specify how many characters each error should display. Default 200',
    },
    skipTargetCheck: {
        description: 'Skip Android target check, just display the raw adb devices to choose from',
    },
    analyzer: {
        description: 'Enable real-time bundle analyzer',
    },
    xcodebuildArgs: {
        value: 'value',
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    xcodebuildArchiveArgs: {
        value: 'value',
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    xcodebuildExportArgs: {
        value: 'value',
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    skipDependencyCheck: {
        description: 'Skips auto update of npm dependencies if mismatch found',
    },
    skipRnvCheck: {
        description: 'Skips auto update of rnv dependencies if mismatch found',
    },
    configName: {
        value: 'value',
        isRequired: true,
        description: 'Use custom name for ./renative.json. (applies only at root level)',
    },
    sourceAppConfigID: {
        value: 'value',
        isRequired: true,
        description: 'name of source appConfig folder to copy from',
    },
    hostIp: {
        value: 'value',
        isRequired: true,
        description: 'Custom IP override',
    },
    unlinked: {
        description: 'Force engines to be loaded from node_modules rather than locally',
    },
    yes: {
        description: 'Default all prompts to yes',
    },
    gitEnabled: {
        description: 'Enable git in your newly created project',
        value: 'value',
    },
    npxMode: {
        description: 'Ensures you can use local npx rnv version after the command is done',
    },
    json: {
        description: 'Outputs the result as json',
    },
    packageManager: {
        value: 'value',
        isRequired: true,
        options: ['yarn', 'npm'],
        description: 'Set specific package manager to use',
        examples: ['--packageManager yarn', '--packageManager npm'],
    },
    skipTasks: {
        value: 'value',
        isRequired: true,
        description: 'List tasks which you want to skip during rnv execution',
        examples: ['--skipTasks "configure,export"', '--skipTasks deploy'],
    },
    answer: {
        value: 'value',
        variadic: true,
        description: 'Pass in answers to prompts',
        examples: ['--answer question=response --answer question2=response2', '--answer question=\'{"some": "json"}\''],
    },
    resetAdb: {
        description: 'Forces to reset android adb',
    },
};

export const PARAM_KEYS = PARAM_KEYS_ENUM as Record<string, RnvTaskParameter>;

type ParamKeysType = typeof PARAM_KEYS_ENUM;

type ProgramOptionsKey = keyof ParamKeysType;

export type ParamKeys = Partial<Record<ProgramOptionsKey, any>>;

(Object.keys(PARAM_KEYS) as ProgramOptionsKey[]).forEach((k) => {
    PARAM_KEYS[k].key = k;
});

export const PARAMS = {
    withBase: (arr?: Array<RnvTaskParameter>) =>
        [PARAM_KEYS.info, PARAM_KEYS.ci, PARAM_KEYS.mono, PARAM_KEYS.maxErrorLength, PARAM_KEYS.only].concat(arr || []),
    withConfigure: (arr?: Array<RnvTaskParameter>) =>
        [
            PARAM_KEYS.reset,
            PARAM_KEYS.resetHard,
            PARAM_KEYS.engine,
            PARAM_KEYS.resetAssets,
            PARAM_KEYS.appConfigID,
            PARAM_KEYS.scheme,
            PARAM_KEYS.platform,
        ].concat(arr || []),
    withRun: (arr?: Array<RnvTaskParameter>) =>
        [
            PARAM_KEYS.target,
            PARAM_KEYS.device,
            PARAM_KEYS.hosted,
            PARAM_KEYS.port,
            PARAM_KEYS.debug,
            PARAM_KEYS.debugIp,
            PARAM_KEYS.skipTargetCheck,
            PARAM_KEYS.host,
        ].concat(arr || []),
    withAll: (arr?: Array<RnvTaskParameter>) => Object.values(PARAM_KEYS).concat(arr || []),
    all: Object.keys(PARAM_KEYS),
};
