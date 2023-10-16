import { z } from 'zod';

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

const SystemCapabilities = z.record(z.string(), z.boolean());
const provisioningProfiles = z.record(z.string());

export const PlatformiOSFragment = {
    ignoreWarnings: z.optional(IgnoreWarnings),
    ignoreLogs: z.optional(IgnoreLogs),
    deploymentTarget: z.optional(DeploymentTarget),
    orientationSupport: z.optional(OrientationSupport),
    teamID: z.optional(TeamID),
    excludedArchs: z.optional(ExcludedArchs),
    urlScheme: z.optional(URLScheme),
    teamIdentifier: z.optional(z.string().describe('Apple developer team ID')),
    scheme: z.string().optional(),
    schemeTarget: z.string().optional(),
    appleId: z.string().optional(),
    provisioningStyle: z.string().optional(),
    codeSignIdentity: z.string().describe('Special property which tells Xcode how to build your project').optional(),
    commandLineArguments: z
        .array(z.string())
        .describe('Allows you to pass launch arguments to active scheme')
        .optional(),
    provisionProfileSpecifier: z.string().optional(),
    provisionProfileSpecifiers: z.array(z.string()).optional(),
    allowProvisioningUpdates: z.boolean().optional(),
    provisioningProfiles: z.optional(provisioningProfiles),
    codeSignIdentities: z.optional(z.record(z.string(), z.string())),
    systemCapabilities: z.optional(SystemCapabilities),
    entitlements: z.record(z.string()).optional(),
    runScheme: z.string().optional(),
    sdk: z.string().optional(),
    testFlightId: z.string().optional(),
    firebaseId: z.string().optional(),
    exportOptions: z
        .object({
            method: z.string().optional(),
            teamID: z.string().optional(),
            uploadBitcode: z.boolean().optional(),
            compileBitcode: z.boolean().optional(),
            uploadSymbols: z.boolean().optional(),
            signingStyle: z.string().optional(),
            signingCertificate: z.string().optional(),
            provisioningProfiles: z.record(z.string()).optional(),
        })
        .optional(),

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
};
