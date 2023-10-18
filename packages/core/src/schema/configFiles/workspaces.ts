import { z } from 'zod';

export const RootWorkspacesSchema = z.object({
    workspaces: z.record(
        z.string(),
        z.object({
            path: z.string(),
        })
    ),
});

export type _RootWorkspacesSchemaType = z.infer<typeof RootWorkspacesSchema>;
