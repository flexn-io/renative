import { z } from 'zod';
import { BundleId, Ext, Runtime } from '../shared';

export const PlatformEngine = z
    .string()
    .describe('ID of engine to be used for this platform. Note: engine must be registered in `engines` field');

export const PlatformEntryFile = z
    .string()
    .default('index')
    .describe('Alternative name of the entry file without `.js` extension');

export const BundleAssets = z
    .boolean()
    .describe(
        'If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds'
    );

export const EnableSourceMaps = z
    .boolean()
    .describe('If set to `true` dedicated source map file will be generated alongside of compiled js bundle');

export const BundleIsDev = z.boolean().describe('If set to `true` debug build will be generated');

export const License = z.string().describe('Injects license information into app');

export const AssetFolderPlatform = z
    .string()
    .describe(
        'Alternative platform assets. This is useful for example when you want to use same android assets in androidtv and want to avoid duplicating assets'
    );

export const PlatformBase = z.object({
    id: z.optional(BundleId),
    assetFolderPlatform: z.optional(AssetFolderPlatform),
    runtime: z.optional(Runtime),
    engine: z.optional(PlatformEngine),
    license: z.optional(License),
    ext: z.optional(Ext),
    //ReactNative specific?
    entryFile: z.optional(PlatformEntryFile),
    bundleAssets: z.optional(BundleAssets),
    enableSourceMaps: z.optional(EnableSourceMaps),
    bundleIsDev: z.optional(BundleIsDev),
});
