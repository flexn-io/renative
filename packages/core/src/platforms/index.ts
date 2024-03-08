import path from 'path';
import { chalk, logDefault, logError, logWarning, logDebug } from '../logger';
import { cleanFolder, copyFolderContentsRecursiveSync } from '../system/fs';
import { getTimestampPathsConfig, getAppFolder } from '../context/contextProps';
import { SUPPORTED_PLATFORMS } from '../constants';
import type { RnvContext } from '../context/types';
import { generateOptions, inquirerPrompt } from '../api';
import type { RnvPlatform, RnvPlatformWithAll } from '../types';
import { updateProjectPlatforms } from '../configs/configProject';
import { doResolve } from '../system/resolve';

export const logErrorPlatform = (c: RnvContext) => {
    logError(
        `Platform: ${chalk().bold(c.platform)} doesn't support command: ${chalk().bold(c.command)}`,
        true // kill it if we're not supporting this
    );
    return false;
};

export const generatePlatformChoices = (c: RnvContext) => {
    const options = c.runtime.supportedPlatforms.map((v) => ({
        name: `${v.platform} - ${
            v.isConnected ? chalk().green('(connected)') : chalk().yellow('(ejected)')
        } [${chalk().cyan(v.engine?.config?.id)}]`,
        value: v.platform,
        isConnected: v.isConnected,
    }));
    return options;
};

export const cleanPlatformBuild = async (c: RnvContext, platform: RnvPlatform) => {
    logDebug('cleanPlatformBuild');

    const cleanTasks = [];

    if ((platform as RnvPlatformWithAll) === 'all' && c.buildConfig.platforms) {
        Object.keys(c.buildConfig.platforms).forEach((k) => {
            if (isPlatformSupportedSync(c, k as RnvPlatform)) {
                const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${k}`);
                cleanTasks.push(cleanFolder(pPath));
            }
        });
    } else if (isPlatformSupportedSync(c, platform)) {
        const pPath = getAppFolder(c);
        cleanTasks.push(cleanFolder(pPath));
    }

    await Promise.all(cleanTasks);
};

export const createPlatformBuild = (c: RnvContext, platform: RnvPlatform) =>
    new Promise<void>((resolve, reject) => {
        logDefault('createPlatformBuild');

        if (!platform || !isPlatformSupportedSync(c, platform, undefined, reject)) return;

        const ptDir = c.paths.project.platformTemplatesDirs[platform];
        if (!ptDir) {
            logError(`Cannot create platform build: c.paths.project.platformTemplatesDirs[${platform}] is not defined`);
            return;
        }

        const pPath = getAppFolder(c);
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
            getTimestampPathsConfig(c, platform),
            c
        );

        resolve();
    });

export const isPlatformSupported = async (c: RnvContext, isGlobalScope = false) => {
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
            updateProjectPlatforms(c, newPlatforms);
            c.buildConfig.defaults = c.buildConfig.defaults || {};
            c.buildConfig.defaults.supportedPlatforms = newPlatforms;
            // await configureEntryPoints(c);
        } else {
            throw new Error('User canceled');
        }
    }

    return c.platform;
};

export const isPlatformSupportedSync = (
    c: RnvContext,
    platform: RnvPlatform,
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
            return false;
        }
        return false;
    }
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

export const isPlatformActive = (c: RnvContext, platform: RnvPlatform, resolve?: () => void) => {
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
export const copySharedPlatforms = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logDefault('copySharedPlatforms');

        if (c.platform) {
            copyFolderContentsRecursiveSync(
                path.resolve(c.paths.project.platformTemplatesDirs[c.platform], '_shared'),
                getAppFolder(c)
            );
        }

        resolve();
    });

export const ejectPlatform = (c: RnvContext, platform: string) => {
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
