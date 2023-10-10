import { z } from 'zod';
import { Ext } from './shared/configShared';

//LEVEl 0 (ROOT)

const RootTemplates = z.object({
    ext: z.optional(Ext),
});

export type _ConfigRootTemplates = z.infer<typeof RootTemplates>;
