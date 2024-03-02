import {
    RnvTaskFn,
    PARAMS,
    executeTask,
    configureRuntimeDefaults,
    isPlatformSupported,
    logTask,
    RnvTask,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../../common';
import { isBuildSchemeSupported } from '../../buildSchemes';
import { TASK_APP_CONFIGURE } from '../app/constants';
import { TASK_CONFIGURE_SOFT } from './constants';

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

const Task: RnvTask = {
    description: 'Configure system and project without recreating files (used for --only)',
    fn: taskRnvConfigureSoft,
    task: TASK_CONFIGURE_SOFT,
    params: PARAMS.withBase(),
    platforms: [],
    isPrivate: true,
};

export default Task;
