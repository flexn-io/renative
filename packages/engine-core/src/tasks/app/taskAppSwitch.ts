import {
    logTask,
    configureFonts,
    copyRuntimeAssets,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskSwitch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskSwitch');

    c.program.appConfigID = true;

    await executeTask(c, RnvTaskName.projectConfigure, RnvTaskName.appSwitch, originTask);

    await copyRuntimeAssets(c);
    await generatePlatformAssetsRuntimeConfig(c);
    await configureFonts(c);

    return true;
};

const Task: RnvTask = {
    description: 'Switch between different app configs in current project',
    fn: taskSwitch,
    task: RnvTaskName.appSwitch,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
