import { z } from 'zod';

export const zodPlatformiOSFragment = z
    .object({
        ignoreWarnings: z.boolean().describe('Injects `inhibit_all_warnings` into Podfile'),
        ignoreLogs: z.boolean().describe('Passes `-quiet` to xcodebuild command'),
        deploymentTarget: z.string().describe('Deployment target for xcodepoj'),
        orientationSupport: z.object({
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
        }),
        teamID: z.string().describe('Apple teamID'),
        excludedArchs: z
            .array(z.string())
            .describe('Defines excluded architectures. This transforms to xcodeproj: `EXCLUDED_ARCHS="<VAL VAL ...>"`'),
        urlScheme: z.string().describe('URL Scheme for the app used for deeplinking'),
        teamIdentifier: z.optional(z.string().describe('Apple developer team ID')),
        scheme: z.string(),
        schemeTarget: z.string(),
        appleId: z.string(),
        provisioningStyle: z.string(),
        newArchEnabled: z.boolean().describe('Enables new archs for iOS. Default: false'),
        codeSignIdentity: z.string().describe('Special property which tells Xcode how to build your project'),
        commandLineArguments: z.array(z.string()).describe('Allows you to pass launch arguments to active scheme'),
        provisionProfileSpecifier: z.string(),
        provisionProfileSpecifiers: z.record(z.string(), z.string()),
        allowProvisioningUpdates: z.boolean(),
        provisioningProfiles: z.record(z.string()),
        codeSignIdentities: z.optional(z.record(z.string(), z.string())),
        systemCapabilities: z.record(z.string(), z.boolean()),
        entitlements: z.record(z.string()),
        runScheme: z.string(),
        sdk: z.string(),
        testFlightId: z.string(),
        firebaseId: z.string(),
        exportOptions: z
            .object({
                method: z.string(),
                teamID: z.string(),
                uploadBitcode: z.boolean(),
                compileBitcode: z.boolean(),
                uploadSymbols: z.boolean(),
                signingStyle: z.string(),
                signingCertificate: z.string(),
                provisioningProfiles: z.record(z.string()),
            })
            .partial(),
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
    })
    .partial();

export type RnvPlatformiOSFragment = z.infer<typeof zodPlatformiOSFragment>;
