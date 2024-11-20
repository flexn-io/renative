import { AnyZodObject, z } from 'zod';

import { zodPlatformsKeys, zodSupportedPlatforms } from '../shared';

const _generatePlatformsSchema = (schema: AnyZodObject) => {
    return z.object({
        android: schema,
        androidtv: schema,
        androidwear: schema,
        firetv: schema,
        ios: schema,
        tvos: schema,
        tizen: schema,
        tizenmobile: schema,
        tizenwatch: schema,
        webos: schema,
        web: schema,
        webtv: schema,
        chromecast: schema,
        kaios: schema,
        macos: schema,
        linux: schema,
        windows: schema,
        xbox: schema,
    });
};

const SchemaRuntime = z
    .any()
    .describe(
        'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code'
    );

const SchemaPluginPlatform = z.object({
    disabled: z.boolean().default(false).describe('Marks plugin platform disabled'),
    forceLinking: z
        .boolean()
        .default(false)
        .describe(
            'Packages that cannot be autolinked yet can still be added to MainApplication PackageList dynamically by setting this to true'
        ),
    path: z
        .string()
        .describe(
            'Enables you to pass custom path to plugin. If undefined, the default `node_modules/[plugin-name]` will be used.'
        ),
});

const SchemaPluginBase = z.object({
    supportedPlatforms: zodSupportedPlatforms.optional(),
    disabled: z.boolean().default(false).describe('Marks plugin disabled'),
    props: z.record(z.string(), z.string()).describe('Custom props passed to plugin'),
    version: z.string().describe('Version of plugin. Typically package version'),
    deprecated: z
        .string()
        .describe('Marks your plugin deprecated with warning showing in the console during rnv commands'),
    source: z
        .nullable(z.string())
        .describe(
            'Will define custom scope for your plugin config to extend from.\n\nNOTE: custom scopes can be defined via paths.pluginTemplates.[CUSTOM_SCOPE].{}'
        ),
    disableNpm: z.boolean().describe('Will skip including plugin in package.json and installing it via npm/yarn etc'),
    skipMerge: z
        .boolean()
        .describe(
            'Will not attempt to merge with existing plugin configuration (ie. coming form renative pluginTemplates)\n\nNOTE: if set to `true` you need to configure your plugin object fully'
        ),
    npm: z
        .record(z.string(), z.string())
        .describe('Object of npm dependencies of this plugin. These will be injected into package.json'), //=> npmDependencies
    pluginDependencies: z
        .record(z.string(), z.string().nullable())
        .describe('List of other Renative plugins this plugin depends on'),
    webpackConfig: z
        .object({
            modulePaths: z.union([z.boolean(), z.array(z.string())]).optional(),
            moduleAliases: z
                .union([
                    z.boolean(),
                    z.record(
                        z.string(),
                        z.union([
                            z.string(),
                            z.object({
                                projectPath: z.string(),
                            }),
                        ])
                    ),
                ])
                .optional(),
            nextTranspileModules: z.optional(z.array(z.string())),
        })
        .describe('Allows you to configure webpack bahaviour per each individual plugin'), //Should this be at root plugin???
    disablePluginTemplateOverrides: z.boolean().describe('Disables plugin overrides for selected plugin'),
    fontSources: z.array(z.string()),
});

const SchemaPlugin: any = SchemaPluginBase.merge(_generatePlatformsSchema(SchemaPluginPlatform));

const SchemaPackageJson = z
    .object({
        dependencies: z.record(z.string(), z.string()),
        devDependencies: z.record(z.string(), z.string()),
        peerDependencies: z.record(z.string(), z.string()),
        optionalDependencies: z.record(z.string(), z.string()),
        name: z.string(),
        version: z.string(),
    })
    .passthrough();

const SchemaPlatform = z.object({
    engine: z
        .string()
        .describe('ID of engine to be used for this platform. Note: engine must be registered in `engines` field'),

    extendPlatform: z.optional(zodPlatformsKeys),
    assetFolderPlatform: z
        .string()
        .describe(
            'Alternative platform assets. This is useful for example when you want to use same android assets in androidtv and want to avoid duplicating assets'
        ),
});

const SchemaCommon = z.object({
    includedPermissions: z
        .array(z.string())
        .describe(
            "Allows you to include specific permissions by their KEY defined in `permissions` object. Use: `['*']` to include all"
        ),
    excludedPermissions: z
        .array(z.string())
        .describe(
            "Allows you to exclude specific permissions by their KEY defined in `permissions` object. Use: `['*']` to exclude all"
        ),
    id: z.string().describe('Bundle ID of application. ie: com.example.myapp'),
    idSuffix: z.string().optional(),
    version: z.string().describe('Semver style version of your app'),
    versionCode: z.string().describe('Manual verride of generated version code'),
    versionFormat: z.string().describe(`Allows you to fine-tune app version defined in package.json or renative.json.
    If you do not define versionFormat, no formatting will apply to version.
    `),
    versionCodeFormat: z.string().describe(`Allows you to fine-tune auto generated version codes.
    Version code is autogenerated from app version defined in package.json or renative.json.
    `),
    versionCodeOffset: z.number().optional(),
    title: z
        .string()
        .describe(
            'Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website'
        ),
    description: z
        .string()
        .describe(
            'General description of your app. This prop will be injected to actual projects where description field is applicable'
        ),
    author: z.string().describe('Author name'),
    license: z.string().describe('Injects license information into app'),
    includedFonts: z
        .array(z.string())
        .describe(
            'Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all'
        ),
    backgroundColor: z
        .string()
        .min(4)
        .max(9)
        .regex(/^#/)
        .describe('Defines root view backgroundColor for all platforms in HEX format'),
    splashScreen: z.boolean().describe('Enable or disable splash screen'),
    fontSources: z
        .array(z.string())
        .describe(
            'Array of paths to location of external Fonts. you can use resolve function here example: `{{resolvePackage(react-native-vector-icons)}}/Fonts`'
        ),
    assetSources: z
        .array(z.string())
        .describe(
            'Array of paths to alternative external assets. this will take priority over ./appConfigs/base/assets folder on your local project. You can use resolve function here example: `{{resolvePackage(@flexn/template-starter)}}/appConfigs/base/assets`'
        ),
    includedPlugins: z
        .array(z.string())
        .describe(
            "Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: includedPlugins is evaluated before excludedPlugins. Use: `['*']` to include all"
        ),
    excludedPlugins: z
        .array(z.string())
        .describe(
            "Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: excludedPlugins is evaluated after includedPlugins. Use: `['*']` to exclude all"
        ),
    runtime: SchemaRuntime,
});

const SchemaProject = z.object({
    workspaceID: z
        .string() //TODO: no spaces
        .describe(
            'Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS'
        ),
    projectVersion: z.string().describe('Version of project'), // TODO: if undefined it should infer from package.json
    projectName: z
        .string()
        .describe(
            'Name of the project which will be used in workspace as folder name. this will also be used as part of the KEY in crypto env var generator'
        ),
    isTemplate: z
        .boolean()
        .describe('Marks project as template. This disables certain user checks like version mismatch etc'),
    defaults: z
        .object({
            ports: z
                .record(zodPlatformsKeys, z.number()) //TODO maxValue(65535)
                .describe(
                    'Allows you to assign custom port per each supported platform specific to this project. this is useful if you foten switch between multiple projects and do not want to experience constant port conflicts'
                ),
            supportedPlatforms: zodSupportedPlatforms,
            portOffset: z.number().describe('Offset each port default value by increment'),
            defaultCommandSchemes: z
                .record(z.enum(['run', 'export', 'build']), z.string())
                .describe(
                    'List of default schemes for each rnv command. This is useful if you want to avoid specifying `-s ...` every time your run rnv command. bu default rnv uses `-s debug`. NOTE: you can only use schemes you defined in `buildSchemes`'
                ),
            targets: z
                .record(zodPlatformsKeys, z.string())
                .describe('Override of default targets specific to this project'),
        })
        .describe('Default system config for this project'),
    common: SchemaCommon.merge(
        z.object({
            buildSchemes: z.record(z.string(), SchemaCommon.merge(_generatePlatformsSchema(SchemaPlatform))),
        })
    ).describe('Common config props used as default props for all available buildSchemes'),
    pipes: z
        .array(z.string())
        .describe(
            'To avoid rnv building `buildHooks/src` every time you can specify which specific pipes should trigger recompile of buildHooks'
        ),
    crypto: z
        .object({
            path: z
                .string()
                .describe(
                    'Relative path to encrypted file in your renative project. Example: "./secrets/mySecrets.enc"'
                ),
            isOptional: z.boolean().describe('Mark if crypto object should not checked every run'),
        })
        .describe(
            'This prop enables automatic encrypt and decrypt of sensitive information in your project. \nRNV will generate new env variable with can be used to encrypt and decrypt. this env var is generated by combining (and sanitizing) 2 properties from your renative.json: \nworkspaceID + projectName.\nThese 2 properties are also used to generate path on your local machine where encrypted files will be decrypted into.'
        ),
    paths: z
        .object({
            appConfigsDir: z.string().describe('Custom path to appConfigs. defaults to `./appConfigs`'),
            platformTemplatesDirs: z
                .record(zodPlatformsKeys, z.string())
                .describe(
                    'Custom location of ejected platform templates. this is populated after you run `rnv platform eject`'
                ),
            appConfigsDirs: z.array(z.string()).describe('Array of custom location app configs directories`'),
            platformAssetsDir: z
                .string()
                .describe('Custom path to platformAssets folder. defaults to `./platformAssets`'),
            platformBuildsDir: z
                .string()
                .describe('Custom path to platformBuilds folder. defaults to `./platformBuilds`'),
            pluginTemplates: z.record(
                z.string(),
                z.object({
                    npm: z.string(),
                    path: z.string(),
                })
            ).describe(`
        Allows you to define custom plugin template scopes. default scope for all plugins is \`rnv\`.`),
        })
        .describe('Define custom paths for RNV to look into'),
    permissions: z
        .object({
            android: z
                .record(
                    z.string(),
                    z.object({
                        key: z.string(), //TODO: type this
                        security: z.string(), //TODO: type this
                    })
                )
                .describe('Android SDK specific permissions'),
            ios: z
                .record(
                    z.string(), //TODO: type this
                    z.object({
                        desc: z.string(),
                    })
                )
                .describe('iOS SDK specific permissions'),
        })
        .describe(
            'Permission definititions which can be used by app configs via `includedPermissions` and `excludedPermissions` to customize permissions for each app'
        ),
    engines: z.record(z.string(), z.literal('source:rnv')).describe('List of engines available in this project'), // TODO: rename to mods (mods with type engine in the future) ?
    enableHookRebuild: z
        .boolean()
        .describe(
            'If set to true in `./renative.json` build hooks will be compiled at each rnv command run. If set to `false` (default) rebuild will be triggered only if `dist` folder is missing, `-r` has been passed or you run `rnv hooks run` directly making your rnv commands faster'
        ),
    extendsTemplate: z
        .string()
        .describe(
            'You can extend another renative.json file of currently applied template by providing relative or full package name path. Exampe: `@rnv/template-starter/renative.json`'
        ), // TODO: rename to "extendsConfig"
    tasks: z
        .object({
            install: z.object({
                script: z.string(),
                platform: z.record(
                    zodPlatformsKeys,
                    z.object({
                        ignore: z.boolean(),
                        ignoreTasks: z.array(z.string()),
                    })
                ),
            }),
        })
        .describe(
            'Allows to override specific task within renative toolchain. (currently only `install` supported). this is useful if you want to change specific behaviour of built-in task. ie install task triggers yarn/npm install by default. but that might not be desirable installation trigger'
        ),
    integrations: z
        .record(z.string(), z.object({}))
        .describe('Object containing integration configurations where key represents package name'), // TODO: rename to mods
    env: z.record(z.string(), z.any()).describe('Object containing injected env variables'),
    platforms: _generatePlatformsSchema(
        SchemaPlatform.extend({
            buildSchemes: z.record(z.string(), SchemaCommon.merge(_generatePlatformsSchema(SchemaPlatform))),
        })
    ).describe('Object containing platform configurations'),
    plugins: z
        .record(z.string(), z.union([SchemaPlugin, z.string()]).nullable())
        .describe(
            'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
        ),
});

const SchemaTemplate = z
    .object({
        name: z.string().optional(),
        version: z.string().optional(),
        disabled: z.boolean().optional(),
        includedPaths: z
            .array(
                z.union([
                    z.string(),
                    z.object({
                        paths: z.array(z.string()),
                        engines: z.array(z.string()).optional(),
                        platforms: zodSupportedPlatforms.optional(),
                    }),
                ])
            )
            .describe('Defines list of all file/dir paths you want to include in template')
            .optional(),
        // bootstrapQuestions: BootstrapQuestionsSchema.optional(),
        renative_json: z
            .object({
                $schema: z.string().optional(),
                extendsTemplate: z.string().optional(),
            })
            .passthrough()
            .optional(),
        package_json: SchemaPackageJson,
    })
    .describe('Used in `renative.template.json` allows you to define template behaviour.');

const SchemaApp = z.object({
    id: z
        .string()
        .describe('ID of the app in `./appConfigs/[APP_ID]/renative.json`. MUST match APP_ID name of the folder'),
    custom: z
        .any()
        .describe(
            'Object used to extend your renative with custom props. This allows renative json schema to be validated'
        ),
    hidden: z
        .boolean()
        .describe(
            'If set to true in `./appConfigs/[APP_ID]/renative.json` the APP_ID will be hidden from list of appConfigs `-c`'
        ),
    extendsTemplate: z
        .string()
        .describe(
            'You can extend another renative.json file of currently applied template by providing relative or full package name path. Exampe: `@rnv/template-starter/renative.json`'
        ), // TODO: rename to "extendsConfig"
    extend: z.string().describe('extend another appConfig by id'), // TODO: rename to "extendsAppConfigID"
});

export const SchemaConfig: any = z
    .object({
        app: SchemaApp,
        project: SchemaProject,
        runtime: SchemaRuntime,
        template: SchemaTemplate,
        plugin: SchemaPlugin,
    })
    .partial();
type PlatformsMap<T> = {
    android: T;
    androidtv: T;
    androidwear: T;
    firetv: T;
    ios: T;
    tvos: T;
    tizen: T;
    tizenmobile: T;
    tizenwatch: T;
    webos: T;
    web: T;
    webtv: T;
    chromecast: T;
    kaios: T;
    macos: T;
    linux: T;
    windows: T;
    xbox: T;
};

export type RnvConfig = {
    app: z.infer<typeof SchemaApp>;
    // project: SchemaProject,
    // runtime: SchemaRuntime,
    runtime: z.infer<typeof SchemaRuntime>;
    template: z.infer<typeof SchemaTemplate>;
    plugin: z.infer<typeof SchemaPluginBase> & PlatformsMap<z.infer<typeof SchemaPluginPlatform>>;

    // plugin: SchemaPlugin,
};

// const kk: RnvConfig;
// kk.plugin.android.

// DEPRECATED?
// const SplashScreen = z.object({
//     backgroundColor: z
//         .string()
//         .min(4)
//         .max(9)
//         .regex(/^#/)
//         .describe('Defines root view backgroundColor for all platforms in HEX format'),
//     image: z
//         .string()
//         .describe(
//             'Path to splash screen image. This path should be relative to `./appConfigs/base/assets` folder'
//         ),
//     resizeMode: z
//         .string()
//         .optional()
//         .describe(
//             'Resize mode of splash screen image. This is specific to each platform. ie: `cover`, `contain`, `center` etc'
//         ),
//     style: z
//         .string()
//         .optional()
//         .describe(
//             'Custom style for splash screen. This is specific to each platform. ie: `light-content`, `dark-content` etc'
//         ),
// });
