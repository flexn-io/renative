import { z } from 'zod';

const SENSITIVE =
    '> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!\n\n';

export const zodPrivatePlatformAndroid = z
    .object({
        storePassword: z.string().describe(`${SENSITIVE}storePassword for keystore file`).optional(),
        keyPassword: z.string().describe(`${SENSITIVE}keyPassword for keystore file`).optional(),
        storeFile: z.string().describe('Name of the store file in android project').optional(), //TODO: Duplicate from config
        keyAlias: z.string().describe('Key alias of the store file in android project').optional(),
    })
    .optional();

const zodPrivatePlatformGeneric = z.object({}).optional();

export const zodRootPrivateSchema = z.object({
    private: z
        .record(z.any())
        .describe(
            'Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file'
        )
        .optional(),
    platforms: z
        .object({
            android: zodPrivatePlatformAndroid,
            androidtv: zodPrivatePlatformAndroid,
            androidwear: zodPrivatePlatformAndroid,
            firetv: zodPrivatePlatformAndroid,
            ios: zodPrivatePlatformGeneric,
            tvos: zodPrivatePlatformGeneric,
            tizen: zodPrivatePlatformGeneric,
            tizenmobile: zodPrivatePlatformGeneric,
            tizenwatch: zodPrivatePlatformGeneric,
            webos: zodPrivatePlatformGeneric,
            web: zodPrivatePlatformGeneric,
            webtv: zodPrivatePlatformGeneric,
            chromecast: zodPrivatePlatformGeneric,
            kaios: zodPrivatePlatformGeneric,
            macos: zodPrivatePlatformGeneric,
            linux: zodPrivatePlatformGeneric,
            windows: zodPrivatePlatformGeneric,
            xbox: zodPrivatePlatformGeneric,
        })
        .optional(),
});
