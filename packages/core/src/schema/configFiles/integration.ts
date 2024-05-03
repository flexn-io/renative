import { z } from 'zod';

export const zodConfigFileIntegration = z
    .object({
        name: z.string().describe('Name of the integration (best to use name of the actual package)'),
    })
    .partial();
