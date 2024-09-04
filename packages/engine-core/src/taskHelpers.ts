import {
    areNodeModulesInstalled,
    checkForPluginDependencies,
    getContext,
    installPackageDependencies,
    logDefault,
    logInfo,
    overrideTemplatePlugins,
} from '@rnv/core';
import { configureFonts, isOfflineMode } from '@rnv/sdk-utils';

export const installPackageDependenciesAndPlugins = async () => {
    logDefault('installPackageDependenciesAndPlugins');

    await installPackageDependencies();
    await overrideTemplatePlugins();
    await configureFonts();
    await checkForPluginDependencies(async () => {
        await installPackageDependenciesAndPlugins();
    });
};

export const checkAndInstallIfRequired = async () => {
    const ctx = getContext();
    if (isOfflineMode('install package dependencies and plugins')) {
        return true;
    }
    if (ctx.program.opts().skipDependencyCheck) {
        logInfo(`Skipping installing package dependencies and plugins due to --skip-dependency-check option`);
        return true;
    }
    const isNmInstalled = areNodeModulesInstalled();
    if (isNmInstalled && !ctx._requiresNpmInstall) {
        return true;
    }
    // if (!isNmInstalled) {
    //     logInfo('node_modules folder is missing. INSTALLING...');
    // } else if (ctx._requiresNpmInstall) {
    //     logInfo('node_modules folder is out of date. INSTALLING...');
    // }

    await installPackageDependenciesAndPlugins();
};
