import { AnyZodObject, z } from 'zod';
import { RnvPluginPlatformAndroidFragment, zodPluginPlatformAndroidFragment } from './fragments/platformAndroid';
import { RnvPluginPlatformiOSFragment, zodPluginPlatformiOSFragment } from './fragments/platformIos';
import { RnvPluginPlatformBaseFragment, zodPluginPlatformBaseFragment } from './fragments/platformBase';
import { RnvPluginBaseFragment, zodPluginBaseFragment } from './fragments/base';
import { PlatformKey } from '../../enums/platformName';

const androidSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformAndroidFragment);

const iosSchema = zodPluginPlatformBaseFragment.merge(zodPluginPlatformiOSFragment);

const genericSchema = zodPluginPlatformBaseFragment;

export const zodPluginSchema: AnyZodObject = zodPluginBaseFragment.merge(
    z.object({
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
    })
);

export const zodPluginsSchema = z
    .record(z.string(), z.union([zodPluginSchema, z.string()]).nullable())
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );

export type RnvPluginPlatformSchema = RnvPluginPlatformBaseFragment &
    RnvPluginPlatformAndroidFragment &
    RnvPluginPlatformiOSFragment;
export type RnvPluginPlatformsSchema = Record<PlatformKey, RnvPluginPlatformSchema>;
export type RnvPluginSchema = RnvPluginBaseFragment & Partial<RnvPluginPlatformsSchema>;
export type RnvPluginsSchema = Record<string, RnvPluginSchema | string>;
// export type RenativeWebpackConfig = RnvPluginSchema['webpackConfig'];
