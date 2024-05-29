import { z } from 'zod';
import { zodPlatformsKeys } from '../../shared';

export const zodPlatformBaseFragment = z
    .object({
        extendPlatform: zodPlatformsKeys,
        assetFolderPlatform: z
            .string()
            .describe(
                'Alternative platform assets. This is useful for example when you want to use same android assets in androidtv and want to avoid duplicating assets'
            ),
        engine: z
            .string()
            .describe('ID of engine to be used for this platform. Note: engine must be registered in `engines` field'),
        //ReactNative specific?
        entryFile: z.string().default('index').describe('Alternative name of the entry file without `.js` extension'),
        bundleAssets: z
            .boolean()
            .describe(
                'If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds'
            ),
        enableSourceMaps: z
            .boolean()
            .describe('If set to `true` dedicated source map file will be generated alongside of compiled js bundle'),
        bundleIsDev: z.boolean().describe('If set to `true` debug build will be generated'),
        getJsBundleFile: z.string(),
        webpackExcludedDirs: z.optional(
            z
                .array(z.string())
                .describe(
                    'Allows to specify files or directories in the src folder that webpack should ignore when bundling code. By default, the "pages" folder is excluded for web platforms that do not use next.js.'
                )
        ),
    })
    .partial();
