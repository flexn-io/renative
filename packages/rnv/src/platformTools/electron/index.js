import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { createPlatformBuild } from '..';
import { executeAsync } from '../../systemTools/exec';
import {
    getAppFolder,
    getAppVersion,
    getAppTitle,
    writeCleanFile,
    getAppId,
    getAppTemplateFolder,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    getConfigProp,
    checkPortInUse,
    resolveNodeModulePath,
    waitForWebpack,
    confirmActiveBundler
} from '../../common';
import {
    logTask,
    logError,
    logWarning,
    logSuccess,
    logInfo
} from '../../systemTools/logger';
import { isPlatformActive } from '..';
import { isSystemWin } from '../../utils';
import { copyBuildsFolder, copyAssetsFolder } from '../../projectTools/projectParser';
import { MACOS } from '../../constants';
import {
    buildWeb,
    runWeb,
    configureCoreWebProject
} from '../web';
import {
    mkdirSync, writeFileSync, readObjectSync, removeDirs
} from '../../systemTools/fileutils';

const configureElectronProject = async (c, platform) => {
    logTask(`configureElectronProject:${platform}`);

    await copyAssetsFolder(c, platform, platform === MACOS ? _generateICNS : null);
    await configureCoreWebProject(c, platform);
    await configureProject(c, platform);
    return copyBuildsFolder(c, platform);
};
const merge = require('deepmerge');

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    const electronConfigPath = path.join(appFolder, 'electronConfig.json');
    const packagePath = path.join(appFolder, 'package.json');
    const appId = getAppId(c, platform);

    if (!fs.existsSync(packagePath)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
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

    let browserWindow = { width: 1200, height: 800, webPreferences: { nodeIntegration: true } };
    const browserWindowExt = getConfigProp(c, platform, 'BrowserWindow');
    if (browserWindowExt) {
        browserWindow = merge(browserWindow, browserWindowExt);
    }
    const browserWindowStr = JSON.stringify(browserWindow, null, 2);

    if (bundleAssets) {
        writeCleanFile(path.join(templateFolder, '_privateConfig', 'main.js'), path.join(appFolder, 'main.js'), [
            { pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}', override: browserWindowStr },
        ]);
    } else {
        writeCleanFile(path.join(templateFolder, '_privateConfig', 'main.dev.js'), path.join(appFolder, 'main.js'), [
            { pattern: '{{DEV_SERVER}}', override: `http://${c.runtime.localhost}:${c.runtime.port}` },
            { pattern: '{{PLUGIN_INJECT_BROWSER_WINDOW}}', override: browserWindowStr },
        ]);
    }

    const macConfig = {};
    if (platform === MACOS) {
        macConfig.mac = {
            entitlements: path.join(appFolder, 'entitlements.mac.plist'),
            entitlementsInherit: path.join(appFolder, 'entitlements.mac.plist'),
            hardenedRuntime: true
        };
        macConfig.mas = {
            entitlements: path.join(appFolder, 'entitlements.mas.plist'),
            entitlementsInherit: path.join(appFolder, 'entitlements.mas.inherit.plist'),
            provisioningProfile: path.join(appFolder, 'embedded.provisionprofile'),
            hardenedRuntime: false
        };
    }

    let electronConfig = merge({
        appId,
        directories: {
            app: appFolder,
            buildResources: path.join(appFolder, 'resources'),
            output: path.join(appFolder, 'build/release')
        },
        files: [
            '!build/release'
        ],
    }, macConfig);

    const electronConfigExt = getConfigProp(c, platform, 'electronConfig');

    if (electronConfigExt) {
        electronConfig = merge(electronConfig, electronConfigExt);
    }
    writeFileSync(electronConfigPath, electronConfig);


    resolve();
});

const buildElectron = (c, platform) => {
    logTask(`buildElectron:${platform}`);

    return buildWeb(c, platform);
};

const exportElectron = async (c, platform) => {
    logTask(`exportElectron:${platform}`);
    const { maxErrorLength } = c.program;
    const appFolder = getAppFolder(c, platform);
    const buildPath = path.join(appFolder, 'build');

    if (fs.existsSync(buildPath)) {
        console.log(`removing old build ${buildPath}`);
        await removeDirs([buildPath]);
    }

    await executeAsync(c, `npx electron-builder --config ${path.join(appFolder, 'electronConfig.json')}`);

    logSuccess(`Your Exported App is located in ${chalk.white(path.join(appFolder, 'build/release'))} .`);
};

const runElectron = async (c, platform, port) => {
    logTask(`runElectron:${platform}`);

    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        await buildElectron(c, platform, bundleIsDev);
        await _runElectronSimulator(c, platform);
    } else {
        const isPortActive = await checkPortInUse(c, platform, port);
        if (!isPortActive) {
            logInfo(
                `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                    port
                )} is not running. Starting it up for you...`
            );
            waitForWebpack(c, port)
                .then(() => _runElectronSimulator(c, platform))
                .catch(logError);
            // await _runElectronSimulator(c, platform);
            await runElectronDevServer(c, platform, port);
        } else {
            await confirmActiveBundler(c);
            await _runElectronSimulator(c, platform);
        }
    }
};

const _runElectronSimulator = async (c) => {
    logTask(`_runElectronSimulator:${c.platform}`);
    const appFolder = getAppFolder(c, c.platform);
    const elc = resolveNodeModulePath(c, 'electron/cli.js');

    const child = spawn('node', [elc, path.join(appFolder, '/main.js')], {
        detached: true,
        env: process.env,
        stdio: 'inherit',
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));

    child.unref();
};

const runElectronDevServer = async (c, platform, port) => {
    logTask(`runElectronDevServer:${platform}`);

    return runWeb(c, platform, port);
};

const _generateICNS = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_generateICNS:${platform}`);

    let source;

    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const pf = path.join(v, `assets/${platform}/AppIcon.iconset`);
            if (fs.existsSync(pf)) {
                source = pf;
            }
        });
    } else if (c.paths.appConfig.dir) {
        source = path.join(c.paths.appConfig.dir, `assets/${platform}/AppIcon.iconset`);
    }

    const dest = path.join(getAppFolder(c, platform), 'resources/icon.icns');

    if (!fs.existsSync(source)) {
        logWarning(`Your app config is missing ${chalk.white(source)}. icon.icns will not be generated!`);
        resolve();
        return;
    }

    mkdirSync(path.join(getAppFolder(c, platform), 'resources'));

    const p = [
        '--convert',
        'icns',
        source,
        '--output',
        dest
    ];
    try {
        executeAsync(c, `iconutil ${p.join(' ')}`);
        resolve();
    } catch (e) {
        reject(e);
    }
});

export { configureElectronProject, runElectron, buildElectron, exportElectron, runElectronDevServer };
