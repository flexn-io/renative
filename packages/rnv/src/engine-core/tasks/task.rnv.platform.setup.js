import inquirer from 'inquirer';
import { SUPPORTED_PLATFORMS, TASK_PLATFORM_SETUP, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { updateProjectPlatforms } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { executeTask } from '../../core/engineManager';


export const taskRnvPlatformSetup = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformSetup');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_SETUP, originTask);

    const currentPlatforms = c.files.project.config.defaults?.supportedPlatforms || [];

    const { inputSupportedPlatforms } = await inquirer.prompt({
        name: 'inputSupportedPlatforms',
        type: 'checkbox',
        pageSize: 20,
        message: 'What platforms would you like to use?',
        validate: val => !!val.length || 'Please select at least a platform',
        default: currentPlatforms,
        choices: SUPPORTED_PLATFORMS
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
