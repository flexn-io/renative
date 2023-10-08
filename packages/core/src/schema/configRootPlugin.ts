import { z } from 'zod';

import { Ext } from './configLevel2';

//LEVEl 0 (ROOT)

export const RootProject = z.object({
    ext: z.optional(Ext),
});
//.catchall(z.never());

export type Config = z.infer<typeof RootProject>;
