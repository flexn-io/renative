import { z } from 'zod';
import { PlatformsKeys } from '../shared';
import { PluginSchema } from '../plugins';

export const PluginTemplates = z
    .record(z.string(), PluginSchema)
    .describe('Define all plugins available to be merged with project plugins');

export const DisableRnvDefaultOverrides = z
    .boolean()
    .describe(
        'Disables default rnv scope plugin overrides and merges. Useful if you want to test entirely clean plugin template list'
    );

export const RootTemplatesSchema = z.object({
    projectTemplates: z.record(
        z.string(),
        z.object({
            description: z.string(),
        })
    ),
    engineIdMap: z.record(z.string(), z.string()).optional(),
    engineTemplates: z
        .record(
            z.string(),
            z.object({
                version: z.string(),
                id: z.string(),
                key: z.string().optional(),
            })
        )
        .optional(),
    integrationTemplates: z
        .record(
            z.string(),
            z.object({
                version: z.string(),
            })
        )
        .optional(),
    platformTemplates: z
        .record(
            PlatformsKeys,
            z.object({
                engine: z.string(),
            })
        )
        .optional(),
    pluginTemplates: PluginTemplates.optional(),
    disableRnvDefaultOverrides: z.optional(DisableRnvDefaultOverrides),
});

export type _RootTemplatesSchemaType = z.infer<typeof RootTemplatesSchema>;
