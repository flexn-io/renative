/* eslint-disable import/no-cycle */
import { configurePlugins } from '../core/pluginManager';
import { logTask, logAppInfo } from '../core/systemManager/logger';
import { parseRenativeConfigs,
    fixRenativeConfigsSync,
    configureRnvGlobal,
    updateConfig,
    checkIsRenativeProject } from '../core/configManager/configParser';
import { applyTemplate, checkIfTemplateInstalled } from '../core/templateManager';
import { checkCrypto } from '../core/systemManager/crypto';
import { checkAndMigrateProject } from '../core/projectManager/migrator';
import { TASK_INSTALL, TASK_PROJECT_CONFIGURE } from '../core/constants';
import { checkAndCreateProjectPackage } from '../core/projectManager/projectParser';
import { executeTask } from '../core/engineManager';

export const taskRnvProjectConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformConfigure', `parent:${parentTask} origin:${originTask}`);

    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);
    await checkIsRenativeProject(c);
    await checkAndCreateProjectPackage(c);
    await configureRnvGlobal(c);
    await checkIfTemplateInstalled(c);
    await fixRenativeConfigsSync(c);
    await executeTask(c, TASK_INSTALL, TASK_PROJECT_CONFIGURE, originTask);
    await applyTemplate(c);
    await configurePlugins(c);
    await executeTask(c, TASK_INSTALL, TASK_PROJECT_CONFIGURE, originTask);
    await checkCrypto(c);
    await updateConfig(c, c.runtime.appId);
    await logAppInfo(c);

    return true;
};

export default {
    description: '',
    fn: taskRnvProjectConfigure,
    task: TASK_PROJECT_CONFIGURE,
    params: [],
    platforms: [],
    skipPlatforms: true,
};
