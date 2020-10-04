import { TASK_PROJECT_UPGRADE, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { logTask } from '../../core/systemManager/logger';
import { upgradeProjectDependencies } from '../../core/projectManager/projectParser';
import { executeTask } from '../../core/engineManager';
import { listAndSelectNpmVersion } from '../../core/systemManager/npmUtils';
import { installPackageDependenciesAndPlugins } from '../../core/pluginManager';


export const taskRnvProjectUpgrade = async (c, parentTask, originTask) => {
    logTask('taskRnvProjectUpgrade');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PROJECT_UPGRADE, originTask);

    const selectedVersion = await listAndSelectNpmVersion(c, 'rnv');

    upgradeProjectDependencies(c, selectedVersion);

    await installPackageDependenciesAndPlugins(c);

    return true;
};

export default {
    description: 'Upgrade or downgrade RNV dependencies in your ReNative project',
    fn: taskRnvProjectUpgrade,
    task: TASK_PROJECT_UPGRADE,
    params: PARAMS.withBase(),
    platforms: [],
};
