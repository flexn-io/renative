import { z } from 'zod';
import { zodTemplateAndroidBaseFragment } from '../../platforms/fragments/templateAndroidBase';

export const zodPluginPlatformAndroidFragment = {
    projectName: z.optional(z.string()),
    skipLinking: z.optional(z.boolean()),
    skipImplementation: z.optional(z.boolean()),
    implementation: z.optional(z.string()),
    package: z.optional(z.string()),
    templateAndroid: z.optional(z.object(zodTemplateAndroidBaseFragment)),
};
