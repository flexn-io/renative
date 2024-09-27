import { createTask, RnvTaskName } from '@rnv/core';
import { SdkPlatforms } from '../constants';
import fs from 'fs';
export default createTask({
    description: 'Change tizen certificate',
    fn: async ({ ctx }) => {
        console.log('good');

        // bad approach?
        ctx.paths.appConfig.configs.forEach(async (config: string) => {
            if (config.includes('base')) {
                const configFile = await JSON.parse(fs.readFileSync(config, 'utf-8'));

                configFile.platforms.tizen.certificateProfile = 'newCert';
                configFile.platforms.tizenwatch.certificateProfile = 'newCert';
                configFile.platforms.tizenmobile.certificateProfile = 'newCert';

                fs.writeFileSync(config, JSON.stringify(configFile, null, 2));
            }
        });

        // should do a simple thing - update core/src/schema/defaults.ts certificateProfile key
        // AND update certificateProfile key in template-starter/appConfigs/base/renative.json platforms.tizen, platforms.tizenwatch and platforms.tizenmobile
    },
    task: RnvTaskName.tizenCertificate,
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
