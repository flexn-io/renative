import { logTask, RnvTaskFn, executeTask, RnvTask, RnvTaskName } from '@rnv/core';
import { runAppleLog } from '../runner';
import { SdkPlatforms } from '../common';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskLog', `parent:${parentTask}`);

    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.projectConfigure, originTask);

    return runAppleLog();
};

const Task: RnvTask = {
    description: 'Attach logger to device or emulator and print out logs',
    fn,
    task: RnvTaskName.log,
    platforms: SdkPlatforms,
    isGlobalScope: true,
};

export default Task;
