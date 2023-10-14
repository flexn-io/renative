import { z } from 'zod';
import { Ext } from '../shared';

//LEVEl 0 (ROOT)

const RootPlugin = z.object({
    ext: z.optional(Ext),
});
//.catchall(z.never());

export type _ConfigRootPlugin = z.infer<typeof RootPlugin>;
