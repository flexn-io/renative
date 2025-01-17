import { createTask, RnvTaskName, getContext, execCLI, logError, logDebug, logToSummary } from '@rnv/core';
import envinfo from 'envinfo';
import semver from 'semver';

/**
 * CLI command `npx rnv info` triggers this task, which is displaying relevant version info about OS, toolchain and libraries.
 * Available globally.
 */
export default createTask({
    description: 'Get relevant version info about OS, toolchain and libraries',
    fn: async () => {
        const parsedInfo = await _getEnvironmentInfo();
        await _checkAndConfigureSdks();
        await _getCliVersions(parsedInfo);
        logToSummary(_formatObject(parsedInfo));
        return true;
    },
    task: RnvTaskName.info,
    isGlobalScope: true,
});

const _checkAndConfigureSdks = async () => {
    const moduleConfigs = [
        { moduleName: 'sdk-tizen', configureFunction: 'checkAndConfigureTizenSdks' },
        { moduleName: 'sdk-webos', configureFunction: 'checkAndConfigureWebosSdks' },
    ];
    for (const config of moduleConfigs) {
        const { moduleName, configureFunction } = config;
        await _checkAndConfigureTargetSdk(moduleName, configureFunction);
    }
};

const _checkAndConfigureTargetSdk = async (moduleName: string, configureFunction: string): Promise<void> => {
    try {
        const SDKModule = require(`@rnv/${moduleName}`);
        await SDKModule[configureFunction]();
    } catch (e) {
        logDebug(`Error configuring ${moduleName} SDK: `, e);
    }
};

const _getCliVersions = async (parsedInfo: any) => {
    const c = getContext();
    const cliVersions: { [key: string]: { version: string; path: string } } = {};

    const addCliVersion = async (cli: string, command: string, path: string, cliName: string) => {
        try {
            const cliVersionOutput = await execCLI(cli, command);
            const cliVersionNumber = semver.coerce(cliVersionOutput)?.version;
            if (cliVersionNumber) {
                cliVersions[`${cliName.replace('-', ' ').toUpperCase()}`] = { version: cliVersionNumber, path };
            }
        } catch (e) {
            logDebug(`Error getting version for ${cliName}: `, e);
        }
    };

    if (c.cli.webosAres) {
        await addCliVersion('webosAres', '--version', c.cli.webosAres, 'WEBOS CLI');
    }
    if (c.cli.tizen) {
        await addCliVersion('tizen', 'version', c.cli.tizen, 'TIZEN CLI');
    }
    if (Object.keys(cliVersions).length) {
        parsedInfo.CLI = cliVersions;
    }
};
const _formatObject = (obj: any, indent = 0) => {
    let formattedString = '';
    if (indent === 0) formattedString += '\n';
    for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object' && obj[key].version) {
            formattedString +=
                ' '.repeat(indent) + `${key}: ${obj[key].version} ${obj[key].path ? `- ${obj[key].path}` : ''}\n`;
        } else if (Array.isArray(obj[key])) {
            formattedString += ' '.repeat(indent) + `${key}: ${obj[key].join(', ')}\n`;
        } else if (typeof obj[key] === 'object') {
            formattedString += ' '.repeat(indent) + `${key}:\n`;
            formattedString += _formatObject(obj[key], indent + 2);
        } else {
            formattedString += ' '.repeat(indent) + `${key}: ${obj[key]}\n`;
        }
    }
    return formattedString;
};

const _getEnvironmentInfo = async () => {
    try {
        const output = await envinfo.run(
            {
                System: ['OS', 'CPU', 'Memory', 'Shell'],
                Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
                Managers: ['CocoaPods'],
                Languages: ['Ruby', 'Java'],
                IDEs: ['Xcode', 'Android Studio'],
                SDKs: ['iOS SDK', 'Android SDK'],
                npmPackages: ['react', 'react-native', '@react-native-community/cli', 'rnv'],
                npmGlobalPackages: ['*react-native*', 'rnv', 'lerna'],
            },
            { json: true, duplicates: false }
        );
        return JSON.parse(output);
    } catch (e) {
        logError(e);
    }
};
