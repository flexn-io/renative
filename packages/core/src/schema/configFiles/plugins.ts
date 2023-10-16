import { z } from 'zod';
import { Ext } from '../shared';
import { PluginSchema } from '../plugins';

export const PluginTemplates = z
    .record(z.string(), PluginSchema)
    .describe('Define all plugins available to be merged with project plugins');

export const DisableRnvDefaultOverrides = z
    .boolean()
    .describe(
        'Disables default rnv scope plugin overrides and merges. Useful if you want to test entirely clean plugin template list'
    );

//LEVEl 0 (ROOT)

export const RootPluginsSchema = z.object({
    custom: z.optional(Ext),
    pluginTemplates: PluginTemplates,
    disableRnvDefaultOverrides: z.optional(DisableRnvDefaultOverrides),
});

export type _RootPluginsSchemaType = z.infer<typeof RootPluginsSchema>;
