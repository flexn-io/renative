/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import open from 'open';
import ip from 'ip';
import { execShellAsync } from '../systemTools/exec';
import {
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    logError,
    getAppFolder,
    isPlatformActive,
    checkSdk,
    logWarning,
    configureIfRequired,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    copyBuildsFolder,
    getAppTemplateFolder,
    checkPortInUse,
    logInfo,
    askQuestion,
    finishQuestion,
    resolveNodeModulePath,
    getConfigProp,
    logSuccess
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../systemTools/fileutils';
import { getMergedPlugin } from '../pluginTools';
import { selectWebToolAndDeploy } from '../deployTools/webTools';

import { RNV_APP_CONFIG_NAME } from '../constants';

const { fork } = require('child_process');

const isRunningOnWindows = process.platform === 'win32'

const _generateWebpackConfigs = (c) => {
    const appFolder = getAppFolder(c, c.platform);
    const templateFolder = getAppTemplateFolder(c, c.platform);

    const plugins = c.files.pluginConfig.plugins;
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

    const modulePathsString = modulePaths.length ? `'${modulePaths.join("','")}'` : '';

    const env = getConfigProp(c, c.platform, 'environment');
    const extendConfig = getConfigProp(c, c.platform, 'webpackConfig', {});
    const entryFile = getConfigProp(c, c.platform, 'entryFile', 'index.web');

    copyFileSync(
        path.join(templateFolder, '_privateConfig', env === 'production' ? 'webpack.config.js' : 'webpack.config.dev.js'),
        path.join(appFolder, 'webpack.config.js')
    );

    const obj = {
        modulePaths,
        moduleAliases,
        entryFile,
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

    _generateWebpackConfigs(c);

    const wbp = resolveNodeModulePath(c, 'webpack/bin/webpack.js');

    execShellAsync(`npx cross-env NODE_ENV=production ${debugVariables} node ${wbp} -p --config ./platformBuilds/${c.appId}_${platform}/webpack.config.js`)
        .then(() => {
            logSuccess(`Your Build is located in ${chalk.white(path.join(appFolder, 'public'))} .`);
            resolve();
        })
        .catch(e => reject(e));
});

const configureWebProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureWebOSProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    // configureIfRequired(c, platform)
    //     .then(() => configureProject(c, platform))
    copyBuildsFolder(c, platform)
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    resolve();
});

const runWeb = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWeb:${platform}:${port}`);

    const extendConfig = getConfigProp(c, c.platform, 'webpackConfig', {});
    let devServerHost = extendConfig.devServerHost || '0.0.0.0';

    
    if (isRunningOnWindows && devServerHost === '0.0.0.0') {
        devServerHost = '127.0.0.1'
    }

    checkPortInUse(c, platform, port)
        .then((isPortActive) => {
            if (!isPortActive) {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServerHost ${chalk.white(devServerHost)} at port ${chalk.white(
                        port
                    )} is not running. Starting it up for you...`
                );
                _runWebBrowser(c, platform, devServerHost, port, 500)
                    .then(() => runWebDevServer(c, platform, port))
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServerHost at port ${chalk.white(
                        port
                    )} is already running. ReNative Will use it!`
                );
                _runWebBrowser(c, platform, devServerHost, port)
                    .then(() => resolve())
                    .catch(e => reject(e));
            }
        })
        .catch(e => reject(e));
});

const _runWebBrowser = (c, platform, devServerHost, port, delay = 0) => new Promise((resolve, reject) => {
    // if (delay) {
    //         const process = fork(path.join(c.paths.rnvNodeModulesFolder, 'open', 'index.js'));
    //         process.send(`http://0.0.0.0:${port}`);
    // } else {
    //     open(`http://0.0.0.0:${port}`);
    // }
    open(`http://${devServerHost}:${port}`);
    resolve();
});

const runWebDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWebDevServer:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const wpConfig = path.join(appFolder, 'webpack.config.js');
    const wpPublic = path.join(appFolder, 'public');

    _generateWebpackConfigs(c);
    const wds = resolveNodeModulePath(c, 'webpack-dev-server/bin/webpack-dev-server.js');

    shell.exec(
        `node ${wds} -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --port ${port}`
    );
    resolve();
});

const deployWeb = (c, platform) => new Promise((resolve, reject) => {
    logTask(`deployWeb:${platform}`);
    selectWebToolAndDeploy(c, platform).then(resolve).catch(reject);
});

export { buildWeb, runWeb, configureWebProject, runWebDevServer, deployWeb };
