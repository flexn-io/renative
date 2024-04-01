import { z } from 'zod';

export const zodConfigFileIntergation = z
    .object({
        packageName: z.string(),
    })
    .partial();
//
