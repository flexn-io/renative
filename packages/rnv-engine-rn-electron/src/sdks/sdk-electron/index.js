import { spawn } from 'child_process';
import path from 'path';
import { Common, Constants, Exec, FileUtils, Logger, PlatformManager, ProjectManager, Resolver } from 'rnv';
import { buildCoreWebpackProject, runWebpackServer, configureCoreWebProject } from '@rnv/sdk-webpack';

const { createPlatformBuild, isPlatformActive } = PlatformManager;
const { executeAsync } = Exec;
const {
    fsExistsSync,
    mkdirSync,
    writeFileSync,
    readObjectSync,
    removeDirs,
    writeCleanFile
} = FileUtils;
const {
    getPlatformProjectDir,
    getTemplateProjectDir,
    getPlatformBuildDir,
    getAppVersion,
    getAppTitle,
    getAppId,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects,
    waitForHost
} = Common;
const { doResolve } = Resolver;
const {
    chalk,
    logTask,
    logError,
    logWarning,
    logSuccess,
    logInfo,
} = Logger;
const {
    copyBuildsFolder,
    copyAssetsFolder
} = ProjectManager;
const {
    MACOS,
    LINUX
} = Constants;


export const configureElectronProject = async (c) => {
    logTask('configureElectronProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    // If path does not exist for png, try iconset
    const iconsetPath = path.join(
        c.paths.appConfig.dir,
        `assets/${platform}/resources/AppIcon.iconset`
    );

    await copyAssetsFolder(
        c,
        platform,
        null,
        (platform === MACOS || platform === LINUX) && fsExistsSync(iconsetPath) ? _generateICNS : null
    );

    await configureCoreWebProject(c);

    await configureProject(c);
    return copyBuildsFolder(c, platform);
};
const merge = require('deepmerge');

const configureProject = c => new Promise((resolve, reject) => {
    logTask('configureProject');
    const { platform } = c;

    if (!isPlatformActive(c, platform, resolve)) return;

    const platformProjectDir = getPlatformProjectDir(c);
    const platformBuildDir = getPlatformBuildDir(c);
    const templateFolder = getTemplateProjectDir(c);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    const electronConfigPath = path.join(platformBuildDir, 'electronConfig.json');
    const packagePath = path.join(platformProjectDir, 'package.json');
    // If path does not exist for png, try iconset
    const pngIconPath = path.join(
        c.paths.appConfig.dir,
        `assets/${platform}/resources/icon.png`
    );
    const appId = getAppId(c, platform);

    if (!fsExistsSync(packagePath)) {
        logWarning(
            `Your ${chalk().white(
                platform
            )} platformBuild is misconfigured!. let's repair it.`
        );
        createPlatformBuild(c, platform)
            .then(() => configureElectronProject(c, platform))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    const pkgJson = path.join(templateFolder, 'package.json');
    const packageJson = readObjectSync(pkgJson);

    packageJson.name = `${c.runtime.appId}-${platform}`;
    packageJson.productName = `${getAppTitle(c, platform)}`;
    packageJson.version = `${getAppVersion(c, platform)}`;
    packageJson.description = `${getAppDescription(c, platform)}`;
    packageJson.author = getAppAuthor(c, platform);
    packageJson.license = `${getAppLicense(c, platform)}`;
    packageJson.main = './main.js';

    writeFileSync(packagePath, packageJson);

    let browserWindow = {
        width: 1200,
        height: 800,
        webPreferences: { nodeIntegration: true, enableRemoteModule: true },
        icon: (platform === MACOS || platform === LINUX) && !fsExistsSync(pngIconPath)
            ? path.join(platformProjectDir, 'resources', 'icon.icns')
            : path.join(platformProjectDir, 'resources', 'icon.png')
    };
    const browserWindowExt = getConfigProp(c, platform, 'BrowserWindow');
    if (browserWindowExt) {
        browserWindow = merge(browserWindow, browserWindowExt);
    }
    const browserWindowStr = JSON.stringify(browserWindow, null, 2);
    const electronConfigExt = getConfigProp(c, platform, 'electronConfig');
    const mainInjection = electronConfigExt?.mainInjection || '';

    if (bundleAssets) {
        const injects = [
            {
                pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}',
                override: browserWindowStr
            },
            {
                pattern: '{{PLUGIN_INJECT_ICON_LOCATION}}',
                override: browserWindow.icon
            },
            {
                pattern: '{{PLUGIN_INJECT_MAIN_PROCESS}}',
                override: mainInjection
            }
        ];

        addSystemInjects(c, injects);

        writeCleanFile(
            path.join(platformBuildDir, 'main.prod.js'),
            path.join(platformProjectDir, 'main.js'),
            injects, null, c
        );
    } else {
        const injects = [
            {
                pattern: '{{DEV_SERVER}}',
                override: `http://${c.runtime.localhost}:${c.runtime.port}`
            },
            {
                pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}',
                override: browserWindowStr
            },
            {
                pattern: '{{PLUGIN_INJECT_ICON_LOCATION}}',
                override: browserWindow.icon
            },
            {
                pattern: '{{PLUGIN_INJECT_MAIN_PROCESS}}',
                override: mainInjection
            }
        ];

        addSystemInjects(c, injects);

        writeCleanFile(
            path.join(platformBuildDir, 'main.dev.js'),
            path.join(platformProjectDir, 'main.js'),
            injects, null, c
        );
    }

    const macConfig = {};
    if (platform === MACOS) {
        macConfig.mac = {
            entitlements: path.join(platformProjectDir, 'entitlements.mac.plist'),
            entitlementsInherit: path.join(
                platformProjectDir,
                'entitlements.mac.plist'
            ),
            hardenedRuntime: true
        };
        macConfig.mas = {
            entitlements: path.join(platformProjectDir, 'entitlements.mas.plist'),
            entitlementsInherit: path.join(
                platformProjectDir,
                'entitlements.mas.inherit.plist'
            ),
            provisioningProfile: path.join(
                platformProjectDir,
                'embedded.provisionprofile'
            ),
            hardenedRuntime: false
        };
    }

    let electronConfig = merge(
        {
            appId,
            directories: {
                app: platformProjectDir,
                buildResources: path.join(platformProjectDir, 'resources'),
                output: path.join(platformBuildDir, 'build/release')
            },
            files: ['!build/release']
        },
        macConfig
    );

    if (electronConfigExt) {
        delete electronConfigExt.mainInjection;
        electronConfig = merge(electronConfig, electronConfigExt);
    }
    writeFileSync(electronConfigPath, electronConfig);

    resolve();
});

const buildElectron = async (c) => {
    logTask('buildElectron');

    await buildCoreWebpackProject(c);
    return true;
};

const exportElectron = async (c) => {
    logTask('exportElectron');

    const platformBuildDir = getPlatformBuildDir(c);
    const buildPath = path.join(platformBuildDir, 'build');

    if (fsExistsSync(buildPath)) {
        logInfo(`exportElectron: removing old build ${buildPath}`);
        await removeDirs([buildPath]);
    }

    await executeAsync(
        c,
        `npx electron-builder --config ${path.join(
            platformBuildDir,
            'electronConfig.json'
        )} --${c.platform}`
    );

    logSuccess(
        `Your Exported App is located in ${chalk().cyan(
            path.join(platformBuildDir, 'build/release')
        )} .`
    );
};

export const runElectron = async (c) => {
    logTask('runElectron');

    const { platform } = c;
    const { port } = c.runtime;

    // const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        await buildElectron(c);
        await _runElectronSimulator(c);
    } else {
        const isPortActive = await checkPortInUse(c, platform, port);
        if (!isPortActive) {
            logInfo(
                `Your ${chalk().white(
                    platform
                )} devServer at port ${chalk().white(
                    port
                )} is not running. Starting it up for you...`
            );
            waitForHost(c)
                .then(() => _runElectronSimulator(c))
                .catch(logError);
            // await _runElectronSimulator(c);
            await runWebpackServer(c);
        } else {
            const resetCompleted = await confirmActiveBundler(c);
            if (resetCompleted) {
                waitForHost(c)
                    .then(() => _runElectronSimulator(c))
                    .catch(logError);
                // await _runElectronSimulator(c);
                await runWebpackServer(c);
            } else {
                await _runElectronSimulator(c);
            }
        }
    }
};

const _runElectronSimulator = async (c) => {
    logTask(`_runElectronSimulator:${c.platform}`);
    // const appFolder = getAppFolder(c, c.platform);
    const elc = `${doResolve('electron')}/cli.js`;

    const child = spawn('node', [elc, path.join(getPlatformProjectDir(c), '/main.js')], {
        detached: true,
        env: process.env,
        stdio: 'inherit'
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => logError(spawnError));

    child.unref();
};

const _generateICNS = c => new Promise((resolve, reject) => {
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
        source = path.join(
            c.paths.appConfig.dir,
            `assets/${platform}/AppIcon.iconset`
        );
    }

    const dest = path.join(
        getPlatformProjectDir(c),
        'resources/icon.icns'
    );

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
        logWarning(
            `Your app config is missing ${chalk().white(
                source
            )}. icon.icns will not be generated!`
        );
        resolve();
        return;
    }

    mkdirSync(path.join(getPlatformProjectDir(c), 'resources'));

    const p = ['--convert', 'icns', source, '--output', dest];
    try {
        executeAsync(c, `iconutil ${p.join(' ')}`);
        resolve();
    } catch (e) {
        reject(e);
    }
});

export {
    buildElectron,
    exportElectron
};
