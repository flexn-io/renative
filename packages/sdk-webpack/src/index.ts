import axios from 'axios';
import path from 'path';
import commandExists from 'command-exists';
import {
    isPlatformActive,
    copyBuildsFolder,
    copyAssetsFolder,
    checkPortInUse,
    getConfigProp,
    confirmActiveBundler,
    getPlatformProjectDir,
    chalk,
    logTask,
    logInfo,
    logWarning,
    logSuccess,
    logRaw,
    logError,
    logSummary,
    executeAsync,
    copyFileSync,
    fsExistsSync,
    RnvContext,
    RnvPlatform,
    CoreEnvVars,
    Env,
} from '@rnv/core';
import { getDevServerHost, openBrowser, waitForHost } from '@rnv/sdk-utils';
import { EnvVars } from './env';
import { withRNVWebpack } from './adapter';
export { withRNVWebpack };

export const REMOTE_DEBUG_PORT = 8079;

export const waitForUrl = (url: string) =>
    new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 10;
        const CHECK_INTEVAL = 2000;
        const interval = setInterval(() => {
            axios
                .get(url)
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject("Can't connect to webpack. Try restarting it.");
                    }
                });
        }, CHECK_INTEVAL);
    });

const _runWebBrowser = (
    c: RnvContext,
    platform: RnvPlatform,
    devServerHost: string,
    port: number,
    alreadyStarted: boolean
) =>
    new Promise<void>((resolve) => {
        logTask('_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`);
        if (!c.runtime.shouldOpenBrowser) return resolve();
        const wait = waitForHost(c, '')
            .then(() => {
                openBrowser(`http://${devServerHost}:${port}/`);
            })
            .catch((e) => {
                logWarning(e);
            });
        if (alreadyStarted) return wait; // if it's already started, return the promise so it rnv will wait, otherwise it will exit before opening the browser
        return resolve();
    });

const _runRemoteDebuggerChii = async (c: RnvContext, obj: { remoteDebuggerActive: boolean }) => {
    const { debugIp } = c.program;
    try {
        await commandExists('chii');

        const resolvedDebugIp = debugIp || getDevServerHost(c);
        logInfo(
            `Starting a remote debugger build with ip ${resolvedDebugIp}. If this IP is not correct, you can always override it with --debugIp`
        );

        const debugUrl = chalk().cyan(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}`);

        const command = `chii start --port ${REMOTE_DEBUG_PORT}`;
        executeAsync(c, command, { stdio: 'inherit', silent: true });

        try {
            await waitForUrl(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}`);
            logRaw(`

Debugger running at: ${debugUrl}`);
            openBrowser(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/`);
        } catch (e) {
            logError(e);
        }
        obj.remoteDebuggerActive = true;

        process.env.RNV_INJECTED_WEBPACK_SCRIPTS = `${process.env.RNV_INJECTED_WEBPACK_SCRIPTS || ''}
        \n<script src="http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/target.js"></script>`;
    } catch (e) {
        logWarning(
            `You are missing chii. You can install via ${chalk().white('npm i -g chii')}) Trying to use weinre next`
        );
    }

    return true;
};

const _runRemoteDebuggerWeinre = async (c: RnvContext, obj: { remoteDebuggerActive: boolean }) => {
    const { debugIp } = c.program;
    try {
        await commandExists('weinre');

        const resolvedDebugIp = debugIp || getDevServerHost(c);
        logInfo(
            `Starting a remote debugger build with ip ${resolvedDebugIp}. If this IP is not correct, you can always override it with --debugIp`
        );

        const debugUrl = chalk().cyan(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/client/#${c.platform}`);

        const command = `weinre --boundHost -all- --httpPort ${REMOTE_DEBUG_PORT}`;
        executeAsync(c, command, { stdio: 'inherit', silent: true });

        try {
            await waitForUrl(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}`);
            logRaw(`

Debugger running at: ${debugUrl}`);
            openBrowser(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/client/#${c.platform}`);
        } catch (e) {
            logError(e);
        }
        obj.remoteDebuggerActive = true;
        process.env.RNV_INJECTED_WEBPACK_SCRIPTS = `${process.env.RNV_INJECTED_WEBPACK_SCRIPTS || ''}
        \n<script src="http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/target/target-script-min.js#${
            c.platform
        }"></script>`;
    } catch (e) {
        logWarning(`You are missing weinre. Skipping debug. install via ${chalk().white('npm i -g weinre')}`);
    }
    return true;
};

export const _runWebDevServer = async (c: RnvContext, enableRemoteDebugger?: boolean) => {
    logTask('_runWebDevServer');
    const { debug } = c.program;

    const env: Env = {
        ...CoreEnvVars.BASE(),
        ...CoreEnvVars.RNV_EXTENSIONS(),
        ...EnvVars.RNV_MODULE_CONFIGS(),
        ...EnvVars.PUBLIC_URL(),
        ...EnvVars.RNV_ENTRY_FILE(),
        ...EnvVars.PORT(),
        ...EnvVars.WEBPACK_TARGET(),
        ...EnvVars.RNV_EXTERNAL_PATHS(),
    };
    console.log(env, 'ENV');

    Object.keys(env).forEach((v) => {
        process.env[v] = env[v];
    });

    try {
        const reactDevUtilsPath = require.resolve('react-dev-utils/clearConsole');
        if (fsExistsSync(reactDevUtilsPath)) {
            copyFileSync(
                path.join(__dirname, '../nodeModuleOverrides/react-dev-utils/clearConsole.js'),
                reactDevUtilsPath
            );
        }
    } catch (e) {
        logError(e);
    }

    const debugObj = { remoteDebuggerActive: false };
    let debugOrder = [_runRemoteDebuggerChii, _runRemoteDebuggerWeinre];
    if (debug === 'weinre') debugOrder = [_runRemoteDebuggerWeinre, _runRemoteDebuggerChii];
    if ((debug || enableRemoteDebugger) && debug !== 'false') {
        await debugOrder[0](c, debugObj);
        if (!debugObj.remoteDebuggerActive) {
            await debugOrder[1](c, debugObj);
        }
    }

    const start = require('./scripts/start').default;
    // const start = require('react-scripts/scripts/start');
    await start();
};

export const buildCoreWebpackProject = async (c: RnvContext) => {
    const { debug, debugIp } = c.program;
    logTask('buildCoreWebpackProject');
    const env: Record<string, any> = {
        ...CoreEnvVars.BASE(),
        ...CoreEnvVars.RNV_EXTENSIONS(),
        ...EnvVars.RNV_MODULE_CONFIGS(),
        ...EnvVars.PUBLIC_URL(),
        ...EnvVars.RNV_ENTRY_FILE(),
        ...EnvVars.PORT(),
        ...EnvVars.WEBPACK_TARGET(),
        ...EnvVars.RNV_EXTERNAL_PATHS(),
    };
    Object.keys(env).forEach((v) => {
        process.env[v] = env[v];
    });

    if (debug) {
        logInfo(
            `Starting a remote debugger build with ip ${
                debugIp || getDevServerHost(c)
            }. If this IP is not correct, you can always override it with --debugIp`
        );
        // process.env.RNV_INJECTED_WEBPACK_SCRIPTS += `DEBUG_IP=${debugIp || ip.address()}`;
    }

    const build = require('./scripts/build').default;
    await build();
};

export const configureCoreWebProject = async () => {
    logTask('configureCoreWebProject');
};

export const runWebpackServer = async (c: RnvContext, enableRemoteDebugger?: boolean) => {
    const { port } = c.runtime;
    const { platform } = c;
    logTask('runWeb', `port:${port} debugger:${!!enableRemoteDebugger}`);

    let devServerHost = c.runtime.localhost;

    devServerHost = getDevServerHost(c);

    const isPortActive = await checkPortInUse(c, platform, port);
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    if (bundleAssets) {
        logSuccess('bundleAssets set to true. webpack dev server will not run');
        await buildCoreWebpackProject(c);
        return true;
    }

    if (!isPortActive) {
        logInfo(
            `Your ${chalk().white(platform)} devServerHost ${chalk().white(devServerHost)} at port ${chalk().white(
                port
            )} is not running. Starting it up for you...`
        );
        await _runWebBrowser(c, platform, devServerHost, port, false);
        if (!bundleAssets) {
            logSummary('BUNDLER STARTED');
        }
        await _runWebDevServer(c, enableRemoteDebugger);
    } else {
        const resetCompleted = await confirmActiveBundler(c);

        if (resetCompleted) {
            await _runWebBrowser(c, platform, devServerHost, port, false);
            if (!bundleAssets) {
                logSummary('BUNDLER STARTED');
            }
            await _runWebDevServer(c, enableRemoteDebugger);
        } else {
            await _runWebBrowser(c, platform, devServerHost, port, true);
        }
    }
};

export const waitForWebpack = async (c: RnvContext, suffix = 'assets/bundle.js') => {
    logTask('waitForWebpack', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost(c);
    const url = `http://${devServerHost}:${c.runtime.port}/${suffix}`;

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            axios
                .get(url)
                .then((res) => {
                    if (res.status === 200) {
                        clearInterval(interval);
                        // spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject("Can't connect to webpack. Try restarting it.");
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject("Can't connect to webpack. Try restarting it.");
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const buildWeb = async (c: RnvContext) => buildCoreWebpackProject(c);

export const configureWebProject = async (c: RnvContext) => {
    logTask('configureWebProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c) || undefined;

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject();

    return copyBuildsFolder(c, platform);
};

// CHROMECAST

export const configureChromecastProject = async (c: RnvContext) => {
    logTask(`configureChromecastProject:${c.platform}`);

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    await copyAssetsFolder(c, c.platform);
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder(c, c.platform);
};

const _configureProject = async (c: RnvContext) => {
    logTask(`_configureProject:${c.platform}`);
};

export const runChromecast = async (c: RnvContext) => {
    logTask(`runChromecast:${c.platform}`);
    await runWebpackServer(c);
};

export const deployWeb = () => {
    logTask('deployWeb');
    // const { platform } = c;

    // DEPRECATED: custom deployers moved to external packages
    // return selectWebToolAndDeploy(c, platform);

    return true;
};

export const exportWeb = () => {
    logTask('exportWeb');
    // const { platform } = c;

    // DEPRECATED: custom deployers moved to external packages
    // return selectWebToolAndExport(c, platform);
    return true;
};
