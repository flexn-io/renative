import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { createPlatformBuild } from '../../cli/platform';
import { executeAsync } from '../../systemTools/exec';
import {
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    logError,
    getAppFolder,
    isPlatformActive,
    configureIfRequired,
    getAppConfigId,
    getAppVersion,
    getAppTitle,
    getAppVersionCode,
    writeCleanFile,
    getAppId,
    getAppTemplateFolder,
    getEntryFile,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    logWarning,
    logSuccess,
    getConfigProp,
    checkPortInUse,
    logInfo,
    resolveNodeModulePath
} from '../../common';
import { copyBuildsFolder, copyAssetsFolder } from '../../projectTools/projectParser';
import { MACOS } from '../../constants';
import { buildWeb, runWeb, runWebDevServer } from '../web';
import {
    cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync,
    copyFileSync, mkdirSync, writeObjectSync, readObjectSync
} from '../../systemTools/fileutils';

const isRunningOnWindows = process.platform === 'win32';

const configureElectronProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureElectronProject:${platform}`);

    copyAssetsFolder(c, platform, platform === MACOS ? _generateICNS : null)
        .then(() => copyBuildsFolder(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
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

    packageJson.name = `${getAppConfigId(c, platform)}-${platform}`;
    packageJson.productName = `${getAppTitle(c, platform)} - ${platform}`;
    packageJson.version = `${getAppVersion(c, platform)}`;
    packageJson.description = `${getAppDescription(c, platform)}`;
    packageJson.author = getAppAuthor(c, platform);
    packageJson.license = `${getAppLicense(c, platform)}`;
    packageJson.main = './main.js';

    writeObjectSync(packagePath, packageJson);

    if (bundleAssets) {
        copyFileSync(path.join(templateFolder, '_privateConfig', 'main.js'), path.join(appFolder, 'main.js'));
        copyFileSync(
            path.join(templateFolder, '_privateConfig', 'webpack.config.js'),
            path.join(appFolder, 'webpack.config.js')
        );
    } else {
        const ip = isRunningOnWindows ? '127.0.0.1' : '0.0.0.0';
        writeCleanFile(path.join(templateFolder, '_privateConfig', 'main.dev.js'), path.join(appFolder, 'main.js'), [
            { pattern: '{{DEV_SERVER}}', override: `http://${ip}:${c.platformDefaults[platform].defaultPort}` },
        ]);
        copyFileSync(
            path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'),
            path.join(appFolder, 'webpack.config.js')
        );
    }

    const electronConfig = {
        appId,
        directories: {
            app: appFolder,
            buildResources: path.join(appFolder, 'resources'),
            output: path.join(appFolder, 'build/release')
        }
    };
    writeObjectSync(electronConfigPath, electronConfig);


    resolve();
});

const buildElectron = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildElectron:${platform}`);

    const appFolder = getAppFolder(c, platform);
    buildWeb(c, platform)
        .then(() => resolve())
        .catch(e => reject(e));
});

const exportElectron = (c, platform) => new Promise((resolve, reject) => {
    logTask(`exportElectron:${platform}`);
    const { maxErrorLength } = c.program;

    const appFolder = getAppFolder(c, platform);
    executeAsync(c, `npx electron-builder --config ${path.join(appFolder, 'electronConfig.json')}`)
        .then(() => {
            logSuccess(`Your Exported App is located in ${chalk.white(path.join(appFolder, 'build/release'))} .`);
            resolve();
        })
        .catch(e => reject(e));
});

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
            await _runElectronSimulator(c, platform);
            await runElectronDevServer(c, platform, port);
        } else {
            logInfo(
                `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                    port
                )} is already running. ReNative will use it!`
            );
            await _runElectronSimulator(c, platform);
        }
    }
};

const _runElectronSimulator = (c, platform) => new Promise((resolve, reject) => {
    const appFolder = getAppFolder(c, platform);
    const elc = resolveNodeModulePath(c, 'electron/cli.js');

    const child = spawn('node', [elc, appFolder], {
        detached: true,
        env: process.env,
        stdio: 'inherit',
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));

    child.unref();
    resolve();
});

const runElectronDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runElectronDevServer:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    copyFileSync(
        path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'),
        path.join(appFolder, 'webpack.config.js')
    );

    runWebDevServer(c, platform, port)
        .then(() => resolve())
        .catch(e => reject(e));
});

const _generateICNS = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_generateICNS:${platform}`);
    const { maxErrorLength } = c.program;

    const source = path.join(c.paths.appConfig.dir, `assets/${platform}/AppIcon.iconset`);

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
