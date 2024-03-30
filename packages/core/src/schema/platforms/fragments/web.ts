import { z } from 'zod';

export const zodPlatformWebFragment = {
    timestampBuildFiles: z.array(z.string()).optional(),
    devServerHost: z.string().optional(),
    environment: z.string().optional(),
};
