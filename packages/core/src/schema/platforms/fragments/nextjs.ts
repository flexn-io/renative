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
        nextTranspileModules: z.array(z.string()),
        nextCliFlags: z
            .string()
            .describe(
                'Extra CLI flags passed directly to the Next.js commands (e.g. "--webpack" to force webpack bundler over turbopack in Next.js 15+). Applied to next dev, next build, next start, and next export.'
            ),
    })
    .partial();
