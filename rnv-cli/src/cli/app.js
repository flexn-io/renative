import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    isPlatformSupported, getConfig, logTask, logComplete, getQuestion, logSuccess,
    logError, getAppFolder, isPlatformActive, logWarning, configureIfRequired,
} from '../common';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, WEB, MACOS,
    WINDOWS, TIZEN_WATCH, KAIOS, FIREFOX_OS, FIREFOX_TV, RNV_APP_CONFIG_NAME,
    RNV_PROJECT_CONFIG_NAME,
} from '../constants';
import { runPod, copyAppleAssets, configureXcodeProject } from '../platformTools/apple';
import { configureGradleProject, configureAndroidProperties } from '../platformTools/android';
import { configureTizenProject, createDevelopTizenCertificate, configureTizenGlobal } from '../platformTools/tizen';
import { configureWebOSProject } from '../platformTools/webos';
import { configureElectronProject } from '../platformTools/electron';
import { configureKaiOSProject } from '../platformTools/firefox';
import { configureWebProject } from '../platformTools/web';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import platformRunner from './platform';
import { executePipe } from '../buildHooks';

const CONFIGURE = 'configure';
const SWITCH = 'switch';
const CREATE = 'create';
const REMOVE = 'remove';
const LIST = 'list';
const INFO = 'info';

const PIPES = {
    APP_CONFIGURE_BEFORE: 'app:configure:before',
    APP_CONFIGURE_AFTER: 'app:configure:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case CONFIGURE:
        return _runConfigure(c);
        break;
    case CREATE:
        return _runCreate(c);
        break;
    // case SWITCH:
    //     return Promise.resolve();
    //     break;
    //
    // case REMOVE:
    //     return Promise.resolve();
    //     break;
    // case LIST:
    //     return Promise.resolve();
    //     break;
    // case INFO:
    //     return Promise.resolve();
    //     break;
    default:
        return Promise.reject(`Sub-Command ${c.subCommand} not supported`);
    }
};

// ##########################################
//  PRIVATE
// ##########################################

const _runConfigure = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`_runConfigure:${p}`);

    executePipe(c, PIPES.APP_CONFIGURE_BEFORE)
        .then(() => _checkAndCreatePlatforms(c, c.program.platform))
        .then(() => copyRuntimeAssets(c))
        .then(() => _runPlugins(c, c.rnvPluginsFolder))
        .then(() => _runPlugins(c, c.projectPluginsFolder))
        .then(() => (_isOK(c, p, [ANDROID, ANDROID_TV, ANDROID_WEAR]) ? configureAndroidProperties(c) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID]) ? configureGradleProject(c, ANDROID) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_TV]) ? configureGradleProject(c, ANDROID_TV) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_WEAR]) ? configureGradleProject(c, ANDROID_WEAR) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenGlobal(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenProject(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN_WATCH]) ? configureTizenProject(c, TIZEN_WATCH) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WEBOS]) ? configureWebOSProject(c, WEBOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WEB]) ? configureWebProject(c, WEB) : Promise.resolve()))
        .then(() => (_isOK(c, p, [MACOS]) ? configureElectronProject(c, MACOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WINDOWS]) ? configureElectronProject(c, WINDOWS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [KAIOS]) ? configureKaiOSProject(c, KAIOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [FIREFOX_OS]) ? configureKaiOSProject(c, FIREFOX_OS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [FIREFOX_TV]) ? configureKaiOSProject(c, FIREFOX_TV) : Promise.resolve()))
        .then(() => (_isOK(c, p, [IOS]) ? configureXcodeProject(c, IOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TVOS]) ? configureXcodeProject(c, TVOS) : Promise.resolve()))
        .then(() => executePipe(c, PIPES.APP_CONFIGURE_AFTER))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _isOK = (c, p, list) => {
    let result = false;
    list.forEach((v) => {
        if (isPlatformActive(c, v) && (p === v || p === 'all')) result = true;
    });
    return result;
};

const _runCreate = c => new Promise((resolve, reject) => {
    logTask('_runCreate');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const data = {};

    readline.question(getQuestion('What\'s your project Name? (no spaces, folder based on ID will be created in this directory)'), (v) => {
        // console.log(`Hi ${v}!`);
        data.projectName = v;
        readline.question(getQuestion('What\'s your project Title?'), (v) => {
            data.appTitle = v;
            data.appID = `com.mycompany.${data.projectName}`;
            readline.question(getQuestion(`What\'s your App ID? (${data.appID}) will be used by default`), (v) => {
                // readline.question(getQuestion(`What\'s your Team ID (iOS)? You can configure it later as well.`), (teamID) => {
                data.teamID = '';
                if (v !== null && v !== '') {
                    data.appID = v.replace(/\s+/g, '-').toLowerCase();
                }

                data.defaultAppConfigId = `${data.projectName}Example`;

                readline.close();

                const base = path.resolve('.');

                c.projectRootFolder = path.join(base, data.projectName);
                c.projectPackagePath = path.join(c.projectRootFolder, 'package.json');


                data.packageName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

                mkdirSync(c.projectRootFolder);

                checkAndCreateProjectPackage(c, data.packageName, data.appTitle, data.appID, data.defaultAppConfigId, data.teamID);

                checkAndCreateGitignore(c);

                checkAndCreateProjectConfig(c);

                logSuccess(`Your project is ready! navigate to project ${chalk.white(`cd ${data.projectName}`)} and run ${chalk.white('rnv run -p web')} to see magic happen!`);

                resolve();
            //  });
            });
        });
    });
});

const checkAndCreateProjectPackage = (c, pkgName, appTitle, appID, defaultAppConfigId, teamID) => {
    logTask(`checkAndCreateProjectPackage:${pkgName}`);
    if (!fs.existsSync(c.projectPackagePath)) {
        logWarning('Looks like your package.json is missing. Let\'s create one for you!');

        const pkgJsonString = fs.readFileSync(path.join(c.rnvHomeFolder, 'supportFiles/package-template.json')).toString();


        const pkgJsonStringClean = pkgJsonString
            .replace(/{{PACKAGE_NAME}}/g, pkgName)
            .replace(/{{DEFAULT_APP_CONFIG}}/g, defaultAppConfigId)
            .replace(/{{APP_ID}}/g, appID)
            .replace(/{{RNV_VERSION}}/g, c.rnvPackage.version)
            .replace(/{{PACKAGE_VERSION}}/g, '0.1.0')
            .replace(/{{PACKAGE_TITLE}}/g, appTitle);

        fs.writeFileSync(c.projectPackagePath, pkgJsonStringClean);
    }
};

const checkAndCreateGitignore = (c) => {
    logTask('checkAndCreateGitignore');
    const ignrPath = path.join(c.projectRootFolder, '.gitignore');
    if (!fs.existsSync(ignrPath)) {
        logWarning('Looks like your .gitignore is missing. Let\'s create one for you!');

        copyFileSync(path.join(c.rnvHomeFolder, 'supportFiles/gitignore-template'), ignrPath);
    }
};

const checkAndCreateProjectConfig = (c) => {
    logTask('checkAndCreateProjectConfig');
    // Check Project Config
    if (fs.existsSync(c.projectConfigPath)) {

    } else {
        logWarning(`You're missing ${RNV_PROJECT_CONFIG_NAME} file in your root project! Let's create one!`);

        copyFileSync(path.join(c.rnvRootFolder, RNV_PROJECT_CONFIG_NAME),
            path.join(c.projectRootFolder, RNV_PROJECT_CONFIG_NAME));
    }
};


const _checkAndCreatePlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_checkAndCreatePlatforms:${platform}`);

    if (!fs.existsSync(c.platformBuildsFolder)) {
        logWarning('Platforms not created yet. creating them for you...');

        const newCommand = Object.assign({}, c);
        newCommand.subCommand = 'configure';
        newCommand.program = { appConfig: c.defaultAppConfigId, platform };

        platformRunner(newCommand)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    } if (platform) {
        const appFolder = getAppFolder(c, platform);
        if (!fs.existsSync(appFolder)) {
            logWarning(`Platform ${platform} not created yet. creating them for you...`);

            const newCommand = Object.assign({}, c);
            newCommand.subCommand = 'configure';
            newCommand.program = { appConfig: c.defaultAppConfigId, platform };

            platformRunner(newCommand)
                .then(() => resolve())
                .catch(e => reject(e));

            return;
        }
    } else {
        const platforms = c.appConfigFile.platforms;
        cmds = [];
        for (const k in platforms) {
            if (!fs.existsSync(k)) {
                logWarning(`Platform ${k} not created yet. creating one for you...`);

                const newCommand = Object.assign({}, c);
                newCommand.subCommand = 'configure';
                newCommand.program = { appConfig: c.defaultAppConfigId, platform };
                cmds.push(platformRunner(newCommand));
            }
        }

        Promise.all(cmds)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    resolve();
});

const copyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('copyRuntimeAssets');
    const aPath = path.join(c.platformAssetsFolder, 'runtime');
    const cPath = path.join(c.appConfigFolder, 'assets/runtime');
    copyFolderContentsRecursiveSync(cPath, aPath);

    // copyFileSync(c.appConfigPath, path.join(c.platformAssetsFolder, RNV_APP_CONFIG_NAME));
    fs.writeFileSync(path.join(c.platformAssetsFolder, RNV_APP_CONFIG_NAME), JSON.stringify(c.appConfigFile, null, 2));

    // FONTS
    let fontsObj = 'export default [';

    if (c.appConfigFile) {
        if (fs.existsSync(c.fontsConfigFolder)) {
            fs.readdirSync(c.fontsConfigFolder).forEach((font) => {
                if (font.includes('.ttf') || font.includes('.otf')) {
                    const key = font.split('.')[0];
                    const includedFonts = c.appConfigFile.common.includedFonts;
                    if (includedFonts) {
                        if (includedFonts.includes('*') || includedFonts.includes(key)) {
                            if (font) {
                                const fontSource = path.join(c.projectConfigFolder, 'fonts', font);
                                if (fs.existsSync(fontSource)) {
                                    // const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                                    // mkdirSync(fontFolder);
                                    // const fontDest = path.join(fontFolder, font);
                                    // copyFileSync(fontSource, fontDest);
                                    fontsObj += `{
                                          fontFamily: '${key}',
                                          file: require('../../projectConfig/fonts/${font}'),
                                      },`;
                                } else {
                                    logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    fontsObj += '];';
    fs.writeFileSync(path.join(c.platformAssetsFolder, 'runtime', 'fonts.js'), fontsObj);
    const supportFiles = path.resolve(c.rnvHomeFolder, 'supportFiles');
    copyFileSync(path.resolve(supportFiles, 'fontManager.js'), path.resolve(c.platformAssetsFolder, 'runtime', 'fontManager.js'));
    copyFileSync(path.resolve(supportFiles, 'fontManager.web.js'), path.resolve(c.platformAssetsFolder, 'runtime', 'fontManager.web.js'));

    resolve();
});


const _runPlugins = (c, pluginsPath) => new Promise((resolve, reject) => {
    logTask('_runPlugins');

    mkdirSync(path.resolve(c.platformBuildsFolder, '_shared'));

    copyFolderContentsRecursiveSync(path.resolve(c.platformTemplatesFolder, '_shared'), path.resolve(c.platformBuildsFolder, '_shared'));
    // copyFileSync(path.resolve(c.platformTemplatesFolder, '_shared/template.js'), path.resolve(c.platformBuildsFolder, '_shared/template.js'));

    if (!fs.existsSync(pluginsPath)) {
        logWarning(`Your project plugin folder ${pluginsPath} does not exists. skipping plugin configuration`);
        resolve();
        return;
    }

    fs.readdirSync(pluginsPath).forEach((dir) => {
        const source = path.resolve(pluginsPath, dir, 'overrides');
        const dest = path.resolve(c.projectRootFolder, 'node_modules', dir);

        if (fs.existsSync(source)) {
            copyFolderContentsRecursiveSync(source, dest, false);
            // fs.readdirSync(pp).forEach((dir) => {
            //     copyFileSync(path.resolve(pp, file), path.resolve(c.projectRootFolder, 'node_modules', dir));
            // });
        } else {
            logWarning(`Your plugin configuration has no override path ${source}. skipping`);
        }
    });

    resolve();
});

export { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore, PIPES };

export default run;
