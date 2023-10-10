import { z } from 'zod';
import { DefaultTargets } from './shared/configShared';

export const SDKs = z.record(z.string(), z.string()).describe('Define your sdk configurations');

//LEVEl 0 (ROOT)

const RootGlobalSchema = z.object({
    defaultTargets: z.optional(DefaultTargets),
    sdks: z.optional(SDKs),
});

export type _RootGlobalSchemaType = z.infer<typeof RootGlobalSchema>;
