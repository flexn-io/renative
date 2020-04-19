/* eslint-disable no-restricted-syntax */
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
import {
    logTask,
    logInfo,
    logDebug,
    logSuccess,
    logWarning
} from '../../systemTools/logger';
import { WEB } from '../../constants';
import {
    copyBuildsFolder,
    copyAssetsFolder
} from '../../projectTools/projectParser';
import { copyFileSync, readObjectSync } from '../../systemTools/fileutils';
import { getMergedPlugin } from '../../pluginTools';
import {
    selectWebToolAndDeploy,
    selectWebToolAndExport
} from '../../deployTools/webTools';
import { getValidLocalhost } from '../../utils';
import { doResolvePath } from '../../resolve';

const _generateWebpackConfigs = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);

    const { plugins } = c.buildConfig;
    let modulePaths = [];
    const moduleAliases = {};

    const modulePath = path.join(c.paths.project.builds.dir, '_shared', 'modules.json');
    let externalModulePaths = [];
    let localModulePaths = [];
    if (fs.existsSync(modulePath)) {
        const modules = readObjectSync(modulePath);
        externalModulePaths = modules.external;
        localModulePaths = modules.local;
        // const modules = eval(fs.readFileSync(modulePath));
    }


    // eslint-disable-next-line guard-for-in, no-unused-vars
    for (const key in plugins) {
        const plugin = getMergedPlugin(c, key, plugins);
        if (!plugin) {
            // naffin
        } else if (plugin.webpack) {
            if (plugin.webpack.modulePaths) {
                if (plugin.webpack.modulePaths === true) {
                    // modulePaths.push(doResolve(key));
                    modulePaths.push(`node_modules/${key}`);
                } else {
                    modulePaths = modulePaths.concat(
                        // plugin.webpack.modulePaths.map(aPath => doResolvePath(aPath))
                        plugin.webpack.modulePaths.map(aPath => `${aPath}`)
                    );
                }
            }
            if (plugin.webpack.moduleAliases) {
                if (plugin.webpack.moduleAliases === true) {
                    moduleAliases[key] = { projectPath: `node_modules/${key}` };
                } else {
                    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
                    for (const aKey in plugin.webpack.moduleAliases) {
                        if (
                            typeof plugin.webpack.moduleAliases[aKey] === 'string'
                        ) {
                            moduleAliases[key] = plugin.webpack.moduleAliases[aKey];
                        } else if (plugin.webpack.moduleAliases[aKey].path) {
                            moduleAliases[key] = {
                                projectPath: plugin.webpack.moduleAliases[aKey].path
                            };
                        } else if (plugin.webpack.moduleAliases[aKey].projectPath) {
                            moduleAliases[key] = {
                                projectPath: plugin.webpack.moduleAliases[aKey].projectPath
                            };
                        }
                    }
                }
            }
        }
    }

    modulePaths = modulePaths
        .map(v => doResolvePath(v, true, {}, c.paths.project.dir))
        .concat(externalModulePaths.map(v => doResolvePath(v, true, {}, c.paths.project.nodeModulesDir)))
        .concat(localModulePaths.map(v => path.join(c.paths.project.dir, v)));

    const env = getConfigProp(c, platform, 'environment');
    const extendConfig = getConfigProp(c, platform, 'webpackConfig', {});
    const entryFile = getConfigProp(c, platform, 'entryFile', 'index.web');
    const title = getAppTitle(c, platform);
    const analyzer = getConfigProp(c, platform, 'analyzer') || c.program.analyzer;

    copyFileSync(
        path.join(
            templateFolder,
            '_privateConfig',
            env === 'production' ? 'webpack.config.js' : 'webpack.config.dev.js'
        ),
        path.join(appFolder, 'webpack.config.js')
    );

    // const externalModulesResolved = externalModules.map(v => doResolve(v))

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

const buildWeb = (c, platform) => new Promise((resolve, reject) => {
    const { debug, debugIp } = c.program;
    logTask(`buildWeb:${platform}`);

    const appFolder = getAppFolder(c, platform);

    let debugVariables = '';

    if (debug) {
        logInfo(
            `Starting a remote debugger build with ip ${debugIp
                    || ip.address()}. If this IP is not correct, you can always override it with --debugIp`
        );
        debugVariables += `DEBUG=true DEBUG_IP=${debugIp || ip.address()}`;
    }

    const wbp = doResolvePath('webpack/bin/webpack.js');

    executeAsync(
        c,
        `npx cross-env PLATFORM=${platform} NODE_ENV=production ${debugVariables} node ${wbp} -p --config ./platformBuilds/${c.runtime.appId}_${platform}/webpack.config.js`
    )
        .then(() => {
            logSuccess(
                `Your Build is located in ${chalk.white(
                    path.join(appFolder, 'public')
                )} .`
            );
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
    _generateWebpackConfigs(c, platform);
    _parseCssSync(c, platform);
};

const _parseCssSync = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const stringsPath = 'public/app.css';
    writeCleanFile(
        getBuildFilePath(c, platform, stringsPath),
        path.join(appFolder, stringsPath),
        [
            {
                pattern: '{{PLUGIN_COLORS_BG}}',
                override: sanitizeColor(
                    getConfigProp(c, platform, 'backgroundColor')
                ).hex
            }
        ]
    );
};

const runWeb = async (c, platform, port) => {
    logTask(`runWeb:${platform}:${port}`);

    let devServerHost = c.runtime.localhost;

    if (platform === WEB) {
        const extendConfig = getConfigProp(c, c.platform, 'webpackConfig', {});
        devServerHost = getValidLocalhost(
            extendConfig.devServerHost,
            c.runtime.localhost
        );
    }

    const isPortActive = await checkPortInUse(c, platform, port);

    if (!isPortActive) {
        logInfo(
            `Looks like your ${chalk.white(
                platform
            )} devServerHost ${chalk.white(
                devServerHost
            )} at port ${chalk.white(
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
    logTask(
        `_runWebBrowser:${platform}:${devServerHost}:${port}:${c.runtime.shouldOpenBrowser}`
    );
    if (!c.runtime.shouldOpenBrowser) return resolve();
    const wait = waitForWebpack(c)
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
        logInfo(
            `Starting a remote debugger build with ip ${debugIp
                    || ip.address()}. If this IP is not correct, you can always override it with --debugIp`
        );
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
