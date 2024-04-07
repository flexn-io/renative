import { z } from 'zod';

export const zodPluginPlatformBaseFragment = z
    .object({
        disabled: z.boolean().default(false).describe('Marks plugin platform disabled'),
        forceLinking: z
            .boolean()
            .default(false)
            .describe(
                'Packages that cannot be autolinked yet can still be added to MainApplication PackageList dynamically by setting this to true'
            ),
        path: z
            .string()
            .describe(
                'Enables you to pass custom path to plugin. If undefined, the default `node_modules/[plugin-name]` will be used.'
            ),
    })
    .partial();
