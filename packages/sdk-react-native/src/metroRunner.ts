import {
    CoreEnvVars,
    PlatformKey,
    chalk,
    executeAsync,
    logError,
    logErrorPlatform,
    logInfo,
    logRaw,
    logDefault,
    getContext,
} from '@rnv/core';
import { isBundlerActive } from './common';
import { EnvVars } from './env';
import { confirmActiveBundler, getEntryFile } from '@rnv/sdk-utils';

const BUNDLER_PLATFORMS: Partial<Record<PlatformKey, PlatformKey>> = {};

BUNDLER_PLATFORMS['ios'] = 'ios';
BUNDLER_PLATFORMS['macos'] = 'ios';
BUNDLER_PLATFORMS['android'] = 'android';
BUNDLER_PLATFORMS['androidtv'] = 'android';
BUNDLER_PLATFORMS['firetv'] = 'android';
BUNDLER_PLATFORMS['androidwear'] = 'android';

export const startReactNative = async (opts: {
    waitForBundler?: boolean;
    customCliPath?: string;
    metroConfigName?: string;
}) => {
    const c = getContext();
    logDefault('startReactNative');

    if (!c.platform) {
        logErrorPlatform();
        return false;
    }

    const { waitForBundler, customCliPath, metroConfigName } = opts;

    let startCmd = '';

    if (customCliPath) {
        startCmd = `node ${customCliPath} start`;
    } else {
        startCmd = `npx react-native start`;
    }

    startCmd += ` --port ${c.runtime.port}`;

    startCmd += ` --no-interactive`;

    if (metroConfigName) {
        startCmd += ` --config=${metroConfigName}`;
    }

    if (c.program.resetHard || c.program.reset) {
        startCmd += ' --reset-cache';
    }

    if (c.program.resetHard || c.program.reset) {
        logInfo(`You passed ${chalk().bold('-r')} argument. --reset-cache will be applied to react-native`);
    }
    // logSummary('BUNDLER STARTED');
    const url = chalk().cyan(
        `http://${c.runtime.localhost}:${c.runtime.port}/${getEntryFile()}.bundle?platform=${
            BUNDLER_PLATFORMS[c.platform]
        }`
    );
    logRaw(`
Dev server running at: ${url}
`);
    if (waitForBundler) {
        const isRunning = await isBundlerActive();
        let resetCompleted = false;
        if (isRunning) {
            resetCompleted = await confirmActiveBundler();
        }

        if (!isRunning || (isRunning && resetCompleted)) {
            return executeAsync(startCmd, {
                stdio: 'inherit',
                silent: true,
                env: {
                    ...CoreEnvVars.BASE(),
                    ...CoreEnvVars.RNV_EXTENSIONS(),
                    ...EnvVars.RNV_REACT_NATIVE_PATH(),
                    ...EnvVars.RNV_APP_ID(),
                    ...EnvVars.RCT_NO_LAUNCH_PACKAGER(),
                },
            });
        }
        if (resetCompleted) {
            return executeAsync(startCmd, {
                stdio: 'inherit',
                silent: true,
                env: {
                    ...CoreEnvVars.BASE(),
                    ...CoreEnvVars.RNV_EXTENSIONS(),
                    ...EnvVars.RNV_REACT_NATIVE_PATH(),
                    ...EnvVars.RNV_APP_ID(),
                },
            });
        }

        return true;
    }
    executeAsync(startCmd, {
        stdio: 'inherit',
        silent: true,
        env: {
            ...CoreEnvVars.BASE(),
            ...EnvVars.RNV_REACT_NATIVE_PATH(),
            ...EnvVars.RNV_APP_ID(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
        },
    }).catch((e) => logError(e));
    return true;
};
