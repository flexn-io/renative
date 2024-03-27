import { updateProjectPlatforms, inquirerPrompt, RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Allows you to change supportedPlatforms for your project',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const currentPlatforms = ctx.files.project.config?.defaults?.supportedPlatforms || [];

        const { inputSupportedPlatforms } = await inquirerPrompt({
            name: 'inputSupportedPlatforms',
            type: 'checkbox',
            pageSize: 20,
            message: 'What platforms would you like to use?',
            validate: (val) => !!val.length || 'Please select at least a platform',
            default: currentPlatforms,
            choices: ctx.runtime.availablePlatforms,
        });

        updateProjectPlatforms(inputSupportedPlatforms);
    },
    task: RnvTaskName.platformSetup,
};

export default Task;
