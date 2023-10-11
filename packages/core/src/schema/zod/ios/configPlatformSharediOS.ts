import { z } from 'zod';

const Podfile = z
    .object({
        injectLines: z.optional(z.array(z.string())),
        post_install: z.optional(z.array(z.string())),
        sources: z.optional(z.array(z.string())),
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

export const PlatformSharediOS = z.object({
    Podfile: z.optional(Podfile),
    staticPods: z.optional(z.array(z.string())),

    podNames: z.optional(z.array(z.string())),
    podDependencies: z.optional(z.array(z.string())),
    xcodeproj: z.optional(XcodeProj),
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
    // plist: {
    //     additionalProperties: true,
    //     type: 'object',
    // },
    // appDelegateApplicationMethods: {
    //     type: 'object',
    //     properties: {
    //         didFinishLaunchingWithOptions: {
    //             type: 'array',
    //         },
    //         open: {
    //             type: 'array',
    //         },
    //         supportedInterfaceOrientationsFor: {
    //             type: 'array',
    //         },
    //         didReceiveRemoteNotification: {
    //             type: 'array',
    //         },
    //         didFailToRegisterForRemoteNotificationsWithError: {
    //             type: 'array',
    //         },
    //         didReceive: {
    //             type: 'array',
    //         },
    //         didRegister: {
    //             type: 'array',
    //         },
    //         didRegisterForRemoteNotificationsWithDeviceToken: {
    //             type: 'array',
    //         },
    //         didConnectCarInterfaceController: {
    //             type: 'array',
    //         },
    //         didDisconnectCarInterfaceController: {
    //             type: 'array',
    //         },
    //     },
    // },
    // appDelegateMethods: {
    //     additionalProperties: true,
    //     type: 'object',
    // },
    // appDelegateImports: {
    //     type: 'array',
    // },
    // appDelegateExtensions: {
    //     type: 'array',
    // },
});

export type _AppDelegateMethodType = z.infer<typeof AppDelegateMethod>;
