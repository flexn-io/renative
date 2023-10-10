import { z } from 'zod';

export const DefaultTargets = z
    .record(z.string(), z.string())
    .describe('Define targets to be used when -t is not set on any project run');

export const SDKs = z.record(z.string(), z.string()).describe('Define your sdk configurations');

//LEVEl 0 (ROOT)

const RootGlobalSchema = z.object({
    defaultTargets: z.optional(DefaultTargets),
    sdks: z.optional(SDKs),
});

export type _RootGlobalSchemaType = z.infer<typeof RootGlobalSchema>;
