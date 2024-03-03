import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { buildReactNativeAndroid } from '@rnv/sdk-react-native';
import { buildXcodeProject } from '@rnv/sdk-apple';

const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.package, TaskKey.build, originTask);

    if (shouldSkipTask(c, TaskKey.build, originTask)) return true;

    switch (platform) {
        case 'androidtv':
        case 'firetv':
            return buildReactNativeAndroid(c);
        case 'tvos':
            if (parentTask === TaskKey.export) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TaskKey.build,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
