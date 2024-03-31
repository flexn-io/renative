import { z } from 'zod';
import { Ext } from '../shared';
import { zodPluginSchema } from '../plugins';

export const RootPluginSchema = zodPluginSchema.extend({
    custom: z.optional(Ext),
});

export type _RootPluginSchemaType = z.infer<typeof RootPluginSchema>;
