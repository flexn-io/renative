import { AnyZodObject, z } from 'zod';
import { zodPluginPlatformAndroidFragment } from './fragments/platformAndroid';
import { zodPluginPlatformiOSFragment } from './fragments/platformIos';
import { zodPluginPlatformBaseFragment } from './fragments/platformBase';
import { RnvPluginBaseFragment, zodPluginBaseFragment } from './fragments/base';
import { PlatformKey } from '../types';

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

export const zodPluginSchema: AnyZodObject = z.object({
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

// TODO: don't create new zod object. use native types
const zodPluginPlatformMergedSchema = z.object({
    ...zodPluginPlatformBaseFragment,
    ...zodPluginPlatformiOSFragment,
    ...zodPluginPlatformAndroidFragment,
});

export type RnvPluginSchema = RnvPluginBaseFragment &
    Record<PlatformKey, z.infer<typeof zodPluginPlatformMergedSchema>>;

export type RnvPluginsSchema = Record<string, RnvPluginSchema | string>;

export const zodPluginsSchema = z
    .record(z.string(), z.union([zodPluginSchema, z.string()]).nullable())
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );
