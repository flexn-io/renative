import { z } from 'zod';

export const zodPlatformWebOSFragment = z.object({
    iconColor: z.string(),
});

export type RnvPlatformWebOSFragment = z.infer<typeof zodPlatformWebOSFragment>;
