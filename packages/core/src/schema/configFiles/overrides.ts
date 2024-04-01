import { z } from 'zod';

export const zodRootOverridesSchema = z.object({
    overrides: z.record(z.string(), z.record(z.string(), z.string())),
});
