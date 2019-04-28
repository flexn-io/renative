import path from 'path';
import shell from 'shelljs';
import { execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, checkSdk, logWarning, configureIfRequired,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH, copyBuildsFolder,
    getAppTemplateFolder,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

function buildWeb(c, platform) {
    logTask(`buildWeb:${platform}`);

    const wbp = path.resolve(c.nodeModulesFolder, 'webpack/bin/webpack.js');

    return execShellAsync(`NODE_ENV=production ${wbp} -p --config ./platformBuilds/${c.appId}_${platform}/webpack.config.js`);
}

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
    logTask(`runWeb:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    const wpConfig = path.join(appFolder, 'webpack.config.js');
    const wpPublic = path.join(appFolder, 'public');

    const wds = path.resolve(c.nodeModulesFolder, 'webpack-dev-server/bin/webpack-dev-server.js');

    shell.exec(`node ${wds} -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --host 0.0.0.0 --port ${port}`);
    resolve();
});

const runWebDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWebDevServer:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    copyFileSync(path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'), path.join(appFolder, 'webpack.config.js'));

    runWeb(c, platform, port)
        .then(() => resolve())
        .catch(e => reject(e));
});


export { buildWeb, runWeb, configureWebProject, runWebDevServer };
