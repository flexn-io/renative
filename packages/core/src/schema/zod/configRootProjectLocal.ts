import { z } from 'zod';

const WorkspaceAppConfigsDir = z.string().describe('Defines app configs dir outside of current project');

//LEVEl 0 (ROOT)

export const RootProjectLocalSchemaPartial = z.object({
    workspaceAppConfigsDir: z.optional(WorkspaceAppConfigsDir),
});

export type _RootProjectLocalSchemaPartialType = z.infer<typeof RootProjectLocalSchemaPartial>;
