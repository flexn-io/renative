import { z } from 'zod';

const Podfile = z
    .object({
        injectLines: z.optional(z.array(z.string())),
        post_install: z.optional(z.array(z.string())),
        sources: z
            .optional(z.array(z.string()))
            .describe('Array of URLs that will be injected on top of the Podfile as sources'),
        podDependencies: z.optional(z.array(z.string())),
        staticPods: z.optional(z.array(z.string())),
        header: z
            .optional(z.array(z.string()))
            .describe('Array of strings that will be injected on top of the Podfile'),
    })
    .describe('Allows to manipulate Podfile');

const XcodeProj = z.object({
    sourceFiles: z.optional(z.array(z.string())),
    resourceFiles: z.optional(z.array(z.string())),
    headerFiles: z.optional(z.array(z.string())),
    buildPhases: z.optional(
        z.array(
            z.object({
                shellPath: z.string(),
                shellScript: z.string(),
                inputPaths: z.array(z.string()),
            })
        )
    ),
    frameworks: z.optional(z.array(z.string())),
    buildSettings: z.optional(z.record(z.string(), z.string())),
});

const AppDelegateMethod = z.union([
    z.string(),
    z.object({
        order: z.number(),
        value: z.string(),
        weight: z.number(),
    }),
]);

const AppDelegateMm = z.object({
    appDelegateMethods: z.optional(
        z.object({
            application: z
                .object({
                    didFinishLaunchingWithOptions: z.array(AppDelegateMethod).optional(),
                    applicationDidBecomeActive: z.array(AppDelegateMethod).optional(),
                    open: z.array(AppDelegateMethod).optional(),
                    supportedInterfaceOrientationsFor: z.array(AppDelegateMethod).optional(),
                    didReceiveRemoteNotification: z.array(AppDelegateMethod).optional(),
                    didFailToRegisterForRemoteNotificationsWithError: z.array(AppDelegateMethod).optional(),
                    didReceive: z.array(AppDelegateMethod).optional(),
                    didRegister: z.array(AppDelegateMethod).optional(),
                    didRegisterForRemoteNotificationsWithDeviceToken: z.array(AppDelegateMethod).optional(),
                    continue: z.array(AppDelegateMethod).optional(),
                    didConnectCarInterfaceController: z.array(AppDelegateMethod).optional(),
                    didDisconnectCarInterfaceController: z.array(AppDelegateMethod).optional(),
                })
                .optional(),
            userNotificationCenter: z
                .object({
                    willPresent: z.array(AppDelegateMethod).optional(),
                    didReceiveNotificationResponse: z.array(AppDelegateMethod).optional(),
                })
                .optional(),
        })
    ),
    appDelegateImports: z.optional(z.array(z.string())),
});
const AppDelegateH = z.object({
    appDelegateImports: z.optional(z.array(z.string())),
    appDelegateExtensions: z.optional(z.array(z.string())),
});

const InfoPlist = z.object({});

// .describe('Allows more advanced modifications to Xcode based project template');

export type _AppDelegateMethodType = z.infer<typeof AppDelegateMethod>;

export const zodTemplateXcodeFragment = z
    .object({
        templateXcode: z
            .object({
                Podfile: z.optional(Podfile),
                project_pbxproj: z.optional(XcodeProj),
                AppDelegate_mm: z.optional(AppDelegateMm),
                AppDelegate_h: z.optional(AppDelegateH),
                Info_plist: z.optional(InfoPlist),
            })
            .partial(),
    })
    .partial();

export type RnvTemplateXcodeFragment = z.infer<typeof zodTemplateXcodeFragment>;
