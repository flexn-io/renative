import { z } from 'zod';
import { PlatformAndroidSchema } from './android';
import { PlatformiOSSchema } from './ios';
import { PlatformElectronFragment } from './fragments/electron';
import { PlatformWindowsSchema } from './windows';
import { PlatformWebpackFragment } from './fragments/webpack';
import { PlatformNextJsFragment } from './fragments/nextjs';
import { PlatformLightningFragment } from './fragments/lightning';
import { PlatformReactNativeFragment } from './fragments/reactNative';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformMacosSchema } from './macos';
import { PlatformWebSchema } from './web';
import { PlatformTizenSchema } from './tizen';
import { PlatformWebosSchema } from './webos';
import { CommonSchemaFragment } from '../common';
import { PlatformWebOSFragment } from './fragments/webos';
import { PlatformWindowsFragment } from './fragments/windows';
import { PlatformTizenFragment } from './fragments/tizen';
import { PlatformWebFragment } from './fragments/web';
import { PlatformAndroidFragment } from './fragments/android';
import { PlatformiOSFragment } from './fragments/ios';
import { TemplateAndroidFragment } from './fragments/templateAndroid';
import { TemplateXcodeFragment } from './fragments/templateXcode';

const MergedPlatformPlainObject = CommonSchemaFragment.merge(
    CommonSchemaFragment.merge(
        z.object({
            //BASE
            ...PlatformBaseFragment,
            //PLATFORMS
            ...PlatformiOSFragment,
            ...PlatformAndroidFragment,
            ...PlatformWebFragment,
            ...PlatformTizenFragment,
            ...PlatformWindowsFragment,
            ...PlatformWebOSFragment,
            //ENGINES
            ...PlatformLightningFragment,
            ...PlatformReactNativeFragment,
            ...PlatformWebpackFragment,
            ...PlatformElectronFragment,
            ...PlatformNextJsFragment,
            ...TemplateAndroidFragment,
            ...TemplateXcodeFragment,
            ...PlatformLightningFragment,
        })
    )
);

export type _MergedPlatformObjectType = z.infer<typeof MergedPlatformPlainObject>;

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

export const PlatformsSchema = z
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

export type _PlatformsSchemaType = z.infer<typeof PlatformsSchema>;
