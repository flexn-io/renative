import { z } from 'zod';
import { zodDefaultTargets } from '../shared';

const WorkspaceAppConfigsDir = z.string().describe('Defines app configs dir outside of current project');

const Meta = z.object({
    currentAppConfigId: z.optional(z.string()),
    requiresJetify: z.optional(z.boolean()),
});

//LEVEl 0 (ROOT)

export const zodRootLocalSchema = z.object({
    workspaceAppConfigsDir: z.optional(WorkspaceAppConfigsDir),
    defaultTargets: z.optional(zodDefaultTargets),
    _meta: z.optional(Meta),
    // extend: z.optional(z.string()),
});
