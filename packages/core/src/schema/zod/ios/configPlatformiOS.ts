import { z } from 'zod';
import { PlatformSharediOS, TemplateXcodeShared } from './configPlatformSharediOS';

const IgnoreWarnings = z.boolean().describe('Injects `inhibit_all_warnings` into Podfile');

const IgnoreLogs = z.boolean().describe('Passes `-quiet` to xcodebuild command');

const DeploymentTarget = z.string().describe('Deployment target for xcodepoj');

const OrientationSupport = z.object({
    phone: z.optional(z.array(z.string())),
    // phone: [
    //                 'UIInterfaceOrientationPortrait',
    //                 'UIInterfaceOrientationPortraitUpsideDown',
    //                 'UIInterfaceOrientationLandscapeLeft',
    //                 'UIInterfaceOrientationLandscapeRight',
    //             ],
    tab: z.optional(z.array(z.string())),
    //             tab: [
    //                 'UIInterfaceOrientationPortrait',
    //                 'UIInterfaceOrientationPortraitUpsideDown',
    //                 'UIInterfaceOrientationLandscapeLeft',
    //                 'UIInterfaceOrientationLandscapeRight',
    //             ],
});

const ExcludedArchs = z
    .array(z.string())
    .describe('Defines excluded architectures. This transforms to xcodeproj: `EXCLUDED_ARCHS="<VAL VAL ...>"`'); //['arm64']

const URLScheme = z.string().describe('URL Scheme for the app used for deeplinking');

const TeamID = z.string().describe('Apple teamID');

export const PlatformiOS = PlatformSharediOS.merge(
    z.object({
        ignoreWarnings: z.optional(IgnoreWarnings),
        ignoreLogs: z.optional(IgnoreLogs),
        deploymentTarget: z.optional(DeploymentTarget),
        orientationSupport: z.optional(OrientationSupport),
        teamID: z.optional(TeamID),
        excludedArchs: z.optional(ExcludedArchs),
        urlScheme: z.optional(URLScheme),

        templateXcode: z.optional(TemplateXcodeShared.merge(z.object({}))),

        // teamIdentifier: {
        //     type: 'string',
        // },
        // scheme: {
        //     type: 'string',
        // },

        // appleId: {
        //     type: 'string',
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
