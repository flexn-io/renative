import { z } from 'zod';
import { Common, Env, MonoRoot } from './configLevel1';
import { Ext } from './common/configCommon';
import { ExtendTemplate, PortOffset, Ports, Schemes, SupportedPlatforms, Targets } from './configLevel2';
import { Platforms } from './configPlatforms';
import { Plugins } from './configPlugins';

export const Defaults = z
    .object({
        ports: Ports,
        supportedPlatforms: SupportedPlatforms,
        portOffset: z.optional(PortOffset),
        schemes: z.optional(Schemes),
        targets: z.optional(Targets),
    })
    .describe('Default system config for this project');

export const Pipes = z
    .array(z.string())
    .describe(
        'To avoid rnv building `buildHooks/src` every time you can specify which specific pipes should trigger recompile of buildHooks'
    );

export const WorkspaceID = z
    .string() //TODO: no spaces
    .describe(
        'Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS'
    );

const Tasks = z
    .object({
        install: z.optional(
            z.object({
                script: z.string(),
            })
        ),
    })
    .describe(
        'Allows to override specific task within renative toolchain. (currently only `install` supported). this is useful if you want to change specific behaviour of built-in task. ie install task triggers yarn/npm install by default. but that might not be desirable installation trigger'
    );

const Integrations = z
    .record(z.string(), z.object({}))
    .describe('Object containing integration configurations where key represents package name');

const Engine = z.union([
    z.literal('source:rnv'),
    z.object({
        version: z.optional(z.string()),
    }),
]);

const IsMonoRepo = z.boolean().describe('Mark if your project is part of monorepo');

const Template = z.object({
    version: z.string(),
});

const Templates = z
    .record(z.string(), Template)
    .describe(
        'Stores installed templates info in your project.\n\nNOTE: This prop will be updated by rnv if you run `rnv template install`'
    );

const CurrentTemplate = z
    .string()
    .describe(
        'Currently active template used in this project. this allows you to re-bootstrap whole project by running `rnv template apply`'
    );

const Crypto = z
    .object({
        encrypt: z.object({
            dest: z
                .string()
                .describe(
                    'Location of encrypted file in your project used as destination of encryption from your workspace'
                ),
        }),
        decrypt: z.object({
            source: z
                .string()
                .describe(
                    'Location of encrypted file in your project used as source of decryption into your workspace'
                ),
        }),
    })
    .describe('This prop enables automatic encrypt and decrypt of sensitive information in your project');

const Permissions = z
    .object({
        android: z.optional(
            z
                .record(
                    z.string(),
                    z.object({
                        key: z.string(), //TODO: type this
                        security: z.string(), //TODO: type this
                    })
                )
                .describe('Android SDK specific permissions')
        ),
        ios: z.optional(
            z
                .record(
                    z.string(), //TODO: type this
                    z.object({
                        desc: z.string(),
                    })
                )
                .describe('iOS SDK specific permissions')
        ),
    })
    .describe(
        'Permission definititions which can be used by app configs via `includedPermissions` and `excludedPermissions` to customize permissions for each app'
    );

const Engines = z.record(z.string(), Engine).describe('List of engines available in this project');

const EnableHookRebuild = z
    .boolean()
    .describe(
        'If set to true in `./renative.json` build hooks will be compiled at each rnv command run. If set to `false` (default) rebuild will be triggered only if `dist` folder is missing, `-r` has been passed or you run `rnv hooks run` directly making your rnv commands faster'
    );

const EnableAnalytics = z.boolean().describe('Enable or disable sending analytics to improve ReNative');

const ProjectName = z
    .string()
    .describe(
        'Name of the project which will be used in workspace as folder name. this will also be used as part of the KEY in crypto env var generator'
    );

const Paths = z
    .object({
        appConfigsDir: z.optional(z.string().describe('Custom path to appConfigs. defaults to `./appConfigs`')),
        platformAssetsDir: z.optional(
            z.string().describe('Custom path to platformAssets folder. defaults to `./platformAssets`')
        ),
        platformBuildsDir: z.optional(
            z.string().describe('Custom path to platformBuilds folder. defaults to `./platformBuilds`')
        ),
        pluginTemplates: z.optional(
            z.record(
                z.string(),
                z.object({
                    npm: z.optional(z.string()),
                    path: z.string(),
                })
            ).describe(`
        Allows you to define custom plugin template scopes. default scope for all plugins is \`rnv\`.
        this custom scope can then be used by plugin via \`"source:myCustomScope"\` value
        
        those will allow you to use direct pointer to preconfigured plugin:
        
        \`\`\`
        "plugin-name": "source:myCustomScope"
        \`\`\`
        
        NOTE: by default every plugin you define with scope will also merge any
        files defined in overrides automatically to your project.
        To skip file overrides coming from source plugin you need to detach it from the scope:
        
        \`\`\`
        {
            "plugins": {
                "plugin-name": {
                    "source": ""
                }
            }
        }
        \`\`\`
        `)
        ),
    })
    .describe('Define custom paths for RNV to look into');

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
