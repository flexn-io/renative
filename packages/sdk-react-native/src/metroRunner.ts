import {
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    CoreEnvVars,
    FIRE_TV,
    IOS,
    MACOS,
    RnvContext,
    chalk,
    confirmActiveBundler,
    executeAsync,
    getEntryFile,
    logError,
    logErrorPlatform,
    logInfo,
    logRaw,
    logTask,
} from '@rnv/core';
import { isBundlerActive } from './common';
import { EnvVars, printableEnvKeys } from './env';

const BUNDLER_PLATFORMS: Record<string, string> = {};

BUNDLER_PLATFORMS[IOS] = IOS;
BUNDLER_PLATFORMS[MACOS] = IOS;
BUNDLER_PLATFORMS[ANDROID] = ANDROID;
BUNDLER_PLATFORMS[ANDROID_TV] = ANDROID;
BUNDLER_PLATFORMS[FIRE_TV] = ANDROID;
BUNDLER_PLATFORMS[ANDROID_WEAR] = ANDROID;

export const startReactNative = async (
    c: RnvContext,
    opts: { waitForBundler?: boolean; customCliPath?: string; metroConfigName?: string }
) => {
    logTask('startReactNative');

    if (!c.platform) {
        logErrorPlatform(c);
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
        logInfo(`You passed ${chalk().white('-r')} argument. --reset-cache will be applied to react-native`);
    }
    // logSummary('BUNDLER STARTED');
    const url = chalk().cyan(
        `http://${c.runtime.localhost}:${c.runtime.port}/${getEntryFile(c, c.platform)}.bundle?platform=${
            BUNDLER_PLATFORMS[c.platform]
        }`
    );
    logRaw(`

Dev server running at: ${url}

`);
    if (waitForBundler) {
        const isRunning = await isBundlerActive(c);
        let resetCompleted = false;
        if (isRunning) {
            resetCompleted = await confirmActiveBundler(c);
        }

        if (!isRunning || (isRunning && resetCompleted)) {
            return executeAsync(c, startCmd, {
                stdio: 'inherit',
                silent: true,
                env: { ...CoreEnvVars.BASE(), ...CoreEnvVars.RNV_EXTENSIONS(), ...EnvVars.RCT_NO_LAUNCH_PACKAGER() },
                printableEnvKeys,
            });
        }
        if (resetCompleted) {
            return executeAsync(c, startCmd, {
                stdio: 'inherit',
                silent: true,
                env: { ...CoreEnvVars.BASE(), ...CoreEnvVars.RNV_EXTENSIONS() },
                printableEnvKeys,
            });
        }

        return true;
    }
    executeAsync(c, startCmd, {
        stdio: 'inherit',
        silent: true,
        env: { ...CoreEnvVars.BASE(), ...CoreEnvVars.RNV_EXTENSIONS() },
        printableEnvKeys,
    }).catch((e) => logError(e, true));
    return true;
};
