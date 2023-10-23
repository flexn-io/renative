import { z } from 'zod';

const SENSITIVE =
    '> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!\n\n';

const PlatformAndroid = z
    .object({
        storePassword: z.string().describe(`${SENSITIVE}storePassword for keystore file`).optional(),
        keyPassword: z.string().describe(`${SENSITIVE}keyPassword for keystore file`).optional(),
        storeFile: z.string().describe('Name of the store file in android project').optional(), //TODO: Duplicate from config
        keyAlias: z.string().describe('Key alias of the store file in android project').optional(),
    })
    .optional();

const PlatformGeneric = z.object({}).optional();

export const RootPrivateSchema = z.object({
    private: z
        .record(z.any())
        .describe(
            'Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file'
        )
        .optional(),
    platforms: z
        .object({
            android: PlatformAndroid,
            androidtv: PlatformAndroid,
            androidwear: PlatformAndroid,
            firetv: PlatformAndroid,
            ios: PlatformGeneric,
            tvos: PlatformGeneric,
            tizen: PlatformGeneric,
            tizenmobile: PlatformGeneric,
            tizenwatch: PlatformGeneric,
            webos: PlatformGeneric,
            web: PlatformGeneric,
            webtv: PlatformGeneric,
            chromecast: PlatformGeneric,
            kaios: PlatformGeneric,
            macos: PlatformGeneric,
            linux: PlatformGeneric,
            windows: PlatformGeneric,
            xbox: PlatformGeneric,
        })
        .optional(),
});

export type _RootPrivateSchemaType = z.infer<typeof RootPrivateSchema>;

export type _MergedPlatformPrivateObjectType = z.infer<typeof PlatformAndroid>;
