import { z } from 'zod';

export const PlatformNextJsFragment = {
    pagesDir: z.string().optional(),
    // pagesDir: {
    //     type: 'string',
    //     description: 'Custom pages directory used by nextjs. Use relative paths',
    //     examples: ['src/customFolder/pages'],
    // },
    // outputDir: {
    //     type: 'string',
    //     description:
    //         'Custom output directory used by nextjs equivalent to "npx next build" with custom outputDir. Use relative paths',
    //     examples: ['.next', 'custom/location'],
    // },
    // exportDir: {
    //     type: 'string',
    //     description:
    //         'Custom export directory used by nextjs equivalent to "npx next export --outdir <exportDir>". Use relative paths',
    //     examples: ['output', 'custom/location'],
    // },
};
