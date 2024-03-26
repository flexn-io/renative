import {
    logTask,
    copyRuntimeAssets,
    executeTask,
    RnvTaskFn,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { configureFonts } from '@rnv/sdk-utils';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskSwitch');

    c.program.opts().appConfigID = true;

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.appSwitch, originTask);

    await copyRuntimeAssets();
    await generatePlatformAssetsRuntimeConfig();
    await configureFonts();

    return true;
};

const Task: RnvTask = {
    description: 'Switch between different app configs in current project',
    fn: async () => {},
    task: RnvTaskName.appSwitch,
};

export default Task;
