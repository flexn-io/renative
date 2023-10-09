import { z } from 'zod';
import { PlatformCommoniOS } from './configPlatformCommoniOS';

const IgnoreWarnings = z.boolean().describe('Injects `inhibit_all_warnings` into Podfile');

const IgnoreLogs = z.boolean().describe('Passes `-quiet` to xcodebuild command');

export const PlatformiOS = PlatformCommoniOS.merge(
    z.object({
        ignoreWarnings: z.optional(IgnoreWarnings),
        ignoreLogs: z.optional(IgnoreLogs),
        // deploymentTarget: {
        //     type: 'string',
        // },
        // teamID: {
        //     type: 'string',
        // },
        // excludedArchs: {
        //     type: 'array',
        //     description: 'Defines excluded architectures. This transforms to xcodeproj: `EXCLUDED_ARCHS="<VAL VAL ...>"`',
        //     default: null,
        //     examples: [['arm64']],
        // },
        // teamIdentifier: {
        //     type: 'string',
        // },
        // scheme: {
        //     type: 'string',
        // },

        // appleId: {
        //     type: 'string',
        // },
        // orientationSupport: {
        //     type: 'object',
        //     properties: {
        //         phone: {
        //             type: 'array',
        //         },
        //         tab: {
        //             type: 'array',
        //         },
        //     },
        //     examples: [
        //         {
        //             phone: [
        //                 'UIInterfaceOrientationPortrait',
        //                 'UIInterfaceOrientationPortraitUpsideDown',
        //                 'UIInterfaceOrientationLandscapeLeft',
        //                 'UIInterfaceOrientationLandscapeRight',
        //             ],
        //             tab: [
        //                 'UIInterfaceOrientationPortrait',
        //                 'UIInterfaceOrientationPortraitUpsideDown',
        //                 'UIInterfaceOrientationLandscapeLeft',
        //                 'UIInterfaceOrientationLandscapeRight',
        //             ],
        //         },
        //     ],
        // },

        // provisioningStyle: {
        //     type: 'string',
        // },
        // codeSignIdentity: {
        //     type: 'string',
        //     description: 'Special property which tells Xcode how to build your project',
        //     examples: ['iPhone Developer', 'iPhone Distribution'],
        // },
        // commandLineArguments: {
        //     type: 'array',
        //     description: 'Allows you to pass launch arguments to active scheme',
        //     examples: [['-FIRAnalyticsDebugEnabled', 'MyCustomLaunchArgument']],
        // },
        // provisionProfileSpecifier: {
        //     type: 'string',
        // },
        // provisioningProfiles: {
        //     additionalProperties: true,
        //     type: 'object',
        // },
        // systemCapabilities: {
        //     additionalProperties: true,
        //     type: 'object',
        //     examples: [
        //         {
        //             'com.apple.SafariKeychain': false,
        //             'com.apple.Wallet': false,
        //             'com.apple.HealthKit': false,
        //             'com.apple.ApplicationGroups.iOS': false,
        //             'com.apple.iCloud': true,
        //             'com.apple.DataProtection': false,
        //             'com.apple.HomeKit': false,
        //             'com.apple.ClassKit': false,
        //             'com.apple.VPNLite': false,
        //             'com.apple.AutoFillCredentialProvider': false,
        //             'com.apple.AccessWiFi': false,
        //             'com.apple.InAppPurchase': false,
        //             'com.apple.HotspotConfiguration': false,
        //             'com.apple.Multipath': false,
        //             'com.apple.GameCenter.iOS': false,
        //             'com.apple.BackgroundModes': false,
        //             'com.apple.InterAppAudio': false,
        //             'com.apple.WAC': false,
        //             'com.apple.Push': true,
        //             'com.apple.NearFieldCommunicationTagReading': false,
        //             'com.apple.ApplePay': false,
        //             'com.apple.Keychain': false,
        //             'com.apple.Maps.iOS': false,
        //             'com.apple.Siri': false,
        //             'com.apple.NetworkExtensions.iOS': false,
        //         },
        //     ],
        // },
        // entitlements: {
        //     additionalProperties: true,
        //     type: 'object',
        // },
        // runScheme: {
        //     type: 'string',
        // },
        // sdk: {
        //     type: 'string',
        // },
        // testFlightId: {
        //     type: 'string',
        // },
        // firebaseId: {
        //     type: 'string',
        // },
        // exportOptions: {
        //     type: 'object',
        //     additionalProperties: false,
        //     properties: {
        //         method: {
        //             type: 'string',
        //         },
        //         teamID: {
        //             type: 'string',
        //         },
        //         uploadBitcode: {
        //             type: 'boolean',
        //         },
        //         compileBitcode: {
        //             type: 'boolean',
        //         },
        //         uploadSymbols: {
        //             type: 'boolean',
        //         },
        //         signingStyle: {
        //             type: 'string',
        //         },
        //         signingCertificate: {
        //             type: 'string',
        //         },
        //         provisioningProfiles: {
        //             additionalProperties: true,
        //             type: 'object',
        //         },
        //     },
        // },
    })
);
