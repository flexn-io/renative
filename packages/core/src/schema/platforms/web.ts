import { z } from 'zod';

export const PlatformWeb = z.object({
    timestampBuildFiles: z.array(z.string()).optional(),
    devServerHost: z.string().optional(),
    environment: z.string().optional(),
});
