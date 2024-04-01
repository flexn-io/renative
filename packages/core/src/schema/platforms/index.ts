import { AnyZodObject, z } from 'zod';
import { zodPlatformElectronFragment } from './fragments/electron';
import { zodPlatformWebpackFragment } from './fragments/webpack';
import { zodPlatformNextJsFragment } from './fragments/nextjs';
import { zodPlatformReactNativeFragment } from './fragments/reactNative';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformWebOSFragment } from './fragments/webos';
import { zodPlatformWindowsFragment } from './fragments/windows';
import { zodPlatformTizenFragment } from './fragments/tizen';
import { zodPlatformWebFragment } from './fragments/web';
import { zodPlatformAndroidFragment } from './fragments/android';
import { zodPlatformiOSFragment } from './fragments/ios';
import { zodTemplateAndroidFragment } from './fragments/templateAndroid';
import { zodTemplateXcodeFragment } from './fragments/templateXcode';

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
