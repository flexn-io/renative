import { z } from 'zod';
import { Ext } from './common/configCommon';

//LEVEl 0 (ROOT)

const RootPlugin = z.object({
    ext: z.optional(Ext),
});
//.catchall(z.never());

export type ConfigRootPlugin = z.infer<typeof RootPlugin>;
