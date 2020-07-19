/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import inquirer from 'inquirer';
import { SUPPORTED_PLATFORMS } from '../constants';
import { updateProjectPlatforms } from '../platformManager';


export const rnvPlatformSetup = async (c) => {
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
