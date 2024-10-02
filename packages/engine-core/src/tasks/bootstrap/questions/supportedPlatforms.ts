import { RnvPlatforms, getContext, inquirerPrompt, logError } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../questionHelpers';

const Question = async (data: NewProjectData) => {
    const c = getContext();
    const { platform } = c.program.opts();
    const { inputs, files } = data;

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
        // files.template.renativeTemplateConfig?.templateConfig?.renative_json?..supportedPlatforms ||
        files.template.renativeConfig?.project?.defaults?.supportedPlatforms || [];

    supportedPlatforms.sort((a, b) => RnvPlatforms.indexOf(a) - RnvPlatforms.indexOf(b));

    const optsPlatforms = c.program.opts().platform && [c.program.opts().platform];
    const selectedPlatforms =
        optsPlatforms ||
        files.template.renativeTemplateConfig?.projectTemplate?.bootstrapConfig?.defaultSelectedPlatforms ||
        supportedPlatforms;

    if (supportedPlatforms.length === 0) {
        logError(
            `Template ${inputs.template?.packageName} does not seem to export any default platforms to support. contact the author.`
        );
    }

    if (checkInputValue(platform)) {
        inputs.supportedPlatforms = platform.split(',');
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
        inputs.supportedPlatforms = answer?.inputSupportedPlatforms || [];
    }
};

export default Question;
