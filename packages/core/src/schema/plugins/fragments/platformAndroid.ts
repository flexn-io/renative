import { z } from 'zod';
import { zodTemplateAndroidFragment } from '../../platforms/fragments/templateAndroid';

export const zodPluginPlatformAndroidFragment = zodTemplateAndroidFragment.extend({
    projectName: z.optional(z.string()),
    skipLinking: z.optional(z.boolean()),
    skipImplementation: z.optional(z.boolean()),
    implementation: z.optional(z.string()),
    package: z.optional(z.string()),
});

export type RnvPluginPlatformAndroidFragment = Partial<z.infer<typeof zodPluginPlatformAndroidFragment>>;
