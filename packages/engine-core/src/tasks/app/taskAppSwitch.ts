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

const taskSwitch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskSwitch');

    c.program.appConfigID = true;

    await executeTask(c, TaskKey.projectConfigure, TaskKey.appSwitch, originTask);

    await copyRuntimeAssets(c);
    await generatePlatformAssetsRuntimeConfig(c);
    await configureFonts(c);

    return true;
};

const Task: RnvTask = {
    description: 'Switch between different app configs in current project',
    fn: taskSwitch,
    task: TaskKey.appSwitch,
    options: PARAMS.withBase(),
    platforms: [],
};

export default Task;
