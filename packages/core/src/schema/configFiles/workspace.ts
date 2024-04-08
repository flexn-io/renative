import { z } from 'zod';
import { zodDefaultTargets, zodProjectTemplates } from '../shared';

// ANDROID_SDK: '~/Library/Android/sdk',
// ANDROID_NDK: '~/Library/Android/sdk/ndk-bundle',
// TIZEN_SDK: '~/tizen-studio',
// WEBOS_SDK: '/opt/webOS_TV_SDK',
// KAIOS_SDK: '~/Applications/KaiosSimulators',

export const zodConfigFileWorkspace = z
    .object({
        defaultTargets: zodDefaultTargets,
        sdks: z
            .object({
                ANDROID_SDK: z.string(),
                ANDROID_NDK: z.string(),
                TIZEN_SDK: z.string(),
                WEBOS_SDK: z.string(),
                KAIOS_SDK: z.string(),
            })
            .partial()
            .describe('Define your sdk configurations'),
        projectTemplates: zodProjectTemplates,
        disableTelemetry: z
            .boolean()
            .describe('Opt-out from renative telemetry program. More info at https://renative.org/telemetry'),
        appConfigsPath: z
            .string()
            .describe(
                'Enables you to define custom global appConfigs location that every project will automatically use'
            ),
    })
    .partial();
