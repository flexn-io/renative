import { z } from 'zod';

const Podfile = z.object({}).describe('Allows to manipulate Podfile');

export const PlatformCommoniOS = z.object({
    Podfile: z.optional(Podfile),
    // Podfile: {
    //     additionalProperties: true,
    //     type: 'object',
    // },
    // xcodeproj: {
    //     additionalProperties: true,
    //     type: 'object',
    // },
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
