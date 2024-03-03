import {
    logTask,
    configureFonts,
    copyRuntimeAssets,
    executeTask,
    PARAMS,
    RnvTaskFn,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
    TaskKey,
} from '@rnv/core';

export const taskRnvSwitch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvSwitch');

    c.program.appConfigID = true;

    await executeTask(c, TaskKey.projectConfigure, TaskKey.appSwitch, originTask);

    await copyRuntimeAssets(c);
    await generatePlatformAssetsRuntimeConfig(c);
    await configureFonts(c);

    return true;
};

const Task: RnvTask = {
    description: 'Switch between different app configs in current project',
    fn: taskRnvSwitch,
    task: TaskKey.appSwitch,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
