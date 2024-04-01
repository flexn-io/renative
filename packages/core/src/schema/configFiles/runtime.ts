import { z } from 'zod';

export const RootRuntimeSchema = z.object({
    // extend: z.optional(z.string()),
});

export type _RootRuntimeSchemaType = z.infer<typeof RootRuntimeSchema>;

// renative.runtime.json
export type ConfigFileRuntime = _RootRuntimeSchemaType;
