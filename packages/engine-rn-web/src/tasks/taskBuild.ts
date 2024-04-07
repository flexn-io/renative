import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { buildWeb } from '@rnv/sdk-webpack';
import { buildTizenProject } from '@rnv/sdk-tizen';
import { buildWebOSProject } from '@rnv/sdk-webos';
import { buildKaiOSProject } from '@rnv/sdk-kaios';
import { EnginePlatforms } from '../constants';

export default createTask({
    description: 'Build project binary',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx }) => {
        switch (ctx.platform) {
            case 'web':
            case 'webtv':
            case 'chromecast':
                await buildWeb();
                return;
            case 'kaios':
                await buildKaiOSProject();
                return;
            case 'tizen':
            case 'tizenmobile':
            case 'tizenwatch':
                await buildTizenProject();
                return;
            case 'webos':
                await buildWebOSProject();
                return;
            default:
            // DO nothing
        }
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: EnginePlatforms,
});
