import { z } from 'zod';
import { PlatformiOS } from './ios/configPlatformiOS';
import { PlatformShared } from './shared/configPlatformShared';
import { PlatformWeb } from './web/configPlatformWeb';
import { PlatformTizen } from './tizen/configPlatformTizen';
import { PlatformWebpack } from './webpack/configPlatformWebpack';
import { PlatformElectron } from './electron/configPlatformElectron';
import { PlatformWindows } from './windows/configPlatformWindows';

export const BuildSchemeShared = z.object({
    enabled: z.optional(z.boolean().describe('Defines whether build scheme shows up in options to run')),
    description: z.optional(
        z
            .string()
            .describe(
                'Custom description of the buildScheme will be displayed directly in cli if you run rnv with an empty paramener `-s`'
            )
    ),
});

const BuildScheme = BuildSchemeShared.merge(PlatformShared)
    .merge(PlatformiOS)
    .merge(PlatformWeb)
    .merge(PlatformTizen)
    .merge(PlatformWebpack)
    .merge(PlatformElectron)
    .merge(PlatformWindows);

// LEVEL 2

export const BuildSchemes = z
    .record(z.string(), BuildScheme)
    .describe('Customizations based on chosen build scheme `-s`');
