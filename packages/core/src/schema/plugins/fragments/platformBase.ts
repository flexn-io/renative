import { z } from 'zod';
import { zodPlatformsKeys } from '../../shared';

export const zodPluginPlatformBaseFragment = z
    .object({
        extendPlatform: zodPlatformsKeys.describe('Extends platform configuration from another platform'),
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
