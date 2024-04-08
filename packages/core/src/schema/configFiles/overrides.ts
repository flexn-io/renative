import { z } from 'zod';

export const zodConfigFileOverrides = z
    .object({
        overrides: z.record(z.string(), z.record(z.string(), z.string())),
    })
    .partial();
