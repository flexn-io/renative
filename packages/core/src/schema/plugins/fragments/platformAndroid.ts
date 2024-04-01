import { z } from 'zod';
import { zodTemplateAndroidFragment } from '../../platforms/fragments/templateAndroid';

export const zodPluginPlatformAndroidFragment = {
    projectName: z.optional(z.string()),
    skipLinking: z.optional(z.boolean()),
    skipImplementation: z.optional(z.boolean()),
    implementation: z.optional(z.string()),
    package: z.optional(z.string()),
    templateAndroid: zodTemplateAndroidFragment,
};
