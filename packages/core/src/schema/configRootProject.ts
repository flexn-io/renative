import { z } from 'zod';
import {
    Common,
    Crypto,
    CurrentTemplate,
    Defaults,
    EnableAnalytics,
    EnableHookRebuild,
    Engines,
    Env,
    Integrations,
    IsMonoRepo,
    MonoRoot,
    Paths,
    Permissions,
    Pipes,
    Platforms,
    Plugins,
    ProjectName,
    Tasks,
    Templates,
    WorkspaceID,
} from './configLevel1';
import { Ext } from './common/configCommon';
import { ExtendTemplate } from './configLevel2';

//LEVEl 0 (ROOT)

const RootProject = z.object({
    workspaceID: WorkspaceID,
    projectName: ProjectName,
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
    monoRoot: z.optional(MonoRoot),
    enableAnalytics: z.optional(EnableAnalytics),
    plugins: z.optional(Plugins),
    extendsTemplate: z.optional(ExtendTemplate),
    tasks: z.optional(Tasks),
    integrations: z.optional(Integrations),
    env: z.optional(Env),
});
//.catchall(z.never());

export type ConfigRootProject = z.infer<typeof RootProject>;
