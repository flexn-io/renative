import { z } from 'zod';
import { PlatformBase } from './base';

export const PlatformWeb = PlatformBase.extend({
    timestampBuildFiles: z.array(z.string()).optional(),
    devServerHost: z.string().optional(),
    environment: z.string().optional(),
});
