import { z } from 'zod';
import { DefaultsSchema, EnginesSchema } from './project';
import { TemplateConfig } from '../shared';

export const RootTemplateSchema = z.object({
    defaults: z.optional(DefaultsSchema),
    engines: z.optional(EnginesSchema),
    templateConfig: TemplateConfig.optional(),
});

// {
//     title: 'Which service to use?',
//     type: 'list',
//     configProp: {
//         key: 'runtime.myServiceConfig',
//         file: 'renative.json',
//     },
//     options: [
//         {
//             title: 'Service 1',
//             value: {
//                 id: 'xxx1',
//             },
//         },
//         {
//             title: 'Service 2',
//             value: {
//                 id: 'xxx2',
//             },
//         },
//     ],
// },

export type _RootTemplateSchemaType = z.infer<typeof RootTemplateSchema>;
