import { z } from 'zod';
import { zodPlatformsKeys, zodProjectTemplates } from '../shared';
import { zodPluginSchema } from '../plugins';

export const RootTemplatesSchema = z
    .object({
        projectTemplates: zodProjectTemplates,
        engineIdMap: z.record(z.string(), z.string()),
        engineTemplates: z.record(
            z.string(),
            z.object({
                version: z.string(),
                id: z.string(),
                key: z.string(),
            })
        ),
        integrationTemplates: z.record(
            z.string(),
            z.object({
                version: z.string(),
            })
        ),
        platformTemplates: z.record(
            zodPlatformsKeys,
            z.object({
                engine: z.string(),
            })
        ),
        pluginTemplates: z
            .record(z.string(), zodPluginSchema)
            .describe('Define all plugins available to be merged with project plugins'),
        disableRnvDefaultOverrides: z
            .boolean()
            .describe(
                'Disables default rnv scope plugin overrides and merges. Useful if you want to test entirely clean plugin template list'
            ),
    })
    .partial();

export type _RootTemplatesSchemaType = z.infer<typeof RootTemplatesSchema>;

// renative.templates.json
export type ConfigFileTemplates = _RootTemplatesSchemaType;
