import { z } from 'zod';
import { DefaultTargets } from './shared/configShared';

const WorkspaceAppConfigsDir = z.string().describe('Defines app configs dir outside of current project');

//LEVEl 0 (ROOT)

export const RootProjectLocalSchemaPartial = z.object({
    workspaceAppConfigsDir: z.optional(WorkspaceAppConfigsDir),
    defaultTargets: z.optional(DefaultTargets),
});

export type _RootProjectLocalSchemaPartialType = z.infer<typeof RootProjectLocalSchemaPartial>;
