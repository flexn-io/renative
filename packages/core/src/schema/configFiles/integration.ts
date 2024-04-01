import { z } from 'zod';

export const zodRootIntegrationSchema = z.object({
    packageName: z.string(),
});
//
