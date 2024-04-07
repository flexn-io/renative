import { z } from 'zod';

export const zodPlatformLightningFragment = z
    .object({
        target: z.string(),
    })
    .partial();
