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
import { waitForWebpack } from './index';
import {
    fsExistsSync,
    writeCleanFile,
    fsWriteFileSync,
    fsMkdirSync,
    fsUnlinkSync,
    fsReaddirSync,
    fsSymlinkSync
} from '../core/systemManager/fileutils';
import { chalk, logTask, logInfo, logWarning, logDebug, logRaw, logSummary, logSuccess } from '../core/systemManager/logger';
import { NEXT_CONFIG_NAME } from '../core/constants';
import { selectWebToolAndDeploy, selectWebToolAndExport } from '../core/deployManager/webTools';

import { getValidLocalhost } from '../core/utils';

export const configureNextIfRequired = async (c) => {
    logTask('configureNextIfRequired');
    c.runtime.platformBuildsProjectPath = `${getPlatformBuildDir(c)}`;
    const { platformTemplatesDirs, dir } = c.paths.project;
    const publicDir = path.join(dir, 'public');
    const baseFontsDir = c.paths.appConfig.fontsDirs?.[0];
    const stylesDir = path.join(dir, 'styles');
    const pagesDir = path.resolve(getConfigProp(c, c.platform, 'pagesDir') || 'src/app');
    const _appFile = path.join(pagesDir, '_app.js');
    const supportFilesDir = path.join(platformTemplatesDirs[c.platform], '../supportFiles');
    const configFile = path.join(dir, NEXT_CONFIG_NAME);

    // handle fonts
    !fsExistsSync(publicDir) && fsMkdirSync(publicDir);
    const fontsSymLinkPath = path.join(publicDir, 'fonts');

    if (fsExistsSync(baseFontsDir)) {
        if (!fsExistsSync(fontsSymLinkPath)) {
            try {
                fsUnlinkSync(fontsSymLinkPath);
            } catch (e) {
                logDebug(e);
            }
            fsSymlinkSync(baseFontsDir, fontsSymLinkPath);
        }

        // create styles dir and global fonts.css file
        if (!fsExistsSync(stylesDir)) {
            fsMkdirSync(stylesDir);
            let cssOutput = '';

            const fontFiles = fsReaddirSync(baseFontsDir);
            fontFiles.forEach((file) => {
                cssOutput += `
                  @font-face {
                      font-family: '${file.split('.')[0]}';
                      src: url('/fonts/${file}');
                  }

              `;
            });

            fsWriteFileSync(path.join(stylesDir, 'fonts.css'), cssOutput);
        }
    }

    // add wrapper _app
    if (!fsExistsSync(_appFile)) {
        if (!fsExistsSync(pagesDir)) {
            fsMkdirSync(pagesDir);
        }
        writeCleanFile(
            path.join(supportFilesDir, '_app.js'),
            _appFile,
            [{ pattern: '{{FONTS_CSS}}', override: path.relative(pagesDir, path.resolve('styles/fonts.css')).replace(/\\/g, '/') }],
            null,
            c
        );
    }

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
            `Looks like your ${chalk().white(platform)} devServerHost ${
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
        await confirmActiveBundler(c);
        await _runWebBrowser(c, platform, devServerHost, port, true);
        if (!bundleAssets) {
            logSummary('BUNDLER STARTED');
        }
    }
};

const _runWebBrowser = (c, platform, devServerHost, port, alreadyStarted) => new Promise((resolve) => {
    logTask(
        '_runWebBrowser', `ip:${devServerHost} port:${port} openBrowser:${!!c.runtime.shouldOpenBrowser}`
    );
    if (!c.runtime.shouldOpenBrowser) return resolve();
    const wait = waitForWebpack(c, 'next')
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
    if (pagesDir) {
        if (fsExistsSync(path.join(c.paths.project.dir, pagesDir))) {
            logWarning('pagesDir in your renative.json is DEPRECATED. next will look at src/pages by default');
        }
    }
    if (!fsExistsSync(path.join(c.paths.project.dir, 'src/pages'))) {
        if (fsExistsSync(path.join(c.paths.project.dir, pagesDir))) {
            logWarning(`pagesDir is DEPRECATED. project buit with ${
                chalk().white('engine-rn-next')
            } must have their entry pages located in ${chalk().white('src/pages')} instead you have them in ${chalk().red(pagesDir)}`);
        } else {
            logWarning(`Folder ${
                chalk().white('src/pages')
            } is missing. make sure your entry code is located there in order for next to work correctly!`);
        }
    }
};

export const buildWebNext = async (c) => {
    logTask('buildWebNext');
    const env = getConfigProp(c, c.platform, 'environment');
    const appFolder = getPlatformBuildDir(c);

    await _checkPagesDir(c);

    await executeAsync(c, `npx next build ${appFolder}`, { ...process.env, env: { NODE_ENV: env || 'development' } });
    logSuccess(
        `Your build is located in ${chalk().cyan(path.join(appFolder, 'platformBuilds'))} .`
    );
    return true;
};

export const runWebDevServer = async (c) => {
    logTask('runWebDevServer');
    const env = getConfigProp(c, c.platform, 'environment');
    await _checkPagesDir(c);

    const devServerHost = getValidLocalhost(getConfigProp(c, c.platform, 'devServerHost', c.runtime.localhost), c.runtime.localhost);

    const url = chalk().cyan(`http://${devServerHost}:${c.runtime.port}`);
    logRaw(`

Dev server running at: ${url}

`);

    return executeAsync(c, `npx next dev --port ${c.runtime.port}`, { env: { NODE_ENV: env || 'development' }, interactive: true });
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
    const appFolder = getPlatformBuildDir(c);
    const env = getConfigProp(c, c.platform, 'environment');
    await _checkPagesDir(c);

    await executeAsync(c, `npx next export ${appFolder}`, { ...process.env, env: { NODE_ENV: env || 'development' } });
    logSuccess(
        `Your export is located in ${chalk().cyan(path.join(appFolder, 'out'))} .`
    );

    await selectWebToolAndExport(c, platform);
    return true;
};
