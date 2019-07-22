/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    logTask,
    logSuccess,
    getAppFolder,
    isPlatformActive,
    logWarning,
    askQuestion,
    finishQuestion,
    generateOptions,
    logWelcome,
    logInfo,
    SUPPORTED_PLATFORMS,
} from '../common';
import {
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    RNV_APP_CONFIG_NAME,
    RNV_PROJECT_CONFIG_NAME,
} from '../constants';
import { configureXcodeProject } from '../platformTools/apple';
import { configureGradleProject, configureAndroidProperties } from '../platformTools/android';
import { configureTizenProject, configureTizenGlobal } from '../platformTools/tizen';
import { configureWebOSProject } from '../platformTools/webos';
import { configureElectronProject } from '../platformTools/electron';
import { configureKaiOSProject } from '../platformTools/firefox';
import { configureWebProject } from '../platformTools/web';
import { getTemplateOptions } from '../templateTools';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, writeObjectSync } from '../systemTools/fileutils';
import platformRunner from './platform';
import { executePipe } from '../projectTools/buildHooks';
import { printIntoBox, printBoxStart, printBoxEnd, printArrIntoBox } from '../systemTools/logger';

const CONFIGURE = 'configure';
const CREATE = 'create';
const NEW = 'new';

const PIPES = {
    APP_CONFIGURE_BEFORE: 'app:configure:before',
    APP_CONFIGURE_AFTER: 'app:configure:after',
};

const highlight = chalk.green;

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.command) {
    case NEW:
        return _runCreate(c);
    }

    switch (c.subCommand) {
    case CONFIGURE:
        return _runConfigure(c);
    case CREATE:
        return _runCreate(c);
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
        .then(() => _copySharedPlatforms(c))
        .then(() => _runPlugins(c, c.paths.rnvPluginsFolder))
        .then(() => _runPlugins(c, c.paths.projectPluginsFolder))
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

    const data = {
        defaultVersion: '0.1.0',
        defaultTemplate: 'renative-template-hello-world',
        defaultProjectName: 'helloRenative',
        defaultAppTitle: 'Hello Renative'
    };
    data.optionPlatforms = generateOptions(SUPPORTED_PLATFORMS, true);
    data.optionTemplates = getTemplateOptions();

    // logWelcome();

    askQuestion("What's your project Name? (no spaces, folder based on ID will be created in this directory)", data, 'inputProjectName')
        .then(() => askQuestion(`What's your project Title? (press ENTER to use default: ${highlight(data.defaultAppTitle)})`, data, 'inputAppTitle'))
        .then(() => { data.appID = `com.mycompany.${data.inputProjectName.replace(/\s+/g, '').toLowerCase()}`; })
        .then(() => askQuestion(`What's your App ID? (press ENTER to use default: ${highlight(data.appID)})`, data, 'inputAppID'))
        .then(() => askQuestion(`What's your Version? (press ENTER to use default: ${highlight(data.defaultVersion)})`, data, 'inputVersion'))
        .then(() => askQuestion(`What template to use? (press ENTER to use default: ${highlight(data.defaultTemplate)})\n${data.optionTemplates.asString})`,
            data, 'inputTemplate'))
        .then(() => data.optionTemplates.pick(data.inputTemplate, data.defaultTemplate))
        .then(() => askQuestion(`What platforms would you like to use? (Add numbers separated by comma or leave blank for all)\n${
            data.optionPlatforms.asString}`, data, 'inputSupportedPlatforms'))
        .then(() => data.optionPlatforms.pick(data.inputSupportedPlatforms))
        .then(() => _prepareProjectOverview(c, data))
        .then(() => askQuestion(`Is All Correct? (press ENTER for yes)\n${data.confirmString}`))
        .then(() => _generateProject(c, data))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _generateProject = (c, data) => new Promise((resolve, reject) => {
    finishQuestion();
    // data.defaultAppConfigId = `${data.projectName}Example`;

    const base = path.resolve('.');

    c.paths.projectRootFolder = path.join(base, data.projectName.replace(/(\s+)/g, '_'));
    c.paths.projectPackagePath = path.join(c.paths.projectRootFolder, 'package.json');

    data.packageName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

    mkdirSync(c.paths.projectRootFolder);

    checkAndCreateProjectPackage(c, data);

    checkAndCreateGitignore(c);

    checkAndCreateProjectConfig(c, data);

    logSuccess(
        `Your project is ready! navigate to project ${chalk.white(`cd ${data.projectName}`)} and run ${chalk.white(
            'rnv run -p web',
        )} to see magic happen!`,
    );

    resolve();
});

const _prepareProjectOverview = (c, data) => new Promise((resolve, reject) => {
    data.projectName = data.inputProjectName;
    data.appTitle = data.inputAppTitle || data.defaultAppTitle;
    data.teamID = '';
    data.appID = data.inputAppID ? data.inputAppID.replace(/\s+/g, '-').toLowerCase() : data.appID;
    data.version = data.inputVersion || data.defaultVersion;

    let str = printBoxStart('🚀  ReNative Project Generator');
    str += printIntoBox('');
    str += printIntoBox(`Project Name (folder): ${highlight(data.projectName)}`, 1);
    str += printIntoBox(`Project Title: ${highlight(data.appTitle)}`, 1);
    str += printIntoBox(`Project Version: ${highlight(data.version)}`, 1);
    str += printIntoBox(`App ID: ${highlight(data.appID)}`, 1);
    str += printIntoBox(`Project Template: ${highlight(data.optionTemplates.selectedOption)}`, 1);
    str += printIntoBox('');
    str += printIntoBox('Project Platforms:');
    str += printArrIntoBox(data.optionPlatforms.selectedOptions);
    str += printIntoBox('');
    str += printIntoBox('Project Structure:');
    str += printIntoBox('');
    str += printIntoBox(data.projectName);
    str += chalk.gray(`│   ├── appConfigs           # Application flavour configuration files/assets  │
│   │   └── default          # Example application flavour                     │
│   │       ├── assets       # Platform assets injected to ./platformAssets    │
│   │       ├── builds       # Platform files injected to ./platformBuilds     │
│   │       └── config.json  # Application flavour config                      │
│   ├── platformAssets       # Generated cross-platform assets                 │
│   ├── platformBuilds       # Generated platform app projects                 │
│   ├── projectConfigs       # Project configuration files/assets              │
│   │   ├── fonts            # Folder for all custom fonts                     │
│   │   ├── permissions.json # Permissions configuration                       │
│   │   └── plugins.json     # Multi-platform Plugins configuration            │
│   ├── src                  # Source files                                    │
│   ├── index.*.js           # Entry files                                     │
│   └── rnv-config.json      # ReNative project configuration                  │
`);
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    data.confirmString = str;
    resolve();
});

const checkAndCreateProjectPackage = (c, data) => {
    logTask(`checkAndCreateProjectPackage:${data.packageName}`);
    const {
        packageName, appTitle, appID, supportedPlatforms,
    } = data;

    if (!fs.existsSync(c.paths.projectPackagePath)) {
        logInfo("Looks like your package.json is missing. Let's create one for you!");

        const pkgJson = {};
        pkgJson.name = packageName;
        pkgJson.title = appTitle;
        pkgJson.version = data.version;
        pkgJson.dependencies = {
            renative: 'latest',
        };
        pkgJson.devDependencies = {
            rnv: c.files.rnvPackage.version,
        };
        pkgJson.devDependencies[data.optionTemplates.selectedOption] = 'latest';

        const pkgJsonStringClean = JSON.stringify(pkgJson, null, 2);

        fs.writeFileSync(c.paths.projectPackagePath, pkgJsonStringClean);
    }
};

const checkAndCreateGitignore = (c) => {
    logTask('checkAndCreateGitignore');
    const ignrPath = path.join(c.paths.projectRootFolder, '.gitignore');
    if (!fs.existsSync(ignrPath)) {
        logInfo("Looks like your .gitignore is missing. Let's create one for you!");

        copyFileSync(path.join(c.paths.rnvHomeFolder, 'supportFiles/gitignore-template'), ignrPath);
    }
};

const checkAndCreateProjectConfig = (c, data) => {
    logTask('checkAndCreateProjectConfig');
    const {
        packageName, appTitle, appID, supportedPlatforms,
    } = data;
    // Check Project Config
    if (!fs.existsSync(c.paths.projectConfigPath)) {
        logInfo(`You're missing ${RNV_PROJECT_CONFIG_NAME} file in your root project! Let's create one!`);

        const defaultProjectConfigs = {
            supportedPlatforms: data.optionPlatforms.selectedOptions,
            template: data.optionTemplates.selectedOption,
            defaultAppId: appID.toLowerCase()
        };

        const obj = JSON.parse(fs.readFileSync(path.join(c.paths.rnvProjectTemplateFolder, 'rnv-config.json')));

        obj.defaultProjectConfigs = defaultProjectConfigs;

        writeObjectSync(path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_NAME), obj);
    }
};

const _checkAndCreatePlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_checkAndCreatePlatforms:${platform}`);

    if (!fs.existsSync(c.paths.platformBuildsFolder)) {
        logWarning('Platforms not created yet. creating them for you...');

        const newCommand = Object.assign({}, c);
        newCommand.subCommand = 'configure';
        newCommand.program = { appConfig: c.defaultAppConfigId, platform };

        platformRunner(newCommand)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    if (platform) {
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
        const { platforms } = c.files.appConfigFile;
        const cmds = [];
        if (!platforms) {
            reject(`Your ${chalk.white(c.paths.appConfigPath)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ platforms: {} }')} object at root`);
            return;
        }

        Object.keys(platforms).forEach((k) => {
            if (!fs.existsSync(k)) {
                logWarning(`Platform ${k} not created yet. creating one for you...`);

                const newCommand = Object.assign({}, c);
                newCommand.subCommand = 'configure';
                newCommand.program = { appConfig: c.defaultAppConfigId, platform };
                cmds.push(platformRunner(newCommand));
            }
        });

        Promise.all(cmds)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    resolve();
});

const copyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('copyRuntimeAssets');
    const aPath = path.join(c.paths.platformAssetsFolder, 'runtime');
    const cPath = path.join(c.paths.appConfigFolder, 'assets/runtime');
    copyFolderContentsRecursiveSync(cPath, aPath);

    // copyFileSync(c.paths.appConfigPath, path.join(c.paths.platformAssetsFolder, RNV_APP_CONFIG_NAME));
    fs.writeFileSync(path.join(c.paths.platformAssetsFolder, RNV_APP_CONFIG_NAME), JSON.stringify(c.files.appConfigFile, null, 2));

    // FONTS
    let fontsObj = 'export default [';

    if (c.files.appConfigFile) {
        if (!c.files.appConfigFile.common) {
            reject(`Your ${chalk.white(c.paths.appConfigPath)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ common: {} }')} object at root`);
            return;
        }
        if (fs.existsSync(c.paths.fontsConfigFolder)) {
            fs.readdirSync(c.paths.fontsConfigFolder).forEach((font) => {
                if (font.includes('.ttf') || font.includes('.otf')) {
                    const key = font.split('.')[0];
                    const { includedFonts } = c.files.appConfigFile.common;
                    if (includedFonts) {
                        if (includedFonts.includes('*') || includedFonts.includes(key)) {
                            if (font) {
                                const fontSource = path.join(c.paths.projectConfigFolder, 'fonts', font);
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
    fs.writeFileSync(path.join(c.paths.platformAssetsFolder, 'runtime', 'fonts.js'), fontsObj);
    const supportFiles = path.resolve(c.paths.rnvHomeFolder, 'supportFiles');
    copyFileSync(
        path.resolve(supportFiles, 'fontManager.js'),
        path.resolve(c.paths.platformAssetsFolder, 'runtime', 'fontManager.js'),
    );
    copyFileSync(
        path.resolve(supportFiles, 'fontManager.web.js'),
        path.resolve(c.paths.platformAssetsFolder, 'runtime', 'fontManager.web.js'),
    );

    resolve();
});

const _copySharedPlatforms = c => new Promise((resolve) => {
    logTask(`_copySharedPlatform:${c.platform}`);

    if (c.platform) {
        mkdirSync(path.resolve(c.paths.platformTemplatesFolders[c.platform], '_shared'));

        copyFolderContentsRecursiveSync(
            path.resolve(c.paths.platformTemplatesFolders[c.platform], '_shared'),
            path.resolve(c.paths.platformBuildsFolder, '_shared'),
        );
    }

    resolve();
});

const _runPlugins = (c, pluginsPath) => new Promise((resolve) => {
    logTask('_runPlugins');

    if (!fs.existsSync(pluginsPath)) {
        logInfo(`Your project plugin folder ${chalk.white(pluginsPath)} does not exists. skipping plugin configuration`);
        resolve();
        return;
    }

    fs.readdirSync(pluginsPath).forEach((dir) => {
        const source = path.resolve(pluginsPath, dir, 'overrides');
        const dest = path.resolve(c.paths.projectRootFolder, 'node_modules', dir);

        if (fs.existsSync(source)) {
            copyFolderContentsRecursiveSync(source, dest, false);
            // fs.readdirSync(pp).forEach((dir) => {
            //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.projectRootFolder, 'node_modules', dir));
            // });
        } else {
            logInfo(`Your plugin configuration has no override path ${chalk.white(source)}. skipping override action`);
        }
    });

    resolve();
});

export { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore, PIPES };

export default run;
