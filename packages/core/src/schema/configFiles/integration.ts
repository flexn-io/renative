import { z } from 'zod';

export const RootIntegrationSchema = z.object({
    packageName: z.string(),
});

export type _RootIntegrationSchemaType = z.infer<typeof RootIntegrationSchema>;
