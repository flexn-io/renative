import path from 'path';
import {
    RnvContext,
    executeAsync,
    getConfigProp,
    chalk,
    logDefault,
    logInfo,
    logWarning,
    logRaw,
    logSummary,
    logSuccess,
    copyAssetsFolder,
    CoreEnvVars,
    ExecOptionsPresets,
    getAppFolder,
    getContext,
} from '@rnv/core';
import { checkPortInUse, confirmActiveBundler, getDevServerHost, openBrowser, waitForHost } from '@rnv/sdk-utils';
import { EnvVars } from './env';

export const configureNextIfRequired = async () => {
    const c = getContext();
    logDefault('configureNextIfRequired');

    if (!c.platform) return;

    c.runtime.platformBuildsProjectPath = `${getAppFolder()}`;

    const destPath = path.join(c.paths.project.dir, 'public');
    await copyAssetsFolder(destPath);
};

export const runWebNext = async () => {
    const c = getContext();
    const { port } = c.runtime;
    logDefault('runWebNext', `port:${port}`);
    const { platform } = c;

    if (!c.platform) return;

    const devServerHost = getDevServerHost();

    const isPortActive = await checkPortInUse(port);
    const bundleAssets = getConfigProp('bundleAssets');

    if (!isPortActive) {
        logInfo(
            `Your ${chalk().bold(platform)} devServerHost ${chalk().bold(devServerHost)} at port ${chalk().bold(
                port
            )} is not running. Starting it up for you...`
        );
        await _runWebBrowser(devServerHost, port, false);

        if (!bundleAssets) {
            logSummary({ header: 'BUNDLER STARTED' });
        }
        await runWebDevServer(c);
    } else {
        const resetCompleted = await confirmActiveBundler();

        if (resetCompleted) {
            await _runWebBrowser(devServerHost, port, false);
            if (!bundleAssets) {
                logSummary({ header: 'BUNDLER STARTED' });
            }
            await runWebDevServer(c);
        } else {
            await _runWebBrowser(devServerHost, port, true);
        }
    }
};

const _runWebBrowser = (devServerHost: string, port: number, alreadyStarted: boolean) =>
    new Promise<void>((resolve) => {
        const c = getContext();
        logDefault('_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`);
        if (!c.runtime.shouldOpenBrowser) return resolve();
        const wait = waitForHost('', { maxAttempts: 10, checkInterval: 1000 })
            .then(() => {
                openBrowser(`http://${devServerHost}:${port}/`);
            })
            .catch((e) => {
                // Let's opent the browser anyway as sometimes we get timeout waiting for next to compile
                openBrowser(`http://${devServerHost}:${port}/`);
                logWarning(e);
            });
        if (alreadyStarted) return wait; // if it's already started, return the promise so it rnv will wait, otherwise it will exit before opening the browser
        return resolve();
    });

export const getExportDir = (c: RnvContext) => {
    const exportDir = getConfigProp('exportDir');
    const maybeAbsolutePath = exportDir || path.join(getAppFolder()!, 'output');

    // if path is absolute, make it relative to project root. Next 14 doesn't seem to like absolute paths
    if (path.isAbsolute(maybeAbsolutePath)) {
        return path.relative(c.paths.project.dir, maybeAbsolutePath);
    }
    return maybeAbsolutePath;
};

export const buildWebNext = async () => {
    const c = getContext();
    logDefault('buildWebNext');

    await executeAsync('npx next build', {
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

    const devServerHost = getDevServerHost();

    const url = chalk().cyan(`http://${devServerHost}:${c.runtime.port}`);
    logRaw(`
Dev server running at: ${url}
`);

    const bundleAssets = getConfigProp('bundleAssets');
    const opts = !c.program?.opts()?.json
        ? ExecOptionsPresets.INHERIT_OUTPUT_NO_SPINNER
        : ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY;
    return executeAsync(`npx next ${bundleAssets ? 'start' : 'dev'} --port ${c.runtime.port}`, {
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

export const exportWebNext = async () => {
    const c = getContext();
    logDefault('exportWebNext');

    const exportDir = getExportDir(c);

    await executeAsync(`npx next build`, {
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
