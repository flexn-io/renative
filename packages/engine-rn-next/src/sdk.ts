import path from 'path';
import {
    RnvContext,
    executeAsync,
    checkPortInUse,
    getConfigProp,
    confirmActiveBundler,
    getPlatformBuildDir,
    copyFolderContentsRecursiveSync,
    chalk,
    logTask,
    logInfo,
    logWarning,
    logRaw,
    logSummary,
    logSuccess,
    copyAssetsFolder,
    RnvPlatform,
    CoreEnvVars,
    ExecOptionsPresets,
} from '@rnv/core';
import { getDevServerHost, openBrowser, waitForHost } from '@rnv/sdk-utils';
import { EnvVars } from './env';

export const configureNextIfRequired = async (c: RnvContext) => {
    logTask('configureNextIfRequired');

    if (!c.platform) return;

    c.runtime.platformBuildsProjectPath = `${getPlatformBuildDir(c)}`;

    await copyAssetsFolder(c, c.platform);

    const destPath = path.join(c.paths.project.dir, 'public');

    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, `assets/${c.platform}`);
            copyFolderContentsRecursiveSync(sourcePath, destPath);
        });
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${c.platform}`);
        copyFolderContentsRecursiveSync(sourcePath, destPath);
    }
};

export const runWebNext = async (c: RnvContext) => {
    const { port } = c.runtime;
    logTask('runWebNext', `port:${port}`);
    const { platform } = c;

    if (!c.platform) return;

    const devServerHost = getDevServerHost(c);

    const isPortActive = await checkPortInUse(c, platform, port);
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

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
        await runWebDevServer(c);
    } else {
        const resetCompleted = await confirmActiveBundler(c);

        if (resetCompleted) {
            await _runWebBrowser(c, platform, devServerHost, port, false);
            if (!bundleAssets) {
                logSummary('BUNDLER STARTED');
            }
            await runWebDevServer(c);
        } else {
            await _runWebBrowser(c, platform, devServerHost, port, true);
        }
    }
};

const _runWebBrowser = (
    c: RnvContext,
    _platform: RnvPlatform,
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

const getOutputDir = (c: RnvContext) => {
    const distDir = getConfigProp(c, c.platform, 'outputDir');
    return distDir || `platformBuilds/${c.runtime.appId}_${c.platform}/.next`;
};

const getExportDir = (c: RnvContext) => {
    const outputDir = getConfigProp(c, c.platform, 'exportDir');
    return outputDir || path.join(getPlatformBuildDir(c)!, 'output');
};

export const buildWebNext = async (c: RnvContext) => {
    logTask('buildWebNext');

    await executeAsync(c, 'npx next build', {
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.RNV_NEXT_TRANSPILE_MODULES(),
            ...EnvVars.NEXT_BASE(),
        },
    });
    logSuccess(`Your build is located in ${chalk().cyan(getOutputDir(c))} .`);
    return true;
};

export const runWebDevServer = async (c: RnvContext) => {
    logTask('runWebDevServer');

    const devServerHost = getDevServerHost(c);

    const url = chalk().cyan(`http://${devServerHost}:${c.runtime.port}`);
    logRaw(`
Dev server running at: ${url}
`);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
    const opts = !c.program?.json
        ? ExecOptionsPresets.INHERIT_OUTPUT_NO_SPINNER
        : ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY;
    return executeAsync(c, `npx next ${bundleAssets ? 'start' : 'dev'} --port ${c.runtime.port}`, {
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.RNV_NEXT_TRANSPILE_MODULES(),
            ...EnvVars.NEXT_BASE(),
            ...EnvVars.NODE_ENV(),
        },
        ...opts,
    });
};

export const deployWebNext = () => {
    logTask('deployWebNext');
    // const { platform } = c;

    // DEPRECATED: custom deployers moved to external packages
    // return selectWebToolAndDeploy(c, platform);

    return true;
};

export const exportWebNext = async (c: RnvContext) => {
    logTask('exportWebNext');
    // const { platform } = c;

    logTask('_exportNext');
    const exportDir = getExportDir(c);

    await executeAsync(c, `npx next export --outdir ${exportDir}`, {
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.RNV_NEXT_TRANSPILE_MODULES(),
            ...EnvVars.NEXT_BASE(),
            ...EnvVars.NODE_ENV(),
        },
    });
    logSuccess(`Your export is located in ${chalk().cyan(exportDir)} .`);

    // DEPRECATED: custom deployers moved to external packages
    // await selectWebToolAndExport(c, platform);
    return true;
};
