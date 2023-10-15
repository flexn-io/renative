import { z } from 'zod';
import { Ext } from '../shared';

//LEVEl 0 (ROOT)

export const RootPluginSchema = z.object({
    custom: z.optional(Ext),
});
//.catchall(z.never());

export type _ConfigRootPlugin = z.infer<typeof RootPluginSchema>;
