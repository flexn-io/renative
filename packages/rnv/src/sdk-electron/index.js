/* eslint-disable import/no-cycle */
import path from 'path';
import { spawn } from 'child_process';
import { createPlatformBuild, isPlatformActive } from '../core/platformManager';
import { executeAsync } from '../core/systemManager/exec';
import {
    fsExistsSync,
    mkdirSync,
    writeFileSync,
    readObjectSync,
    removeDirs,
    writeCleanFile
} from '../core/systemManager/fileutils';
import {
    getAppFolder,
    getAppVersion,
    getAppTitle,
    getAppId,
    getAppTemplateFolder,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler
} from '../core/common';
import { doResolve } from '../core/resolve';
import {
    chalk,
    logTask,
    logError,
    logWarning,
    logSuccess,
    logInfo,
} from '../core/systemManager/logger';
import {
    copyBuildsFolder,
    copyAssetsFolder
} from '../core/projectManager/projectParser';
import { MACOS } from '../core/constants';
import { buildWeb, runWeb, configureCoreWebProject, waitForWebpack } from '../sdk-webpack';


export const configureElectronProject = async (c) => {
    logTask('configureElectronProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getAppFolder(c, c.platform)}`;

    await copyAssetsFolder(
        c,
        platform,
        platform === MACOS ? _generateICNS : null
    );
    await configureCoreWebProject(c, platform);
    await configureProject(c);
    return copyBuildsFolder(c, platform);
};
const merge = require('deepmerge');

const configureProject = c => new Promise((resolve, reject) => {
    logTask('configureProject');
    const { platform } = c;

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    const electronConfigPath = path.join(appFolder, 'electronConfig.json');
    const packagePath = path.join(appFolder, 'package.json');
    const appId = getAppId(c, platform);

    if (!fsExistsSync(packagePath)) {
        logWarning(
            `Looks like your ${chalk().white(
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
        webPreferences: { nodeIntegration: true }
    };
    const browserWindowExt = getConfigProp(c, platform, 'BrowserWindow');
    if (browserWindowExt) {
        browserWindow = merge(browserWindow, browserWindowExt);
    }
    const browserWindowStr = JSON.stringify(browserWindow, null, 2);

    if (bundleAssets) {
        writeCleanFile(
            path.join(templateFolder, '_privateConfig', 'main.js'),
            path.join(appFolder, 'main.js'),
            [
                {
                    pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}',
                    override: browserWindowStr
                }
            ], null, c
        );
    } else {
        writeCleanFile(
            path.join(templateFolder, '_privateConfig', 'main.dev.js'),
            path.join(appFolder, 'main.js'),
            [
                {
                    pattern: '{{DEV_SERVER}}',
                    override: `http://${c.runtime.localhost}:${c.runtime.port}`
                },
                {
                    pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}',
                    override: browserWindowStr
                }
            ], null, c
        );
    }

    const macConfig = {};
    if (platform === MACOS) {
        macConfig.mac = {
            entitlements: path.join(appFolder, 'entitlements.mac.plist'),
            entitlementsInherit: path.join(
                appFolder,
                'entitlements.mac.plist'
            ),
            hardenedRuntime: true
        };
        macConfig.mas = {
            entitlements: path.join(appFolder, 'entitlements.mas.plist'),
            entitlementsInherit: path.join(
                appFolder,
                'entitlements.mas.inherit.plist'
            ),
            provisioningProfile: path.join(
                appFolder,
                'embedded.provisionprofile'
            ),
            hardenedRuntime: false
        };
    }

    let electronConfig = merge(
        {
            appId,
            directories: {
                app: appFolder,
                buildResources: path.join(appFolder, 'resources'),
                output: path.join(appFolder, 'build/release')
            },
            files: ['!build/release']
        },
        macConfig
    );

    const electronConfigExt = getConfigProp(c, platform, 'electronConfig');

    if (electronConfigExt) {
        electronConfig = merge(electronConfig, electronConfigExt);
    }
    writeFileSync(electronConfigPath, electronConfig);

    resolve();
});

const buildElectron = async (c) => {
    logTask('buildElectron');

    await buildWeb(c);
    return true;
};

const exportElectron = async (c) => {
    logTask('exportElectron');
    const { platform } = c;

    const appFolder = getAppFolder(c, platform);
    const buildPath = path.join(appFolder, 'build');

    if (fsExistsSync(buildPath)) {
        logInfo(`exportElectron: removing old build ${buildPath}`);
        await removeDirs([buildPath]);
    }

    await executeAsync(
        c,
        `npx electron-builder --config ${path.join(
            appFolder,
            'electronConfig.json'
        )}`
    );

    logSuccess(
        `Your Exported App is located in ${chalk().white(
            path.join(appFolder, 'build/release')
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
        await _runElectronSimulator(c, platform);
    } else {
        const isPortActive = await checkPortInUse(c, platform, port);
        if (!isPortActive) {
            logInfo(
                `Looks like your ${chalk().white(
                    platform
                )} devServer at port ${chalk().white(
                    port
                )} is not running. Starting it up for you...`
            );
            waitForWebpack(c)
                .then(() => _runElectronSimulator(c, platform))
                .catch(logError);
            // await _runElectronSimulator(c, platform);
            await runElectronDevServer(c);
        } else {
            await confirmActiveBundler(c);
            await _runElectronSimulator(c, platform);
        }
    }
};

const _runElectronSimulator = async (c) => {
    logTask(`_runElectronSimulator:${c.platform}`);
    const appFolder = getAppFolder(c, c.platform);
    const elc = `${doResolve('electron')}/cli.js`;

    const child = spawn('node', [elc, path.join(appFolder, '/main.js')], {
        detached: true,
        env: process.env,
        stdio: 'inherit'
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => logError(spawnError));

    child.unref();
};

const runElectronDevServer = async (c) => {
    logTask('runElectronDevServer');

    return runWeb(c);
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
        getAppFolder(c, platform),
        'resources/icon.icns'
    );

    if (!fsExistsSync(source)) {
        logWarning(
            `Your app config is missing ${chalk().white(
                source
            )}. icon.icns will not be generated!`
        );
        resolve();
        return;
    }

    mkdirSync(path.join(getAppFolder(c, platform), 'resources'));

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
    exportElectron,
    runElectronDevServer
};
