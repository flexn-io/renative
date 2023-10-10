import { z } from 'zod';
import { SUPPORTED_PLATFORMS } from '../../../constants';

export const Runtime = z
    .any()
    .describe(
        'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code'
    );

export const PlatformsKeys = z.enum(SUPPORTED_PLATFORMS);

export type _PlatformsKeysType = z.infer<typeof PlatformsKeys>;

export const HexColor = z.string().min(4).max(9).regex(/^#/);

export const Ext = z
    .any()
    .describe(
        'Object ysed to extend your renative with custom props. This allows renative json schema to be validated'
    );

export const ExtendTemplate = z
    .string()
    .describe(
        'You can extend another renative.json file of currently applied template by providing relative or full package name path. Exampe: `@rnv/template-starter/renative.json`'
    );
