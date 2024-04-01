import { z } from 'zod';

const zodPodfile = z
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

// type RnvPodfile = z.infer<typeof zodPodfile>;

const zodXcodeProj = z.object({
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
// type RnvXcodeProj = z.infer<typeof zodXcodeProj>;

export const zodAppDelegateMethod = z.union([
    z.string(),
    z.object({
        order: z.number(),
        value: z.string(),
        weight: z.number(),
    }),
]);

const zodAppDelegateMm = z.object({
    appDelegateMethods: z.optional(
        z.object({
            application: z
                .object({
                    didFinishLaunchingWithOptions: z.array(zodAppDelegateMethod).optional(),
                    applicationDidBecomeActive: z.array(zodAppDelegateMethod).optional(),
                    open: z.array(zodAppDelegateMethod).optional(),
                    supportedInterfaceOrientationsFor: z.array(zodAppDelegateMethod).optional(),
                    didReceiveRemoteNotification: z.array(zodAppDelegateMethod).optional(),
                    didFailToRegisterForRemoteNotificationsWithError: z.array(zodAppDelegateMethod).optional(),
                    didReceive: z.array(zodAppDelegateMethod).optional(),
                    didRegister: z.array(zodAppDelegateMethod).optional(),
                    didRegisterForRemoteNotificationsWithDeviceToken: z.array(zodAppDelegateMethod).optional(),
                    continue: z.array(zodAppDelegateMethod).optional(),
                    didConnectCarInterfaceController: z.array(zodAppDelegateMethod).optional(),
                    didDisconnectCarInterfaceController: z.array(zodAppDelegateMethod).optional(),
                })
                .optional(),
            userNotificationCenter: z
                .object({
                    willPresent: z.array(zodAppDelegateMethod).optional(),
                    didReceiveNotificationResponse: z.array(zodAppDelegateMethod).optional(),
                })
                .optional(),
        })
    ),
    appDelegateImports: z.optional(z.array(z.string())),
});
const zodAppDelegateH = z.object({
    appDelegateImports: z.optional(z.array(z.string())),
    appDelegateExtensions: z.optional(z.array(z.string())),
});

const zodInfoPlist = z.object({});

// .describe('Allows more advanced modifications to Xcode based project template');

export const zodTemplateXcodeFragment = z
    .object({
        templateXcode: z
            .object({
                Podfile: z.optional(zodPodfile),
                project_pbxproj: z.optional(zodXcodeProj),
                AppDelegate_mm: z.optional(zodAppDelegateMm),
                AppDelegate_h: z.optional(zodAppDelegateH),
                Info_plist: z.optional(zodInfoPlist),
            })
            .partial(),
    })
    .partial();
