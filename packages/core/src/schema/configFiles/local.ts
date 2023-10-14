import { z } from 'zod';
import { DefaultTargets } from '../shared';

const WorkspaceAppConfigsDir = z.string().describe('Defines app configs dir outside of current project');

const Meta = z.object({
    currentAppConfigId: z.optional(z.string()),
    requiresJetify: z.optional(z.boolean()),
});

//LEVEl 0 (ROOT)

export const RootProjectLocalSchemaPartial = z.object({
    workspaceAppConfigsDir: z.optional(WorkspaceAppConfigsDir),
    defaultTargets: z.optional(DefaultTargets),
    _meta: z.optional(Meta),
    extend: z.optional(z.string()),
});

export type _RootProjectLocalSchemaPartialType = z.infer<typeof RootProjectLocalSchemaPartial>;
