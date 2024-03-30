import { z } from 'zod';
import { zodPluginPlatformAndroidFragment } from './fragments/platformAndroid';
import { zodPluginPlatformiOSFragment } from './fragments/platformIos';
import { zodPluginPlatformBaseFragment } from './fragments/platformBase';
import { zodPluginBaseFragment } from './fragments/base';

const androidSchema = z
    .object({
        ...zodPluginPlatformBaseFragment,
        ...zodPluginPlatformAndroidFragment,
    })
    .optional();

const iosSchema = z
    .object({
        ...zodPluginPlatformBaseFragment,
        ...zodPluginPlatformiOSFragment,
    })
    .optional();

const genericSchema = z
    .object({
        ...zodPluginPlatformBaseFragment,
    })
    .optional();

export const PluginSchema = z.object({
    ...zodPluginBaseFragment,
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
    ...zodPluginPlatformBaseFragment,
    ...zodPluginPlatformiOSFragment,
    ...zodPluginPlatformAndroidFragment,
});

export type _PluginPlatformMergedSchemaType = z.infer<typeof PluginPlatformMergedSchema>;

export type _PluginType = z.infer<typeof PluginSchema>;

export const PluginsSchema = z
    .record(z.string(), z.union([PluginSchema, z.string()]).nullable())
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );
