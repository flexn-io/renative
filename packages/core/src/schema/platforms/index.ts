import { z } from 'zod';
import { PlatformAndroid, PlatformAndroidPartialSchema } from './android';
import { PlatformiOS, PlatformiOSPartialSchema } from './ios';
import { PlatformWeb, PlatformWebPartialSchema } from './web';
import { PlatformTizen, PlatformTizenPartialSchema } from './tizen';
import { PlatformDecoratorElectronSchema } from './decorators/electron';
import { PlatformWindowsPartialSchema } from './windows';
import { PlatformDecoratorWebpackSchema } from './decorators/webpack';
import { PlatformDecoratorNextJsSchema } from './decorators/nextjs';
import { PlatformWebOS, PlatformWebOSPartialSchema } from './webos';
import { PlatformDecoratorLightningSchema } from './decorators/lightning';
import { PlatformDecoratorReactNativeSchema } from './decorators/reactNative';
import { PlatformBase } from './base';
// import { PlatformSharedReactNative } from './decorators/reactNative';

const MergedPlatformPlainObject = PlatformBase.extend({
    ...PlatformiOSPartialSchema,
    ...PlatformAndroidPartialSchema,
    ...PlatformWebPartialSchema,
    ...PlatformTizenPartialSchema,
    ...PlatformWindowsPartialSchema,
    ...PlatformWebOSPartialSchema,
    ...PlatformDecoratorLightningSchema,
    ...PlatformDecoratorReactNativeSchema,
    ...PlatformDecoratorWebpackSchema,
    ...PlatformDecoratorElectronSchema,
    ...PlatformDecoratorNextJsSchema,
});

export type _MergedPlatformObjectType = z.infer<typeof MergedPlatformPlainObject>;

// LEVEL 2

// export const PlatformBuildSchemes = z
//     .record(z.string(), MergedPlatformPlainObject)
//     .describe('Allows to customize platforms configurations based on chosen build scheme `-s`');

// const PlatformMerged = MergedPlatformPlainObject.extend({
//     buildSchemes: z.optional(PlatformBuildSchemes),
// });
// export type _PlatformMergedType = z.infer<typeof PlatformMerged>;

// const generatePlatform = <T extends ZodObject>(schema: T) => {
//     return z.optional(
//         schema.extend({
//             buildSchemes: z
//                 .record(z.string(), schema)
//                 .optional()
//                 .describe('Allows to customize platforms configurations based on chosen build scheme `-s`'),
//         })
//     );
// };
const desc = 'Allows to customize platforms configurations based on chosen build scheme `-s`';

const androidSchema = z
    .optional(PlatformAndroid.extend({ buildSchemes: z.record(z.string(), PlatformAndroid) }))
    .describe(desc);
// const androidSchema = generatePlatform(PlatformAndroid);
const iosSchema = z.optional(PlatformiOS.extend({ buildSchemes: z.record(z.string(), PlatformiOS) })).describe(desc);
const tizenSchema = z
    .optional(PlatformTizen.extend({ buildSchemes: z.record(z.string(), PlatformTizen) }))
    .describe(desc);
const webSchema = z.optional(PlatformWeb.extend({ buildSchemes: z.record(z.string(), PlatformWeb) })).describe(desc);

const webosSchema = z
    .optional(PlatformWebOS.extend({ buildSchemes: z.record(z.string(), PlatformWebOS) }))
    .describe(desc);

export const Platforms = z
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
        macos: webSchema,
        linux: webSchema,
        windows: webSchema,
        xbox: webSchema,
    })
    .describe('Object containing platform configurations');

export type _PlatformsType = z.infer<typeof Platforms>;
