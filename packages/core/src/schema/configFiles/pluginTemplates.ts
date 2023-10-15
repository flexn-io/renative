import { z } from 'zod';
import { Ext } from '../shared';
import { Plugin } from '../plugins';

export const PluginTemplates = z
    .record(z.string(), Plugin)
    .describe('Define all plugins available to be merged with project plugins');

export const DisableRnvDefaultOverrides = z
    .boolean()
    .describe(
        'Disables default rnv scope plugin overrides and merges. Useful if you want to test entirely clean plugin template list'
    );

//LEVEl 0 (ROOT)

export const RootPluginTemplatesSchema = z.object({
    custom: z.optional(Ext),
    pluginTemplates: PluginTemplates,
    disableRnvDefaultOverrides: z.optional(DisableRnvDefaultOverrides),
});

export type _RootTemplatesSchemaType = z.infer<typeof RootPluginTemplatesSchema>;
