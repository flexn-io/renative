import path from 'path';
import commandExists from 'command-exists';
import {
    isPlatformActive,
    copyBuildsFolder,
    copyAssetsFolder,
    getConfigProp,
    getPlatformProjectDir,
    chalk,
    logDefault,
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
    CoreEnvVars,
    Env,
    getContext,
    getAppFolder,
} from '@rnv/core';
import {
    checkPortInUse,
    getDevServerHost,
    openBrowser,
    waitForHost,
    confirmActiveBundler,
    axios,
} from '@rnv/sdk-utils';
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

const _runWebBrowser = (devServerHost: string, port: number, alreadyStarted: boolean) =>
    new Promise<void>((resolve) => {
        const c = getContext();
        logDefault('_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`);
        if (!c.runtime.shouldOpenBrowser) return resolve();
        const wait = waitForHost('')
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
    const { debugIp } = c.program.opts();
    try {
        await commandExists('chii');

        const resolvedDebugIp = debugIp || getDevServerHost();
        logInfo(
            `Starting a remote debugger build with ip ${resolvedDebugIp}. If this IP is not correct, you can always override it with --debugIp`
        );

        const debugUrl = chalk().cyan(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}`);

        const command = `chii start --port ${REMOTE_DEBUG_PORT}`;
        executeAsync(command, { stdio: 'inherit', silent: true });

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
            `You are missing chii. You can install via ${chalk().bold.white.white(
                'npm i -g chii'
            )}) Trying to use weinre next`
        );
    }

    return true;
};

const _runRemoteDebuggerWeinre = async (c: RnvContext, obj: { remoteDebuggerActive: boolean }) => {
    const { debugIp } = c.program.opts();
    try {
        await commandExists('weinre');

        const resolvedDebugIp = debugIp || getDevServerHost();
        logInfo(
            `Starting a remote debugger build with ip ${resolvedDebugIp}. If this IP is not correct, you can always override it with --debugIp`
        );

        const debugUrl = chalk().cyan(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/client/#${c.platform}`);

        const command = `weinre --boundHost -all- --httpPort ${REMOTE_DEBUG_PORT}`;
        executeAsync(command, { stdio: 'inherit', silent: true });

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
        logWarning(`You are missing weinre. Skipping debug. install via ${chalk().bold.white('npm i -g weinre')}`);
    }
    return true;
};

export const _runWebDevServer = async (c: RnvContext, enableRemoteDebugger?: boolean) => {
    logDefault('_runWebDevServer');
    const { debug } = c.program.opts();

    const env: Env = {
        ...CoreEnvVars.BASE(),
        ...CoreEnvVars.RNV_EXTENSIONS(),
        ...EnvVars.RNV_MODULE_CONFIGS(),
        ...EnvVars.PUBLIC_URL(),
        ...EnvVars.RNV_ENTRY_FILE(),
        ...EnvVars.PORT(),
        ...EnvVars.WEBPACK_TARGET(),
        ...EnvVars.RNV_EXTERNAL_PATHS(),
        ...EnvVars.WEBPACK_EXCLUDED_PATHS(),
    };

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
    await start();
};

export const buildCoreWebpackProject = async () => {
    const c = getContext();
    const { debug, debugIp } = c.program.opts();
    logDefault('buildCoreWebpackProject');
    const env: Env = {
        ...CoreEnvVars.BASE(),
        ...CoreEnvVars.RNV_EXTENSIONS(),
        ...EnvVars.RNV_MODULE_CONFIGS(),
        ...EnvVars.PUBLIC_URL(),
        ...EnvVars.RNV_ENTRY_FILE(),
        ...EnvVars.PORT(),
        ...EnvVars.WEBPACK_TARGET(),
        ...EnvVars.RNV_EXTERNAL_PATHS(),
        ...EnvVars.WEBPACK_EXCLUDED_PATHS(),
    };
    Object.keys(env).forEach((v) => {
        process.env[v] = env[v];
    });

    if (debug) {
        logInfo(
            `Starting a remote debugger build with ip ${
                debugIp || getDevServerHost()
            }. If this IP is not correct, you can always override it with --debugIp`
        );
        // process.env.RNV_INJECTED_WEBPACK_SCRIPTS += `DEBUG_IP=${debugIp || ip.address()}`;
    }

    const build = require('./scripts/build').default;
    await build();
};

export const configureCoreWebProject = async () => {
    logDefault('configureCoreWebProject');
};

export const runWebpackServer = async (enableRemoteDebugger?: boolean) => {
    const c = getContext();
    const { port } = c.runtime;
    const { platform } = c;
    logDefault('runWeb', `port:${port} debugger:${!!enableRemoteDebugger}`);

    let devServerHost = c.runtime.localhost;

    devServerHost = getDevServerHost();

    const isPortActive = await checkPortInUse(port);
    const bundleAssets = getConfigProp('bundleAssets');

    if (bundleAssets) {
        logSuccess('bundleAssets set to true. webpack dev server will not run');
        await buildCoreWebpackProject();
        return true;
    }

    if (!isPortActive) {
        logInfo(
            `Your ${chalk().bold.white(platform)} devServerHost ${chalk().bold.white(
                devServerHost
            )} at port ${chalk().bold.white(port)} is not running. Starting it up for you...`
        );
        await _runWebBrowser(devServerHost, port, false);
        if (!bundleAssets) {
            logSummary({ header: 'BUNDLER STARTED' });
        }
        await _runWebDevServer(c, enableRemoteDebugger);
    } else {
        const resetCompleted = await confirmActiveBundler();

        if (resetCompleted) {
            await _runWebBrowser(devServerHost, port, false);
            if (!bundleAssets) {
                logSummary({ header: 'BUNDLER STARTED' });
            }
            await _runWebDevServer(c, enableRemoteDebugger);
        } else {
            await _runWebBrowser(devServerHost, port, true);
        }
    }
};

export const waitForWebpack = async (suffix = 'assets/bundle.js') => {
    const c = getContext();
    logDefault('waitForWebpack', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost();
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

export const buildWeb = async () => {
    logDefault('buildWebProject');

    const appFolder = getAppFolder();
    await buildCoreWebpackProject();
    logSuccess(`Your build is located in  ${chalk().cyan(path.join(appFolder, `build`))} .`);
};

export const configureWebProject = async () => {
    const c = getContext();
    logDefault('configureWebProject');

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir() || undefined;

    if (!isPlatformActive()) return;

    await copyAssetsFolder();
    await configureCoreWebProject();

    return copyBuildsFolder();
};

// CHROMECAST

export const configureChromecastProject = async () => {
    const c = getContext();
    logDefault(`configureChromecastProject:${c.platform}`);

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir()}`;

    await copyAssetsFolder();
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder();
};

const _configureProject = async (c: RnvContext) => {
    logDefault(`_configureProject:${c.platform}`);
};

export const runChromecast = async (c: RnvContext) => {
    logDefault(`runChromecast:${c.platform}`);
    await runWebpackServer();
};
