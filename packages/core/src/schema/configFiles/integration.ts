import { z } from 'zod';

export const zodConfigFileIntegration = z
    .object({
        packageName: z.string(),
    })
    .partial();
//
