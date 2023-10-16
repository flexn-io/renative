import { z } from 'zod';

export const PlatformWebOS = z.object({
    iconColor: z.string().optional(),
});
