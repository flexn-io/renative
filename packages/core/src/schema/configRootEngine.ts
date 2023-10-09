import { z } from 'zod';
import { Ext } from './common/configCommon';

//LEVEl 0 (ROOT)

const RootProject = z.object({
    ext: z.optional(Ext),
});
//.catchall(z.never());

export type ConfigRootProject = z.infer<typeof RootProject>;
