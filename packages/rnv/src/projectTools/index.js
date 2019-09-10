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

    _checkAndCreatePlatforms(c, c.program.platform)
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
        .then(() => resolve())
        .catch(e => reject(e));
});

export const rnvSwitch = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`rnvSwitch:${p}`);


    copyRuntimeAssets(c)
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
        .then(() => resolve())
        .catch(e => reject(e));
});

export const rnvLink = c => new Promise((resolve) => {
    if (fs.existsSync(c.paths.project.npmLinkPolyfill)) {
        const l = JSON.parse(fs.readFileSync(c.paths.project.npmLinkPolyfill).toString());
        Object.keys(l).forEach((key) => {
            // console.log('COPY', key, l[key]);
            const source = path.resolve(l[key]);
            const nm = path.join(source, 'node_modules');
            const dest = path.join(c.paths.project.nodeModulesDir, key);
            if (fs.existsSync(source)) {
                copyFolderContentsRecursiveSync(source, dest, false, [nm]);
            } else {
                logWarning(`Source: ${source} doesn't exists!`);
            }
        });
    } else {
        logWarning(`${c.paths.project.npmLinkPolyfill} file not found. nothing to link!`);
        resolve();
    }
});

const _isOK = (c, p, list) => {
    let result = false;
    list.forEach((v) => {
        if (isPlatformActive(c, v) && (p === v || p === 'all')) result = true;
    });
    return result;
};


const _checkAndCreatePlatforms = async (c, platform) => {
    logTask(`_checkAndCreatePlatforms:${platform}`);

    if (!fs.existsSync(c.paths.project.builds.dir)) {
        logWarning('Platforms not created yet. creating them for you...');
        await CLI(spawnCommand(c, {
            command: 'platform',
            subCommand: 'configure',
            program: { appConfig: c.runtime.appId, platform }
        }));
        return;
    }
    if (platform) {
        const appFolder = getAppFolder(c, platform);
        if (!fs.existsSync(appFolder)) {
            logWarning(`Platform ${platform} not created yet. creating them for you at ${appFolder}`);
            await CLI(spawnCommand(c, {
                command: 'platform',
                subCommand: 'configure',
                program: { appConfig: c.runtime.appId, platform }
            }));
        }
    } else {
        const { platforms } = c.buildConfig;
        if (!platforms) {
            reject(`Your ${chalk.white(c.paths.appConfig.config)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ platforms: {} }')} object at root`);
            return;
        }
        const ks = Object.keys(platforms);
        for (let i = 0; i < ks.length; i++) {
            const k = ks[i];
            const appFolder = getAppFolder(c, k);
            if (!fs.existsSync(appFolder)) {
                logWarning(`Platform ${k} not created yet. creating one for you at ${appFolder}`);
                await CLI(spawnCommand(c, {
                    command: 'platform',
                    subCommand: 'configure',
                    platform: k,
                    program: { appConfig: c.runtime.appId, platform: k }
                }));
            }
        }
    }
};

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
