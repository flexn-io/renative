import { copySharedPlatforms, RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { configureWebProject, configureChromecastProject } from '@rnv/sdk-webpack';
import { configureKaiOSProject } from '@rnv/sdk-kaios';
import { configureWebOSProject } from '@rnv/sdk-webos';
import { configureTizenProject } from '@rnv/sdk-tizen';
import { EnginePlatforms } from '../constants';

export default createTask({
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async ({ ctx }) => {
        await copySharedPlatforms();
        switch (ctx.platform) {
            case 'web':
            case 'webtv':
                return configureWebProject();
            case 'tizen':
            case 'tizenmobile':
            case 'tizenwatch':
                return configureTizenProject();
            case 'webos':
                return configureWebOSProject();
            case 'chromecast':
                return configureChromecastProject();
            case 'kaios':
                return configureKaiOSProject();
            default:
            // DO nothing
        }
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: EnginePlatforms,
});
