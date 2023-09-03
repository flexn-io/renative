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
                didFinishLaunchingWithOptions: Array<string>;
                applicationDidBecomeActive: Array<string>;
                open: Array<string>;
                supportedInterfaceOrientationsFor: Array<string>;
                didReceiveRemoteNotification: Array<string>;
                didFailToRegisterForRemoteNotificationsWithError: Array<string>;
                didReceive: Array<string>;
                didRegister: Array<string>;
                didRegisterForRemoteNotificationsWithDeviceToken: Array<string>;
                continue: Array<string>;
                didConnectCarInterfaceController: Array<string>;
                didDisconnectCarInterfaceController: Array<string>;
            };
            userNotificationCenter: {
                willPresent: Array<string>;
            };
        };
        podfileSources: string;
    };
};

export type Context = RnvContext<Payload>;
