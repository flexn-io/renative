/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import {
    logTask,
    logSuccess,
    getAppFolder,
    isPlatformActive,
    logWarning,
    logInfo,
    spawnCommand
} from '../common';
import { generateOptions } from '../systemTools/prompt';
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
import { copyFolderContentsRecursiveSync, mkdirSync, writeObjectSync } from '../systemTools/fileutils';
import { executeAsync } from '../systemTools/exec';
import CLI from '../cli';
import { executePipe } from './buildHooks';
import { printIntoBox, printBoxStart, printBoxEnd, printArrIntoBox } from '../systemTools/logger';
import { copyRuntimeAssets, copySharedPlatforms } from './projectParser';
import { getWorkspaceOptions } from './workspace';
import { generateRuntimeConfig } from '../configTools/configParser';

export const rnvConfigure = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`rnvConfigure:${p}`);

    executePipe(c, PIPES.APP_CONFIGURE_BEFORE)
        .then(() => _checkAndCreatePlatforms(c, c.program.platform))
        .then(() => copyRuntimeAssets(c))
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
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

export const rnvSwitch = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`rnvSwitch:${p}`);

    executePipe(c, PIPES.APP_SWITCH_AFTER)

        .then(() => copyRuntimeAssets(c))
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
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


const _checkAndCreatePlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_checkAndCreatePlatforms:${platform}`);

    if (!fs.existsSync(c.paths.project.builds.dir)) {
        logWarning('Platforms not created yet. creating them for you...');
        CLI(spawnCommand(c, {
            subCommand: 'configure',
            program: { appConfig: c.runtime.appId, platform }
        }))
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    if (platform) {
        const appFolder = getAppFolder(c, platform);
        if (!fs.existsSync(appFolder)) {
            logWarning(`Platform ${platform} not created yet. creating them for you...`);
            CLI(spawnCommand(c, {
                subCommand: 'configure',
                program: { appConfig: c.runtime.appId, platform }
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
                cmds.push(CLI(spawnCommand(c, {
                    subCommand: 'configure',
                    program: { appConfig: c.runtime.appId, platform }
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
