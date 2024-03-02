import { PARAMS, updateProjectPlatforms, logTask, executeTask, RnvTaskFn, inquirerPrompt, RnvTask } from '@rnv/core';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';
import { TASK_PLATFORM_SETUP } from './constants';

export const taskRnvPlatformSetup: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPlatformSetup');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_SETUP, originTask);

    const currentPlatforms = c.files.project.config?.defaults?.supportedPlatforms || [];

    const { inputSupportedPlatforms } = await inquirerPrompt({
        name: 'inputSupportedPlatforms',
        type: 'checkbox',
        pageSize: 20,
        message: 'What platforms would you like to use?',
        validate: (val) => !!val.length || 'Please select at least a platform',
        default: currentPlatforms,
        choices: c.runtime.availablePlatforms,
    });

    updateProjectPlatforms(c, inputSupportedPlatforms);
};

const Task: RnvTask = {
    description: 'Allows you to change supportedPlatforms for your project',
    fn: taskRnvPlatformSetup,
    task: TASK_PLATFORM_SETUP,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
