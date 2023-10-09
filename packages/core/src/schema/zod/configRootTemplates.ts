import { z } from 'zod';
import { Ext } from './shared/configShared';

//LEVEl 0 (ROOT)

const RootTemplates = z.object({
    ext: z.optional(Ext),
});
//.catchall(z.never());

export type ConfigRootTemplates = z.infer<typeof RootTemplates>;
