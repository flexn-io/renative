import { z } from 'zod';
import { Ext } from './common/configCommon';

//LEVEl 0 (ROOT)

const RootTemplates = z.object({
    ext: z.optional(Ext),
});
//.catchall(z.never());

export type ConfigRootTemplates = z.infer<typeof RootTemplates>;
