import { z } from 'zod';

// DEPRECATED?
const Enabled = z.boolean().default(true).describe('Marks plugin platform enabled or disabled'); //TODO: switch to disabled
const Path = z
    .string()
    .describe(
        'Enables you to pass custom path to plugin. If undefined, the default `node_modules/[plugin-name]` will be used.'
    );

export const PluginCommon = z.object({
    enabled: z.optional(Enabled),
    path: z.optional(Path),
});
