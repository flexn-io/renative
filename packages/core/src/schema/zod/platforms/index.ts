import { z } from 'zod';
import { PlatformShared } from './base';
import { PlatformAndroid } from './android';
import { PlatformiOS } from './ios';
import { PlatformWeb } from '../web/configPlatformWeb';
import { PlatformTizen } from '../tizen/configPlatformTizen';
import { PlatformElectron } from './electron';
import { PlatformWindows } from '../windows/configPlatformWindows';
import { PlatformWebpack } from '../webpack/configPlatformWebpack';
import { BuildSchemeBase } from '../shared';

const BuildScheme = BuildSchemeBase.merge(PlatformShared)
    .merge(PlatformiOS)
    .merge(PlatformWeb)
    .merge(PlatformTizen)
    .merge(PlatformWebpack)
    .merge(PlatformElectron)
    .merge(PlatformWindows);

// LEVEL 2

export const BuildSchemes = z
    .record(z.string(), BuildScheme)
    .describe('Allows to customize platforms configurations based on chosen build scheme `-s`');

const PlatformMerged = PlatformShared.merge(PlatformiOS)
    .merge(PlatformAndroid)
    .merge(PlatformWeb)
    .merge(PlatformTizen)
    .merge(PlatformWebpack)
    .merge(PlatformElectron)
    .merge(PlatformWindows)
    .merge(
        z.object({
            buildSchemes: z.optional(BuildSchemes),
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
        buildSchemes: z.optional(BuildSchemes),
    })
    .merge(PlatformShared);

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
