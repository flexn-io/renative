import { RnvContext } from 'rnv';

export type Payload = {
    pluginConfigiOS: {
        exportOptions: string;
        // exportOptions: {
        //     provisioningProfiles: Record<string, string>;
        // };
        embeddedFonts: Array<string>;
        podfileInject: string;
        podPostInstall: string;
        staticPodExtraConditions: string;
        staticFrameworks: Array<string>;
        staticPodDefinition: string;
        embeddedFontSources: Array<string>;
        ignoreProjectFonts: Array<string>;
        pluginAppDelegateImports: string;
        pluginAppDelegateMethods: string;
        pluginAppDelegateExtensions: string;
        appDelegateMethods: {
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
            };
        };
        podfileSources: string;
        deploymentTarget: string;
    };
    xcodeProj?: {
        id?: string;
        runScheme?: string;
        provisioningStyle?: string;
        deploymentTarget?: string;
        provisionProfileSpecifier?: any;
        provisionProfileSpecifiers?: any;
        excludedArchs?: Array<string>;
        codeSignIdentity?: string;
        codeSignIdentities?: Record<string, string>;
        systemCapabilities?: Record<string, boolean>;
        teamID?: any;
        appId?: any;
    };
};

export type PayloadAppDelegateMethod = {
    order: number;
    value: string;
    weight: number;
};

export type PayloadAppDelegateKey = keyof Payload['pluginConfigiOS']['appDelegateMethods'];

export type PayloadAppDelegateSubKey = keyof Payload['pluginConfigiOS']['appDelegateMethods']['application'] &
    keyof Payload['pluginConfigiOS']['appDelegateMethods']['userNotificationCenter'];

export type Context = RnvContext<Payload>;

export type SwiftMethod = {
    isRequired?: boolean;
    func: string;
    begin: string | null;
    render: (v: string) => string;
    end: string | null;
};

export type SwiftAppDelegate = {
    application: {
        didFinishLaunchingWithOptions: SwiftMethod;
        applicationDidBecomeActive: SwiftMethod;
        open: SwiftMethod;
        continue: SwiftMethod;
        supportedInterfaceOrientationsFor: SwiftMethod;
        didConnectCarInterfaceController: SwiftMethod;
        didDisconnectCarInterfaceController: SwiftMethod;
        didReceiveRemoteNotification: SwiftMethod;
        didFailToRegisterForRemoteNotificationsWithError: SwiftMethod;
        didReceive: SwiftMethod;
        didRegister: SwiftMethod;
        didRegisterForRemoteNotificationsWithDeviceToken: SwiftMethod;
    };
    userNotificationCenter: {
        willPresent: SwiftMethod;
    };
};

export type SwiftAppDelegateSubKey = keyof SwiftAppDelegate['application'] &
    keyof SwiftAppDelegate['userNotificationCenter'];

export type SwiftAppDelegateKey = keyof SwiftAppDelegate;
