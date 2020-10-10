import path from 'path';
import open from 'better-opn';
import { executeAsync } from '../core/systemManager/exec';
import {
    checkPortInUse,
    getConfigProp,
    confirmActiveBundler,
    getPlatformBuildDir,
    // getAppFolder
} from '../core/common';
import { waitForWebpack, getModuleConfigs } from './index';

import {
    fsExistsSync,
    writeCleanFile,
    // fsWriteFileSync,
    // fsMkdirSync,
    // fsUnlinkSync,
    // fsReaddirSync,
    // fsSymlinkSync
} from '../core/systemManager/fileutils';
import { chalk, logTask, logInfo, logWarning,
    logRaw, logSummary, logSuccess } from '../core/systemManager/logger';
import { NEXT_CONFIG_NAME } from '../core/constants';
import { generateEnvVars } from '../core/engineManager';
import { selectWebToolAndDeploy, selectWebToolAndExport } from '../core/deployManager/webTools';
import { parsePlugins } from '../core/pluginManager';
import { getValidLocalhost } from '../core/utils';

export const configureNextIfRequired = async (c) => {
    logTask('configureNextIfRequired');
    c.runtime.platformBuildsProjectPath = `${getPlatformBuildDir(c)}`;
    const { platformTemplatesDirs, dir } = c.paths.project;
    // const pagesDir = path.resolve(getConfigProp(c, c.platform, 'pagesDir') || 'src/app');
    // const _appFile = path.join(pagesDir, '_app.js');
    const supportFilesDir = path.join(platformTemplatesDirs[c.platform], '../supportFiles');
    const configFile = path.join(dir, NEXT_CONFIG_NAME);

    // handle fonts
    // !fsExistsSync(publicDir) && fsMkdirSync(publicDir);
    // const fontsSymLinkPath = path.join(publicDir, 'fonts');
    //
    // if (fsExistsSync(baseFontsDir)) {
    //     if (!fsExistsSync(fontsSymLinkPath)) {
    //         try {
    //             fsUnlinkSync(fontsSymLinkPath);
    //         } catch (e) {
    //             logDebug(e);
    //         }
    //         fsSymlinkSync(baseFontsDir, fontsSymLinkPath);
    //     }
    //
    //     // create styles dir and global fonts.css file
    //     if (!fsExistsSync(stylesDir)) {
    //         fsMkdirSync(stylesDir);
    //         let cssOutput = '';
    //
    //         const fontFiles = fsReaddirSync(baseFontsDir);
    //         fontFiles.forEach((file) => {
    //             cssOutput += `
    //               @font-face {
    //                   font-family: '${file.split('.')[0]}';
    //                   src: url('/fonts/${file}');
    //               }
    //
    //           `;
    //         });
    //
    //         fsWriteFileSync(path.join(stylesDir, 'fonts.css'), cssOutput);
    //     }
    // }

    // add wrapper _app
    // if (!fsExistsSync(_appFile)) {
    //     if (!fsExistsSync(pagesDir)) {
    //         fsMkdirSync(pagesDir);
    //     }
    //     writeCleanFile(
    //         path.join(supportFilesDir, '_app.js'),
    //         _appFile,
    //         [{ pattern: '{{FONTS_CSS}}', override: path.relative(pagesDir, path.resolve('styles/fonts.css')).replace(/\\/g, '/') }],
    //         null,
    //         c
    //     );
    // }

    // add config
    if (!fsExistsSync(configFile)) {
        writeCleanFile(path.join(supportFilesDir, NEXT_CONFIG_NAME), configFile, null, null, c);
    }
};

export const runWebNext = async (c) => {
    const { port } = c.runtime;
    logTask('runWebNext', `port:${port}`);
    const { platform } = c;

    const devServerHost = getValidLocalhost(getConfigProp(c, c.platform, 'devServerHost', c.runtime.localhost), c.runtime.localhost);

    const isPortActive = await checkPortInUse(c, platform, port);
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    if (!isPortActive) {
        logInfo(
            `Your ${chalk().white(platform)} devServerHost ${
                chalk().white(devServerHost)} at port ${chalk().white(
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

const _runWebBrowser = (c, platform, devServerHost, port, alreadyStarted) => new Promise((resolve) => {
    logTask(
        '_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`
    );
    if (!c.runtime.shouldOpenBrowser) return resolve();
    const wait = waitForWebpack(c, '')
        .then(() => {
            open(`http://${devServerHost}:${port}/`);
        })
        .catch((e) => {
            logWarning(e);
        });
    if (alreadyStarted) return wait; // if it's already started, return the promise so it rnv will wait, otherwise it will exit before opening the browser
    return resolve();
});

const _checkPagesDir = async (c) => {
    const pagesDir = getConfigProp(c, c.platform, 'pagesDir');
    const distDir = `platformBuilds/${c.runtime.appId}_${c.platform}/.next`;
    if (pagesDir) {
        const pagesDirPath = path.join(c.paths.project.dir, pagesDir);
        if (!fsExistsSync(pagesDirPath)) {
            logWarning(`You configured custom ${c.platform}pagesDir: ${
                chalk().white(pagesDir)
            } in your renative.json but it is missing at ${chalk().red(pagesDirPath)}`);
        }
        return { NEXT_PAGES_DIR: pagesDir, NEXT_DIST_DIR: distDir };
    }
    const fallbackPagesDir = 'src/app';
    logWarning(`You're missing ${c.platform}.pagesDir config. Defaulting to '${fallbackPagesDir}'`);

    const fallbackPagesDirPath = path.join(c.paths.project.dir, fallbackPagesDir);
    if (!fsExistsSync(fallbackPagesDirPath)) {
        logWarning(`Folder ${
            chalk().white(fallbackPagesDir)
        } is missing. make sure your entry code is located there in order for next to work correctly!
Alternatively you can configure custom entry folder via ${c.platform}.pagesDir in renative.json`);
    }
    return { NEXT_PAGES_DIR: 'src/app', NEXT_DIST_DIR: distDir };
};

export const getTranspileModules = (c) => {
    let transModules = [];
    parsePlugins(c, c.platform, (plugin, pluginPlat, key) => {
        const webpackConfig = plugin.webpack || plugin.webpackConfig;
        if (webpackConfig) {
            transModules.push(key);
            if (webpackConfig.nextTranspileModules?.length) {
                transModules = transModules.concat(webpackConfig.nextTranspileModules);
            }
        }
    }, true);
    return transModules;
};

export const buildWebNext = async (c) => {
    logTask('buildWebNext');
    const env = getConfigProp(c, c.platform, 'environment');
    const platformBuildDir = getPlatformBuildDir(c);

    const envExt = await _checkPagesDir(c);

    await executeAsync(c, 'npx next build', {
        ...process.env,
        env: {
            NODE_ENV: env || 'development',
            ...envExt,
            ...generateEnvVars(c, getModuleConfigs(c), getTranspileModules(c))
        }
    });
    logSuccess(
        `Your build is located in ${chalk().cyan(path.join(platformBuildDir, '.next'))} .`
    );
    return true;
};

export const runWebDevServer = async (c) => {
    logTask('runWebDevServer');
    const env = getConfigProp(c, c.platform, 'environment');
    const envExt = await _checkPagesDir(c);

    const devServerHost = getValidLocalhost(getConfigProp(c, c.platform, 'devServerHost', c.runtime.localhost), c.runtime.localhost);

    const url = chalk().cyan(`http://${devServerHost}:${c.runtime.port}`);
    logRaw(`

Dev server running at: ${url}

`);


    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
    return executeAsync(c, `npx next ${bundleAssets ? 'start' : 'dev'} --port ${c.runtime.port}`,
        {
            env: {
                NODE_ENV: env || 'development',
                ...envExt,
                ...generateEnvVars(c, getModuleConfigs(c), getTranspileModules(c))
            },
            interactive: true
        });
};

export const deployWebNext = (c) => {
    logTask('deployWebNext');
    const { platform } = c;

    return selectWebToolAndDeploy(c, platform);
};

export const exportWebNext = async (c) => {
    logTask('exportWebNext');
    const { platform } = c;

    logTask('_exportNext');
    const exportDir = path.join(getPlatformBuildDir(c), 'output');
    const env = getConfigProp(c, c.platform, 'environment');
    const envExt = await _checkPagesDir(c);

    await executeAsync(c, `npx next export --outdir ${exportDir}`, {
        ...process.env,
        env: {
            NODE_ENV: env || 'development',
            ...envExt,
            ...generateEnvVars(c, getModuleConfigs(c), getTranspileModules(c))
        }
    });
    logSuccess(
        `Your export is located in ${chalk().cyan(exportDir)} .`
    );

    await selectWebToolAndExport(c, platform);
    return true;
};
