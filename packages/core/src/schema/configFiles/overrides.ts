import { z } from 'zod';

export const RootOverridesSchema = z.object({
    overrides: z.record(z.string(), z.record(z.string(), z.string())),
});

export type _RootOverridesSchemaType = z.infer<typeof RootOverridesSchema>;
