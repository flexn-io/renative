import { z } from 'zod';

export const zodPlatformWebpackFragment = z
    .object({
        webpackConfig: z
            .object({
                publicUrl: z.string(),
                customScripts: z
                    .array(z.string())

                    .describe('Allows you to inject custom script into html header'),
            })
            .partial(),

        // webpackConfig: {
        //     additionalProperties: true,
        //     type: 'object',
        //     properties: {
        //         publicUrl: {
        //             type: 'string',
        //         },
        //         metaTags: {
        //             additionalProperties: true,
        //             type: 'object',
        //         },
        //         customScripts: {
        //             type: 'array',
        //         },
        //         extend: {
        //             additionalProperties: true,
        //             type: 'object',
        //             description: 'Allows you to directly extend/override webpack config of your current platform',
        //             examples: [
        //                 {
        //                     devtool: 'source-map',
        //                 },
        //                 {
        //                     module: {
        //                         rules: [
        //                             {
        //                                 test: /\.js$/,
        //                                 use: ['source-map-loader'],
        //                                 enforce: 'pre',
        //                             },
        //                         ],
        //                     },
        //                 },
        //             ],
        //         },
        //     },
        // },
    })
    .partial();
