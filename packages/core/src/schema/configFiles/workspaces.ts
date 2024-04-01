import { z } from 'zod';

export const zodFileWorkspaces = z.object({
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
