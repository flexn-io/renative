import { AnyZodObject, z } from 'zod';
import { zodPluginPlatformAndroidFragment } from './fragments/platformAndroid';
import { zodPluginPlatformiOSFragment } from './fragments/platformIos';
import { zodPluginPlatformBaseFragment } from './fragments/platformBase';
import { zodPluginBaseFragment } from './fragments/base';

const zodAndroidSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformAndroidFragment);

const zodIOSSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformiOSFragment);

export const zodPluginSchema: AnyZodObject = zodPluginBaseFragment.merge(
    z.object({
        android: zodAndroidSchema,
        androidtv: zodAndroidSchema,
        androidwear: zodAndroidSchema,
        firetv: zodAndroidSchema,
        ios: zodIOSSchema,
        tvos: zodIOSSchema,
        tizen: zodPluginPlatformBaseFragment,
        tizenmobile: zodPluginPlatformBaseFragment,
        tizenwatch: zodPluginPlatformBaseFragment,
        webos: zodPluginPlatformBaseFragment,
        web: zodPluginPlatformBaseFragment,
        webtv: zodPluginPlatformBaseFragment,
        chromecast: zodPluginPlatformBaseFragment,
        kaios: zodPluginPlatformBaseFragment,
        macos: zodPluginPlatformBaseFragment,
        linux: zodPluginPlatformBaseFragment,
        windows: zodPluginPlatformBaseFragment,
        xbox: zodPluginPlatformBaseFragment,
    })
);

export const zodPluginsSchema = z
    .record(z.string(), z.union([zodPluginSchema, z.string()]).nullable())
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );
