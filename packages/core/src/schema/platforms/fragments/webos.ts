import { z } from 'zod';

export const zodPlatformWebOSFragment = z
    .object({
        iconColor: z.string(),
    })
    .partial();
