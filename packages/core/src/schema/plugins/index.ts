import { AnyZodObject, z } from 'zod';
import { zodPluginPlatformAndroidFragment } from './fragments/platformAndroid';
import { zodPluginPlatformiOSFragment } from './fragments/platformIos';
import { zodPluginPlatformBaseFragment } from './fragments/platformBase';
import { zodPluginBaseFragment } from './fragments/base';

const zodAndroidSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformAndroidFragment).nullable();
const zodIOSSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformiOSFragment).nullable();
const zodMacosSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformiOSFragment).nullable();
const baseSchema = zodPluginPlatformBaseFragment.nullable();

export const zodPluginSchema: AnyZodObject = zodPluginBaseFragment.merge(
    z
        .object({
            android: zodAndroidSchema,
            androidtv: zodAndroidSchema,
            androidwear: zodAndroidSchema,
            firetv: zodAndroidSchema,
            ios: zodIOSSchema,
            tvos: zodIOSSchema,
            tizen: baseSchema,
            tizenmobile: baseSchema,
            tizenwatch: baseSchema,
            webos: baseSchema,
            web: baseSchema,
            webtv: baseSchema,
            chromecast: baseSchema,
            kaios: baseSchema,
            macos: zodMacosSchema,
            linux: baseSchema,
            windows: baseSchema,
            xbox: baseSchema,
        })
        .partial()
);

export const zodPluginsSchema = z
    .record(z.string(), z.union([zodPluginSchema, z.string()]).nullable())
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );
