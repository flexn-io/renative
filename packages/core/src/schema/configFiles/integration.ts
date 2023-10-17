import { z } from 'zod';

export const RootIntegrationSchema = z.object({});

export type _RootIntegrationSchemaType = z.infer<typeof RootIntegrationSchema>;
