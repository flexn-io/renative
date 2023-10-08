import { z } from 'zod';

export const Runtime = z
    .any()
    .describe(
        'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code'
    );

export const PlatformsKeys = z.enum(['ios', 'android']);

export const HexColor = z.string().min(4).max(9).regex(/^#/);

export const Ext = z
    .any()
    .describe(
        'Object ysed to extend your renative with custom props. This allows renative json schema to be validated'
    );
