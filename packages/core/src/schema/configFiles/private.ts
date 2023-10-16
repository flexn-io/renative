import { z } from 'zod';

const SENSITIVE =
    '> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!\n\n';

export const RootPrivateSchema = z.object({
    storePassword: z.string().describe(`${SENSITIVE}storePassword for keystore file`),
    keyPassword: z.string().describe(`${SENSITIVE}keyPassword for keystore file`),
    private: z
        .record(z.any())
        .describe(
            'Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file'
        )
        .optional(),
});

export type _RootPrivateSchemaType = z.infer<typeof RootPrivateSchema>;
