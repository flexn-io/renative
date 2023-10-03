import {
    RnvTaskFn,
    TASK_APP_CONFIGURE,
    TASK_CONFIGURE_SOFT,
    PARAMS,
    executeTask,
    configureRuntimeDefaults,
    isPlatformSupported,
    isBuildSchemeSupported,
    logTask,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../common';

export const taskRnvConfigureSoft: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigureSoft');

    await configureRuntimeDefaults(c);
    await executeTask(c, TASK_APP_CONFIGURE, parentTask, originTask);
    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkAndConfigureSdks(c);
    await checkSdk(c);
    await configureRuntimeDefaults(c);
    return true;
};

export default {
    description: 'Configure system and project wothout recreating files (used for --only)',
    fn: taskRnvConfigureSoft,
    task: TASK_CONFIGURE_SOFT,
    params: PARAMS.withBase(),
    platforms: [],
};
