import { z } from 'zod';

export const RootWorkspacesSchema = z.object({
    workspaces: z.record(
        z.string(),
        z.object({
            path: z.string(),
            remote: z.optional(
                z.object({
                    url: z.string(),
                    type: z.string(),
                })
            ),
        })
    ),
});

export type _RootWorkspacesSchemaType = z.infer<typeof RootWorkspacesSchema>;
