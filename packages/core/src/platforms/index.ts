import path from 'path';
import { chalk, logDefault, logError, logWarning, logDebug } from '../logger';
import { cleanFolder, copyFolderContentsRecursiveSync } from '../system/fs';
import { getTimestampPathsConfig, getAppFolder } from '../context/contextProps';
import { SUPPORTED_PLATFORMS } from '../constants';
import { generateOptions, inquirerPrompt } from '../api';
import type { RnvPlatform, RnvPlatformWithAll } from '../types';
import { updateProjectPlatforms } from '../configs/configProject';
import { doResolve } from '../system/resolve';
import { getContext } from '../context/provider';

export const logErrorPlatform = () => {
    const c = getContext();

    return Promise.reject(`Platform: ${chalk().bold(c.platform)} doesn't support command: ${chalk().bold(c.command)}`);
};

export const generatePlatformChoices = () => {
    const c = getContext();

    const options = c.runtime.supportedPlatforms.map((v) => ({
        name: `${v.platform} - ${
            v.isConnected ? chalk().green('(connected)') : chalk().yellow('(ejected)')
        } [${chalk().cyan(v.engine?.config?.id)}]`,
        value: v.platform,
        isConnected: v.isConnected,
    }));
    return options;
};

export const cleanPlatformBuild = async (platform: RnvPlatform) => {
    logDebug('cleanPlatformBuild');

    const c = getContext();

    const cleanTasks = [];

    if ((platform as RnvPlatformWithAll) === 'all' && c.buildConfig.platforms) {
        Object.keys(c.buildConfig.platforms).forEach((k) => {
            if (isPlatformSupportedSync(k as RnvPlatform)) {
                const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${k}`);
                cleanTasks.push(cleanFolder(pPath));
            }
        });
    } else if (isPlatformSupportedSync(platform)) {
        const pPath = getAppFolder();
        cleanTasks.push(cleanFolder(pPath));
    }

    await Promise.all(cleanTasks);
};

export const createPlatformBuild = (platform: RnvPlatform) =>
    new Promise<void>((resolve, reject) => {
        logDefault('createPlatformBuild');
        const c = getContext();

        if (!platform || !isPlatformSupportedSync(platform, undefined, reject)) return;

        const ptDir = c.paths.project.platformTemplatesDirs[platform];
        if (!ptDir) {
            logError(`Cannot create platform build: c.paths.project.platformTemplatesDirs[${platform}] is not defined`);
            return;
        }

        const pPath = getAppFolder();
        const ptPath = path.join(ptDir, `${platform}`);

        copyFolderContentsRecursiveSync(
            ptPath,
            pPath,
            false,
            [path.join(ptPath, '_privateConfig')],
            false,
            [
                {
                    pattern: '{{PATH_REACT_NATIVE}}',
                    override:
                        doResolve(c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native', true, {
                            forceForwardPaths: true,
                        }) || '',
                },
            ],
            getTimestampPathsConfig(),
            c
        );

        resolve();
    });

export const isPlatformSupported = async (isGlobalScope = false) => {
    const c = getContext();

    if (c.platform && c.program.platform !== true && isGlobalScope) {
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

    if (!c.platform || c.program.platform === true || !c.runtime.availablePlatforms?.includes?.(c.platform)) {
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

    if (c.platform && Array.isArray(configuredPlatforms) && !configuredPlatforms.includes(c.platform)) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: `Platform ${c.platform} is not supported by your project. Would you like to enable it?`,
        });

        if (confirm) {
            const newPlatforms = [...configuredPlatforms, c.platform];
            updateProjectPlatforms(newPlatforms);
            c.buildConfig.defaults = c.buildConfig.defaults || {};
            c.buildConfig.defaults.supportedPlatforms = newPlatforms;
            // await configureEntryPoints(c);
        } else {
            throw new Error('User canceled');
        }
    }

    return c.platform;
};

export const isPlatformSupportedSync = (platform: RnvPlatform, resolve?: () => void, reject?: (e: string) => void) => {
    if (!platform) {
        if (reject) {
            reject(
                chalk().red(
                    `You didn't specify platform. make sure you add "${chalk().white.bold(
                        '-p <PLATFORM>'
                    )}" option to your command!`
                )
            );
            return false;
        }
        return false;
    }
    const c = getContext();

    if (!c.runtime.availablePlatforms.includes(platform)) {
        if (reject) {
            reject(
                chalk().red(
                    `Platform ${platform} is not supported. Use one of the following: ${chalk().bold(
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

export const isPlatformActive = (resolve?: () => void) => {
    const c = getContext();
    const { platform } = c;

    if (!c.buildConfig || !c.buildConfig.platforms) {
        logError(
            `Your appConfigFile is not configured properly! check ${chalk().bold(c.paths.appConfig.config)} location.`
        );
        if (resolve) resolve();
        return false;
    }
    if (!platform || (platform && !c.buildConfig.platforms[platform])) {
        logWarning(`Platform ${platform} not configured for ${c.runtime.appId}. skipping.`);
        if (resolve) resolve();
        return false;
    }
    return true;
};
export const copySharedPlatforms = () =>
    new Promise<void>((resolve) => {
        const c = getContext();

        logDefault('copySharedPlatforms');

        if (c.platform) {
            copyFolderContentsRecursiveSync(
                path.resolve(c.paths.project.platformTemplatesDirs[c.platform], '_shared'),
                getAppFolder()
            );
        }

        resolve();
    });

export const ejectPlatform = (platform: string) => {
    const c = getContext();

    const engine = c.runtime.enginesByPlatform[platform];
    const destDir = path.join(c.paths.project.dir, 'platformTemplates', platform);
    const sourcePlatformDir = engine.originalTemplatePlatformsDir;
    if (sourcePlatformDir) {
        copyFolderContentsRecursiveSync(path.join(sourcePlatformDir, platform), destDir);
        // DEPRECATED: only for legacy support
        copyFolderContentsRecursiveSync(path.join(sourcePlatformDir, '_shared'), destDir);
    } else {
        logError(`engine.originalTemplatePlatformsDir is undefined`);
    }
};
