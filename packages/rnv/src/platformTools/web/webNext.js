/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import open from 'better-opn';
import ip from 'ip';
import { executeAsync } from '../../systemTools/exec';
import {
    getAppFolder,
    getAppTemplateFolder,
    checkPortInUse,
    resolveNodeModulePath,
    getConfigProp,
    waitForWebpack,
    writeCleanFile,
    getBuildFilePath,
    getAppTitle,
    getSourceExts,
    sanitizeColor,
    confirmActiveBundler
} from '../../common';
import { isPlatformActive } from '..';
import { logTask, logInfo, logDebug, logError, logSuccess, logWarning } from '../../systemTools/logger';
import { WEB, RN_BABEL_CONFIG_NAME, NEXT_CONFIG_NAME } from '../../constants';
import { copyBuildsFolder, copyAssetsFolder } from '../../projectTools/projectParser';
import { copyFileSync, copyFolderContentsRecursiveSync } from '../../systemTools/fileutils';
import { getMergedPlugin } from '../../pluginTools';
import { selectWebToolAndDeploy, selectWebToolAndExport } from '../../deployTools/webTools';
import { getValidLocalhost } from '../../utils';
import Config from '../../config';

const _generateWebpackConfigs = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);

    const { plugins } = c.buildConfig;
    let modulePaths = [];
    let moduleAliasesString = '';
    const moduleAliases = {};

    for (const key in plugins) {
        const plugin = getMergedPlugin(c, key, plugins);
        if (!plugin) {

        } else if (plugin.webpack) {
            if (plugin.webpack.modulePaths) {
                if (plugin.webpack.modulePaths === true) {
                    modulePaths.push(`node_modules/${key}`);
                } else {
                    modulePaths = modulePaths.concat(plugin.webpack.modulePaths);
                }
            }
            if (plugin.webpack.moduleAliases) {
                if (plugin.webpack.moduleAliases === true) {
                    moduleAliasesString += `'${key}': {
                  projectPath: 'node_modules/${key}'
                },`;
                    moduleAliases[key] = { projectPath: `node_modules/${key}` };
                } else {
                    for (const aKey in plugin.webpack.moduleAliases) {
                        if (typeof plugin.webpack.moduleAliases[aKey] === 'string') {
                            moduleAliasesString += `'${aKey}': '${plugin.webpack.moduleAliases[aKey]}',`;
                            moduleAliases[key] = plugin.webpack.moduleAliases[aKey];
                        } else {
                            moduleAliasesString += `'${aKey}': {projectPath: '${plugin.webpack.moduleAliases[aKey].projectPath}'},`;
                            if (plugin.webpack.moduleAliases[aKey].projectPath) {
                                moduleAliases[key] = { projectPath: plugin.webpack.moduleAliases[aKey].projectPath };
                            }
                        }
                    }
                }
            }
        }
    }

    const env = getConfigProp(c, platform, 'environment');
    const extendConfig = getConfigProp(c, platform, 'webpackConfig', {});
    const entryFile = getConfigProp(c, platform, 'entryFile', 'index.web');
    const title = getAppTitle(c, platform);
    const analyzer = getConfigProp(c, platform, 'analyzer') || c.program.analyzer;

    copyFileSync(
        path.join(templateFolder, '_privateConfig', env === 'production' ? 'webpack.config.js' : 'webpack.config.dev.js'),
        path.join(appFolder, 'webpack.config.js')
    );

    const obj = {
        modulePaths,
        moduleAliases,
        analyzer,
        entryFile,
        title,
        extensions: getSourceExts(c, platform),
        ...extendConfig
    };

    const extendJs = `
    module.exports = ${JSON.stringify(obj, null, 2)}`;

    fs.writeFileSync(path.join(appFolder, 'webpack.extend.js'), extendJs);
};

export const buildWeb = (c, platform) => new Promise((resolve, reject) => {
    const { debug, debugIp } = c.program;
    logTask(`buildWeb:${platform}`);

    const appFolder = getAppFolder(c, platform);

    let debugVariables = '';

    if (debug) {
        logInfo(`Starting a remote debugger build with ip ${debugIp || ip.address()}. If this IP is not correct, you can always override it with --debugIp`);
        debugVariables += `DEBUG=true DEBUG_IP=${debugIp || ip.address()}`;
    }

    const wbp = resolveNodeModulePath(c, 'webpack/bin/webpack.js');

    executeAsync(c, `npx cross-env PLATFORM=${platform} NODE_ENV=production ${debugVariables} node ${wbp} -p --config ./platformBuilds/${c.runtime.appId}_${platform}/webpack.config.js`)
        .then(() => {
            logSuccess(`Your Build is located in ${chalk.white(path.join(appFolder, 'public'))} .`);
            resolve();
        })
        .catch(e => reject(e));
});

const configureNextIfRequired = async (c) => {
    const { platformTemplatesDirs, dir } = c.paths.project;
    const publicDir = path.join(dir, 'public');
    const baseFontsDir = c.paths.appConfig.fontDirs?.[0];
    const stylesDir = path.join(dir, 'styles');
    const pagesDir = path.resolve(getConfigProp(c, c.platform, 'pagesDir') || 'src/app');
    const _appFile = path.join(pagesDir, '_app.js');
    const platformTemplateDir = path.join(platformTemplatesDirs[c.platform], `_${c.platform}`);
    const configFile = path.join(dir, NEXT_CONFIG_NAME);

    // handle fonts
    !fs.existsSync(publicDir) && fs.mkdirSync(publicDir);
    !fs.existsSync(path.join(publicDir, 'fonts')) && fs.symlinkSync(baseFontsDir, path.join(publicDir, 'fonts'));

    // create styles dir and global fonts.css file
    if (!fs.existsSync(stylesDir)) {
        fs.mkdirSync(stylesDir);
        let cssOutput = '';

        const fontFiles = fs.readdirSync(baseFontsDir);
        fontFiles.forEach((file) => {
            cssOutput += `
                @font-face {
                    font-family: '${file.split('.')[0]}';
                    src: url('/fonts/${file}');
                }

            `;
        });

        fs.writeFileSync(path.join(stylesDir, 'fonts.css'), cssOutput);
    }

    // add wrapper _app
    if (!fs.existsSync(_appFile)) {
        writeCleanFile(path.join(platformTemplateDir, '_app.js'), _appFile, [{ pattern: '{{FONTS_CSS}}', override: path.relative(pagesDir, path.resolve('styles/fonts.css')) }]);
    }

    // add config
    if (!fs.existsSync(configFile)) {
        writeCleanFile(path.join(platformTemplateDir, NEXT_CONFIG_NAME), configFile);
    }
};

export const runWebNext = async (c, platform, port) => {
    logTask(`runWebNext:${platform}:${port}`);
    await configureNextIfRequired(c);

    const devServerHost = c.runtime.localhost;

    const isPortActive = await checkPortInUse(c, platform, port);

    if (!isPortActive) {
        logInfo(
            `Looks like your ${chalk.white(platform)} devServerHost ${chalk.white(devServerHost)} at port ${chalk.white(
                port
            )} is not running. Starting it up for you...`
        );
        await _runWebBrowser(c, platform, devServerHost, port, false);
        await runWebDevServer(c, platform, port);
    } else {
        await confirmActiveBundler(c);
        await _runWebBrowser(c, platform, devServerHost, port, true);
    }
};

const _runWebBrowser = (c, platform, devServerHost, port, alreadyStarted) => new Promise((resolve) => {
    logTask(`_runWebBrowser:${platform}:${devServerHost}:${port}:${c.runtime.shouldOpenBrowser}`);
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

export const buildWebNext = async (c) => {
    logTask('buildWebNext');
    const env = getConfigProp(c, c.platform, 'environment');
    const pagesDir = getConfigProp(c, c.platform, 'pagesDir');
    if (!pagesDir) logWarning(`You're missing ${c.platform}.pagesDir config. Defaulting to 'src/app'`);

    await executeAsync(c, `npx next build ./platformBuilds/${c.runtime.appId}_${c.platform} --pagesDir ${pagesDir || 'src/app'}`, { ...process.env, env: { NODE_ENV: env || 'development' }, interactive: true });
    return executeAsync(c, `npx next export ./platformBuilds/${c.runtime.appId}_${c.platform} --pagesDir ${pagesDir || 'src/app'}`, { ...process.env, env: { NODE_ENV: env || 'development' }, interactive: true });
};

export const runWebDevServer = (c, platform, port) => {
    logTask(`runWebDevServer:${platform}`);
    const env = getConfigProp(c, platform, 'environment');
    const pagesDir = getConfigProp(c, platform, 'pagesDir');
    if (!pagesDir) logWarning(`You're missing ${platform}.pagesDir config. Defaulting to 'src/app'`);

    return executeAsync(c, `npx next --pagesDir ${pagesDir || 'src/app'} --port ${port}`, { env: { NODE_ENV: env || 'development' }, interactive: true });
};

export const deployWeb = (c, platform) => {
    logTask(`deployWeb:${platform}`);
    return selectWebToolAndDeploy(c, platform);
};

export const exportWeb = (c, platform) => {
    logTask(`exportWeb:${platform}`);
    return selectWebToolAndExport(c, platform);
};
