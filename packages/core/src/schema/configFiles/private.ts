import { z } from 'zod';
import { zodPrivatePlatformAndroid } from '../platforms/fragments/androidPrivate';

const zodPrivatePlatformGeneric = z.any({});

export const zodConfigFilePrivate = z
    .object({
        private: z
            .record(z.any())
            .describe(
                'Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file'
            ),
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
            .partial(),
    })
    .partial();
