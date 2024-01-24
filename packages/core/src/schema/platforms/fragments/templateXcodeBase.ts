import { z } from 'zod';

const Podfile = z
    .object({
        injectLines: z.optional(z.array(z.string())),
        post_install: z.optional(z.array(z.string())),
        sources: z.optional(z.array(z.string())),
        podDependencies: z.optional(z.array(z.string())),
        staticPods: z.optional(z.array(z.string())),
        header: z.optional(z.array(z.string())),
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
            application: z.object({
                didFinishLaunchingWithOptions: z.array(AppDelegateMethod),
                applicationDidBecomeActive: z.array(AppDelegateMethod),
                open: z.array(AppDelegateMethod),
                supportedInterfaceOrientationsFor: z.array(AppDelegateMethod),
                didReceiveRemoteNotification: z.array(AppDelegateMethod),
                didFailToRegisterForRemoteNotificationsWithError: z.array(AppDelegateMethod),
                didReceive: z.array(AppDelegateMethod),
                didRegister: z.array(AppDelegateMethod),
                didRegisterForRemoteNotificationsWithDeviceToken: z.array(AppDelegateMethod),
                continue: z.array(AppDelegateMethod),
                didConnectCarInterfaceController: z.array(AppDelegateMethod),
                didDisconnectCarInterfaceController: z.array(AppDelegateMethod),
            }),
            userNotificationCenter: z.object({
                willPresent: z.array(AppDelegateMethod),
            }),
        })
    ),
    appDelegateImports: z.optional(z.array(z.string())),
});
const AppDelegateH = z.object({
    appDelegateImports: z.optional(z.array(z.string())),
    appDelegateExtensions: z.optional(z.array(z.string())),
});

const InfoPlist = z.object({});

export const TemplateXcodeBaseFragment = {
    Podfile: z.optional(Podfile),
    project_pbxproj: z.optional(XcodeProj),
    AppDelegate_mm: z.optional(AppDelegateMm),
    AppDelegate_h: z.optional(AppDelegateH),
    Info_plist: z.optional(InfoPlist),
};
// .describe('Allows more advanced modifications to Xcode based project template');

export type _AppDelegateMethodType = z.infer<typeof AppDelegateMethod>;
