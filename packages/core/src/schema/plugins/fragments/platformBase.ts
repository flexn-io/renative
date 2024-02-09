import { z } from 'zod';

// DEPRECATED?
const Disabled = z.boolean().default(false).describe('Marks plugin platform disabled');
const ForceLinking = z
    .boolean()
    .default(false)
    .describe(
        'Packages that cannot be autolinked yet can still be added to MainApplication PackageList dynamically by setting this to true'
    );
const Path = z
    .string()
    .describe(
        'Enables you to pass custom path to plugin. If undefined, the default `node_modules/[plugin-name]` will be used.'
    );

export const PluginPlatformBaseFragment = {
    disabled: z.optional(Disabled),
    forceLinking: z.optional(ForceLinking),
    path: z.optional(Path),
};
