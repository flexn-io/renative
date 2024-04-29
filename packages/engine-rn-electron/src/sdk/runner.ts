import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import {
    RnvContext,
    getEngineRunnerByPlatform,
    createPlatformBuild,
    isPlatformActive,
    executeAsync,
    fsExistsSync,
    mkdirSync,
    writeFileSync,
    readObjectSync,
    removeDirs,
    writeCleanFile,
    copyFileSync,
    getPlatformProjectDir,
    getConfigProp,
    doResolve,
    chalk,
    logDefault,
    logError,
    logWarning,
    logSuccess,
    logInfo,
    copyBuildsFolder,
    copyAssetsFolder,
    ExecOptionsPresets,
    getAppFolder,
    RnvTaskName,
    getContext,
    NpmPackageFile,
    RnvFileName,
} from '@rnv/core';
import { FileElectronPackage } from './types';
import {
    checkPortInUse,
    waitForHost,
    getAppVersion,
    getAppTitle,
    getAppId,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    confirmActiveBundler,
    addSystemInjects,
} from '@rnv/sdk-utils';

export const configureElectronProject = async (exitOnFail?: boolean) => {
    const c = getContext();
    logDefault('configureElectronProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir()}`;
    c.runtime.webpackTarget = 'electron-main';

    // If path does not exist for png, try iconset
    const iconsetPath = path.join(c.paths.appConfig.dir, `assets/${platform}/resources/AppIcon.iconset`);

    await copyAssetsFolder(
        undefined,
        (platform === 'macos' || platform === 'linux') && fsExistsSync(iconsetPath) ? _generateICNS : undefined
    );

    await configureCoreWebProject();

    await configureProject(exitOnFail);
    return copyBuildsFolder();
};
const merge = require('deepmerge');

const configureProject = (exitOnFail?: boolean) =>
    new Promise<void>((resolve, reject) => {
        const c = getContext();
        logDefault('configureProject');
        const { platform } = c;

        if (!isPlatformActive(resolve)) return;

        const platformProjectDir = getPlatformProjectDir()!;
        const engine = getEngineRunnerByPlatform(c.platform);

        if (!engine || !platform) return;

        const platformBuildDir = getAppFolder()!;
        const bundleAssets = getConfigProp('bundleAssets') === true;
        const electronConfigPath = path.join(platformBuildDir, 'electronConfig.json');
        const packagePath = path.join(platformBuildDir, RnvFileName.package);
        // If path does not exist for png, try iconset
        const pngIconPath = path.join(c.paths.appConfig.dir, `assets/${platform}/resources/icon.png`);
        const appId = getAppId();

        if (!fsExistsSync(packagePath)) {
            if (exitOnFail) {
                logWarning(`Your ${chalk().bold(platform)} platformBuild is misconfigured!. let's repair it.`);
                createPlatformBuild(platform)
                    .then(() => configureElectronProject(true))
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }
            reject(`${packagePath} does not exist!`);
            return;
        }
        const pkgJson = path.join(engine.originalTemplatePlatformsDir!, platform, RnvFileName.package);
        const packageJson = readObjectSync<FileElectronPackage>(pkgJson) || {};

        packageJson.name = `${c.runtime.appId}-${platform}`;
        packageJson.productName = `${getAppTitle()}`;
        packageJson.version = `${getAppVersion()}`;
        packageJson.description = `${getAppDescription()}`;
        packageJson.author = getAppAuthor();
        packageJson.license = `${getAppLicense()}`;
        packageJson.main = './main.js';

        // check if project includes @electron/remote
        const remoteVersion = c.files.project.package.dependencies?.['@electron/remote'];
        if (remoteVersion) {
            if (!packageJson.dependencies) {
                // guard against overrides of package.json that don't include dependencies
                packageJson.dependencies = {};
            }
            // inject @electron/remote version to packageJson, otherwise runtime will fail
            logInfo(`Found @electron/remote@${remoteVersion} dependency. adding to generated electron package.json`);
            packageJson.dependencies['@electron/remote'] = remoteVersion;
        }

        writeFileSync(packagePath, packageJson);

        let browserWindow = {
            width: 1200,
            height: 800,
            webPreferences: { nodeIntegration: true, enableRemoteModule: true, contextIsolation: false },
            icon:
                platform === 'linux' && !fsExistsSync(pngIconPath)
                    ? path.join(platformProjectDir, 'resources', 'icon.icns')
                    : path.join(platformProjectDir, 'resources', 'icon.png'),
        };
        const browserWindowExt = getConfigProp('BrowserWindow');
        if (browserWindowExt) {
            browserWindow = merge(browserWindow, browserWindowExt);
        }
        const browserWindowStr = JSON.stringify(browserWindow, null, 2);
        const electronConfigExt = getConfigProp('electronConfig');
        const mainInjection = electronConfigExt?.mainInjection || '';
        const mainHeadInjection = electronConfigExt?.mainHeadInjection || '';

        if (bundleAssets) {
            const injects = [
                {
                    pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}',
                    override: browserWindowStr,
                },
                {
                    pattern: '{{PLUGIN_INJECT_ICON_LOCATION}}',
                    override: browserWindow.icon,
                },
                {
                    pattern: '{{PLUGIN_INJECT_MAIN_PROCESS}}',
                    override: mainInjection,
                },
                {
                    pattern: '{{PLUGIN_INJECT_MAIN_HEAD}}',
                    override: mainHeadInjection,
                },
            ];

            addSystemInjects(injects);

            writeCleanFile(
                path.join(platformProjectDir, 'main.prod.js'),
                path.join(platformProjectDir, 'main.js'),
                injects,
                undefined,
                c
            );
        } else {
            const injects = [
                {
                    pattern: '{{DEV_SERVER}}',
                    override: `http://${c.runtime.localhost}:${c.runtime.port}`,
                },
                {
                    pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}',
                    override: browserWindowStr,
                },
                {
                    pattern: '{{PLUGIN_INJECT_ICON_LOCATION}}',
                    override: browserWindow.icon,
                },
                {
                    pattern: '{{PLUGIN_INJECT_MAIN_PROCESS}}',
                    override: mainInjection,
                },
                {
                    pattern: '{{PLUGIN_INJECT_MAIN_HEAD}}',
                    override: mainHeadInjection,
                },
            ];

            addSystemInjects(injects);

            writeCleanFile(
                path.join(platformProjectDir, 'main.dev.js'),
                path.join(platformProjectDir, 'main.js'),
                injects,
                undefined,
                c
            );
        }

        const macConfig: {
            mac?: Record<string, string | boolean>;
            mas?: Record<string, string | boolean>;
        } = {};
        if (platform === 'macos') {
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

        // Fix `Cannot compute electron version from installed node modules - none of the possible electron modules are installed.`
        // See https://github.com/electron-userland/electron-builder/issues/3984#issuecomment-505307933
        const enginePkgJson = path.join(engine.rootPath!, RnvFileName.package);
        const enginePackageJson = readObjectSync<NpmPackageFile>(enginePkgJson);

        let electronConfig = merge(
            {
                appId,
                directories: {
                    app: path.join(platformBuildDir, 'build'),
                    buildResources: path.join(platformProjectDir, 'resources'),
                    output: path.join(platformBuildDir, 'export'),
                },
                files: ['!export/*'],
                electronVersion: enginePackageJson?.dependencies?.electron,
            },
            macConfig
        );

        if (electronConfigExt) {
            delete electronConfigExt.mainInjection;
            delete electronConfigExt.mainHeadInjection;
            electronConfig = merge(electronConfig, electronConfigExt);
        }
        writeFileSync(electronConfigPath, electronConfig);
        resolve();
    });

const buildElectron = async () => {
    const c = getContext();
    logDefault('buildElectron');

    await buildCoreWebpackProject();
    // Webpack 5 deletes build folder but does not copy package json

    const platformBuildDir = getAppFolder()!;

    // workaround: electron-builder fails export in npx mode due to trying install node_modules. we trick it not to do that
    mkdirSync(path.join(platformBuildDir, 'build', 'node_modules'));

    const packagePathSrc = path.join(platformBuildDir, RnvFileName.package);
    const packagePathDest = path.join(platformBuildDir, 'build', RnvFileName.package);
    copyFileSync(packagePathSrc, packagePathDest);

    const mainPathSrc = path.join(platformBuildDir, 'main.js');
    const mainPathDest = path.join(platformBuildDir, 'build', 'main.js');
    copyFileSync(mainPathSrc, mainPathDest);

    const menuPathSrc = path.join(platformBuildDir, 'contextMenu.js');
    const menuPathDest = path.join(platformBuildDir, 'build', 'contextMenu.js');
    copyFileSync(menuPathSrc, menuPathDest);

    if (c.command !== RnvTaskName.export) {
        logSuccess(`Your Build is located in ${chalk().cyan(path.join(platformBuildDir, 'build'))} .`);
    }

    return true;
};

const exportElectron = async () => {
    const c = getContext();
    logDefault('exportElectron');

    const platformBuildDir = getAppFolder()!;
    const buildPath = path.join(platformBuildDir, 'build', 'release');

    if (fsExistsSync(buildPath)) {
        logInfo(`exportElectron: removing old build ${buildPath}`);
        await removeDirs([buildPath]);
    }

    const execPath = path.join('node_modules', '.bin', 'electron-builder');
    let electronBuilderPath = path.join(c.paths.project.dir, execPath);
    if (!fsExistsSync(electronBuilderPath)) {
        electronBuilderPath = path.join(c.paths.project.dir, '../../', execPath);
    }
    if (!fsExistsSync(electronBuilderPath)) {
        electronBuilderPath = path.join(c.paths.project.dir, '../../../', execPath);
    }
    if (!fsExistsSync(electronBuilderPath)) {
        electronBuilderPath = 'npx electron-builder';
    }
    await executeAsync(
        `${electronBuilderPath} --config ${path.join(platformBuildDir, 'electronConfig.json')} --${c.platform}`
    );

    logSuccess(`Your Exported App is located in ${chalk().cyan(path.join(platformBuildDir, 'export'))} .`);
};

export const runElectron = async () => {
    const c = getContext();
    logDefault('runElectron');

    const { platform } = c;
    const { port } = c.runtime;

    // const bundleIsDev = getConfigProp('bundleIsDev') === true;
    const bundleAssets = getConfigProp('bundleAssets') === true;

    if (bundleAssets) {
        await buildElectron();
        await _runElectronSimulator(c);
    } else {
        const isPortActive = await checkPortInUse(port);
        if (!isPortActive) {
            logInfo(
                `Your ${chalk().bold(platform)} devServer at port ${chalk().bold(
                    port
                )} is not running. Starting it up for you...`
            );
            waitForHost('')
                .then(() => _runElectronSimulator(c))
                .catch(logError);
            // await _runElectronSimulator(c);
            await runWebpackServer();
        } else {
            const resetCompleted = await confirmActiveBundler();
            if (resetCompleted) {
                waitForHost('')
                    .then(() => _runElectronSimulator(c))
                    .catch(logError);
                // await _runElectronSimulator(c);
                await runWebpackServer();
            } else {
                await _runElectronSimulator(c);
            }
        }
    }
};

const _runElectronSimulator = async (c: RnvContext) => {
    logDefault(`_runElectronSimulator:${c.platform}`);
    // const appFolder = getAppFolder(c.platform);
    // const elc = `${doResolve('electron')}/cli.js`;
    const bundleAssets = getConfigProp('bundleAssets') === true;
    let platformProjectDir = getPlatformProjectDir()!;

    if (bundleAssets) {
        platformProjectDir = path.join(getAppFolder()!, 'build');
    }

    const cmd = `node ${doResolve('electron')}/cli.js ${path.join(platformProjectDir, '/main.js')}`;
    await executeAsync(cmd, ExecOptionsPresets.INHERIT_OUTPUT_NO_SPINNER);
};

const _generateICNS = (c: RnvContext) =>
    new Promise<void>((resolve, reject) => {
        logDefault('_generateICNS');
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

        const dest = path.join(getPlatformProjectDir()!, 'resources/icon.icns');

        // It's ok if icns are not generated as png is also valid https://www.electron.build/icons.html#macos
        if (!source) {
            logWarning(
                `You are missing AppIcon.iconset in ${chalk().bold(
                    c.paths.appConfig.dir
                )}. icon.icns will not be generated!`
            );
            resolve();
            return;
        }

        if (!fsExistsSync(source)) {
            logWarning(`Your app config is missing ${chalk().bold(source)}. icon.icns will not be generated!`);
            resolve();
            return;
        }

        mkdirSync(path.join(getPlatformProjectDir()!, 'resources'));

        const p = ['--convert', 'icns', source, '--output', dest];
        try {
            executeAsync(`iconutil ${p.join(' ')}`);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

export { buildElectron, exportElectron };
