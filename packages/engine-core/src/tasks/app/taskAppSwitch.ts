import {
    logTask,
    copyRuntimeAssets,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { configureFonts } from '@rnv/sdk-utils';

const taskSwitch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskSwitch');

    c.program.appConfigID = true;

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.appSwitch, originTask);

    await copyRuntimeAssets();
    await generatePlatformAssetsRuntimeConfig();
    await configureFonts();

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
