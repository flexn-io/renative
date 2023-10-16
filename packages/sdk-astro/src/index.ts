import axios from 'axios';
import open from 'better-opn';
import path from 'path';
import {
    isPlatformActive,
    copyBuildsFolder,
    copyAssetsFolder,
    checkPortInUse,
    getConfigProp,
    confirmActiveBundler,
    getPlatformProjectDir,
    getDevServerHost,
    waitForHost,
    getAppFolder,
    chalk,
    logTask,
    logInfo,
    logWarning,
    logSuccess,
    logError,
    logSummary,
    generateEnvVars,
    getModuleConfigs,
    copyFileSync,
    fsExistsSync,
    RnvContext,
    RnvPlatform,
    executeAsync,
} from '@rnv/core';

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
                        return reject("Can't connect to astro. Try restarting it.");
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
                open(`http://${devServerHost}:${port}/`);
            })
            .catch((e) => {
                logWarning(e);
            });
        if (alreadyStarted) return wait; // if it's already started, return the promise so it rnv will wait, otherwise it will exit before opening the browser
        return resolve();
    });


export const _runWebDevServer = async (c: RnvContext) => {
    logTask('_runWebDevServer');
    const env: Record<string, any> = { ...generateEnvVars(c, getModuleConfigs(c)) };
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
    } catch (e: any) {
        // Do nothing
        logError(e);
    }
    await executeAsync(c, `astro dev --port ${c.runtime.port}`, { env });
    // await dev({
    //     root: c.paths.project.dir,
    //     server: {
    //         port: c.runtime.port,
    //     }
    // });
};

export const buildAstroProject = async (c: RnvContext) => {
    logTask('buildAstroProject');
    const env: Record<string, any> = { ...generateEnvVars(c, getModuleConfigs(c)) };
    Object.keys(env).forEach((v) => {
        process.env[v] = env[v];
    });

    process.env.PUBLIC_URL = getConfigProp(c, c.platform, 'publicUrl', '.');
    process.env.RNV_ENTRY_FILE = getConfigProp(c, c.platform, 'entryFile');
    process.env.PORT = String(c.runtime.port);
    if (c.runtime.webpackTarget) {
        process.env.WEBPACK_TARGET = c.runtime.webpackTarget;
    }
    process.env.RNV_EXTERNAL_PATHS = [c.paths.project.assets.dir, c.paths.project.dir].join(',');

    await executeAsync(c, `astro build --port ${c.runtime.port} --outDir ${getAppFolder(c)}`, { env });
    // await build({
    //     root: c.paths.project.dir,
    //     outDir: getAppFolder(c),
    //     mode: 'production',
    // });
};

export const configureCoreWebProject = async () => {
    logTask('configureCoreWebProject');
};

export const runAstroServer = async (c: RnvContext, enableRemoteDebugger?: boolean) => {
    const { port } = c.runtime;
    const { platform } = c;
    logTask('runWeb', `port:${port} debugger:${!!enableRemoteDebugger}`);

    let devServerHost = c.runtime.localhost;

    devServerHost = getDevServerHost(c);

    const isPortActive = await checkPortInUse(c, platform, port);
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    if (bundleAssets) {
        logSuccess('bundleAssets set to true. webpack dev server will not run');
        await buildAstroProject(c);
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
        await _runWebDevServer(c);
    } else {
        const resetCompleted = await confirmActiveBundler(c);

        if (resetCompleted) {
            await _runWebBrowser(c, platform, devServerHost, port, false);
            if (!bundleAssets) {
                logSummary('BUNDLER STARTED');
            }
            await _runWebDevServer(c);
        } else {
            await _runWebBrowser(c, platform, devServerHost, port, true);
        }
    }
};

export const waitForAstro = async (c: RnvContext) => {
    logTask('waitForAstro', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost(c);
    const url = `http://${devServerHost}:${c.runtime.port}`;

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

export const buildWeb = async (c: RnvContext) => buildAstroProject(c);

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
