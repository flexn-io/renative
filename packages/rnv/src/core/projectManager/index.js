/* eslint-disable import/no-cycle */
import { getAppFolder } from '../common';
import { chalk, logTask, logWarning } from '../systemManager/logger';
import { fsExistsSync } from '../systemManager/fileutils';
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

/* eslint-disable no-await-in-loop */
const _checkAndCreatePlatforms = async (c) => {
    logTask('_checkAndCreatePlatforms');
    const { platform } = c;
    if (!fsExistsSync(c.paths.project.builds.dir)) {
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
        if (!fsExistsSync(appFolder)) {
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
            if (!fsExistsSync(appFolder)) {
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
