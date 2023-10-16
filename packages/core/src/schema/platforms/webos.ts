import { z } from 'zod';
import { PlatformBase } from './base';

export const PlatformWebOSPartialSchema = {
    iconColor: z.string().optional(),
};

export const PlatformWebOS = PlatformBase.extend(PlatformWebOSPartialSchema);
