import { z } from 'zod';

export const zodPlatformTizenFragment = z
    .object({
        package: z.string(),
        certificateProfile: z.string(),
        appName: z.string(),
    })
    .partial();

export type RnvPlatformTizenFragment = z.infer<typeof zodPlatformTizenFragment>;
