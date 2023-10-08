import { z } from 'zod';
import {
    Common,
    Crypto,
    CurrentTemplate,
    Defaults,
    EnableHookRebuild,
    Engines,
    IsMonoRepo,
    Paths,
    Permissions,
    Pipes,
    Platforms,
    Templates,
    WorkspaceID,
} from './configLevel1';
import { Ext } from './configLevel2';

//LEVEl 0 (ROOT)

export const RootProject = z.object({
    workspaceID: WorkspaceID,
    isMonorepo: z.optional(IsMonoRepo),
    common: Common,
    defaults: z.optional(Defaults),
    pipes: z.optional(Pipes),
    templates: Templates,
    currentTemplate: CurrentTemplate,
    crypto: z.optional(Crypto),
    paths: z.optional(Paths),
    permissions: z.optional(Permissions),
    platforms: z.optional(Platforms),
    engines: z.optional(Engines),
    ext: z.optional(Ext),
    enableHookRebuild: z.optional(EnableHookRebuild),
});
//.catchall(z.never());

export type Config = z.infer<typeof RootProject>;
