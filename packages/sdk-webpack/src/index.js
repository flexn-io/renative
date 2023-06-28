/* eslint-disable global-require */

import axios from 'axios';
import open from 'better-opn';
import path from 'path';
import commandExists from 'command-exists';
import {
    Common,
    Constants,
    EngineManager,
    Exec,
    Logger,
    PlatformManager,
    PluginManager,
    ProjectManager,
    FileUtils,
} from 'rnv';
// import { fsExistsSync, fsWriteFileSync } from 'rnv/dist/core/systemManager/fileutils';
// import { runServer } from './scripts/start';

const { isPlatformActive } = PlatformManager;
const { copyBuildsFolder, copyAssetsFolder } = ProjectManager;
const { checkPortInUse, getConfigProp, confirmActiveBundler, getPlatformProjectDir, getDevServerHost, waitForHost } =
    Common;
const { chalk, logTask, logInfo, logWarning, logSuccess, logRaw, logError, logSummary } = Logger;
const { generateEnvVars } = EngineManager;
const { getModuleConfigs } = PluginManager;
const { REMOTE_DEBUG_PORT } = Constants;
const { executeAsync } = Exec;
const { copyFileSync, fsExistsSync } = FileUtils;

export const waitForUrl = (url) =>
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

const _runWebBrowser = (c, platform, devServerHost, port, alreadyStarted) =>
    new Promise((resolve) => {
        logTask('_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`);
        if (!c.runtime.shouldOpenBrowser) return resolve();
        const wait = waitForHost(c, '')
            .then(() => {
                open(`http://${devServerHost}:${port}/`);
            })
            .catch((e) => {
                logWarning(e);
            });
        if (alreadyStarted) return wait; // if it's already started, return the promise so it rnv will wait, otherwise it will exit before opening the browser
        return resolve();
    });

const _runRemoteDebuggerChii = async (c, obj) => {
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
            open(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/`);
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

const _runRemoteDebuggerWeinre = async (c, obj) => {
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
            open(`http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/client/#${c.platform}`);
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

export const _runWebDevServer = async (c, enableRemoteDebugger) => {
    logTask('_runWebDevServer');
    const { debug } = c.program;
    const env = { ...generateEnvVars(c, getModuleConfigs(c)) };
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
        // Do nothing
        logError(e);
    }

    process.env.PUBLIC_URL = getConfigProp(c, c.platform, 'publicUrl', '.');
    process.env.RNV_ENTRY_FILE = getConfigProp(c, c.platform, 'entryFile');
    process.env.PORT = c.runtime.port;
    if (c.runtime.webpackTarget) {
        process.env.WEBPACK_TARGET = c.runtime.webpackTarget;
    }
    process.env.RNV_EXTERNAL_PATHS = [c.paths.project.assets.dir, c.paths.project.dir].join(',');

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

export const buildCoreWebpackProject = async (c) => {
    const { debug, debugIp } = c.program;
    logTask('buildCoreWebpackProject');
    const env = { ...generateEnvVars(c, getModuleConfigs(c)) };
    Object.keys(env).forEach((v) => {
        process.env[v] = env[v];
    });

    process.env.PUBLIC_URL = getConfigProp(c, c.platform, 'publicUrl', '.');
    process.env.RNV_ENTRY_FILE = getConfigProp(c, c.platform, 'entryFile');
    process.env.PORT = c.runtime.port;
    if (c.runtime.webpackTarget) {
        process.env.WEBPACK_TARGET = c.runtime.webpackTarget;
    }
    process.env.RNV_EXTERNAL_PATHS = [c.paths.project.assets.dir, c.paths.project.dir].join(',');

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

export const runWebpackServer = async (c, enableRemoteDebugger) => {
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

export const waitForWebpack = async (c, suffix = 'assets/bundle.js') => {
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

export const buildWeb = async (c) => buildCoreWebpackProject(c);

export const configureWebProject = async (c) => {
    logTask('configureWebProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c);

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c);

    return copyBuildsFolder(c, platform);
};

// CHROMECAST

export const configureChromecastProject = async (c) => {
    logTask(`configureChromecastProject:${c.platform}`);

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    await copyAssetsFolder(c, c.platform);
    await configureCoreWebProject(c);
    await _configureProject(c);
    return copyBuildsFolder(c, c.platform);
};

const _configureProject = async (c) => {
    logTask(`_configureProject:${c.platform}`);
};

export const runChromecast = async (c) => {
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
