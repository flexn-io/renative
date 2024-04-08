import { z } from 'zod';
import { zodTemplateAndroidFragment } from '../../platforms/fragments/templateAndroid';

export const zodPluginPlatformAndroidFragment = zodTemplateAndroidFragment
    .extend({
        projectName: z.string(),
        skipLinking: z.boolean(),
        skipImplementation: z.boolean(),
        implementation: z.string(),
        package: z.string(),
    })
    .partial();
