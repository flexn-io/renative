import { AnyZodObject, z } from 'zod';
import { zodExt } from '../shared';
import { zodPluginSchema } from '../plugins';

export const zodPluginFragment = z.object({
    custom: z.optional(zodExt),
});

export const zodConfigFilePlugin: AnyZodObject = zodPluginSchema.merge(zodPluginFragment).partial();
