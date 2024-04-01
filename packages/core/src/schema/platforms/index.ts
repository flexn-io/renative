import { AnyZodObject, z } from 'zod';
import { type RnvPlatformElectronFragment, zodPlatformElectronFragment } from './fragments/electron';
import { type RnvPlatformWebpackFragment, zodPlatformWebpackFragment } from './fragments/webpack';
import { type RnvPlatformNextJsFragment, zodPlatformNextJsFragment } from './fragments/nextjs';
import { type RnvPlatformLightningFragment } from './fragments/lightning';
import { type RnvPlatformReactNativeFragment, zodPlatformReactNativeFragment } from './fragments/reactNative';
import { type RnvPlatformBaseFragment, zodPlatformBaseFragment } from './fragments/base';
import { type RnvCommonSchemaFragment, zodCommonSchemaFragment } from '../common';
import { type RnvPlatformWebOSFragment, zodPlatformWebOSFragment } from './fragments/webos';
import { type RnvPlatformWindowsFragment, zodPlatformWindowsFragment } from './fragments/windows';
import { type RnvPlatformTizenFragment, zodPlatformTizenFragment } from './fragments/tizen';
import { type RnvPlatformWebFragment, zodPlatformWebFragment } from './fragments/web';
import { type RnvPlatformAndroidFragment, zodPlatformAndroidFragment } from './fragments/android';
import { type RnvPlatformiOSFragment, zodPlatformiOSFragment } from './fragments/ios';
import { type RnvTemplateAndroidFragment, zodTemplateAndroidFragment } from './fragments/templateAndroid';
import { type RnvTemplateXcodeFragment, zodTemplateXcodeFragment } from './fragments/templateXcode';
import { type RnvPlatformNameKey } from '../../enums/platformName';
import { type RnvBuildSchemeFragment } from '../shared';

const createPlatformSchema = (obj: AnyZodObject): AnyZodObject => {
    const zodPlatformSchema = zodCommonSchemaFragment.merge(zodPlatformBaseFragment).merge(obj);
    return z.object({ buildSchemes: z.record(z.string(), zodPlatformSchema) });
};

const androidSchema = createPlatformSchema(
    zodPlatformAndroidFragment.merge(zodPlatformReactNativeFragment.merge(zodTemplateAndroidFragment))
);

const iosSchema = createPlatformSchema(
    zodPlatformiOSFragment.merge(zodPlatformReactNativeFragment.merge(zodTemplateXcodeFragment))
);

const tizenSchema = createPlatformSchema(
    zodPlatformTizenFragment.merge(zodPlatformWebFragment.merge(zodPlatformWebpackFragment))
);

const webosSchema = createPlatformSchema(
    zodPlatformWebOSFragment.merge(zodPlatformWebFragment.merge(zodPlatformWebpackFragment))
);

const webSchema = createPlatformSchema(
    zodPlatformWebpackFragment.merge(zodPlatformNextJsFragment.merge(zodPlatformWebFragment))
);

const macosSchema = createPlatformSchema(
    zodPlatformiOSFragment.merge(
        zodPlatformReactNativeFragment.merge(zodTemplateXcodeFragment.merge(zodPlatformElectronFragment))
    )
);

const windowsSchema = createPlatformSchema(
    zodPlatformElectronFragment.merge(zodPlatformReactNativeFragment.merge(zodPlatformWindowsFragment))
);

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

export type RnvPlatformSchemaFragment = RnvCommonSchemaFragment &
    RnvPlatformBaseFragment &
    RnvPlatformiOSFragment &
    RnvPlatformAndroidFragment &
    RnvPlatformWebFragment &
    RnvPlatformTizenFragment &
    RnvPlatformWindowsFragment &
    RnvPlatformWebOSFragment &
    RnvPlatformLightningFragment &
    RnvPlatformReactNativeFragment &
    RnvPlatformWebpackFragment &
    RnvPlatformElectronFragment &
    RnvPlatformNextJsFragment &
    RnvTemplateAndroidFragment &
    RnvTemplateXcodeFragment;

// export type RnvPlatformsSchema = z.infer<typeof zodPlatformsSchema>;
export type RnvPlatformBuildSchemeSchema = RnvCommonSchemaFragment & RnvBuildSchemeFragment & RnvPlatformSchemaFragment;

export type RnvPlatformSchema = RnvPlatformSchemaFragment & {
    buildSchemes?: Record<string, RnvPlatformBuildSchemeSchema>;
};
export type RnvPlatformsSchema = Partial<Record<RnvPlatformNameKey, RnvPlatformSchema>>;
