import { AnyZodObject, z } from 'zod';
import { PlatformAndroidSchema } from './android';
import { PlatformiOSSchema } from './ios';
import { zodPlatformElectronFragment } from './fragments/electron';
import { PlatformWindowsSchema } from './windows';
import { zodPlatformWebpackFragment } from './fragments/webpack';
import { zodPlatformNextJsFragment } from './fragments/nextjs';
import { zodPlatformLightningFragment } from './fragments/lightning';
import { zodPlatformReactNativeFragment } from './fragments/reactNative';
import { zodPlatformBaseFragment } from './fragments/base';
import { PlatformMacosSchema } from './macos';
import { PlatformWebSchema } from './web';
import { PlatformTizenSchema } from './tizen';
import { PlatformWebosSchema } from './webos';
import { RnvCommonSchemaFragment, zodCommonSchemaFragment } from '../common';
import { zodPlatformWebOSFragment } from './fragments/webos';
import { zodPlatformWindowsFragment } from './fragments/windows';
import { zodPlatformTizenFragment } from './fragments/tizen';
import { zodPlatformWebFragment } from './fragments/web';
import { zodPlatformAndroidFragment } from './fragments/android';
import { zodPlatformiOSFragment } from './fragments/ios';
import { zodTemplateAndroidFragment } from './fragments/templateAndroid';
import { zodTemplateXcodeFragment } from './fragments/templateXcode';
import { RnvPlatformNameKey } from '../../enums/platformName';
import { RnvBuildSchemeFragment } from '../shared';

const zodMergedPlatformPlainObject = zodCommonSchemaFragment.merge(
    zodCommonSchemaFragment.merge(
        z.object({
            //BASE
            ...zodPlatformBaseFragment,
            //PLATFORMS
            ...zodPlatformiOSFragment,
            ...zodPlatformAndroidFragment,
            ...zodPlatformWebFragment,
            ...zodPlatformTizenFragment,
            ...zodPlatformWindowsFragment,
            ...zodPlatformWebOSFragment,
            //ENGINES
            ...zodPlatformLightningFragment,
            ...zodPlatformReactNativeFragment,
            ...zodPlatformWebpackFragment,
            ...zodPlatformElectronFragment,
            ...zodPlatformNextJsFragment,
            ...zodTemplateAndroidFragment,
            ...zodTemplateXcodeFragment,
            ...zodPlatformLightningFragment,
        })
    )
);

export type _MergedPlatformObjectType = z.infer<typeof zodMergedPlatformPlainObject>;

const desc = 'Allows to customize platforms configurations based on chosen build scheme `-s`';

const androidSchema = z
    .optional(PlatformAndroidSchema.extend({ buildSchemes: z.record(z.string(), PlatformAndroidSchema).optional() }))
    .describe(desc);
// const androidSchema = generatePlatform(PlatformAndroid);
const iosSchema = z
    .optional(PlatformiOSSchema.extend({ buildSchemes: z.record(z.string(), PlatformiOSSchema).optional() }))
    .describe(desc);
const macosSchema = z
    .optional(PlatformMacosSchema.extend({ buildSchemes: z.record(z.string(), PlatformMacosSchema).optional() }))
    .describe(desc);
const windowsSchema = z
    .optional(PlatformWindowsSchema.extend({ buildSchemes: z.record(z.string(), PlatformWindowsSchema).optional() }))
    .describe(desc);
const tizenSchema = z
    .optional(PlatformTizenSchema.extend({ buildSchemes: z.record(z.string(), PlatformTizenSchema).optional() }))
    .describe(desc);
const webSchema = z
    .optional(PlatformWebSchema.extend({ buildSchemes: z.record(z.string(), PlatformWebSchema).optional() }))
    .describe(desc);

const webosSchema = z
    .optional(PlatformWebosSchema.extend({ buildSchemes: z.record(z.string(), PlatformWebosSchema).optional() }))
    .describe(desc);

export const zodPlatformsSchema: AnyZodObject = z
    .object({
        android: androidSchema,
        androidtv: androidSchema,
        androidwear: androidSchema,
        firetv: androidSchema,
        ios: iosSchema,
        tvos: iosSchema,
        tizen: tizenSchema,
        tizenmobile: tizenSchema,
        tizenwatch: tizenSchema,
        webos: webosSchema,
        web: webSchema,
        webtv: webSchema,
        chromecast: webSchema,
        kaios: webSchema,
        macos: macosSchema,
        linux: webSchema,
        windows: windowsSchema,
        xbox: windowsSchema,
    })
    .describe('Object containing platform configurations');

// export type RnvPlatformsSchema = z.infer<typeof zodPlatformsSchema>;
export type RnvPlatformsSchema = Record<
    RnvPlatformNameKey,
    _MergedPlatformObjectType & {
        buildSchemes?: Record<string, RnvCommonSchemaFragment & RnvBuildSchemeFragment & _MergedPlatformObjectType>;
    }
>;
