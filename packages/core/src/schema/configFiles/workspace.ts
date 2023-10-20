import { z } from 'zod';
import { DefaultTargets } from '../shared';

export const SDKs = z.record(z.string(), z.string()).describe('Define your sdk configurations');
// ANDROID_SDK: '~/Library/Android/sdk',
// ANDROID_NDK: '~/Library/Android/sdk/ndk-bundle',
// TIZEN_SDK: '~/tizen-studio',
// WEBOS_SDK: '/opt/webOS_TV_SDK',
// KAIOS_SDK: '/Applications/Kaiosrt.app',

//LEVEl 0 (ROOT)

export const RootWorkspaceSchema = z.object({
    defaultTargets: z.optional(DefaultTargets),
    sdks: z.optional(SDKs),
    projectTemplates: z.record(z.string(), z.object({})),
    appConfigsPath: z
        .string()
        .optional()
        .describe('Enables you to define custom global appConfigs location that every project will automatically use'),
});

export type _RootWorkspaceSchemaType = z.infer<typeof RootWorkspaceSchema>;
