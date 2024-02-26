import { RenativeConfigPluginPlatform, RnvContext } from '@rnv/core';

export type AppleDevice = {
    udid?: string;
    version?: string;
    isAvailable?: boolean;
    name?: string;
    icon?: string;
    isDevice?: boolean;
};

export type AppiumAppleDevice = {
    udid: string;
    CPUArchitecture: string;
    DeviceName: string;
    HardwareModel: string;
    HumanReadableProductVersionString: string;
    ProductName: string;
    ProductType: string;
    ProductVersion: string;
    SupportedDeviceFamilies: number[];
    DeviceClass?: string;
};

export type Payload = {
    pluginConfigiOS: {
        exportOptions: string;
        // exportOptions: {
        //     provisioningProfiles: Record<string, string>;
        // };
        embeddedFonts: Array<string>;
        podfileInject: string;
        podPostInstall: string;
        staticFrameworks: Array<string>;
        embeddedFontSources: Array<string>;
        ignoreProjectFonts: Array<string>;
        pluginAppDelegateMmImports: string;
        pluginAppDelegateMmMethods: string;
        pluginAppDelegateHExtensions: string;
        pluginAppDelegateHImports: string;
        appDelegateMmMethods: {
            application: {
                didFinishLaunchingWithOptions: Array<PayloadAppDelegateMethod>;
                applicationDidBecomeActive: Array<PayloadAppDelegateMethod>;
                open: Array<PayloadAppDelegateMethod>;
                supportedInterfaceOrientationsFor: Array<PayloadAppDelegateMethod>;
                didReceiveRemoteNotification: Array<PayloadAppDelegateMethod>;
                didFailToRegisterForRemoteNotificationsWithError: Array<PayloadAppDelegateMethod>;
                didReceive: Array<PayloadAppDelegateMethod>;
                didRegister: Array<PayloadAppDelegateMethod>;
                didRegisterForRemoteNotificationsWithDeviceToken: Array<PayloadAppDelegateMethod>;
                continue: Array<PayloadAppDelegateMethod>;
                didConnectCarInterfaceController: Array<PayloadAppDelegateMethod>;
                didDisconnectCarInterfaceController: Array<PayloadAppDelegateMethod>;
            };
            userNotificationCenter: {
                willPresent: Array<PayloadAppDelegateMethod>;
                didReceiveNotificationResponse: Array<PayloadAppDelegateMethod>;
            };
        };
        podfileSources: string;
        deploymentTarget: string;
        podfileNodeRequire: string;
        podfileHeader?: string;
    };
    xcodeProj?: {
        id?: string;
        runScheme?: string;
        provisioningStyle?: string;
        deploymentTarget?: string;
        provisionProfileSpecifier?: string;
        provisionProfileSpecifiers?: Record<string, string>;
        excludedArchs?: Array<string>;
        codeSignIdentity?: string;
        codeSignIdentities?: Record<string, string>;
        systemCapabilities?: Record<string, boolean>;
        teamID?: string;
        appId?: string;
    };
};

export type PayloadAppDelegateMethod = {
    order: number;
    value: string;
    weight: number;
};

export type PayloadAppDelegateKey = keyof Payload['pluginConfigiOS']['appDelegateMmMethods'];

export type PayloadAppDelegateSubKey = keyof Payload['pluginConfigiOS']['appDelegateMmMethods']['application'] &
    keyof Payload['pluginConfigiOS']['appDelegateMmMethods']['userNotificationCenter'];

export type Context = RnvContext<Payload>;
export type ObjectiveCMethod = {
    isRequired?: boolean;
    func: string;
    begin: string | null;
    render: (v: string) => string;
    end: string | null;
};

// export type SwiftMethod = {
//     isRequired?: boolean;
//     func: string;
//     begin: string | null;
//     render: (v: string) => string;
//     end: string | null;
// };

// export type SwiftAppDelegate = {
//     application: {
//         didFinishLaunchingWithOptions: SwiftMethod;
//         applicationDidBecomeActive: SwiftMethod;
//         open: SwiftMethod;
//         continue: SwiftMethod;
//         supportedInterfaceOrientationsFor: SwiftMethod;
//         didConnectCarInterfaceController: SwiftMethod;
//         didDisconnectCarInterfaceController: SwiftMethod;
//         didReceiveRemoteNotification: SwiftMethod;
//         didFailToRegisterForRemoteNotificationsWithError: SwiftMethod;
//         didReceive: SwiftMethod;
//         didRegister: SwiftMethod;
//         didRegisterForRemoteNotificationsWithDeviceToken: SwiftMethod;
//     };
//     userNotificationCenter: {
//         willPresent: SwiftMethod;
//     };
// };

export type ObjectiveCAppDelegate = {
    application: {
        didFinishLaunchingWithOptions: ObjectiveCMethod;
        applicationDidBecomeActive: ObjectiveCMethod;
        sourceURLForBridge: ObjectiveCMethod;
        open: ObjectiveCMethod;
        continue: ObjectiveCMethod;
        supportedInterfaceOrientationsFor: ObjectiveCMethod;
        didConnectCarInterfaceController: ObjectiveCMethod;
        didDisconnectCarInterfaceController: ObjectiveCMethod;
        didReceiveRemoteNotification: ObjectiveCMethod;
        didFailToRegisterForRemoteNotificationsWithError: ObjectiveCMethod;
        // didReceive: ObjectiveCMethod;
        requestAuthorizationWithOptions: ObjectiveCMethod;
        didRegisterForRemoteNotificationsWithDeviceToken: ObjectiveCMethod;
    };
    userNotificationCenter: {
        willPresent: ObjectiveCMethod;
        didReceiveNotificationResponse: ObjectiveCMethod;
    };
};

export type ObjectiveCAppDelegateSubKey = keyof ObjectiveCAppDelegate['application'] &
    keyof ObjectiveCAppDelegate['userNotificationCenter'];

export type ObjectiveCAppDelegateKey = keyof ObjectiveCAppDelegate;

export type TemplateXcode = Required<Required<RenativeConfigPluginPlatform>['templateXcode']>;

export type FilePlistJSON = {
    CFBundleDisplayName?: string;
    CFBundleShortVersionString?: string;
    CFBundleVersion?: string;
    UIAppFonts?: string[];
    UISupportedInterfaceOrientations?: string[];
    'UISupportedInterfaceOrientations~ipad'?: string[];
    CFBundleURLTypes?: Array<{
        CFBundleTypeRole: string;
        CFBundleURLName: string;
        CFBundleURLSchemes: string[];
    }>;
};
