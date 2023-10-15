import { z } from 'zod';

export const RootPrivateSchema = z.object({
    private: z
        .record(z.any())
        .describe(
            'Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file'
        )
        .optional(),
});

export type _RootPrivateSchemaType = z.infer<typeof RootPrivateSchema>;
