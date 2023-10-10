import { z } from 'zod';
import { Ext } from './shared/configShared';
import { Plugin } from './configPlugins';

export const PluginTemplates = z
    .record(z.string(), Plugin)
    .describe('Define all plugins available to be merged with project plugins');

//LEVEl 0 (ROOT)

const RootTemplatesSchema = z.object({
    ext: z.optional(Ext),
    pluginTemplates: PluginTemplates,
});

export type _RootTemplatesSchemaType = z.infer<typeof RootTemplatesSchema>;
