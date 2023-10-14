import { z } from 'zod';
import { BuildSchemeBase, BundleId, Ext, HexColor, Runtime } from '../shared';
import { PlatformShared } from '../platforms/base';

// DEPRECATED?
export const SplashScreen = z.boolean().describe('Enable or disable splash screen');

const IncludedPermissions = z
    .array(z.string())
    .describe(
        "Allows you to include specific permissions by their KEY defined in `permissions` object. Use: `['*']` to include all"
    );

//DEPRECATED??
const ExcludedPermissions = z
    .array(z.string())
    .describe(
        "Allows you to exclude specific permissions by their KEY defined in `permissions` object. Use: `['*']` to exclude all"
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

const CommonBuildSchemes = z.record(z.string(), BuildSchemeBase.merge(PlatformShared));

const BackgroundColor = HexColor.describe('Defines root view backgroundColor for all platforms in HEX format');

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

//LEVEl 1

export const Common = z
    .object({
        buildSchemes: z.optional(CommonBuildSchemes),
        includedPermissions: z.optional(IncludedPermissions),
        excludedPermissions: z.optional(ExcludedPermissions),
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
