/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import fs from 'fs';
import { getAppFolder } from '../common';
import { doResolve } from '../resolve';
import { chalk, logTask, logWarning } from '../systemManager/logger';
import {
    copyFolderContentsRecursiveSync
} from '../systemManager/fileutils';
import CLI from '../../cli';
import { copyRuntimeAssets, copySharedPlatforms } from './projectParser';
import { generateRuntimeConfig } from '../configManager/configParser';
import { injectPlatformDependencies } from '../configManager/packageParser';
import { overrideTemplatePlugins } from '../pluginManager';

export const configureGenericProject = async (c) => {
    logTask('configureGenericProject');

    await injectPlatformDependencies(c);
    await _checkAndCreatePlatforms(c);
    await copyRuntimeAssets(c);
    await copySharedPlatforms(c);
    await generateRuntimeConfig(c);
    await overrideTemplatePlugins(c);
};

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
        const l = JSON.parse(
            fs.readFileSync(c.paths.project.npmLinkPolyfill).toString()
        );
        Object.keys(l).forEach((key) => {
            const source = path.resolve(l[key]);
            const nm = path.join(source, 'node_modules');
            const dest = doResolve(key);
            if (fs.existsSync(source)) {
                copyFolderContentsRecursiveSync(source, dest, false, [nm]);
            } else {
                logWarning(`Source: ${source} doesn't exists!`);
            }
        });
    } else {
        logWarning(
            `${c.paths.project.npmLinkPolyfill} file not found. nothing to link!`
        );
        resolve();
    }
});

/* eslint-disable no-await-in-loop */
const _checkAndCreatePlatforms = async (c) => {
    logTask('_checkAndCreatePlatforms');
    const { platform } = c;
    if (!fs.existsSync(c.paths.project.builds.dir)) {
        logWarning('Platforms not created yet. creating them for you...');
        await CLI(c, {
            command: 'platform',
            subCommand: 'configure',
            program: { appConfig: c.runtime.appId, platform }
        });
        return;
    }
    if (platform) {
        const appFolder = getAppFolder(c, platform);
        if (!fs.existsSync(appFolder)) {
            logWarning(
                `Platform ${platform} not created yet. creating them for you at ${appFolder}`
            );
            await CLI(c, {
                command: 'platform',
                subCommand: 'configure',
                program: { appConfig: c.runtime.appId, platform }
            });
        }
    } else {
        const { platforms } = c.buildConfig;
        if (!platforms) {
            return Promise.reject(
                `Your ${chalk().white(
                    c.paths.appConfig.config
                )} is missconfigured. (Maybe you have older version?). Missing ${chalk().white(
                    '{ platforms: {} }'
                )} object at root`
            );
        }
        const ks = Object.keys(platforms);
        for (let i = 0; i < ks.length; i++) {
            const k = ks[i];
            const appFolder = getAppFolder(c, k);
            if (!fs.existsSync(appFolder)) {
                logWarning(
                    `Platform ${k} not created yet. creating one for you at ${appFolder}`
                );
                await CLI(c, {
                    command: 'platform',
                    subCommand: 'configure',
                    platform: k,
                    program: { appConfig: c.runtime.appId, platform: k }
                });
            }
        }
    }
};
