/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import open from 'react-dev-utils/openBrowser';
import ip from 'ip';
import { executeAsync } from '../../systemTools/exec';
import {
    logTask,
    getAppFolder,
    isPlatformActive,
    getAppTemplateFolder,
    checkPortInUse,
    logInfo,
    logDebug,
    resolveNodeModulePath,
    getConfigProp,
    logSuccess,
    waitForWebpack,
    logError,
    logWarning,
    writeCleanFile,
    getBuildFilePath,
    getAppTitle,
    getSourceExts,
    sanitizeColor
} from '../../common';
import { PLATFORMS, WEB } from '../../constants';
import { copyBuildsFolder, copyAssetsFolder } from '../../projectTools/projectParser';
import { copyFileSync } from '../../systemTools/fileutils';
import { getMergedPlugin } from '../../pluginTools';
import { selectWebToolAndDeploy, selectWebToolAndExport } from '../../deployTools/webTools';


const isRunningOnWindows = process.platform === 'win32';

const _generateWebpackConfigs = (c) => {
    const appFolder = getAppFolder(c, c.platform);
    const templateFolder = getAppTemplateFolder(c, c.platform);

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

    const env = getConfigProp(c, c.platform, 'environment');
    const extendConfig = getConfigProp(c, c.platform, 'webpackConfig', {});
    const entryFile = getConfigProp(c, c.platform, 'entryFile', 'index.web');
    const title = getAppTitle(c, c.platform);
    const analyzer = getConfigProp(c, c.platform, 'analyzer') || c.program.analyzer;

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
        extensions: getSourceExts(c),
        ...extendConfig
    };

    const extendJs = `
    module.exports = ${JSON.stringify(obj, null, 2)}`;

    fs.writeFileSync(path.join(appFolder, 'webpack.extend.js'), extendJs);
};

const buildWeb = (c, platform) => new Promise((resolve, reject) => {
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

const configureWebProject = async (c, platform) => {
    logTask(`configureWebProject:${platform}`);

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);

    await configureCoreWebProject(c, platform);

    return copyBuildsFolder(c, platform);
};

export const configureCoreWebProject = async (c, platform) => {
    _generateWebpackConfigs(c);
    _parseCssSync(c, platform);
};

const _parseCssSync = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const stringsPath = 'public/app.css';
    writeCleanFile(getBuildFilePath(c, platform, stringsPath), path.join(appFolder, stringsPath), [
        { pattern: '{{PLUGIN_COLORS_BG}}', override: sanitizeColor(getConfigProp(c, platform, 'backgroundColor')).hex },
    ]);
};

const runWeb = (c, platform, port, shouldOpenBrowser) => new Promise((resolve, reject) => {
    logTask(`runWeb:${platform}:${port}`);

    let devServerHost = '0.0.0.0';

    if (platform === WEB) {
        const extendConfig = getConfigProp(c, c.platform, 'webpackConfig', {});
        if (extendConfig.devServerHost) devServerHost = extendConfig.devServerHost;
    }

    if (isRunningOnWindows && devServerHost === '0.0.0.0') {
        devServerHost = '127.0.0.1';
    }

    checkPortInUse(c, platform, port)
        .then((isPortActive) => {
            if (!isPortActive) {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServerHost ${chalk.white(devServerHost)} at port ${chalk.white(
                        port
                    )} is not running. Starting it up for you...`
                );
                _runWebBrowser(c, platform, devServerHost, port, false, shouldOpenBrowser)
                    .then(() => runWebDevServer(c, platform, port))
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                logWarning(
                    `Looks like your ${chalk.white(platform)} devServerHost at port ${chalk.white(
                        port
                    )} is already running. ReNative Will use it!`
                );
                _runWebBrowser(c, platform, devServerHost, port, true, shouldOpenBrowser)
                    .then(() => resolve())
                    .catch(e => reject(e));
            }
        })
        .catch(e => reject(e));
});

const _runWebBrowser = (c, platform, devServerHost, port, alreadyStarted, shouldOpenBrowser) => new Promise((resolve) => {
    logTask(`_runWebBrowser:${platform}:${devServerHost}:${port}:${shouldOpenBrowser}`);
    if (!shouldOpenBrowser) return resolve();
    const wait = waitForWebpack(c, port)
        .then(() => {
            open(`http://${devServerHost}:${port}/`);
        })
        .catch((e) => {
            logWarning(e);
        });
    if (alreadyStarted) return wait; // if it's already started, return the promise so it rnv will wait, otherwise it will exit before opening the browser
    return resolve();
});

const runWebDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWebDevServer:${platform}`);
    const { debug, debugIp } = c.program;

    const appFolder = getAppFolder(c, platform);
    const wpPublic = path.join(appFolder, 'public');
    const wpConfig = path.join(appFolder, 'webpack.config.js');

    let debugVariables = '';

    if (debug) {
        logInfo(`Starting a remote debugger build with ip ${debugIp || ip.address()}. If this IP is not correct, you can always override it with --debugIp`);
        debugVariables += `DEBUG=true DEBUG_IP=${debugIp || ip.address()}`;
    }

    const command = `npx cross-env PLATFORM=${platform} ${debugVariables} webpack-dev-server -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --port ${port} --mode=development`;
    executeAsync(c, command, { stdio: 'inherit', silent: true })
        .then(() => {
            logDebug('runWebDevServer: running');
            resolve();
        })
        .catch((e) => {
            logDebug(e);
            resolve();
        });
});

const deployWeb = (c, platform) => {
    logTask(`deployWeb:${platform}`);
    return selectWebToolAndDeploy(c, platform);
};

const exportWeb = (c, platform) => {
    logTask(`exportWeb:${platform}`);
    return selectWebToolAndExport(c, platform);
};

export { buildWeb, runWeb, configureWebProject, deployWeb, exportWeb };
