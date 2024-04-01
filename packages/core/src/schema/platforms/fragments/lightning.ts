import { z } from 'zod';

export const zodPlatformLightningFragment = z.object({
    target: z.string(),
});

export type RnvPlatformLightningFragment = z.infer<typeof zodPlatformLightningFragment>;
