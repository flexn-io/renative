import {
    RnvTaskFn,
    PARAMS,
    executeTask,
    configureRuntimeDefaults,
    isPlatformSupported,
    logTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../../common';
import { isBuildSchemeSupported } from '../../buildSchemes';

export const taskRnvConfigureSoft: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigureSoft');

    await configureRuntimeDefaults(c);
    await executeTask(c, TaskKey.appConfigure, parentTask, originTask);
    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkAndConfigureSdks(c);
    await checkSdk(c);
    await configureRuntimeDefaults(c);
    return true;
};

const Task: RnvTask = {
    description: 'Configure system and project without recreating files (used for --only)',
    fn: taskRnvConfigureSoft,
    task: TaskKey.configureSoft,
    params: PARAMS.withBase(),
    platforms: [],
    isPrivate: true,
};

export default Task;