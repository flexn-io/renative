import { PlatformKey, RnvPlatforms, getContext, inquirerPrompt, logError } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../utils';

export const inquirySupportedPlatforms = async (data: NewProjectData) => {
    const c = getContext();
    const { platform } = c.program;

    // TODO: grouped platforms
    // const orderedPlatforms = [
    //     PlatformName.web,
    //     inquirerSeparator('Mobile:')
    //     // Mobile
    //     PlatformName.ios,
    //     PlatformName.android,
    //     PlatformName.tizenmobile,
    //     PlatformName.kaios,
    //     inquirerSeparator('TV:')
    //     // TV
    //     PlatformName.androidtv,
    //     PlatformName.firetv,
    //     PlatformName.webtv,
    //     PlatformName.tizen,
    //     PlatformName.tvos,
    //     PlatformName.webos,
    //     inquirerSeparator('Desktop:')
    //     //Desktop
    //     PlatformName.macos,
    //     PlatformName.windows,
    //     PlatformName.linux,
    //     inquirerSeparator('Wareables:')
    //     //Wareables
    //     PlatformName.tizenwatch,
    //     PlatformName.androidwear,
    //     inquirerSeparator('Other:')
    //     // Other
    //     PlatformName.chromecast,
    //     PlatformName.xbox,
    // ]

    const supportedPlatforms =
        data.files.template.renativeTemplateConfig?.defaults?.supportedPlatforms ||
        data.files.template.renativeConfig?.defaults?.supportedPlatforms ||
        [];

    supportedPlatforms.sort((a, b) => RnvPlatforms.indexOf(a) - RnvPlatforms.indexOf(b));

    const selectedPlatforms =
        data.files.template.renativeTemplateConfig?.bootstrapConfig?.defaultSelectedPlatforms || supportedPlatforms;

    if (supportedPlatforms.length === 0) {
        logError(
            `Template ${data.selectedInputTemplate} does not seem to export any default platforms to support. contact the author.`
        );
    }

    if (checkInputValue(platform)) {
        data.inputSupportedPlatforms = platform.split(',');
    } else {
        const answer = await inquirerPrompt({
            name: 'inputSupportedPlatforms',
            type: 'checkbox',
            pageSize: 20,
            message: 'What platforms would you like to use?',
            validate: (val) => !!val.length || 'Please select at least a platform',
            default: selectedPlatforms,
            choices: supportedPlatforms,
        });
        data.inputSupportedPlatforms = answer?.inputSupportedPlatforms;
    }
    data.optionPlatforms.selectedOptions = (data.inputSupportedPlatforms || []) as Array<PlatformKey>;
};
