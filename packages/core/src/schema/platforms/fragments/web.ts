import { z } from 'zod';

export const zodPlatformWebFragment = z
    .object({
        timestampBuildFiles: z.array(z.string()),
        devServerHost: z.string(),
        environment: z.string(),
    })
    .partial();
