
import axios from 'axios';
import open from 'better-opn';
import commandExists from 'command-exists';
import ip from 'ip';
import path from 'path';
import { Common, Constants, EngineManager, Exec, FileUtils, Logger, PlatformManager, PluginManager, ProjectManager, Resolver } from 'rnv';
// import { runServer } from './scripts/start';

const { isPlatformActive } = PlatformManager;
const { copyBuildsFolder, copyAssetsFolder } = ProjectManager;
const {
    getPlatformBuildDir,
    getAppVersion,
    checkPortInUse,
    getConfigProp,
    getTemplateProjectDir,
    getAppTitle,
    sanitizeColor,
    confirmActiveBundler,
    getTimestampPathsConfig,
    addSystemInjects,
    getPlatformProjectDir,
    getPlatformServerDir,
    getDevServerHost,
    waitForHost
} = Common;
const { doResolve, doResolvePath } = Resolver;
const {
    chalk,
    logTask,
    logInfo,
    logDebug,
    logWarning,
    logSuccess,
    logRaw,
    logError,
    logSummary
} = Logger;
const { fsExistsSync, readObjectSync, writeCleanFile, fsWriteFileSync, mkdirSync } = FileUtils;
const { getPlatformExtensions, generateEnvVars } = EngineManager;
const { getModuleConfigs } = PluginManager;
const { REMOTE_DEBUG_PORT, RNV_NODE_MODULES_DIR } = Constants;
const { executeAsync } = Exec;


const _generateWebpackConfigs = (c) => {
    logTask('_generateWebpackConfigs');
    // const { platform } = c;
    // const appFolder = getPlatformBuildDir(c);
    // const appFolderServer = getPlatformServerDir(c);
    // // const templateFolder = getAppTemplateFolder(c, platform);

    // let { modulePaths, moduleAliases } = getModuleConfigs(c);

    // // const env = getConfigProp(c, platform, 'environment');
    // const extendConfig = getConfigProp(c, platform, 'webpackConfig', {});
    // const entryFile = getConfigProp(c, platform, 'entryFile', 'index.web');
    // const title = getAppTitle(c, platform);
    // const analyzer = getConfigProp(c, platform, 'analyzer') || c.program.analyzer;

    // if (!fsExistsSync(appFolderServer)) {
    //     mkdirSync(appFolderServer);
    // }

    // // copyFileSync(
    // //     path.join(
    // //         templateFolder,
    // //         '_privateConfig',
    // //         env === 'production' ? 'webpack.config.js' : 'webpack.config.dev.js'
    // //     ),
    // //     path.join(appFolderServer, 'webpack.config.js')
    // // );

    // // const externalModulesResolved = externalModules.map(v => doResolve(v))
    // let assetVersion = '';
    // const versionedAssets = getConfigProp(c, platform, 'versionedAssets', false);
    // if (versionedAssets) {
    //     assetVersion = `-${getAppVersion(c, platform)}`;
    // }
    // const timestampAssets = getConfigProp(c, platform, 'timestampAssets', false);
    // if (timestampAssets) {
    //     assetVersion = `-${c.runtime.timestamp}`;
    // }

    // const bundleAssets = c.runtime.forceBundleAssets || getConfigProp(c, c.platform, 'bundleAssets', false);

    // const obj = {
    //     modulePaths,
    //     moduleAliases,
    //     analyzer,
    //     entryFile,
    //     title,
    //     assetVersion,
    //     buildFolder: bundleAssets ? getPlatformProjectDir(c) : getPlatformServerDir(c),
    //     extensions: getPlatformExtensions(c, true),
    //     ...extendConfig
    // };

    // const extendJs = `
    // module.exports = ${JSON.stringify(obj, null, 2)}`;

    // fsWriteFileSync(path.join(appFolder, 'webpack.extend.js'), extendJs);
};

// TODO: Legacy for backward compatibility, will be removed from webpack utils
const _parseCssSync = (c) => {
    logTask('_parseCssSync');

    // const templateProjectDir = getTemplateProjectDir(c);
    // const timestampPathsConfig = getTimestampPathsConfig(c, c.platform);
    // const backgroundColor = getConfigProp(c, c.platform, 'backgroundColor');

    // const bundleAssets = c.runtime.forceBundleAssets || getConfigProp(c, c.platform, 'bundleAssets', false);
    // const targetDir = bundleAssets ? getPlatformProjectDir(c) : getPlatformServerDir(c);

    // const injects = [
    //     {
    //         pattern: '{{PLUGIN_COLORS_BG}}',
    //         override: sanitizeColor(
    //             backgroundColor,
    //             'backgroundColor'
    //         ).hex
    //     }
    // ];

    // addSystemInjects(c, injects);
    // const cssPath = path.join(templateProjectDir, 'app.css');
    // if (fsExistsSync(cssPath)) {
    //     writeCleanFile(
    //         cssPath,
    //         path.join(targetDir, 'app.css'),
    //         injects,
    //         timestampPathsConfig, c
    //     );
    // }
};

export const waitForUrl = url => new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    const interval = setInterval(() => {
        axios.get(url)
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                attempts++;
                if (attempts > maxAttempts) {
                    clearInterval(interval);
                    // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                    return reject(
                        "Can't connect to webpack. Try restarting it."
                    );
                }
            });
    }, CHECK_INTEVAL);
});

const _runWebBrowser = (c, platform, devServerHost, port, alreadyStarted) => new Promise((resolve) => {
    logTask(
        '_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`
    );
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

        const resolvedDebugIp = debugIp || ip.address();
        logInfo(
            `Starting a remote debugger build with ip ${
                resolvedDebugIp}. If this IP is not correct, you can always override it with --debugIp`
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
        obj.debugVariables += `DEBUG=true DEBUG_IP=${
            resolvedDebugIp} DEBUG_CLIENT=chii DEBUG_SCRIPT="http://${resolvedDebugIp}:${REMOTE_DEBUG_PORT}/target.js"`;
        obj.lineBreaks = '\n';
    } catch (e) {
        logWarning(`You are missing chii. You can install via ${chalk().white('npm i -g chii')}) Trying to use weinre next`);
    }

    return true;
};

const _runRemoteDebuggerWeinre = async (c, obj) => {
    const { debugIp } = c.program;
    try {
        await commandExists('weinre');

        const resolvedDebugIp = debugIp || ip.address();
        logInfo(
            `Starting a remote debugger build with ip ${
                resolvedDebugIp}. If this IP is not correct, you can always override it with --debugIp`
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
        obj.debugVariables += `DEBUG=true DEBUG_IP=${
            resolvedDebugIp} DEBUG_CLIENT=weinre DEBUG_SCRIPT="http://${resolvedDebugIp}:${
            REMOTE_DEBUG_PORT}/target/target-script-min.js#${c.platform}}`;
        obj.lineBreaks = '\n';
    } catch (e) {
        logWarning(`You are missing weinre. Skipping debug. install via ${chalk().white('npm i -g weinre')}`);
    }
    return true;
};

export const _runWebDevServer = async (c, enableRemoteDebugger) => {
    logTask('_runWebDevServer');
    const env = { ...generateEnvVars(c, getModuleConfigs(c)) };
    Object.keys(env).forEach((v) => {
        process.env[v] = env[v];
    });
    process.env.PUBLIC_URL = '/';
    process.env.RNV_ENTRY_FILE = 'index';
    process.env.PORT = c.runtime.port;
    process.env.RNV_EXTERNAL_PATHS = [
        path.join(c.paths.project.assets.dir)
    ];

    // const debugObj = { lineBreaks: '\n\n\n', debugVariables: '', remoteDebuggerActive: false };
    // let debugOrder = [_runRemoteDebuggerChii, _runRemoteDebuggerWeinre];
    // if (debug === 'weinre') debugOrder = [_runRemoteDebuggerWeinre, _runRemoteDebuggerChii];
    // if ((debug || enableRemoteDebugger) && debug !== 'false') {
    //     await debugOrder[0](c, debugObj);
    //     if (!debugObj.remoteDebuggerActive) {
    //         await debugOrder[1](c, debugObj);
    //     }
    // }

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
    process.env.PUBLIC_URL = '/';
    process.env.RNV_ENTRY_FILE = 'index';
    process.env.PORT = c.runtime.port;
    process.env.RNV_EXTERNAL_PATHS = [
        path.join(c.paths.project.assets.dir)
    ];

    if (debug) {
        logInfo(
            `Starting a remote debugger build with ip ${debugIp
                    || ip.address()}. If this IP is not correct, you can always override it with --debugIp`
        );
        // debugVariables += `DEBUG=true DEBUG_IP=${debugIp || ip.address()}`;
    }

    const build = require('./scripts/build').default;
    await build();
};


export const configureCoreWebProject = async (c) => {
    logTask('configureCoreWebProject');
    _generateWebpackConfigs(c);
    _parseCssSync(c);
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
            `Your ${chalk().white(
                platform
            )} devServerHost ${chalk().white(
                devServerHost
            )} at port ${chalk().white(
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
                        return reject(
                            "Can't connect to webpack. Try restarting it."
                        );
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(
                            "Can't connect to webpack. Try restarting it."
                        );
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const buildWeb = async c => buildCoreWebpackProject(c);

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
