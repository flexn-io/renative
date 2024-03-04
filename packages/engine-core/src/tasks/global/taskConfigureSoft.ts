import {
    RnvTaskFn,
    RnvTaskOptionPresets,
    executeTask,
    configureRuntimeDefaults,
    isPlatformSupported,
    logTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../../common';
import { isBuildSchemeSupported } from '../../buildSchemes';

const taskConfigureSoft: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigureSoft');

    await configureRuntimeDefaults(c);
    await executeTask(c, RnvTaskName.appConfigure, parentTask, originTask);
    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkAndConfigureSdks(c);
    await checkSdk(c);
    await configureRuntimeDefaults(c);
    return true;
};

const Task: RnvTask = {
    description: 'Configure system and project without recreating files (used for --only)',
    fn: taskConfigureSoft,
    task: RnvTaskName.configureSoft,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isPrivate: true,
};

export default Task;
