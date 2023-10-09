import { z } from 'zod';

export const PlatformWebpack = z.object({
    // webpackConfig: {
    //     additionalProperties: true,
    //     type: 'object',
    //     properties: {
    //         devServerHost: {
    //             type: 'string',
    //         },
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
    // devServerHost: {
    //     type: 'string',
    // },
});
