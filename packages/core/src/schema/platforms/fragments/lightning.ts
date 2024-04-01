import { z } from 'zod';

export const zodPlatformLightningFragment = z
    .object({
        target: z.string(),
    })
    .partial();

export type RnvPlatformLightningFragment = z.infer<typeof zodPlatformLightningFragment>;
