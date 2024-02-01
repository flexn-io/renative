import { z } from 'zod';

// DEPRECATED?
const Enabled = z.boolean().default(true).describe('Marks plugin platform enabled or disabled');
const Disabled = z.boolean().default(false).describe('Marks plugin platform disabled');
const ForceLinking = z.boolean().default(false).describe('Marks plugin as not able to be autolinked');
const Path = z
    .string()
    .describe(
        'Enables you to pass custom path to plugin. If undefined, the default `node_modules/[plugin-name]` will be used.'
    );

export const PluginPlatformBaseFragment = {
    enabled: z.optional(Enabled),
    disabled: z.optional(Disabled),
    forceLinking: z.optional(ForceLinking),
    path: z.optional(Path),
};
