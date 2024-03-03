import {
    PARAMS,
    updateProjectPlatforms,
    logTask,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskRnvPlatformSetup: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPlatformSetup');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.platformSetup, originTask);

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
    task: TaskKey.platformSetup,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
