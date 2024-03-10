import { z } from 'zod';
import { PluginPlatformAndroidFragment } from './fragments/platformAndroid';
import { PluginPlatformiOSFragment } from './fragments/platformIos';
import { PluginPlatformBaseFragment } from './fragments/platformBase';
import { PluginBaseFragment } from './fragments/base';

const androidSchema = z
    .object({
        ...PluginPlatformBaseFragment,
        ...PluginPlatformAndroidFragment,
    })
    .optional();

const iosSchema = z
    .object({
        ...PluginPlatformBaseFragment,
        ...PluginPlatformiOSFragment,
    })
    .optional();

const genericSchema = z
    .object({
        ...PluginPlatformBaseFragment,
    })
    .optional();

export const PluginSchema = z.object({
    ...PluginBaseFragment,
    android: androidSchema,
    androidtv: androidSchema,
    androidwear: androidSchema,
    firetv: androidSchema,
    ios: iosSchema,
    tvos: iosSchema,
    tizen: genericSchema,
    tizenmobile: genericSchema,
    tizenwatch: genericSchema,
    webos: genericSchema,
    web: genericSchema,
    webtv: genericSchema,
    chromecast: genericSchema,
    kaios: genericSchema,
    macos: genericSchema,
    linux: genericSchema,
    windows: genericSchema,
    xbox: genericSchema,
});

const PluginPlatformMergedSchema = z.object({
    ...PluginPlatformBaseFragment,
    ...PluginPlatformiOSFragment,
    ...PluginPlatformAndroidFragment,
});

export type _PluginPlatformMergedSchemaType = z.infer<typeof PluginPlatformMergedSchema>;

export type _PluginType = z.infer<typeof PluginSchema>;

export const PluginsSchema = z
    .record(z.string(), z.union([PluginSchema, z.string()]).nullable())
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );
