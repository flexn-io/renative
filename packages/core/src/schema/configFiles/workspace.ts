import { z } from 'zod';
import { DefaultTargets } from '../shared';

const SDKsSchema = z
    .object({
        ANDROID_SDK: z.string().optional(),
        ANDROID_NDK: z.string().optional(),
        TIZEN_SDK: z.string().optional(),
        WEBOS_SDK: z.string().optional(),
        KAIOS_SDK: z.string().optional(),
    })
    .describe('Define your sdk configurations');
// ANDROID_SDK: '~/Library/Android/sdk',
// ANDROID_NDK: '~/Library/Android/sdk/ndk-bundle',
// TIZEN_SDK: '~/tizen-studio',
// WEBOS_SDK: '/opt/webOS_TV_SDK',
// KAIOS_SDK: '/Applications/Kaiosrt.app',

//LEVEl 0 (ROOT)

export const RootWorkspaceSchema = z.object({
    defaultTargets: z.optional(DefaultTargets),
    sdks: z.optional(SDKsSchema),
    projectTemplates: z.record(z.string(), z.object({})),
    appConfigsPath: z
        .string()
        .optional()
        .describe('Enables you to define custom global appConfigs location that every project will automatically use'),
});

export type _RootWorkspaceSchemaType = z.infer<typeof RootWorkspaceSchema>;
