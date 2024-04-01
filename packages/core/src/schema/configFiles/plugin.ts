import { AnyZodObject, z } from 'zod';
import { zodExt } from '../shared';
import { RnvPluginSchema, zodPluginSchema } from '../plugins';

const zodPluginFragment = z.object({
    custom: z.optional(zodExt),
});

export const RootPluginSchema: AnyZodObject = zodPluginSchema.merge(zodPluginFragment);

export type _RootPluginSchemaType = RnvPluginSchema & z.infer<typeof zodPluginFragment>;

// renative.plugin.json
export type ConfigFilePlugin = _RootPluginSchemaType;
