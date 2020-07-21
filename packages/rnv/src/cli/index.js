/* eslint-disable import/no-cycle */
import { taskRnvInstall } from '../engine-core/task.rnv.install';
import { isPlatformSupported } from '../core/platformManager';
import { isBuildSchemeSupported } from '../core/common';
import { checkSdk } from '../core/sdkManager';
import { resolvePluginDependants, configurePlugins } from '../core/pluginManager';
import { logAppInfo } from '../core/systemManager/logger';
import { applyTemplate, checkIfTemplateInstalled } from '../core/templateManager';
import { checkCrypto } from '../core/systemManager/crypto';
import { getEngineByPlatform, initializeTask, findSuitableTask } from '../core/engineManager';
import { isSystemWin } from '../core/utils';
import { PLATFORMS } from '../core/constants';
import { checkAndMigrateProject } from '../core/projectManager/migrator';
import {
    parseRenativeConfigs,
    updateConfig,
    fixRenativeConfigsSync,
    configureRnvGlobal,
    checkIsRenativeProject
} from '../core/configManager/configParser';
import { checkAndCreateProjectPackage } from '../core/projectManager/projectParser';


const run = async (c) => {
    setDefaults(c);

    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);

    const taskInstance = await findSuitableTask(c);

    if (!taskInstance.skipSetup) {
        await checkAndMigrateProject(c);
        await parseRenativeConfigs(c);
        await checkIsRenativeProject(c);
        await checkAndCreateProjectPackage(c);
        await configureRnvGlobal(c);
        await checkIfTemplateInstalled(c);
        await fixRenativeConfigsSync(c);
        await taskRnvInstall(c);
        await applyTemplate(c);
        await configurePlugins(c);
        await taskRnvInstall(c);
        await checkCrypto(c);
    } else {
        await configureRnvGlobal(c);
    }
    if (!taskInstance.skipAppConfig) {
        await updateConfig(c, c.runtime.appId);
    }
    await logAppInfo(c);

    if (!taskInstance.skipPlatforms) {
        await isPlatformSupported(c);
        await isBuildSchemeSupported(c);
        await checkSdk(c);
        await resolvePluginDependants(c);
        await taskRnvInstall(c);
    }
    setDefaults(c);

    await initializeTask(c, taskInstance.task);
};

const setDefaults = (c) => {
    c.runtime.port = c.program.port
    || c.buildConfig?.defaults?.ports?.[c.platform]
    || PLATFORMS[c.platform]?.defaultPort;
    if (c.program.target !== true) {
        c.runtime.target = c.program.target
        || c.files.workspace.config?.defaultTargets?.[c.platform];
    } else c.runtime.target = c.program.target;
    c.runtime.scheme = c.program.scheme || 'debug';
    c.runtime.localhost = isSystemWin ? '127.0.0.1' : '0.0.0.0';
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    c.runtime.engine = getEngineByPlatform(c, c.platform);
};

export default run;
