import { z } from 'zod';

export const PlatformWebFragment = {
    timestampBuildFiles: z.array(z.string()).optional(),
    devServerHost: z.string().optional(),
    environment: z.string().optional(),
};
