import {
    RnvTaskOptionPresets,
    updateProjectPlatforms,
    logTask,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskPlatformSetup: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskPlatformSetup');

    await executeTask(c, RnvTaskName.projectConfigure, RnvTaskName.platformSetup, originTask);

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
    fn: taskPlatformSetup,
    task: RnvTaskName.platformSetup,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
