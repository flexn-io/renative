import semver from 'semver';
import merge from 'deepmerge';

import { executeAsync } from '../systemManager/exec';
import { installPackageDependencies } from '../systemManager/npmUtils';
import { chalk, logInfo, logDebug, logTask } from '../systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';
import { getEngineRunnerByPlatform } from '../engineManager';
import { writeRenativeConfigFile } from './index';
import { overrideTemplatePlugins } from '../pluginManager';
import { configureFonts } from '../projectManager';
import { getConfigProp } from '../common';
import { RnvConfig } from './types';

const injectProjectDependency = async (
    c: RnvConfig,
    dependency: string,
    version: string,
    type: string,
    skipInstall = false
) => {
    logTask('injectProjectDependency');

    const currentPackage = c.files.project.package;
    const existingPath = c.paths.project.package;
    if (!currentPackage[type]) currentPackage[type] = {};
    currentPackage[type][dependency] = version;
    writeRenativeConfigFile(c, existingPath, currentPackage);
    if (!skipInstall) {
        await installPackageDependencies(c);
        await overrideTemplatePlugins(c);
        await configureFonts(c);
    }
    return true;
};

export const checkRequiredPackage = async (
    c: RnvConfig,
    pkg: string,
    version = '',
    type: string,
    skipAsking = false,
    skipInstall = false,
    skipVersionCheck = false
) => {
    logDebug('checkRequiredPackage');
    if (!pkg) return false;
    const projectConfig = c.files.project;

    if (!projectConfig.package[type]?.[pkg]) {
        // package does not exist, adding it
        let confirm = skipAsking;
        if (!confirm) {
            const resp = await inquirerPrompt({
                type: 'confirm',
                message: `You do not have ${pkg} installed. Do you want to add it now?`,
            });
            // eslint-disable-next-line prefer-destructuring
            confirm = resp.confirm;
        }

        if (confirm) {
            let latestVersion = 'latest';
            if (version === '' && !skipVersionCheck) {
                try {
                    latestVersion = await executeAsync(`npm show ${pkg} version`);
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            }
            return injectProjectDependency(c, pkg, version || latestVersion, type, skipInstall);
        }
    } else if (version === '') {
        // package exists, checking version only if version is not
        const currentVersion = projectConfig.package[type][pkg];
        let latestVersion;
        try {
            latestVersion = await executeAsync(`npm show ${pkg} version`);
            // eslint-disable-next-line no-empty
        } catch (e) {}
        if (latestVersion) {
            let updateAvailable = false;

            try {
                // semver might fail if you have a path instead of a version (like when you are developing)
                updateAvailable = semver.lt(currentVersion, latestVersion);
                // eslint-disable-next-line no-empty
            } catch (e) {}

            if (updateAvailable) {
                let confirm = skipAsking;
                if (!confirm) {
                    const resp = await inquirerPrompt({
                        type: 'confirm',
                        message: `Seems like ${pkg}@${currentVersion} is installed while there is a newer version, ${pkg}@${latestVersion}. Do you want to upgrade?`,
                    });
                    // eslint-disable-next-line prefer-destructuring
                    confirm = resp.confirm;
                }

                if (confirm) {
                    return injectProjectDependency(c, pkg, latestVersion, type, skipInstall);
                }
            }
        }
    }

    return false;
};

export const injectPlatformDependencies = async (c: RnvConfig) => {
    logTask('injectPlatformDependencies');
    const { platform } = c;
    const engine = getEngineRunnerByPlatform(c, platform);
    const npmDepsBase = engine?.config?.npm || {};
    const npmDepsExt = engine?.config?.platforms[platform]?.npm || {};

    const npmDeps = merge<any>(npmDepsBase, npmDepsExt);

    if (npmDeps) {
        const promises = Object.keys(npmDeps).reduce<Array<Promise<boolean>>>((acc, type) => {
            // iterate over dependencies, devDepencencies or optionalDependencies
            Object.keys(npmDeps[type]).forEach((dep) => {
                // iterate over deps
                acc.push(checkRequiredPackage(c, dep, npmDeps[type][dep], type, true, true));
            });
            return acc;
        }, []);

        const installed = await Promise.all(promises);

        if (installed.some((i) => i === true)) {
            const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo');
            if (isMonorepo) {
                logInfo(
                    `Found extra npm dependencies required by ${chalk().white(
                        engine.config.id
                    )} engine. project marked as monorepo. SKIPPING`
                );
            } else {
                // do npm i only if something new is added
                logInfo(
                    `Found extra npm dependencies required by ${chalk().white(engine.config.id)} engine. ADDING...DONE`
                );
                await installPackageDependencies(c);
                await overrideTemplatePlugins(c);
                await configureFonts(c);
            }
        }
    }

    // add other deps that are not npm
};
