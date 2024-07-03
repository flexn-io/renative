import { z } from 'zod';

export const zodPlatformWebpackFragment = z
    .object({
        webpackConfig: z
            .object({
                publicUrl: z.string(),
                customScripts: z
                    .array(z.string())

                    .describe('Allows you to inject custom script into html header'),
                excludedPaths: z
                    .array(z.string())
                    .describe(
                        'Allows to specify files or directories in the src folder that webpack should ignore when bundling code.'
                    ),
            })
            .partial(),
    })
    .partial();
