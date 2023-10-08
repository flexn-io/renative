import { z } from 'zod';
import { PlatformiOS } from './configPlatformiOS';

const PlatformsKeys = z.enum(['ios', 'android']);

const HexColor = z.string().min(4).max(9).regex(/^#/);

const Ext = z
    .any()
    .describe(
        'Object ysed to extend your renative with custom props. This allows renative json schema to be validated'
    );

const BuildScheme = z.object({});

const BuildSchemes = z.record(BuildScheme);

const Schemes = z
    .record(PlatformsKeys, z.string())
    .describe(
        'List of default schemes for each platform. This is useful if you want to avoid specifying `-s ...` every time your run rnv command. bu default rnv uses `-s debug`. NOTE: you can only use schemes you defined in `buildSchemes`'
    );

const Targets = z.record(PlatformsKeys, z.string()).describe('Override of default targets specific to this project');

const Ports = z
    .record(PlatformsKeys, z.number()) //TODO maxValue(65535)
    .describe(
        'Allows you to assign custom port per each supported platform specific to this project. this is useful if you foten switch between multiple projects and do not want to experience constant port conflicts'
    );

const SupportedPlatforms = z.array(PlatformsKeys).describe('Array list of all supported platforms in current project');

const PortOffset = z.number().describe('Offset each port default value by increment');

const Template = z.object({
    version: z.string(),
});

const IncludedPermissions = z
    .array(z.string())
    .describe(
        "Allows you to include specific permissions by their KEY defined in `permissions` object. Use: `['*']` to include all"
    );

const IncludedPlugins = z
    .array(z.string())
    .describe(
        "Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: includedPlugins is evaluated before excludedPlugins. Use: `['*']` to include all"
    );

const ExcludedPlugins = z
    .array(z.string())
    .describe(
        "Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: excludedPlugins is evaluated after includedPlugins. Use: `['*']` to exclude all"
    );

const BundleId = z.string().describe('Bundle ID of application. ie: com.example.myapp');

const Title = z
    .string()
    .describe(
        'Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website'
    );

const Description = z
    .string()
    .describe(
        'General description of your app. This prop will be injected to actual projects where description field is applicable'
    );

const Author = z.string().describe('Author name');

const IncludedFonts = z
    .array(z.string())
    .describe(
        'Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all'
    );

const BackgroundColor = HexColor.describe('Defines root view backgroundColor for all platforms in HEX format');

// DEPRECATED?
const SplashScreen = z.boolean().describe('Enable or disable splash screen');

const FontSources = z
    .array(z.string())
    .describe(
        'Array of paths to location of external Fonts. you can use resolve function here example: `{{resolvePackage(react-native-vector-icons)}}/Fonts`'
    );

const AssetSources = z
    .array(z.string())
    .describe(
        'Array of paths to alternative external assets. this will take priority over ./appConfigs/base/assets folder on your local project. You can use resolve function here example: `{{resolvePackage(@flexn/template-starter)}}/appConfigs/base/assets`'
    );

const AssetFolderPlatform = z
    .string()
    .describe(
        'Alternative platform assets. This is useful for example when you want to use same android assets in androidtv and want to avoid duplicating assets'
    );

const Runtime = z
    .any()
    .describe(
        'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code'
    );

const PlatformEngine = z
    .string()
    .describe('ID of engine to be used for this platform. Note: engine must be registered in `engines` field');

const PlatformEntryFile = z
    .string()
    .default('index')
    .describe('Alternative name of the entry file without `.js` extension');

const BundleAssets = z
    .boolean()
    .describe(
        'If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds'
    );

const EnableSourceMaps = z
    .boolean()
    .describe('If set to `true` dedicated source map file will be generated alongside of compiled js bundle');

const BundleIsDev = z.boolean().describe('If set to `true` debug build will be generated');

const License = z.string().describe('Injects license information into app');

const PlatformCommon = z.object({
    assetFolderPlatform: z.optional(AssetFolderPlatform),
    runtime: z.optional(Runtime),
    engine: z.optional(PlatformEngine),
    entryFile: z.optional(PlatformEntryFile),
    bundleAssets: z.optional(BundleAssets),
    enableSourceMaps: z.optional(EnableSourceMaps),
    bundleIsDev: z.optional(BundleIsDev),
    license: z.optional(License),
});

const Platform = z.object({}).merge(PlatformCommon).merge(PlatformiOS);

const Engine = z.union([
    z.literal('source:rnv'),
    z.object({
        version: z.optional(z.string()),
    }),
]);

//LEVEl 1

const Common = z
    .object({
        buildSchemes: z.optional(BuildSchemes),
        includedPermissions: z.optional(IncludedPermissions),
        id: z.optional(BundleId),
        title: z.optional(Title),
        description: z.optional(Description),
        author: z.optional(Author),
        includedFonts: z.optional(IncludedFonts),
        backgroundColor: z.optional(BackgroundColor),
        splashScreen: z.optional(SplashScreen),
        fontSources: z.optional(FontSources),
        assetSources: z.optional(AssetSources),
        includedPlugins: z.optional(IncludedPlugins),
        excludedPlugins: z.optional(ExcludedPlugins),
        runtime: z.optional(Runtime),
        ext: z.optional(Ext),
    })
    .describe('Common config props used as default props for all available buildSchemes');

const Defaults = z
    .object({
        ports: Ports,
        supportedPlatforms: SupportedPlatforms,
        portOffset: z.optional(PortOffset),
        schemes: z.optional(Schemes),
        targets: z.optional(Targets),
    })
    .describe('Default system config for this project');

const Pipes = z
    .array(z.string())
    .describe(
        'To avoid rnv building `buildHooks/src` every time you can specify which specific pipes should trigger recompile of buildHooks'
    );

const WorkspaceID = z
    .string() //TODO: no spaces
    .describe(
        'Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS'
    );

const Version = z.string().describe('Semver style version of your app');

const VersionCode = z.string().describe('Manual verride of generated version code');

const VersionFormat = z.string().describe(`Allows you to fine-tune app version defined in package.json or renative.json.

If you do not define versionFormat, no formatting will apply to version.

"versionFormat" : "0.0.0"

IN: 1.2.3-rc.4+build.56 OUT: 1.2.3

IN: 1.2.3 OUT: 1.2.3



"versionFormat" : "0.0.0.0.0"

IN: 1.2.3-rc.4+build.56 OUT: 1.2.3.4.56

IN: 1.2.3 OUT: 1.2.3

"versionFormat" : "0.0.0.x.x.x.x"

IN: 1.2.3-rc.4+build.56 OUT: 1.2.3.rc.4.build.56

IN: 1.2.3 OUT: 1.2.3

`);

const VersionCodeFormat = z.string().describe(`Allows you to fine-tune auto generated version codes.

Version code is autogenerated from app version defined in package.json or renative.json.

NOTE: If you define versionCode manually this formatting will not apply.

EXAMPLE 1:

default value: 00.00.00

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 10203

EXAMPLE 2:

"versionCodeFormat" : "00.00.00.00.00"

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 102030000

EXAMPLE 3:

"versionCodeFormat" : "00.00.00.0000"

IN: 1.0.23-rc.15 OUT: 100230015

IN: 1.0.23 OUT: 100230000

`);

const Id = z
    .string()
    .describe('ID of the app in `./appConfigs/[APP_ID]/renative.json`. MUST match APP_ID name of the folder');

const IsMonoRepo = z.boolean().describe('Mark if your project is part of monorepo');

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

const Platforms = z.record(PlatformsKeys, Platform).describe('TODO');

const EnableHookRebuild = z
    .boolean()
    .describe(
        'If set to true in `./renative.json` build hooks will be compiled at each rnv command run. If set to `false` (default) rebuild will be triggered only if `dist` folder is missing, `-r` has been passed or you run `rnv hooks run` directly making your rnv commands faster'
    );

//LEVEl 0 (ROOT)

export const Root = z.object({
    workspaceID: WorkspaceID,
    id: z.optional(Id),
    isMonorepo: z.optional(IsMonoRepo),
    version: z.optional(Version),
    versionCode: z.optional(VersionCode),
    versionFormat: z.optional(VersionFormat),
    versionCodeFormat: z.optional(VersionCodeFormat),
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

export type Config = z.infer<typeof Root>;
