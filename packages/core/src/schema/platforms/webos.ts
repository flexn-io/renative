import { z } from 'zod';
import { PlatformBase } from './base';

export const PlatformWebOS = PlatformBase.extend({
    iconColor: z.string().optional(),
});
