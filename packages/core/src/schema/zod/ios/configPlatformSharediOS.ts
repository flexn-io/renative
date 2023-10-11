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

export const PlatformSharediOS = z.object({
    Podfile: z.optional(Podfile),
    staticPods: z.optional(z.array(z.string())),

    podNames: z.optional(z.array(z.string())),
    podDependencies: z.optional(z.array(z.string())),
    xcodeproj: z.optional(XcodeProj),
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
