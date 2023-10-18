import { z } from 'zod';
import { PlatformsKeys } from '../shared';

export const RootTemplatesSchema = z.object({
    projectTemplates: z.record(
        z.string(),
        z.object({
            description: z.string(),
        })
    ),
    engineTemplates: z.record(
        z.string(),
        z.object({
            version: z.string(),
            id: z.string(),
        })
    ),
    integrationTemplates: z.record(
        z.string(),
        z.object({
            version: z.string(),
        })
    ),
    platforms: z.record(
        PlatformsKeys,
        z.object({
            engine: z.string(),
        })
    ),
});

export type _RootTemplatesSchemaType = z.infer<typeof RootTemplatesSchema>;
