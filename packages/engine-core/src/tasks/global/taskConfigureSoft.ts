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
import { isBuildSchemeSupported } from '../../buildSchemes';

const taskConfigureSoft: RnvTaskFn = async (_c, parentTask, originTask) => {
    logTask('taskConfigureSoft');

    await configureRuntimeDefaults();
    await executeTask(RnvTaskName.appConfigure, RnvTaskName.configureSoft, originTask);
    await isPlatformSupported();
    await isBuildSchemeSupported();

    await executeTask(RnvTaskName.sdkConfigure, RnvTaskName.configureSoft, originTask);

    await configureRuntimeDefaults();
    return true;
};

const Task: RnvTask = {
    description: 'Configure system and project without recreating files (used for --only)',
    fn: taskConfigureSoft,
    task: RnvTaskName.configureSoft,
    options: RnvTaskOptionPresets.withBase(),
    isPrivate: true,
};

export default Task;
