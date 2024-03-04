import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { buildXcodeProject } from '@rnv/sdk-apple';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild');
    const { platform } = c;

    await executeOrSkipTask(c, RnvTaskName.package, RnvTaskName.build, originTask);

    if (shouldSkipTask(c, RnvTaskName.build, originTask)) return true;

    switch (platform) {
        case 'macos':
            if (parentTask === RnvTaskName.export) {
                // build task is not necessary when exporting macos
                return true;
            }
            return buildXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskBuild,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos'],
};

export default Task;
