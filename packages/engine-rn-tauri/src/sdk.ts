import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import {
    RnvContext,
    getEngineRunnerByPlatform,
    isPlatformActive,
    executeAsync,
    fsExistsSync,
    mkdirSync,
    writeFileSync,
    readObjectSync,
    writeCleanFile,
    copyFileSync,
    getPlatformProjectDir,
    getPlatformBuildDir,
    getAppVersion,
    getAppTitle,
    getAppId,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects,
    chalk,
    logTask,
    logError,
    logWarning,
    logSuccess,
    logInfo,
    copyBuildsFolder,
    copyAssetsFolder,
    MACOS,
    LINUX,
    TASK_EXPORT,
    ExecOptionsPresets,
} from '@rnv/core';
import { NpmPackageFile } from '@rnv/core/lib/configs/types';
import { waitForHost } from '@rnv/sdk-utils';

export const configureTauriProject = async (c: RnvContext) => {
    logTask('configureTauriProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;
    // c.runtime.webpackTarget = 'electron-main';

    // If path does not exist for png, try iconset
    const iconsetPath = path.join(c.paths.appConfig.dir, `assets/${platform}/resources/AppIcon.iconset`);

    await copyAssetsFolder(
        c,
        platform,
        undefined,
        (platform === MACOS || platform === LINUX) && fsExistsSync(iconsetPath) ? _generateICNS : undefined
    );

    await configureCoreWebProject();

    await configureProject(c);
    return copyBuildsFolder(c, platform);
};
const merge = require('deepmerge');

const configureProject = async (c: RnvContext) => {
    logTask('configureProject');
    const { platform } = c;

    if (!isPlatformActive(c, platform)) return;

    const platformProjectDir = getPlatformProjectDir(c)!;
    const engine = getEngineRunnerByPlatform(c, c.platform);

    if (!engine || !platform) return;

    const platformBuildDir = getPlatformBuildDir(c)!;
    // If path does not exist for png, try iconset
    const tauriSrc = path.join(platformBuildDir, 'src-tauri');
    const configFile = path.join(tauriSrc, 'tauri.conf.json');

    console.log('c.runtime', c.runtime);

    const injects = [
        {
            pattern: '{{INJECT_APP_ID}}',
            override: c.runtime.appId,
        },
        {
            pattern: '{{INJECT_PRODUCT_NAME}}',
            override: getAppTitle(c, platform),
        },
        {
            pattern: '{{INJECT_VERSION}}',
            override: getAppVersion(c, platform),
        },
    ];
    writeCleanFile(configFile, configFile, injects);

    const macConfig: {
        mac?: Record<string, string | boolean>;
        mas?: Record<string, string | boolean>;
    } = {};
    if (platform === MACOS) {
        macConfig.mac = {
            entitlements: path.join(platformProjectDir, 'entitlements.mac.plist'),
            entitlementsInherit: path.join(platformProjectDir, 'entitlements.mac.plist'),
            hardenedRuntime: true,
        };
        macConfig.mas = {
            entitlements: path.join(platformProjectDir, 'entitlements.mas.plist'),
            entitlementsInherit: path.join(platformProjectDir, 'entitlements.mas.inherit.plist'),
            provisioningProfile: path.join(platformProjectDir, 'embedded.provisionprofile'),
            hardenedRuntime: false,
        };
    }
};

const buildElectron = async (c: RnvContext) => {
    logTask('buildElectron');

    await buildCoreWebpackProject(c);
    // Webpack 5 deletes build folder but does not copy package json

    const platformBuildDir = getPlatformBuildDir(c)!;

    // workaround: electron-builder fails export in npx mode due to trying install node_modules. we trick it not to do that
    mkdirSync(path.join(platformBuildDir, 'build', 'node_modules'));

    const packagePathSrc = path.join(platformBuildDir, 'package.json');
    const packagePathDest = path.join(platformBuildDir, 'build', 'package.json');
    copyFileSync(packagePathSrc, packagePathDest);

    const mainPathSrc = path.join(platformBuildDir, 'main.js');
    const mainPathDest = path.join(platformBuildDir, 'build', 'main.js');
    copyFileSync(mainPathSrc, mainPathDest);

    const menuPathSrc = path.join(platformBuildDir, 'contextMenu.js');
    const menuPathDest = path.join(platformBuildDir, 'build', 'contextMenu.js');
    copyFileSync(menuPathSrc, menuPathDest);

    if (c.command !== TASK_EXPORT) {
        logSuccess(`Your Build is located in ${chalk().cyan(path.join(platformBuildDir, 'build'))} .`);
    }

    return true;
};

const exportTauri = async (c: RnvContext) => {
    logTask('exportTauri');

    const platformBuildDir = getPlatformBuildDir(c)!;

    // before we export we need to take all the app files out of gitignore
    // see https://github.com/tauri-apps/tauri/issues/3527#issuecomment-1046846533, https://github.com/tauri-apps/tauri/issues/7427
    // TODO

    const gitIgnorePath = path.join(platformBuildDir, '.gitignore');
    const cmd = `npx @tauri-apps/cli build`;
    await executeAsync(c, cmd, { cwd: platformBuildDir, ...ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY });

    logSuccess(`Your Exported App is located in ${chalk().cyan(path.join(platformBuildDir, 'export'))} .`);
};

export const runTauri = async (c: RnvContext) => {
    logTask('runElectron');

    const { platform } = c;
    const { port } = c.runtime;

    // const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        await buildElectron(c);
        await _runTauri(c);
    } else {
        const isPortActive = await checkPortInUse(c, platform, port);
        if (!isPortActive) {
            logInfo(
                `Your ${chalk().white(platform)} devServer at port ${chalk().white(
                    port
                )} is not running. Starting it up for you...`
            );
            waitForHost(c, '')
                .then(() => _runTauri(c))
                .catch(logError);
            // await _runTauri(c);
            await runWebpackServer(c);
        } else {
            const resetCompleted = await confirmActiveBundler(c);
            if (resetCompleted) {
                waitForHost(c, '')
                    .then(() => _runTauri(c))
                    .catch(logError);
                // await _runTauri(c);
                await runWebpackServer(c);
            } else {
                await _runTauri(c);
            }
        }
    }
};

const _runTauri = async (c: RnvContext) => {
    logTask(`_runTauri:${c.platform}`);
    const platformProjectDir = getPlatformProjectDir(c)!;

    const cmd = `npx @tauri-apps/cli dev`;
    await executeAsync(c, cmd, { cwd: platformProjectDir, ...ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY });
};

const _generateICNS = (c: RnvContext) =>
    new Promise<void>((resolve, reject) => {
        logTask('_generateICNS');
        const { platform } = c;

        let source;

        if (c.paths.appConfig.dirs) {
            c.paths.appConfig.dirs.forEach((v) => {
                const pf = path.join(v, `assets/${platform}/AppIcon.iconset`);
                if (fsExistsSync(pf)) {
                    source = pf;
                }
            });
        } else if (c.paths.appConfig.dir) {
            source = path.join(c.paths.appConfig.dir, `assets/${platform}/AppIcon.iconset`);
        }

        const dest = path.join(getPlatformProjectDir(c)!, 'resources/icon.icns');

        // It's ok if icns are not generated as png is also valid https://www.electron.build/icons.html#macos
        if (!source) {
            logWarning(
                `You are missing AppIcon.iconset in ${chalk().white(
                    c.paths.appConfig.dir
                )}. icon.icns will not be generated!`
            );
            resolve();
            return;
        }

        if (!fsExistsSync(source)) {
            logWarning(`Your app config is missing ${chalk().white(source)}. icon.icns will not be generated!`);
            resolve();
            return;
        }

        mkdirSync(path.join(getPlatformProjectDir(c)!, 'resources'));

        const p = ['--convert', 'icns', source, '--output', dest];
        try {
            executeAsync(c, `iconutil ${p.join(' ')}`);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

export { buildElectron, exportTauri };
