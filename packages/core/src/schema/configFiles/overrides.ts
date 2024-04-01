import { z } from 'zod';

export const zodRootOverridesSchema = z.object({
    overrides: z.record(z.string(), z.record(z.string(), z.string())),
});

export type RnvRootOverridesSchema = z.infer<typeof zodRootOverridesSchema>;

//overrides.json
export type ConfigFileOverrides = RnvRootOverridesSchema;
