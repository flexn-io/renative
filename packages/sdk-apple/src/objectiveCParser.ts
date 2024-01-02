import path from 'path';
import {
    RenativeConfigPluginPlatform,
    // getEntryFile,
    getAppTemplateFolder,
    getConfigProp,
    // getGetJsBundleFile,
    sanitizeColor,
    getFlavouredProp,
    addSystemInjects,
    chalk,
    logTask,
    logDebug,
    logWarning,
    parsePlugins,
    writeCleanFile,
    RnvPlatform,
    RenativeConfigAppDelegateMethod,
} from '@rnv/core';
import {
    Context,
    ObjectiveCAppDelegate,
    PayloadAppDelegateKey,
    PayloadAppDelegateMethod,
    PayloadAppDelegateSubKey,
    SwiftAppDelegateKey,
    SwiftAppDelegateSubKey,
    SwiftMethod,
} from './types';

export const parseAppDelegate = (
    c: Context,
    platform: RnvPlatform,
    appFolder: string,
    appFolderName: string,
    // isBundled = false,
    ip = 'localhost'
) =>
    new Promise<void>((resolve) => {
        const newPort = c.runtime?.port;
        logTask('parseAppDelegateSync', `ip:${ip} port:${newPort}`);
        const appDelegate = 'AppDelegate.mm';

        // const entryFile = getEntryFile(c, platform);

        // const forceBundle = getGetJsBundleFile(c, platform);
        // let bundle;
        // if (forceBundle) {
        //     bundle = forceBundle;
        // } else if (isBundled) {
        //     bundle = `RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "${entryFile}", fallbackResource: nil)`;
        // } else {
        //     bundle = `URL(string: "http://${ip}:${newPort}/${entryFile}.bundle?platform=ios")`;
        // }

        // PLUGINS
        parsePlugins(c, platform, (plugin, pluginPlat, key) => {
            injectPluginObjectiveCSync(c, pluginPlat, key);
        });

        // BG COLOR
        // let pluginBgColor = 'vc.view.backgroundColor = UIColor.white';
        // const UI_COLORS = ['black', 'blue', 'brown', 'clear', 'cyan', 'darkGray', 'gray', 'green', 'lightGray', 'magneta', 'orange', 'purple', 'red', 'white', 'yellow'];
        // if (backgroundColor) {
        //     if (UI_COLORS.includes(backgroundColor)) {
        //         pluginBgColor = `vc.view.backgroundColor = UIColor.${backgroundColor}`;
        //     } else {
        //         logWarning(`Your choosen color in renative.json for platform ${chalk().white(platform)} is not supported by UIColor. use one of the predefined ones: ${chalk().white(UI_COLORS.join(','))}`);
        //     }
        // }

        const clr = sanitizeColor(getConfigProp(c, platform, 'backgroundColor'), 'backgroundColor').rgbDecimal;
        const pluginBgColor = `vc.view.backgroundColor = UIColor(red: ${clr[0]}, green: ${clr[1]}, blue: ${clr[2]}, alpha: ${clr[3]})`;
        const methods: ObjectiveCAppDelegate = {
            application: {
                didFinishLaunchingWithOptions: {
                    isRequired: true,
                    func: '- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {',
                    begin: `
        self.moduleName = @"RNVApp";
        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        self.initialProps = @{};
                `,
                    render: (v) => `${v}`,
                    end: 'return [super application:application didFinishLaunchingWithOptions:launchOptions];',
                },
                sourceURLForBridge: {
                    isRequired: true,
                    func: '- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {',
                    begin: `
        #if DEBUG
            return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
        #else
            return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
        #endif
                    `,
                    render: (v) => `${v}`,
                    end: null,
                },
                applicationDidBecomeActive: {
                    func: '- (void)applicationDidBecomeActive:(UIApplication *)application {',
                    begin: null,
                    render: (v) => `${v}`,
                    end: null,
                },
                // open: {
                //     func: 'func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {',
                //     begin: 'var handled = false',
                //     render: (v) => `if(!handled) { handled = ${v} }`,
                //     end: 'return handled',
                // },
                // continue: {
                //     func: 'func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {',
                //     begin: null,
                //     render: (v) => `return ${v}`,
                //     end: null,
                // },
                // supportedInterfaceOrientationsFor: {
                //     func: 'func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {',
                //     begin: null,
                //     render: (v) => `return ${v}`,
                //     end: null,
                // },
                // didConnectCarInterfaceController: {
                //     func: 'func application(_ application: UIApplication, didConnectCarInterfaceController interfaceController: CPInterfaceController, to window: CPWindow) {',
                //     begin: null,
                //     render: (v) => `return ${v}`,
                //     end: null,
                // },
                // didDisconnectCarInterfaceController: {
                //     func: 'func application(_ application: UIApplication, didDisconnectCarInterfaceController interfaceController: CPInterfaceController, from window: CPWindow) {',
                //     begin: null,
                //     render: (v) => `return ${v}`,
                //     end: null,
                // },
                didReceiveRemoteNotification: {
                    func: '- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))handler {',
                    begin: null,
                    render: (v) => `${v}`,
                    end: null,
                },
                // didFailToRegisterForRemoteNotificationsWithError: {
                //     func: 'func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {',
                //     begin: null,
                //     render: (v) => `${v}`,
                //     end: null,
                // },
                // didReceive: {
                //     func: 'func application(_ application: UIApplication, didReceive notification: UILocalNotification) {',
                //     begin: null,
                //     render: (v) => `${v}`,
                //     end: null,
                // },
                // didRegister: {
                //     func: 'func application(_ application: UIApplication, didRegister notificationSettings: UIUserNotificationSettings) {',
                //     begin: null,
                //     render: (v) => `${v}`,
                //     end: null,
                // },
                // didRegisterForRemoteNotificationsWithDeviceToken: {
                //     func: 'func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {',
                //     begin: null,
                //     render: (v) => `${v}`,
                //     end: null,
                // },
            },
            // userNotificationCenter: {
            //     willPresent: {
            //         func: 'func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {',
            //         begin: null,
            //         render: (v) => `${v}`,
            //         end: null,
            //     },
            // },
        };

        const constructMethod = (lines: Array<string>, method: SwiftMethod) => {
            let output = '';
            if (lines.length || method.isRequired) {
                output += `\n${method.func}\n`;
                if (method.begin) output += `   ${method.begin}\n`;
                lines.forEach((v) => {
                    output += `    ${method.render(v)}\n`;
                });
                if (method.end) output += `   ${method.end}\n`;
                output += '}\n';
            }
            return output;
        };

        // REORDER Injects
        const injectors: Array<{
            f: SwiftMethod;
            lines: Array<string>;
        }> = [];
        let cleanedLinesArr;
        const mk = Object.keys(methods) as Array<SwiftAppDelegateKey>;
        mk.forEach((key) => {
            const method = methods[key];
            const mk2 = Object.keys(method) as Array<SwiftAppDelegateSubKey>;
            mk2.forEach((key2) => {
                const f = method[key2];
                const lines: Array<PayloadAppDelegateMethod> =
                    c.payload.pluginConfigiOS.appDelegateMethods[key][key2] || [];
                console.log('lines', lines);
                console.log({ key, key2 });
                const cleanedLines: Record<string, PayloadAppDelegateMethod> = {};

                lines.forEach((l) => {
                    if (!cleanedLines[l.value]) {
                        cleanedLines[l.value] = l;
                    }

                    if (cleanedLines[l.value].weight < l.weight) {
                        cleanedLines[l.value] = l;
                    }
                });
                cleanedLinesArr = Object.values(cleanedLines)
                    .sort((a, b) => a.order - b.order)
                    .map((v) => v.value);

                injectors.push({
                    f,
                    lines: cleanedLinesArr,
                });
            });
        });

        injectors.forEach((v) => {
            c.payload.pluginConfigiOS.pluginAppDelegateMethods += constructMethod(v.lines, v.f);
        });

        const injects = [
            // { pattern: '{{BUNDLE}}', override: bundle },
            // { pattern: '{{ENTRY_FILE}}', override: entryFile },
            { pattern: '{{IP}}', override: ip },
            { pattern: '{{PORT}}', override: newPort },
            { pattern: '{{BACKGROUND_COLOR}}', override: pluginBgColor },
            {
                pattern: '{{APPDELEGATE_IMPORTS}}',
                override: c.payload.pluginConfigiOS.pluginAppDelegateImports,
            },
            {
                pattern: '{{APPDELEGATE_METHODS}}',
                override: c.payload.pluginConfigiOS.pluginAppDelegateMethods,
            },
            {
                pattern: '{{APPDELEGATE_EXTENSIONS}}',
                override: c.payload.pluginConfigiOS.pluginAppDelegateExtensions,
            },
        ];

        addSystemInjects(c, injects);

        writeCleanFile(
            path.join(getAppTemplateFolder(c, platform)!, appFolderName, appDelegate),
            path.join(appFolder, appFolderName, appDelegate),
            injects,
            undefined,
            c
        );
        resolve();
    });

export const injectPluginObjectiveCSync = (c: Context, plugin: RenativeConfigPluginPlatform, key: string) => {
    logDebug(`injectPluginSwiftSync:${c.platform}:${key}`);
    const templateXcode = getFlavouredProp(c, plugin, 'templateXcode');
    const appDelegateImports = templateXcode?.AppDelegate_mm?.appDelegateImports;
    if (appDelegateImports) {
        appDelegateImports.forEach((appDelegateImport) => {
            // Avoid duplicate imports
            logDebug('appDelegateImports add');
            if (c.payload.pluginConfigiOS.pluginAppDelegateImports.indexOf(appDelegateImport) === -1) {
                logDebug('appDelegateImports add ok');
                c.payload.pluginConfigiOS.pluginAppDelegateImports += `#import ${appDelegateImport}\n`;
            }
        });
    }
    // if (plugin.appDelegateMethods instanceof Array) {
    //     c.payload.pluginConfigiOS.pluginAppDelegateMethods += `${plugin.appDelegateMethods.join('\n    ')}`;
    // }

    const appDelegateExtensions = templateXcode?.AppDelegate_mm?.appDelegateExtensions;
    if (appDelegateExtensions instanceof Array) {
        appDelegateExtensions.forEach((appDelegateExtension) => {
            // Avoid duplicate imports
            logDebug('appDelegateExtensions add');
            if (c.payload.pluginConfigiOS.pluginAppDelegateExtensions.indexOf(appDelegateExtension) === -1) {
                logDebug('appDelegateExtensions add ok');
                c.payload.pluginConfigiOS.pluginAppDelegateExtensions += `, ${appDelegateExtension}`;
            }
        });
    }

    const appDelegateMethods = templateXcode?.AppDelegate_mm?.appDelegateMethods;
    if (appDelegateMethods) {
        const admk = Object.keys(appDelegateMethods) as Array<PayloadAppDelegateKey>;
        admk.forEach((delKey) => {
            const amdk2 = Object.keys(appDelegateMethods[delKey]) as Array<PayloadAppDelegateSubKey>;
            amdk2.forEach((key2) => {
                const plugArr: Array<RenativeConfigAppDelegateMethod> =
                    c.payload.pluginConfigiOS.appDelegateMethods[delKey][key2];
                if (!plugArr) {
                    logWarning(`appDelegateMethods.${delKey}.${chalk().red(key2)} not supported. SKIPPING.`);
                } else {
                    const plugVal: Array<RenativeConfigAppDelegateMethod> = appDelegateMethods[delKey][key2];
                    if (plugVal) {
                        plugVal.forEach((v) => {
                            const isString = typeof v === 'string';
                            plugArr.push({
                                order: isString ? 0 : v?.order || 0,
                                value: isString ? v : v?.value,
                                weight: isString ? 0 : v?.weight || 0,
                            });
                        });
                    }
                }
            });
        });
    }
};
