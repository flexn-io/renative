import { z } from 'zod';

export const PlatformElectronFragment = {
    electronConfig: z
        .any()
        .optional()
        .describe('Allows you to configure electron app as per https://www.electron.build/'),
    BrowserWindow: z
        .object({
            width: z.number().optional(),
            height: z.number().optional(),
            webPreferences: z
                .object({
                    devTools: z.boolean().optional(),
                })
                .optional()
                .describe('Extra web preferences of electron app'),
        })
        .optional()
        .describe('Allows you to configure electron wrapper app window'),
    // electronTemplate: z.optional(z.object({})),
    // electronConfig: {
    //     additionalProperties: true,
    //     type: 'object',
    //     description: 'Allows you to configure electron app as per https://www.electron.build/',
    //     examples: [
    //         {
    //             mac: {
    //                 target: ['dmg', 'mas', 'mas-dev'],
    //                 hardenedRuntime: true,
    //             },
    //             dmg: {
    //                 sign: false,
    //             },
    //             mas: {
    //                 type: 'distribution',
    //                 hardenedRuntime: false,
    //             },
    //             mainInjection: 'console.log("Hello from main.js!");',
    //             mainHeadInjection: 'console.log("Hello from main.js!");',
    //         },
    //     ],
    // },
    // BrowserWindow: {
    //     type: 'object',
    //     additionalProperties: false,
    //     description: 'Allows you to configure electron wrapper app window',
    //     examples: [
    //         {
    //             width: 1310,
    //             height: 800,
    //             webPreferences: {
    //                 devTools: true,
    //             },
    //         },
    //     ],
    //     properties: {
    //         width: {
    //             type: 'integer',
    //             description: 'Default width of electron app',
    //         },
    //         height: {
    //             type: 'integer',
    //             description: 'Default height of electron app',
    //         },
    //         webPreferences: {
    //             additionalProperties: true,
    //             type: 'object',
    //             description: 'Extra web preferences of electron app',
    //             examples: [
    //                 {
    //                     devTools: true,
    //                 },
    //             ],
    //         },
    //     },
    // },
};
