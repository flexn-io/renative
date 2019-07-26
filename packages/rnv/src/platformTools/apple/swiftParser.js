


export const parseAppDelegateSync = (c, platform, appFolder, appFolderName, isBundled = false, ip = 'localhost', port = 8081) => {
    logTask(`parseAppDelegateSync:${platform}:${ip}:${port}`);
    const appDelegate = 'AppDelegate.swift';

    const entryFile = getEntryFile(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);
    const { backgroundColor } = c.files.appConfigFile.platforms[platform];
    const tId = getConfigProp(c, platform, 'teamID');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
    let bundle;
    if (isBundled) {
        bundle = `RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "${entryFile}", fallbackResource: nil)`;
    } else {
        bundle = `URL(string: "http://${ip}:${port}/${entryFile}.bundle?platform=ios")`;
    }
    // INJECTORS
    const pluginAppDelegateImports = '';
    const pluginAppDelegateMethods = '';
    const pluginConfig = {
        pluginAppDelegateImports,
        pluginAppDelegateMethods,
        appDelegateMethods: {
            application: {
                didFinishLaunchingWithOptions: [],
                open: [],
                supportedInterfaceOrientationsFor: [],
                didReceiveRemoteNotification: [],
                didFailToRegisterForRemoteNotificationsWithError: [],
                didReceive: [],
                didRegister: [],
                didRegisterForRemoteNotificationsWithDeviceToken: []
            },
            userNotificationCenter: {
                willPresent: []
            }
        }
    };

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        _injectPlugin(c, pluginPlat, key, pluginPlat.package, pluginConfig);
    });

    // BG COLOR
    let pluginBgColor = 'vc.view.backgroundColor = UIColor.white';
    const UI_COLORS = ['black', 'blue', 'brown', 'clear', 'cyan', 'darkGray', 'gray', 'green', 'lightGray', 'magneta', 'orange', 'purple', 'red', 'white', 'yellow'];
    if (backgroundColor) {
        if (UI_COLORS.includes(backgroundColor)) {
            pluginBgColor = `vc.view.backgroundColor = UIColor.${backgroundColor}`;
        } else {
            logWarning(`Your choosen color in config.json for platform ${chalk.white(platform)} is not supported by UIColor. use one of the predefined ones: ${chalk.white(UI_COLORS.join(','))}`);
        }
    }

    const methods = {
        application: {
            didFinishLaunchingWithOptions: {
                isRequired: true,
                func: 'func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {',
                begin: `
        self.window = UIWindow(frame: UIScreen.main.bounds)
        let vc = UIViewController()
        let v = RCTRootView(
            bundleURL: bundleUrl,
            moduleName: moduleName,
            initialProperties: nil,
            launchOptions: launchOptions)
        vc.view = v
        ${pluginBgColor}
        v?.frame = vc.view.bounds
        self.window?.rootViewController = vc
        self.window?.makeKeyAndVisible()
        UNUserNotificationCenter.current().delegate = self
                `,
                render: v => `${v}`,
                end: 'return true',

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
            pluginConfig.pluginAppDelegateMethods += constructMethod(pluginConfig.appDelegateMethods[key][key2], f);
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
                override: pluginConfig.pluginAppDelegateImports,
            },
            {
                pattern: '{{APPDELEGATE_METHODS}}',
                override: pluginConfig.pluginAppDelegateMethods,
            },
        ],
    );
});

const _injectPlugin = (c, plugin, key, pkg, pluginConfig) => {
    logTask(`_injectPlugin:${c.platform}:${key}`);
    if (plugin.appDelegateImports instanceof Array) {
        plugin.appDelegateImports.forEach((appDelegateImport) => {
            // Avoid duplicate imports
            logTask('appDelegateImports add');
            if (pluginConfig.pluginAppDelegateImports.indexOf(appDelegateImport) === -1) {
                logTask('appDelegateImports add ok');
                pluginConfig.pluginAppDelegateImports += `import ${appDelegateImport}\n`;
            }
        });
    }
    // if (plugin.appDelegateMethods instanceof Array) {
    //     pluginConfig.pluginAppDelegateMethods += `${plugin.appDelegateMethods.join('\n    ')}`;
    // }

    if (plugin.appDelegateMethods) {
        for (const key in plugin.appDelegateMethods) {
            for (const key2 in plugin.appDelegateMethods[key]) {
                const plugArr = pluginConfig.appDelegateMethods[key][key2];
                const plugVal = plugin.appDelegateMethods[key][key2];
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
