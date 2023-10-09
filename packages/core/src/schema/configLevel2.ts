import { z } from 'zod';

import { HexColor, PlatformsKeys } from './shared/configShared';

export const Schemes = z
    .record(PlatformsKeys, z.string())
    .describe(
        'List of default schemes for each platform. This is useful if you want to avoid specifying `-s ...` every time your run rnv command. bu default rnv uses `-s debug`. NOTE: you can only use schemes you defined in `buildSchemes`'
    );

export const Targets = z
    .record(PlatformsKeys, z.string())
    .describe('Override of default targets specific to this project');

export const Ports = z
    .record(PlatformsKeys, z.number()) //TODO maxValue(65535)
    .describe(
        'Allows you to assign custom port per each supported platform specific to this project. this is useful if you foten switch between multiple projects and do not want to experience constant port conflicts'
    );

export const SupportedPlatforms = z
    .array(PlatformsKeys)
    .describe('Array list of all supported platforms in current project');

export const PortOffset = z.number().describe('Offset each port default value by increment');

export const IncludedPermissions = z
    .array(z.string())
    .describe(
        "Allows you to include specific permissions by their KEY defined in `permissions` object. Use: `['*']` to include all"
    );

export const IncludedPlugins = z
    .array(z.string())
    .describe(
        "Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: includedPlugins is evaluated before excludedPlugins. Use: `['*']` to include all"
    );

export const ExcludedPlugins = z
    .array(z.string())
    .describe(
        "Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: excludedPlugins is evaluated after includedPlugins. Use: `['*']` to exclude all"
    );

export const BundleId = z.string().describe('Bundle ID of application. ie: com.example.myapp');

export const Title = z
    .string()
    .describe(
        'Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website'
    );

export const Description = z
    .string()
    .describe(
        'General description of your app. This prop will be injected to actual projects where description field is applicable'
    );

export const Author = z.string().describe('Author name');

export const IncludedFonts = z
    .array(z.string())
    .describe(
        'Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all'
    );

export const BackgroundColor = HexColor.describe('Defines root view backgroundColor for all platforms in HEX format');

// DEPRECATED?
export const SplashScreen = z.boolean().describe('Enable or disable splash screen');

export const FontSources = z
    .array(z.string())
    .describe(
        'Array of paths to location of external Fonts. you can use resolve function here example: `{{resolvePackage(react-native-vector-icons)}}/Fonts`'
    );

export const AssetSources = z
    .array(z.string())
    .describe(
        'Array of paths to alternative external assets. this will take priority over ./appConfigs/base/assets folder on your local project. You can use resolve function here example: `{{resolvePackage(@flexn/template-starter)}}/appConfigs/base/assets`'
    );

export const ExtendTemplate = z
    .string()
    .describe(
        'You can extend another renative.json file of currently applied template by providing relative or full package name path. Exampe: `@rnv/template-starter/renative.json`'
    );

export const Extend = z.string().describe('extend another appConfig by id');
