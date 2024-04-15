import { z } from 'zod';

const SENSITIVE =
    '> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!\n\n';

export const zodPrivatePlatformAndroid = z
    .object({
        storePassword: z.string().describe(`${SENSITIVE}storePassword for keystore file`),
        keyPassword: z.string().describe(`${SENSITIVE}keyPassword for keystore file`),
        storeFile: z.string().describe('Name of the store file in android project'), //TODO: Duplicate from config
        keyAlias: z.string().describe('Key alias of the store file in android project'),
    })
    .partial();
