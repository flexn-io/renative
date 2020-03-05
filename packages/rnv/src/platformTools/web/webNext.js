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
import { logTask, logInfo, logDebug, logSuccess, logWarning } from '../../systemTools/logger';
import { WEB } from '../../constants';
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
        extensions: getSourceExts(c),
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
    const { srcDir, platformTemplatesDirs } = c.paths.project;
    const pagesDir = path.join(srcDir, 'pages');
    const publicDir = path.join(srcDir, 'public');
    const baseFontsDir = c.paths.appConfig.fontDirs[0];
    const stylesDir = path.join(srcDir, 'styles');

    const platformTemplateDir = path.join(platformTemplatesDirs[c.platform], c.platform);
    copyFolderContentsRecursiveSync(platformTemplateDir, srcDir); // move to projectTemplates

    // pages hardcoded for helloworld
    !fs.existsSync(path.join(pagesDir, 'index.js')) && fs.symlinkSync(path.join(srcDir, 'app/index.web.js'), path.join(pagesDir, 'index.js')); // move to projectTemplates
    !fs.existsSync(path.join(pagesDir, 'my-page.js')) && fs.symlinkSync(path.join(srcDir, 'screenMyPage.js'), path.join(pagesDir, 'my-page.js'));

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

export const runWebDevServer = (c, platform, port) => {
    logTask(`runWebDevServer:${platform}`);

    const { srcDir, builds: { dir } } = c.paths.project;
    // const platformBuildDir = path.join(dir, `${c.runtime.appId}_${c.platform}`);

    return executeAsync(c, `npx next ${srcDir} --port ${port}`);

    // const { debug, debugIp } = c.program;

    // const appFolder = getAppFolder(c, platform);
    // const wpPublic = path.join(appFolder, 'public');
    // const wpConfig = path.join(appFolder, 'webpack.config.js');

    // let debugVariables = '';

    // if (debug) {
    //     logInfo(`Starting a remote debugger build with ip ${debugIp || ip.address()}. If this IP is not correct, you can always override it with --debugIp`);
    //     debugVariables += `DEBUG=true DEBUG_IP=${debugIp || ip.address()}`;
    // }

    // const command = `npx cross-env PLATFORM=${platform} ${debugVariables} webpack-dev-server -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --port ${port} --mode=development`;
    // executeAsync(c, command, { stdio: 'inherit', silent: true })
    //     .then(() => {
    //         logDebug('runWebDevServer: running');
    //         resolve();
    //     })
    //     .catch((e) => {
    //         logDebug(e);
    //         resolve();
    //     });
};

export const deployWeb = (c, platform) => {
    logTask(`deployWeb:${platform}`);
    return selectWebToolAndDeploy(c, platform);
};

export const exportWeb = (c, platform) => {
    logTask(`exportWeb:${platform}`);
    return selectWebToolAndExport(c, platform);
};
