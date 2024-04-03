import { z } from 'zod';

const zodPodfile = z
    .object({
        injectLines: z.array(z.string()),
        post_install: z.array(z.string()),
        sources: z
            .optional(z.array(z.string()))
            .describe('Array of URLs that will be injected on top of the Podfile as sources'),
        podDependencies: z.array(z.string()),
        staticPods: z.array(z.string()),
        header: z
            .optional(z.array(z.string()))
            .describe('Array of strings that will be injected on top of the Podfile'),
    })
    .partial()
    .describe('Allows to manipulate Podfile');

// type RnvPodfile = z.infer<typeof zodPodfile>;

const zodXcodeProj = z
    .object({
        sourceFiles: z.array(z.string()),
        resourceFiles: z.array(z.string()),
        headerFiles: z.array(z.string()),
        buildPhases: z.array(
            z.object({
                shellPath: z.string(),
                shellScript: z.string(),
                inputPaths: z.array(z.string()),
            })
        ),
        frameworks: z.array(z.string()),
        buildSettings: z.record(z.string(), z.string()),
    })
    .partial();
// type RnvXcodeProj = z.infer<typeof zodXcodeProj>;

export const zodAppDelegateMethod = z.union([
    z.string(),
    z.object({
        order: z.number(),
        value: z.string(),
        weight: z.number(),
    }),
]);

const zodAppDelegateMm = z
    .object({
        appDelegateMethods: z.object({
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
        }),

        appDelegateImports: z.array(z.string()),
    })
    .partial();
const zodAppDelegateH = z
    .object({
        appDelegateImports: z.array(z.string()),
        appDelegateExtensions: z.array(z.string()),
    })
    .partial();

const zodInfoPlist = z.object({});

export const zodTemplateXcodeFragment = z
    .object({
        templateXcode: z
            .object({
                Podfile: zodPodfile,
                project_pbxproj: zodXcodeProj,
                AppDelegate_mm: zodAppDelegateMm,
                AppDelegate_h: zodAppDelegateH,
                Info_plist: zodInfoPlist,
            })
            .partial(),
    })
    .partial();
