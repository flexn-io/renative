import { z } from 'zod';

// DEPRECATED?
const Disabled = z.boolean().default(false).describe('Marks plugin platform disabled');
const Path = z
    .string()
    .describe(
        'Enables you to pass custom path to plugin. If undefined, the default `node_modules/[plugin-name]` will be used.'
    );

export const PluginPlatformBaseFragment = {
    disabled: z.optional(Disabled),
    path: z.optional(Path),
};
