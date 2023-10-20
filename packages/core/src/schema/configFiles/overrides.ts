import { z } from 'zod';

export const RootOverridesSchema = z.object({
    overrides: z.object({}),
});

export type _RootOverridesSchemaType = z.infer<typeof RootOverridesSchema>;
