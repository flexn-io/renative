import { getContext, inquirerPrompt, logError } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../utils';

export const inquirySupportedPlatforms = async (data: NewProjectData) => {
    const c = getContext();
    const { platform } = c.program;
    const supportedPlatforms =
        data.files.template.renativeTemplateConfig?.defaults?.supportedPlatforms ||
        data.files.template.renativeConfig?.defaults?.supportedPlatforms ||
        [];

    if (supportedPlatforms.length === 0) {
        logError(
            `Template ${data.selectedInputTemplate} does not seem to export any default platforms to support. contact the author.`
        );
    }

    let inputSupportedPlatforms;
    if (checkInputValue(platform)) {
        data.inputSupportedPlatforms = platform.split(',');
    } else {
        const answer = await inquirerPrompt({
            name: 'inputSupportedPlatforms',
            type: 'checkbox',
            pageSize: 20,
            message: 'What platforms would you like to use?',
            validate: (val) => !!val.length || 'Please select at least a platform',
            default: supportedPlatforms,
            choices: supportedPlatforms,
        });
        data.inputSupportedPlatforms = answer?.inputSupportedPlatforms;
    }
    data.optionPlatforms.selectedOptions = inputSupportedPlatforms;
};
