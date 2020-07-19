/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import inquirer from 'inquirer';

import { chalk, logToSummary, logTask, logSuccess, logError, logWarning, logInfo } from '../systemManager/logger';
import { generateOptions, inquirerPrompt } from '../../cli/prompt';
import {
    cleanFolder,
    copyFolderContentsRecursiveSync,
    writeFileSync,
    removeDirs
} from '../systemManager/fileutils';
import { cleanPlaformAssets } from '../projectManager/projectParser';
import { PLATFORMS, SUPPORTED_PLATFORMS } from '../constants';
import { checkAndConfigureSdks } from '../sdkManager';
import { configureEntryPoints } from '../templateManager';
import { getTimestampPathsConfig } from '../common';

export const rnvPlatformList = c => new Promise((resolve) => {
    const opts = _genPlatOptions(c);
    logToSummary(`Platforms:\n\n${opts.asString}`);
    resolve();
});

export const logErrorPlatform = (c) => {
    logError(
        `Platform: ${chalk().white(
            c.platform
        )} doesn't support command: ${chalk().white(c.command)}`,
        true // kill it if we're not supporting this
    );
    return false;
};

export const rnvPlatformConfigure = async (c) => {
    // c.platform = c.program.platform || 'all';
    logTask(`rnvPlatformConfigure:${c.platform}`);

    await isPlatformSupported(c);
    await cleanPlatformBuild(c, c.platform);
    await cleanPlaformAssets(c, c.platform);
    await _runCopyPlatforms(c, c.platform);
};

const updateProjectPlatforms = (c, platforms) => {
    const {
        project: { config }
    } = c.paths;
    const currentConfig = c.files.project.config;
    currentConfig.defaults = currentConfig.defaults || {};
    currentConfig.defaults.supportedPlatforms = platforms;
    writeFileSync(config, currentConfig);
};

export const rnvPlatformSetup = async (c) => {
    const currentPlatforms = c.files.project.config.defaults?.supportedPlatforms || [];

    const { inputSupportedPlatforms } = await inquirer.prompt({
        name: 'inputSupportedPlatforms',
        type: 'checkbox',
        pageSize: 20,
        message: 'What platforms would you like to use?',
        validate: val => !!val.length || 'Please select at least a platform',
        default: currentPlatforms,
        choices: SUPPORTED_PLATFORMS
    });

    updateProjectPlatforms(c, inputSupportedPlatforms);
};

const _generatePlatformChoices = c => c.buildConfig.defaults.supportedPlatforms.map((platform) => {
    const isConnected = c.paths.project.platformTemplatesDirs[
        platform
    ].includes(c.paths.rnv.platformTemplates.dir);
    return {
        name: `${platform} - ${
            isConnected
                ? chalk().green('(connected)')
                : chalk().yellow('(ejected)')
        }`,
        value: platform,
        isConnected
    };
});

export const rnvPlatformEject = async (c) => {
    logTask('rnvPlatformEject');

    const { ejectedPlatforms } = await inquirer.prompt({
        name: 'ejectedPlatforms',
        message:
            'This will copy platformTemplates folders from ReNative managed directly to your project Select platforms you would like to connect (use SPACE key)',
        type: 'checkbox',
        choices: _generatePlatformChoices(c).map(choice => ({
            ...choice,
            disabled: !choice.isConnected
        }))
    });

    if (ejectedPlatforms.length) {
        const ptfn = 'platformTemplates';
        const rptf = c.paths.rnv.platformTemplates.dir;
        const prf = c.paths.project.dir;

        let copyShared = false;

        ejectedPlatforms.forEach((platform) => {
            if (PLATFORMS[platform].requiresSharedConfig) {
                copyShared = true;
            }
            copyFolderContentsRecursiveSync(
                path.join(rptf, platform),
                path.join(prf, ptfn, platform)
            );

            if (copyShared) {
                copyFolderContentsRecursiveSync(
                    path.join(rptf, '_shared'),
                    path.join(prf, ptfn, '_shared')
                );
            }

            c.files.project.config.paths
                .platformTemplatesDirs = c.files.project.config.paths.platformTemplatesDirs || {};
            c.files.project.config.paths.platformTemplatesDirs[
                platform
            ] = `./${ptfn}`;
            writeFileSync(c.paths.project.config, c.files.project.config);
        });

        logSuccess(
            `${chalk().white(
                ejectedPlatforms.join(',')
            )} platform templates are located in ${chalk().white(
                c.files.project.config.paths.platformTemplatesDirs[ejectedPlatforms[0]]
            )} now. You can edit them directly!`
        );
    } else {
        logError(`You haven't selected any platform to eject.
TIP: You can select options with ${chalk().white('SPACE')} key before pressing ENTER!`);
    }
};

const _genPlatOptions = (c) => {
    const opts = generateOptions(
        c.buildConfig.defaults.supportedPlatforms,
        true,
        null,
        (i, obj, mapping, defaultVal) => {
            const isEjected = c.paths.project.platformTemplatesDirs[
                obj
            ].includes(c.paths.rnv.platformTemplates.dir)
                ? chalk().green('(connected)')
                : chalk().yellow('(ejected)');
            return ` [${chalk().white(i + 1)}]> ${chalk().bold(
                defaultVal
            )} - ${isEjected} \n`;
        }
    );
    return opts;
};

export const rnvPlatformConnect = async (c) => {
    logTask('rnvPlatformConnect');

    const { connectedPlatforms } = await inquirer.prompt({
        name: 'connectedPlatforms',
        message:
            'This will point platformTemplates folders from your local project to ReNative managed one. Select platforms you would like to connect',
        type: 'checkbox',
        choices: _generatePlatformChoices(c).map(choice => ({
            ...choice,
            disabled: choice.isConnected
        }))
    });

    if (connectedPlatforms.length) {
        connectedPlatforms.forEach((platform) => {
            if (c.files.project.config.paths.platformTemplatesDirs?.[platform]) {
                delete c.files.project.config.paths.platformTemplatesDirs[platform];
            }

            if (
                !Object.keys(c.files.project.config.paths.platformTemplatesDirs)
                    .length
            ) {
                delete c.files.project.config.paths.platformTemplatesDirs; // also cleanup the empty object
            }

            writeFileSync(c.paths.project.config, c.files.project.config);
        });
    }

    const { deletePlatformFolder } = await inquirer.prompt({
        name: 'deletePlatformFolder',
        type: 'confirm',
        message:
            'Would you also like to delete the previously used platform folder?'
    });

    if (deletePlatformFolder) {
        const pathsToRemove = [];
        connectedPlatforms.forEach((platform) => {
            pathsToRemove.push(
                path.join(
                    c.paths.project.platformTemplatesDirs[platform],
                    platform
                )
            );
        });

        // TODO: Remove shared folders as well

        await removeDirs(pathsToRemove);
    }

    logSuccess(
        `${chalk().white(
            connectedPlatforms.join(',')
        )} now using ReNative platformTemplates located in ${chalk().white(
            c.paths.rnv.platformTemplates.dir
        )} now!`
    );
};

const _runCopyPlatforms = (c, platform) => new Promise((resolve) => {
    logTask(`_runCopyPlatforms:${platform}`);
    const copyPlatformTasks = [];

    if (platform === 'all') {
        Object.keys(c.buildConfig.platforms).forEach((k) => {
            if (_isPlatformSupportedSync(k)) {
                const ptPath = path.join(
                    c.paths.project.platformTemplatesDirs[k],
                    `${k}`
                );
                const pPath = path.join(
                    c.paths.project.builds.dir,
                    `${c.runtime.appId}_${k}`
                );
                copyPlatformTasks.push(
                    copyFolderContentsRecursiveSync(ptPath, pPath, true, false, false, {},
                        getTimestampPathsConfig(c, platform), c)
                );
            }
        });
    } else if (_isPlatformSupportedSync(platform)) {
        const ptPath = path.join(
            c.paths.project.platformTemplatesDirs[platform],
            `${platform}`
        );
        const pPath = path.join(
            c.paths.project.builds.dir,
            `${c.runtime.appId}_${platform}`
        );
        copyPlatformTasks.push(
            copyFolderContentsRecursiveSync(ptPath, pPath, true, false, false, {},
                getTimestampPathsConfig(c, platform), c)
        );
    } else {
        logWarning(
            `Your platform ${chalk().white(
                platform
            )} config is not present. Check ${chalk().white(
                c.paths.appConfig.config
            )}`
        );
    }

    Promise.all(copyPlatformTasks).then(() => {
        resolve();
    });
});

export const cleanPlatformBuild = (c, platform) => new Promise((resolve) => {
    logTask('cleanPlatformBuild', `platforms:${platform}`);

    const cleanTasks = [];

    if (platform === 'all') {
        Object.keys(c.buildConfig.platforms).forEach((k) => {
            if (_isPlatformSupportedSync(k)) {
                const pPath = path.join(
                    c.paths.project.builds.dir,
                    `${c.runtime.appId}_${k}`
                );
                cleanTasks.push(cleanFolder(pPath));
            }
        });
    } else if (_isPlatformSupportedSync(platform)) {
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

export const configureGenericPlatform = async (c) => {
    logTask('configureGenericPlatform');
    // await configurePlatformIfRequired(c, c.platform);
    if (c.program.reset) {
        logInfo(
            `You passed ${chalk().white('-r')} argument. paltform ${chalk().white(
                c.platform
            )} will be cleaned up first!`
        );
        await cleanPlatformBuild(c, c.platform);
    }

    if (c.program.resetHard) {
        await cleanPlaformAssets(c);
    }
    await createPlatformBuild(c, c.platform);
    return true;
};

export const createPlatformBuild = (c, platform) => new Promise((resolve, reject) => {
    logTask('createPlatformBuild');

    if (!_isPlatformSupportedSync(platform, null, reject)) return;

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
            message: `Looks like platform ${
                c.platform
            } is not supported by your project. Would you like to enable it?`
        });

        if (confirm) {
            const newPlatforms = [...configuredPlatforms, c.platform];
            updateProjectPlatforms(c, newPlatforms);
            c.buildConfig.defaults.supportedPlatforms = newPlatforms;
            await configureEntryPoints(c);
        } else {
            throw new Error('User canceled');
        }
    }

    // Check global SDKs
    await checkAndConfigureSdks(c);
    return c.platform;
};

const _isPlatformSupportedSync = (platform, resolve, reject) => {
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
            `Looks like your appConfigFile is not configured properly! check ${chalk().white(
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
