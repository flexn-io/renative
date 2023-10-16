import { z } from 'zod';
import { Ext } from '../shared';
import { PluginSchema } from '../plugins';

export const RootPluginSchema = PluginSchema.extend({
    custom: z.optional(Ext),
});

export type _RootPluginSchemaType = z.infer<typeof RootPluginSchema>;
