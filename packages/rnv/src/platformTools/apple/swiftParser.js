import path from 'path';
import chalk from 'chalk';
import {
    getEntryFile,
    writeCleanFile,
    getAppTemplateFolder,
    getConfigProp,
    getGetJsBundleFile,
    sanitizeColor,
    getFlavouredProp
} from '../../common';
import {
    logTask
} from '../../systemTools/logger';
import { parsePlugins } from '../../pluginTools';

export const parseAppDelegate = (c, platform, appFolder, appFolderName, isBundled = false, ip = 'localhost', port) => new Promise((resolve, reject) => {
    if (!port) port = c.runtime.port;
    logTask(`parseAppDelegateSync:${platform}:${ip}:${port}`);
    const appDelegate = 'AppDelegate.swift';

    const entryFile = getEntryFile(c, platform);
    const { backgroundColor } = c.buildConfig.platforms[platform];

    const forceBundle = getGetJsBundleFile(c, platform);
    let bundle;
    if (forceBundle) {
        bundle = forceBundle;
    } else if (isBundled) {
        bundle = `RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "${entryFile}", fallbackResource: nil)`;
    } else {
        bundle = `URL(string: "http://${ip}:${port}/${entryFile}.bundle?platform=ios")`;
    }

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        injectPluginSwiftSync(c, pluginPlat, key, pluginPlat.package);
    });

    // BG COLOR
    // let pluginBgColor = 'vc.view.backgroundColor = UIColor.white';
    // const UI_COLORS = ['black', 'blue', 'brown', 'clear', 'cyan', 'darkGray', 'gray', 'green', 'lightGray', 'magneta', 'orange', 'purple', 'red', 'white', 'yellow'];
    // if (backgroundColor) {
    //     if (UI_COLORS.includes(backgroundColor)) {
    //         pluginBgColor = `vc.view.backgroundColor = UIColor.${backgroundColor}`;
    //     } else {
    //         logWarning(`Your choosen color in renative.json for platform ${chalk.white(platform)} is not supported by UIColor. use one of the predefined ones: ${chalk.white(UI_COLORS.join(','))}`);
    //     }
    // }

    const clr = sanitizeColor(getConfigProp(c, platform, 'backgroundColor')).rgbDecimal;
    const pluginBgColor = `vc.view.backgroundColor = UIColor(red: ${clr[0]}, green: ${clr[1]}, blue: ${clr[2]}, alpha: ${clr[3]})`;
    const methods = {
        application: {
            didFinishLaunchingWithOptions: {
                isRequired: true,
                func: 'func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {',
                begin: `
        self.window = UIWindow(frame: UIScreen.main.bounds)
        let vc = UIViewController()
        let v = RCTRootView(
            bundleURL: bundleUrl!,
            moduleName: moduleName,
            initialProperties: nil,
            launchOptions: launchOptions)
        vc.view = v
        ${pluginBgColor}
        v.frame = vc.view.bounds
        self.window?.rootViewController = vc
        self.window?.makeKeyAndVisible()
        UNUserNotificationCenter.current().delegate = self
                `,
                render: v => `${v}`,
                end: 'return true',

            },
            applicationDidBecomeActive: {
                func: 'func applicationDidBecomeActive(_ application: UIApplication) {',
                begin: null,
                render: v => `${v}`,
                end: null,
            },
            open: {
                func: 'func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {',
                begin: 'var handled = false',
                render: v => `if(!handled) { handled = ${v} }`,
                end: 'return handled',

            },
            supportedInterfaceOrientationsFor: {
                func: 'func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {',
                begin: null,
                render: v => `return ${v}`,
                end: null,

            },
            didReceiveRemoteNotification: {
                func: 'func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {',
                begin: null,
                render: v => `${v}`,
                end: null,

            },
            didFailToRegisterForRemoteNotificationsWithError: {
                func: 'func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {',
                begin: null,
                render: v => `${v}`,
                end: null,

            },
            didReceive: {
                func: 'func application(_ application: UIApplication, didReceive notification: UILocalNotification) {',
                begin: null,
                render: v => `${v}`,
                end: null,

            },
            didRegister: {
                func: 'func application(_ application: UIApplication, didRegister notificationSettings: UIUserNotificationSettings) {',
                begin: null,
                render: v => `${v}`,
                end: null,

            },
            didRegisterForRemoteNotificationsWithDeviceToken: {
                func: 'func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {',
                begin: null,
                render: v => `${v}`,
                end: null,

            }
        },
        userNotificationCenter: {
            willPresent: {
                func: 'func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {',
                begin: null,
                render: v => `${v}`,
                end: null
            }
        }
    };

    const constructMethod = (lines, method) => {
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

    for (const key in methods) {
        const method = methods[key];
        for (const key2 in method) {
            const f = method[key2];
            c.pluginConfigiOS.pluginAppDelegateMethods += constructMethod(c.pluginConfigiOS.appDelegateMethods[key][key2], f);
        }
    }

    writeCleanFile(
        path.join(getAppTemplateFolder(c, platform), appFolderName, appDelegate),
        path.join(appFolder, appFolderName, appDelegate),
        [
            { pattern: '{{BUNDLE}}', override: bundle },
            { pattern: '{{ENTRY_FILE}}', override: entryFile },
            { pattern: '{{IP}}', override: ip },
            { pattern: '{{PORT}}', override: port },
            { pattern: '{{BACKGROUND_COLOR}}', override: pluginBgColor },
            {
                pattern: '{{APPDELEGATE_IMPORTS}}',
                override: c.pluginConfigiOS.pluginAppDelegateImports,
            },
            {
                pattern: '{{APPDELEGATE_METHODS}}',
                override: c.pluginConfigiOS.pluginAppDelegateMethods,
            },
        ],
    );
    resolve();
});

export const injectPluginSwiftSync = (c, plugin, key, pkg) => {
    logTask(`injectPluginSwiftSync:${c.platform}:${key}`, chalk.grey);
    const appDelegateImports = getFlavouredProp(c, plugin, 'appDelegateImports');
    if (appDelegateImports instanceof Array) {
        appDelegateImports.forEach((appDelegateImport) => {
            // Avoid duplicate imports
            logTask('appDelegateImports add', chalk.grey);
            if (c.pluginConfigiOS.pluginAppDelegateImports.indexOf(appDelegateImport) === -1) {
                logTask('appDelegateImports add ok', chalk.grey);
                c.pluginConfigiOS.pluginAppDelegateImports += `import ${appDelegateImport}\n`;
            }
        });
    }
    // if (plugin.appDelegateMethods instanceof Array) {
    //     c.pluginConfigiOS.pluginAppDelegateMethods += `${plugin.appDelegateMethods.join('\n    ')}`;
    // }

    const appDelegateMethods = getFlavouredProp(c, plugin, 'appDelegateMethods');
    if (appDelegateMethods) {
        for (const key in appDelegateMethods) {
            for (const key2 in appDelegateMethods[key]) {
                const plugArr = c.pluginConfigiOS.appDelegateMethods[key][key2];
                const plugVal = appDelegateMethods[key][key2];
                if (plugVal) {
                    plugVal.forEach((v) => {
                        if (!plugArr.includes(v)) {
                            plugArr.push(v);
                        }
                    });
                }
            }
        }
    }
};
