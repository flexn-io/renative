import path from 'path';
import {
    RnvContext,
    executeAsync,
    getConfigProp,
    copyFolderContentsRecursiveSync,
    chalk,
    logDefault,
    logInfo,
    logWarning,
    logRaw,
    logSummary,
    logSuccess,
    copyAssetsFolder,
    RnvPlatform,
    CoreEnvVars,
    ExecOptionsPresets,
    getAppFolder,
} from '@rnv/core';
import { checkPortInUse, confirmActiveBundler, getDevServerHost, openBrowser, waitForHost } from '@rnv/sdk-utils';
import { EnvVars } from './env';

export const configureNextIfRequired = async (c: RnvContext) => {
    logDefault('configureNextIfRequired');

    if (!c.platform) return;

    c.runtime.platformBuildsProjectPath = `${getAppFolder(c)}`;

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
    logDefault('runWebNext', `port:${port}`);
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
        logDefault('_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`);
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

export const getExportDir = (c: RnvContext) => {
    const exportDir = getConfigProp(c, c.platform, 'exportDir');
    const maybeAbsolutePath = exportDir || path.join(getAppFolder(c)!, 'output');

    // if path is absolute, make it relative to project root. Next 14 doesn't seem to like absolute paths
    if (path.isAbsolute(maybeAbsolutePath)) {
        return path.relative(c.paths.project.dir, maybeAbsolutePath);
    }
    return maybeAbsolutePath;
};

export const buildWebNext = async (c: RnvContext) => {
    logDefault('buildWebNext');

    await executeAsync(c, 'npx next build', {
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.RNV_NEXT_TRANSPILE_MODULES(),
            ...EnvVars.NEXT_BASE(),
        },
    });
    logSuccess(`Your build is located in ${chalk().cyan(getExportDir(c))} .`);
    return true;
};

export const runWebDevServer = async (c: RnvContext) => {
    logDefault('runWebDevServer');

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

export const exportWebNext = async (c: RnvContext) => {
    logDefault('exportWebNext');

    const exportDir = getExportDir(c);

    await executeAsync(c, `npx next build`, {
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.RNV_NEXT_TRANSPILE_MODULES(),
            ...EnvVars.NEXT_BASE(),
            // building next fails if NODE_ENV is not set to production https://github.com/vercel/next.js/issues/52158
            NODE_ENV: 'production',
        },
    });
    logSuccess(`Your export is located in ${chalk().cyan(exportDir)} .`);

    return true;
};
