import { z } from 'zod';

export const zodRootIntegrationSchema = z.object({
    packageName: z.string(),
});
//
export type RnvRootIntegrationSchema = z.infer<typeof zodRootIntegrationSchema>;

// renative.integration.json
export type ConfigFileIntegration = RnvRootIntegrationSchema;
