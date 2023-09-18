import {
    TASK_PLATFORM_SETUP,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    updateProjectPlatforms,
    logTask,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
} from '@rnv/core';

export const taskRnvPlatformSetup: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPlatformSetup');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_SETUP, originTask);

    const currentPlatforms = c.files.project.config.defaults?.supportedPlatforms || [];

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

export default {
    description: '',
    fn: taskRnvPlatformSetup,
    task: TASK_PLATFORM_SETUP,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
