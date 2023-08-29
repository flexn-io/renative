import path from 'path';
import { chalk, logTask, logError, logWarning } from '../systemManager/logger';
import { generateOptions, inquirerPrompt } from '../../cli/prompt';
import { cleanFolder, copyFolderContentsRecursiveSync, writeFileSync } from '../systemManager/fileutils';
import { checkAndConfigureSdks } from '../sdkManager/installer';
import { getTimestampPathsConfig, getPlatformBuildDir, getAppFolder } from '../common';
import { SUPPORTED_PLATFORMS } from '../constants';
import { RnvConfig } from '../configManager/types';

export const logErrorPlatform = (c: RnvConfig) => {
    logError(
        `Platform: ${chalk().white(c.platform)} doesn't support command: ${chalk().white(c.command)}`,
        true // kill it if we're not supporting this
    );
    return false;
};

export const updateProjectPlatforms = (c: RnvConfig, platforms: Array<string>) => {
    const {
        project: { config },
    } = c.paths;
    const currentConfig = c.files.project.config;
    currentConfig.defaults = currentConfig.defaults || {};
    currentConfig.defaults.supportedPlatforms = platforms;
    writeFileSync(config, currentConfig);
};

export const generatePlatformChoices = (c: RnvConfig) => {
    const options = c.runtime.supportedPlatforms.map((v) => ({
        name: `${v.platform} - ${
            v.isConnected ? chalk().green('(connected)') : chalk().yellow('(ejected)')
        } [${chalk().cyan(v.engine?.config?.id)}]`,
        value: v.platform,
        isConnected: v.isConnected,
    }));
    return options;
};

export const cleanPlatformBuild = (c: RnvConfig, platform: string) =>
    new Promise<void>((resolve) => {
        logTask('cleanPlatformBuild');

        const cleanTasks = [];

        if (platform === 'all') {
            Object.keys(c.buildConfig.platforms).forEach((k) => {
                if (isPlatformSupportedSync(c, k)) {
                    const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${k}`);
                    cleanTasks.push(cleanFolder(pPath));
                }
            });
        } else if (isPlatformSupportedSync(c, platform)) {
            const pPath = getAppFolder(c);
            cleanTasks.push(cleanFolder(pPath));
        }

        Promise.all(cleanTasks).then(() => {
            resolve();
        });
    });

export const createPlatformBuild = (c: RnvConfig, platform: string) =>
    new Promise((resolve, reject) => {
        logTask('createPlatformBuild');

        if (!isPlatformSupportedSync(c, platform, null, reject)) return;

        const pPath = getAppFolder(c);
        const ptPath = path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`);

        copyFolderContentsRecursiveSync(
            ptPath,
            pPath,
            false,
            [path.join(ptPath, '_privateConfig')],
            false,
            {},
            getTimestampPathsConfig(c, platform),
            c
        );

        resolve();
    });

export const isPlatformSupported = async (c: RnvConfig, isGlobalScope = false) => {
    logTask('isPlatformSupported');

    if (c.platform && c.platform !== true && isGlobalScope) {
        return c.platform;
    }

    let platformsAsObj;
    if (isGlobalScope) {
        platformsAsObj = SUPPORTED_PLATFORMS;
    } else {
        platformsAsObj = c.buildConfig ? c.buildConfig.platforms : c.supportedPlatforms;
    }

    if (!platformsAsObj) platformsAsObj = c.runtime.availablePlatforms;
    const opts = generateOptions(platformsAsObj);

    if (!c.platform || c.platform === true || !c.runtime.availablePlatforms?.includes?.(c.platform)) {
        const { platform } = await inquirerPrompt({
            name: 'platform',
            type: 'list',
            message: 'Pick one of available platforms',
            choices: opts.keysAsArray,
            logMessage: 'You need to specify platform',
        });

        c.platform = platform;
    }

    const configuredPlatforms = c.files.project.config?.defaults?.supportedPlatforms;

    if (Array.isArray(configuredPlatforms) && !configuredPlatforms.includes(c.platform)) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: `Platform ${c.platform} is not supported by your project. Would you like to enable it?`,
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

export const isPlatformSupportedSync = (
    c: RnvConfig,
    platform: string,
    resolve?: () => void,
    reject?: (e: string) => void
) => {
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
    if (!c.runtime.availablePlatforms.includes(platform)) {
        if (reject) {
            reject(
                chalk().red(
                    `Platform ${platform} is not supported. Use one of the following: ${chalk().white(
                        c.runtime.availablePlatforms.join(', ')
                    )} .`
                )
            );
        }
        return false;
    }
    if (resolve) resolve();
    return true;
};

export const isPlatformActive = (c: RnvConfig, platform: string, resolve: () => void) => {
    if (!c.buildConfig || !c.buildConfig.platforms) {
        logError(
            `Your appConfigFile is not configured properly! check ${chalk().white(c.paths.appConfig.config)} location.`
        );
        if (resolve) resolve();
        return false;
    }
    if (!c.buildConfig.platforms[platform]) {
        logWarning(`Platform ${platform} not configured for ${c.runtime.appId}. skipping.`);
        if (resolve) resolve();
        return false;
    }
    return true;
};
export const copySharedPlatforms = (c) =>
    new Promise((resolve) => {
        logTask('copySharedPlatforms');

        if (c.platform) {
            copyFolderContentsRecursiveSync(
                path.resolve(c.paths.project.platformTemplatesDirs[c.platform], '_shared'),
                getPlatformBuildDir(c)
            );
        }

        resolve();
    });

export const ejectPlatform = (c: RnvConfig, platform: string) => {
    const engine = c.runtime.enginesByPlatform[platform];
    const destDir = path.join(c.paths.project.dir, 'platformTemplates', platform);
    const sourcePlatformDir = engine.originalTemplatePlatformsDir;
    copyFolderContentsRecursiveSync(path.join(sourcePlatformDir, platform), destDir);
    // DEPRECATED: only for legacy support
    copyFolderContentsRecursiveSync(path.join(sourcePlatformDir, '_shared'), destDir);
};
