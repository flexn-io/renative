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
    logWelcome,
    logInfo,
    spawnCommand
} from '../common';
import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
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
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    RENATIVE_CONFIG_NAME,
    SUPPORTED_PLATFORMS
} from '../constants';
import { configureXcodeProject } from '../platformTools/apple';
import { configureGradleProject } from '../platformTools/android';
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
import {
    copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore,
    copySharedPlatforms, checkAndCreateProjectConfig
} from '../projectTools/projectParser';

const CONFIGURE = 'configure';
const SWITCH = 'switch';
const CREATE = 'create';
const NEW = 'new';

const PIPES = {
    APP_CONFIGURE_BEFORE: 'configure:before',
    APP_CONFIGURE_AFTER: 'configure:after',
    APP_SWITCH_BEFORE: 'switch:before',
    APP_SWITCH_AFTER: 'switch:after',
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
    case CONFIGURE:
        return _runConfigure(c);
    case SWITCH:
        return _runSwitch(c);
    }

    switch (c.subCommand) {
    case CONFIGURE:
        logWarning(`$ ${chalk.red('$ rnv app configure')} is deprecated. Use ${chalk.green('$ rnv configure')} instead`);
        return _runConfigure(c);

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
        return Promise.reject(`cli:app: Sub-Command ${c.subCommand} not supported`);
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
        .then(() => copySharedPlatforms(c))
        .then(() => _runPlugins(c, c.paths.rnv.plugins.dir))
        .then(() => _runPlugins(c, c.paths.project.projectConfig.pluginsDir))
        .then(() => (_isOK(c, p, [ANDROID]) ? configureGradleProject(c, ANDROID) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_TV]) ? configureGradleProject(c, ANDROID_TV) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_WEAR]) ? configureGradleProject(c, ANDROID_WEAR) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenGlobal(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenProject(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN_WATCH]) ? configureTizenProject(c, TIZEN_WATCH) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN_MOBILE]) ? configureTizenProject(c, TIZEN_MOBILE) : Promise.resolve()))
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

const _runSwitch = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`_runSwitch:${p}`);

    executePipe(c, PIPES.APP_SWITCH_AFTER)

        .then(() => copyRuntimeAssets(c))
        .then(() => copySharedPlatforms(c))
        .then(() => executePipe(c, PIPES.APP_SWITCH_AFTER))
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

    c.paths.project.dir = path.join(base, data.projectName.replace(/(\s+)/g, '_'));
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');

    data.packageName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

    mkdirSync(c.paths.project.dir);

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

const _checkAndCreatePlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_checkAndCreatePlatforms:${platform}`);

    if (!fs.existsSync(c.paths.project.builds.dir)) {
        logWarning('Platforms not created yet. creating them for you...');
        platformRunner(spawnCommand(c, {
            subCommand: 'configure',
            program: { appConfig: c.defaultAppConfigId, platform }
        }))
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    if (platform) {
        const appFolder = getAppFolder(c, platform);
        if (!fs.existsSync(appFolder)) {
            logWarning(`Platform ${platform} not created yet. creating them for you...`);
            platformRunner(spawnCommand(c, {
                subCommand: 'configure',
                program: { appConfig: c.defaultAppConfigId, platform }
            }))
                .then(() => resolve())
                .catch(e => reject(e));

            return;
        }
    } else {
        const { platforms } = c.buildConfig;
        const cmds = [];
        if (!platforms) {
            reject(`Your ${chalk.white(c.paths.appConfig.config)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ platforms: {} }')} object at root`);
            return;
        }

        Object.keys(platforms).forEach((k) => {
            if (!fs.existsSync(k)) {
                logWarning(`Platform ${k} not created yet. creating one for you...`);
                cmds.push(platformRunner(spawnCommand(c, {
                    subCommand: 'configure',
                    program: { appConfig: c.defaultAppConfigId, platform }
                })));
            }
        });

        Promise.all(cmds)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    resolve();
});

const _runPlugins = (c, pluginsPath) => new Promise((resolve) => {
    logTask(`_runPlugins:${pluginsPath}`, chalk.grey);

    if (!fs.existsSync(pluginsPath)) {
        logInfo(`Your project plugin folder ${chalk.white(pluginsPath)} does not exists. skipping plugin configuration`);
        resolve();
        return;
    }

    fs.readdirSync(pluginsPath).forEach((dir) => {
        const source = path.resolve(pluginsPath, dir, 'overrides');
        const dest = path.resolve(c.paths.project.dir, 'node_modules', dir);

        if (fs.existsSync(source)) {
            copyFolderContentsRecursiveSync(source, dest, false);
            // fs.readdirSync(pp).forEach((dir) => {
            //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.project.dir, 'node_modules', dir));
            // });
        } else {
            logInfo(`Your plugin configuration has no override path ${chalk.white(source)}. skipping override action`);
        }
    });

    resolve();
});

export { PIPES };

export default run;
