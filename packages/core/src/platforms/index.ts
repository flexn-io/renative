import path from 'path';
import { chalk, logDefault, logError, logWarning, logDebug } from '../logger';
import { cleanFolder, copyFolderContentsRecursiveSync } from '../system/fs';
import { getTimestampPathsConfig, getAppFolder } from '../context/contextProps';
import type { RnvPlatform } from '../types';
import { doResolve } from '../system/resolve';
import { getContext } from '../context/provider';
import { inquirerPrompt } from '../api';
import { updateProjectPlatforms, generatePlatformTemplatePaths } from '../configs/configProject';

export const generatePlatformChoices = () => {
    const c = getContext();

    const options = c.runtime.supportedPlatforms.map((v) => ({
        name: `${v.platform} - ${
            v.isConnected ? chalk().green('(connected)') : chalk().yellow('(ejected)')
        } [${chalk().cyan(v.engine?.id)}]`,
        value: v.platform,
        isConnected: v.isConnected,
    }));
    return options;
};

export const cleanPlatformBuild = async (platform: RnvPlatform, cleanAllPlatforms?: boolean) => {
    logDebug('cleanPlatformBuild');

    const c = getContext();

    const cleanTasks = [];

    if (cleanAllPlatforms && c.buildConfig.platforms) {
        for (const k of Object.keys(c.buildConfig.platforms)) {
            if (await _isPlatformSupported(k as RnvPlatform)) {
                const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${k}`);
                cleanTasks.push(cleanFolder(pPath));
            }
        }
    } else if (await _isPlatformSupported(platform)) {
        const pPath = getAppFolder();
        cleanTasks.push(cleanFolder(pPath));
    }

    await Promise.all(cleanTasks);
};

export const createPlatformBuild = async (platform: RnvPlatform) => {
    logDefault('createPlatformBuild');
    const c = getContext();
    if (!platform) return;
    const isPlatformSupported = await _isPlatformSupported(platform, true);
    if (!isPlatformSupported) return;

    const ptDir = c.paths.project.platformTemplatesDirs[platform];
    if (!ptDir) {
        // this was a logError('Cannot create platform ...') before. Shouldn't it be a reject?
        return Promise.reject(
            `Cannot create platform build: c.paths.project.platformTemplatesDirs[${platform}] is not defined`
        );
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
};

const _isPlatformSupported = async (platform: RnvPlatform, shouldResolve?: boolean) => {
    if (!platform) {
        if (shouldResolve) {
            return Promise.reject(
                chalk().red(
                    `You didn't specify platform. make sure you add "${chalk().white.bold(
                        '-p <PLATFORM>'
                    )}" option to your command!`
                )
            );
        }
        return false;
    }
    const c = getContext();

    if (!c.runtime.availablePlatforms.includes(platform)) {
        const { enablePlatform } = await inquirerPrompt({
            name: 'enablePlatform',
            type: 'confirm',
            message: `Platform ${platform} is not supported in your project. Would you like to enable it?`,
        });

        if (!enablePlatform) return false;
        console.log('old:');
        console.log(c.runtime.availablePlatforms);
        console.log('new:');
        console.log([...c.runtime.availablePlatforms, platform]);
        updateProjectPlatforms([...c.runtime.availablePlatforms, platform]);
        generatePlatformTemplatePaths();
        console.log('good?');

        return true;
        // TODO. Release 1.0 changes
        // if (reject) {
        //     reject(
        //         chalk().red(
        //             `Platform ${platform} is not supported. Use one of the following: ${chalk().bold.white(
        //                 c.runtime.availablePlatforms.join(', ')
        //             )} .`
        //         )
        //     );
        // }
        // return false;
    }
    return true;
};

export const isPlatformActive = (resolve?: () => void) => {
    const c = getContext();
    const { platform } = c;

    if (!c.buildConfig || !c.buildConfig.platforms) {
        logError(
            `Your appConfigFile is not configured properly! check ${chalk().bold.white(
                c.paths.appConfig.config
            )} location.`
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
