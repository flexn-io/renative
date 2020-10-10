/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import { chalk, logTask, logError, logWarning } from '../systemManager/logger';
import { generateOptions, inquirerPrompt } from '../../cli/prompt';
import {
    cleanFolder,
    copyFolderContentsRecursiveSync,
    writeFileSync
} from '../systemManager/fileutils';
import { SUPPORTED_PLATFORMS } from '../constants';
import { checkAndConfigureSdks } from '../sdkManager';
// import { configureEntryPoints } from '../templateManager';
import { getTimestampPathsConfig, getPlatformBuildDir } from '../common';


export const logErrorPlatform = (c) => {
    logError(
        `Platform: ${chalk().white(
            c.platform
        )} doesn't support command: ${chalk().white(c.command)}`,
        true // kill it if we're not supporting this
    );
    return false;
};

export const updateProjectPlatforms = (c, platforms) => {
    const {
        project: { config }
    } = c.paths;
    const currentConfig = c.files.project.config;
    currentConfig.defaults = currentConfig.defaults || {};
    currentConfig.defaults.supportedPlatforms = platforms;
    writeFileSync(config, currentConfig);
};


export const generatePlatformChoices = (c) => {
    const options = c.runtime.supportedPlatforms.map(v => ({
        name: `${v.platform} - ${v.isConnected ? chalk().green('(connected)') : chalk().yellow('(ejected)')}`,
        value: v.platform,
        isConnected: v.isConnected
    }));
    return options;
};

export const cleanPlatformBuild = (c, platform) => new Promise((resolve) => {
    logTask('cleanPlatformBuild');

    const cleanTasks = [];

    if (platform === 'all') {
        Object.keys(c.buildConfig.platforms).forEach((k) => {
            if (isPlatformSupportedSync(k)) {
                const pPath = path.join(
                    c.paths.project.builds.dir,
                    `${c.runtime.appId}_${k}`
                );
                cleanTasks.push(cleanFolder(pPath));
            }
        });
    } else if (isPlatformSupportedSync(platform)) {
        const pPath = path.join(
            c.paths.project.builds.dir,
            `${c.runtime.appId}_${platform}`
        );
        cleanTasks.push(cleanFolder(pPath));
    }

    Promise.all(cleanTasks).then(() => {
        resolve();
    });
});

export const createPlatformBuild = (c, platform) => new Promise((resolve, reject) => {
    logTask('createPlatformBuild');

    if (!isPlatformSupportedSync(platform, null, reject)) return;

    const pPath = path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${platform}`
    );
    const ptPath = path.join(
        c.paths.project.platformTemplatesDirs[platform],
        `${platform}`
    );

    copyFolderContentsRecursiveSync(ptPath, pPath, false, [
        path.join(ptPath, '_privateConfig')
    ], false, {}, getTimestampPathsConfig(c, platform), c);

    resolve();
});

export const isPlatformSupported = async (c) => {
    logTask('isPlatformSupported');
    let platformsAsObj = c.buildConfig
        ? c.buildConfig.platforms
        : c.supportedPlatforms;
    if (!platformsAsObj) platformsAsObj = SUPPORTED_PLATFORMS;
    const opts = generateOptions(platformsAsObj);

    if (
        !c.platform
        || c.platform === true
        || !SUPPORTED_PLATFORMS.includes(c.platform)
    ) {
        const { platform } = await inquirerPrompt({
            name: 'platform',
            type: 'list',
            message: 'Pick one of available platforms',
            choices: opts.keysAsArray,
            logMessage: 'You need to specify platform'
        });

        c.platform = platform;
    }

    const configuredPlatforms = c.files.project.config?.defaults?.supportedPlatforms;
    if (
        Array.isArray(configuredPlatforms)
        && !configuredPlatforms.includes(c.platform)
    ) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: `Platform ${
                c.platform
            } is not supported by your project. Would you like to enable it?`
        });

        if (confirm) {
            const newPlatforms = [...configuredPlatforms, c.platform];
            updateProjectPlatforms(c, newPlatforms);
            c.buildConfig.defaults.supportedPlatforms = newPlatforms;
            // await configureEntryPoints(c);
        } else {
            throw new Error('User canceled');
        }
    }

    // Check global SDKs
    await checkAndConfigureSdks(c);
    return c.platform;
};

export const isPlatformSupportedSync = (platform, resolve, reject) => {
    if (!platform) {
        if (reject) {
            reject(
                chalk().red(
                    `You didn't specify platform. make sure you add "${chalk().white.bold(
                        '-p <PLATFORM>'
                    )}" option to your command!`
                )
            );
        }
        return false;
    }
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        if (reject) {
            reject(
                chalk().red(
                    `Platform ${platform} is not supported. Use one of the following: ${chalk().white(
                        SUPPORTED_PLATFORMS.join(', ')
                    )} .`
                )
            );
        }
        return false;
    }
    if (resolve) resolve();
    return true;
};

export const isPlatformActive = (c, platform, resolve) => {
    if (!c.buildConfig || !c.buildConfig.platforms) {
        logError(
            `Your appConfigFile is not configured properly! check ${chalk().white(
                c.paths.appConfig.config
            )} location.`
        );
        if (resolve) resolve();
        return false;
    }
    if (!c.buildConfig.platforms[platform]) {
        logWarning(
            `Platform ${platform} not configured for ${c.runtime.appId}. skipping.`
        );
        if (resolve) resolve();
        return false;
    }
    return true;
};
export const copySharedPlatforms = c => new Promise((resolve) => {
    logTask('copySharedPlatforms');

    if (c.platform) {
        copyFolderContentsRecursiveSync(
            path.resolve(
                c.paths.project.platformTemplatesDirs[c.platform],
                '_shared'
            ),
            getPlatformBuildDir(c)
        );
    }

    resolve();
});
