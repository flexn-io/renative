import { z } from 'zod';
import { PluginPlatformBase } from './platformBase';
import { TemplateAndroidBaseFragment } from '../platforms/fragments/templateAndroidBase';

export const PluginAndroid = PluginPlatformBase.merge(
    z.object({
        projectName: z.optional(z.string()),
        skipLinking: z.optional(z.boolean()),
        skipImplementation: z.optional(z.boolean()),
        implementation: z.optional(z.string()),
        package: z.optional(z.string()),
        templateAndroid: z.optional(z.object(TemplateAndroidBaseFragment)),
    })
);
