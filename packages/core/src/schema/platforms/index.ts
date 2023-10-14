import { z } from 'zod';
import { PlatformBase } from './base';
import { PlatformAndroid } from './android';
import { PlatformiOS } from './ios';
import { PlatformWeb } from './web';
import { PlatformTizen } from './tizen';
import { PlatformElectron } from './electron';
import { PlatformWindows } from './windows';
import { PlatformWebpack } from './webpack';
import { BuildSchemeBase } from '../shared';

const PlatformBuildScheme = BuildSchemeBase.merge(PlatformBase)
    .merge(PlatformiOS)
    .merge(PlatformWeb)
    .merge(PlatformTizen)
    .merge(PlatformWebpack)
    .merge(PlatformElectron)
    .merge(PlatformWindows);

// LEVEL 2

export const PlatformBuildSchemes = z
    .record(z.string(), PlatformBuildScheme)
    .describe('Allows to customize platforms configurations based on chosen build scheme `-s`');

const PlatformMerged = PlatformBase.merge(PlatformiOS)
    .merge(PlatformAndroid)
    .merge(PlatformWeb)
    .merge(PlatformTizen)
    .merge(PlatformWebpack)
    .merge(PlatformElectron)
    .merge(PlatformWindows)
    .merge(
        z.object({
            buildSchemes: z.optional(PlatformBuildSchemes),
        })
    );

// export const Platform = z
//     .object({
//         buildSchemes: z.optional(BuildSchemes),
//     })
//     .merge(PlatformCommon)
//     .merge(PlatformiOS)
//     .merge(PlatformWeb)
//     .merge(PlatformTizen)
//     .merge(PlatformWebpack)
//     .merge(PlatformElectron)
//     .merge(PlatformWindows);

export type _PlatformMergedType = z.infer<typeof PlatformMerged>;

// export const Platforms = z.record(PlatformsKeys, Platform).describe('Object containing platform configurations');

const Base = z
    .object({
        buildSchemes: z.optional(PlatformBuildSchemes),
    })
    .merge(PlatformBase);

export const Platforms = z
    .object({
        android: z.optional(Base.merge(PlatformAndroid)),
        androidtv: z.optional(Base.merge(PlatformAndroid)),
        androidwear: z.optional(Base.merge(PlatformAndroid)),
        firetv: z.optional(Base.merge(PlatformAndroid)),
        ios: z.optional(Base.merge(PlatformiOS)),
        tvos: z.optional(Base.merge(PlatformiOS)),
        tizen: z.optional(Base.merge(PlatformTizen)),
        webos: z.optional(Base.merge(PlatformWeb)),
        web: z.optional(Base.merge(PlatformWeb)),
        webtv: z.optional(Base.merge(PlatformWeb)),
        chromecast: z.optional(Base.merge(PlatformWeb)),
        kaios: z.optional(Base.merge(PlatformWeb)),
        macos: z.optional(Base.merge(PlatformWeb)),
        linux: z.optional(Base.merge(PlatformWeb)),
        windows: z.optional(Base.merge(PlatformWeb)),
        xbox: z.optional(Base.merge(PlatformWeb)),
    })
    .describe('Object containing platform configurations');
