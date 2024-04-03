import { z } from 'zod';
import { zodDefaultTargets } from '../shared';

export const zodConfigFileLocal = z
    .object({
        workspaceAppConfigsDir: z.string().describe('Defines app configs dir outside of current project'),
        defaultTargets: zodDefaultTargets,
        _meta: z
            .object({
                currentAppConfigId: z.optional(z.string()),
                requiresJetify: z.optional(z.boolean()),
            })
            .partial(),
        // extend: z.optional(z.string()),
    })
    .partial();
