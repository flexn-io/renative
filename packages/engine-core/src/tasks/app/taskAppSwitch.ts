import {
    logTask,
    configureFonts,
    copyRuntimeAssets,
    executeTask,
    PARAMS,
    RnvTaskFn,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
} from '@rnv/core';
import { TASK_APP_SWITCH } from './constants';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';

export const taskRnvSwitch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvSwitch');

    c.program.appConfigID = true;

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_APP_SWITCH, originTask);

    await copyRuntimeAssets(c);
    await generatePlatformAssetsRuntimeConfig(c);
    await configureFonts(c);

    return true;
};

const Task: RnvTask = {
    description: 'Switch between different app configs in current project',
    fn: taskRnvSwitch,
    task: TASK_APP_SWITCH,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
