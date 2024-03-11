import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { buildReactNativeAndroid } from '@rnv/sdk-react-native';
import { buildXcodeProject } from '@rnv/sdk-apple';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild');
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.package, RnvTaskName.build, originTask);

    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;

    switch (platform) {
        case 'androidtv':
        case 'firetv':
            return buildReactNativeAndroid();
        case 'tvos':
            if (parentTask === RnvTaskName.export) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject();
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskBuild,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
