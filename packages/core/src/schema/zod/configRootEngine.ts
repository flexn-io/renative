import { z } from 'zod';
import { Ext } from './shared/configShared';

//LEVEl 0 (ROOT)

const RootEngine = z.object({
    ext: z.optional(Ext),
});

export type _ConfigRootEngine = z.infer<typeof RootEngine>;
