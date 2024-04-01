import { z } from 'zod';

export const zodPlatformNextJsFragment = z
    .object({
        pagesDir: z.string().describe('Custom pages directory used by nextjs. Use relative paths'),
        outputDir: z
            .string()
            .describe(
                'Custom output directory used by nextjs equivalent to `npx next build` with custom outputDir. Use relative paths'
            ),
        exportDir: z
            .string()
            .describe(
                'Custom export directory used by nextjs equivalent to `npx next export --outdir <exportDir>`. Use relative paths'
            ),
        nextTranspileModules: z.optional(z.array(z.string())),
    })
    .partial();
