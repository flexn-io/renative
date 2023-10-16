import { z } from 'zod';
import { PlatformBase } from './base';

export const PlatformWebPartialSchema = {
    timestampBuildFiles: z.array(z.string()).optional(),
    devServerHost: z.string().optional(),
    environment: z.string().optional(),
};

export const PlatformWeb = PlatformBase.extend(PlatformWebPartialSchema);
