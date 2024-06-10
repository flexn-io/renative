import { z } from 'zod';

export const zodPlatformiOSFragment = z
    .object({
        ignoreWarnings: z.boolean().describe('Injects `inhibit_all_warnings` into Podfile'),
        ignoreLogs: z.boolean().describe('Passes `-quiet` to xcodebuild command'),
        deploymentTarget: z.string().describe('Deployment target for xcodepoj'),
        orientationSupport: z
            .object({
                phone: z.array(z.string()),
                // phone: [
                //                 'UIInterfaceOrientationPortrait',
                //                 'UIInterfaceOrientationPortraitUpsideDown',
                //                 'UIInterfaceOrientationLandscapeLeft',
                //                 'UIInterfaceOrientationLandscapeRight',
                //             ],
                tab: z.array(z.string()),
                //             tab: [
                //                 'UIInterfaceOrientationPortrait',
                //                 'UIInterfaceOrientationPortraitUpsideDown',
                //                 'UIInterfaceOrientationLandscapeLeft',
                //                 'UIInterfaceOrientationLandscapeRight',
                //             ],
            })
            .partial(),
        teamID: z.string().describe('Apple teamID'),
        excludedArchs: z
            .array(z.string())
            .describe('Defines excluded architectures. This transforms to xcodeproj: `EXCLUDED_ARCHS="<VAL VAL ...>"`'),
        urlScheme: z.string().describe('URL Scheme for the app used for deeplinking'),
        teamIdentifier: z.string().describe('Apple developer team ID'),
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
        codeSignIdentities: z.record(z.string(), z.string()),
        systemCapabilities: z.record(z.string(), z.boolean()),
        entitlements: z.record(z.string()),
        runScheme: z.string(),
        sdk: z.string(),
        testFlightId: z.string(),
        firebaseId: z.string(),
        privacyManifests: z.object({
            NSPrivacyAccessedAPITypes: z.array(
                z.object({
                    NSPrivacyAccessedAPIType: z.union([
                        z.literal('NSPrivacyAccessedAPICategorySystemBootTime'),
                        z.literal('NSPrivacyAccessedAPICategoryDiskSpace'),
                        z.literal('NSPrivacyAccessedAPICategoryActiveKeyboards'),
                        z.literal('NSPrivacyAccessedAPICategoryUserDefaults'),
                    ]),
                    NSPrivacyAccessedAPITypeReasons: z.array(
                        z.union([
                            z.literal('DDA9.1'),
                            z.literal('C617.1'),
                            z.literal('3B52.1'),
                            z.literal('0A2A.1'),
                            z.literal('35F9.1'),
                            z.literal('8FFB.1'),
                            z.literal('3D61.1'),
                            z.literal('85F4.1'),
                            z.literal('E174.1'),
                            z.literal('7D9E.1'),
                            z.literal('B728.1'),
                            z.literal('3EC4.1'),
                            z.literal('54BD.1'),
                            z.literal('CA92.1'),
                            z.literal('1C8F.1'),
                            z.literal('C56D.1'),
                            z.literal('AC6B.1'),
                        ])
                    ),
                }).describe("Official apple documentation https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api")
            ),
        }),
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
