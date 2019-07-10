/* eslint-disable import/no-cycle */
// @todo fix circular dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';
import { executeAsync } from '../systemTools/exec';
import { isObject } from '../systemTools/objectUtils';
import { createPlatformBuild } from '../cli/platform';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug,
    getAppVersion,
    getAppTitle,
    getEntryFile,
    writeCleanFile,
    getAppTemplateFolder,
    getAppId,
    copyBuildsFolder,
    getConfigProp,
    getIP,
    getQuestion,
    logSuccess,
    getBuildsFolder
} from '../common';
import { IOS, TVOS } from '../constants';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, mergeObjects } from '../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../pluginTools';
import { saveObjToPlistSync } from './apple/plistParser';

const xcode = require('xcode');
const readline = require('readline');

const checkIfCommandExists = command => new Promise((resolve, reject) => child_process.exec(`command -v ${command} 2>/dev/null`, (error) => {
    if (error) return reject(new Error(`${command} not installed`));
    return resolve();
}));

const runPod = (command, cwd, rejectOnFail = false) => new Promise((resolve, reject) => {
    logTask(`runPod:${command}`);

    if (!fs.existsSync(cwd)) {
        logError(`Location ${cwd} does not exists!`);
        if (rejectOnFail) return reject();
        return resolve();
    }
    return checkIfCommandExists('pod')
        .then(() => executeAsync('pod', [command], {
            cwd,
            evn: process.env,
            stdio: 'inherit',
        })
            .then(() => resolve())
            .catch((e) => {
                logError(e);
                if (rejectOnFail) return reject(e);
                return resolve();
            }))
        .catch(err => logError(err));
});

const copyAppleAssets = (c, platform, appFolderName) => new Promise((resolve) => {
    logTask('copyAppleAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const iosPath = path.join(getAppFolder(c, platform), appFolderName);
    const sPath = path.join(c.paths.appConfigFolder, `assets/${platform}`);
    copyFolderContentsRecursiveSync(sPath, iosPath);
    resolve();
});

const runXcodeProject = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`runXcodeProject:${platform}:${target}`);

    if (target === '?') {
        launchAppleSimulator(c, platform, target).then((newTarget) => {
            _runXcodeProject(c, platform, newTarget)
                .then(() => resolve())
                .catch(e => reject(e));
        });
    } else {
        _runXcodeProject(c, platform, target)
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const _runXcodeProject = (c, platform, target) => new Promise((resolve, reject) => {
    logTask(`_runXcodeProject:${platform}:${target}`);

    const appPath = getAppFolder(c, platform);
    const { device } = c.program;
    const scheme = getConfigProp(c, platform, 'scheme');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    let p;

    if (!scheme) {
        reject(
            `You missing scheme in platforms.${chalk.yellow(platform)} in your ${chalk.white(
                c.paths.appConfigPath,
            )}! Check example config for more info:  ${chalk.blue(
                'https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/config.json',
            )} `,
        );
        return;
    }

    if (device === true) {
        const devicesArr = _getAppleDevices(c, platform, false, true);
        if (devicesArr.length === 1) {
            logSuccess(`Found one device connected! device name: ${chalk.white(devicesArr[0].name)} udid: ${chalk.white(devicesArr[0].udid)}`);
            if (devicesArr[0].udid) {
                p = [
                    'run-ios',
                    '--project-path',
                    appPath,
                    '--device',
                    '--udid',
                    devicesArr[0].udid,
                    '--scheme',
                    scheme,
                    '--configuration',
                    runScheme,
                ];
            } else {
                p = [
                    'run-ios',
                    '--project-path',
                    appPath,
                    '--device',
                    devicesArr[0].name,
                    '--scheme',
                    scheme,
                    '--configuration',
                    runScheme,
                ];
            }
        } else if (devicesArr.length > 1) {
            let devicesString = '\n';
            devicesArr.forEach((v, i) => {
                devicesString += `-[${i + 1}] ${chalk.white(v.name)} | ${v.deviceIcon} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(
                    v.udid,
                )}${v.isDevice ? chalk.red(' (device)') : ''}\n`;
            });

            const readlineInterface = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readlineInterface.question(getQuestion(`${devicesString}\nType number of the device you want to launch`), (v) => {
                const selectedDevice = devicesArr[parseInt(v, 10) - 1];
                if (selectedDevice) {
                    if (selectedDevice.udid) {
                        p = [
                            'run-ios',
                            '--project-path',
                            appPath,
                            '--device',
                            '--udid',
                            selectedDevice.udid,
                            '--scheme',
                            scheme,
                            '--configuration',
                            runScheme,
                        ];
                    } else {
                        p = [
                            'run-ios',
                            '--project-path',
                            appPath,
                            '--device',
                            selectedDevice.name,
                            '--scheme',
                            scheme,
                            '--configuration',
                            runScheme,
                        ];
                    }

                    if (bundleAssets) {
                        packageBundleForXcode(c, platform, bundleIsDev)
                            .then(v => executeAsync('react-native', p))
                            .then(() => resolve())
                            .catch(e => reject(e));
                    } else {
                        executeAsync('react-native', p)
                            .then(() => resolve())
                            .catch(e => reject(e));
                    }
                } else {
                    reject(`Wrong choice ${v}! Ingoring`);
                }
            });
            return;
        } else {
            reject(`No ${platform} devices connected!`);
            return;
        }
    } else if (device) {
        p = ['run-ios', '--project-path', appPath, '--device', device, '--scheme', scheme, '--configuration', runScheme];
    } else {
        p = ['run-ios', '--project-path', appPath, '--simulator', target, '--scheme', scheme, '--configuration', runScheme];
    }

    logDebug('running', p);
    if (p) {
        if (bundleAssets) {
            packageBundleForXcode(c, platform, bundleIsDev)
                .then(v => executeAsync('react-native', p))
                .then(() => resolve())
                .catch(e => reject(e));
        } else {
            executeAsync('react-native', p)
                .then(() => resolve())
                .catch(e => reject(e));
        }
    } else {
        reject('Missing options for react-native command!');
    }
});

const archiveXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`archiveXcodeProject:${platform}`);

    const appFolderName = _getAppFolderName(c, platform);
    const sdk = platform === IOS ? 'iphoneos' : 'tvos';

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    const scheme = getConfigProp(c, platform, 'scheme');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const p = [
        '-workspace',
        `${appPath}/${appFolderName}.xcworkspace`,
        '-scheme',
        scheme,
        '-sdk',
        sdk,
        '-configuration',
        'Release',
        'archive',
        '-archivePath',
        `${exportPath}/${scheme}.xcarchive`,
        '-allowProvisioningUpdates',
    ];

    logDebug('running', p);

    if (c.files.appConfigFile.platforms[platform].runScheme === 'Release') {
        packageBundleForXcode(c, platform, bundleIsDev)
            .then(() => executeAsync('xcodebuild', p))
            .then(() => resolve())
            .catch(e => reject(e));
    } else {
        executeAsync('xcodebuild', p)
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const exportXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`exportXcodeProject:${platform}`);

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    const scheme = getConfigProp(c, platform, 'scheme');
    const p = [
        '-exportArchive',
        '-archivePath',
        `${exportPath}/${scheme}.xcarchive`,
        '-exportOptionsPlist',
        `${appPath}/exportOptions.plist`,
        '-exportPath',
        `${exportPath}`,
        '-allowProvisioningUpdates',
    ];
    logDebug('running', p);

    executeAsync('xcodebuild', p)
        .then(() => {
            logSuccess(`Your IPA is located in ${chalk.white(exportPath)}.`);
            resolve();
        })
        .catch(e => reject(e));
});

const packageBundleForXcode = (c, platform, isDev = false) => {
    logTask(`packageBundleForXcode:${platform}`);
    const appFolderName = _getAppFolderName(c, platform);

    return executeAsync('react-native', [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.appId}_${platform}`,
        '--entry-file',
        `${c.files.appConfigFile.platforms[platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, platform)}/main.jsbundle`,
    ]);
};

const prepareXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    const { device } = c.program;
    const ip = device ? getIP() : 'localhost';
    const appFolder = getAppFolder(c, platform);
    const appFolderName = _getAppFolderName(c, platform);
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    // CHECK TEAM ID IF DEVICE
    const tId = getConfigProp(c, platform, 'teamID');
    if (device && (!tId || tId === '')) {
        logError(
            `Looks like you're missing teamID in your ${chalk.white(
                c.paths.appConfigPath,
            )} => .platforms.${platform}.teamID . you will not be able to build ${platform} app for device!`,
        );
        // resolve();
        // return;
    }

    const check = path.join(appFolder, `${appFolderName}.xcodeproj`);
    if (!fs.existsSync(check)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
        createPlatformBuild(c, platform)
            .then(() => configureXcodeProject(c, platform))
            .then(() => _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }
    if (!fs.existsSync(path.join(appFolder, 'Pods'))) {
        logWarning(`Looks like your ${platform} project is not configured yet. Let's configure it!`);
        configureXcodeProject(c, platform)
            .then(() => _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip))
            .then(() => resolve(c))
            .catch(e => reject(e));
    } else {
        _postConfigureProject(c, platform, appFolder, appFolderName, bundleAssets, ip)
            .then(() => resolve(c))
            .catch(e => reject(e));
    }
});

const configureXcodeProject = (c, platform, ip, port) => new Promise((resolve, reject) => {
    logTask('configureXcodeProject');
    if (process.platform !== 'darwin') return;
    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolderName = _getAppFolderName(c, platform);

    // configureIfRequired(c, platform)
    //     .then(() => copyAppleAssets(c, platform, appFolderName))
    copyAppleAssets(c, platform, appFolderName)
        .then(() => copyAppleAssets(c, platform, appFolderName))
        .then(() => copyBuildsFolder(c, platform))
        .then(() => _preConfigureProject(c, platform, appFolderName, ip, port))
        .then(() => runPod(c.program.update ? 'update' : 'install', getAppFolder(c, platform), true))
        .then(() => resolve())
        .catch((e) => {
            if (!c.program.update) {
                logWarning(`Looks like pod install is not enough! Let's try pod update! Error: ${e}`);
                _preConfigureProject(c, platform, appFolderName, ip, port)
                    .then(() => runPod('update', getAppFolder(c, platform)))
                    .then(() => resolve())
                    .catch(err => reject(err));
            } else {
                reject(e);
            }
        });
});

const _injectPlugin = (c, plugin, key, pkg, pluginConfig) => {
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
                if (!plugArr.includes(plugVal)) {
                    plugArr.push(plugVal);
                }
            }
        }
    }
};

const _postConfigureProject = (c, platform, appFolder, appFolderName, isBundled = false, ip = 'localhost', port = 8081) => new Promise((resolve) => {
    logTask(`_postConfigureProject:${platform}:${ip}:${port}`);
    const appDelegate = 'AppDelegate.swift';

    const entryFile = getEntryFile(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);
    const { backgroundColor } = c.files.appConfigFile.platforms[platform];
    const tId = getConfigProp(c, platform, 'teamID');
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
    parsePlugins(c, (plugin, pluginPlat, key) => {
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

    writeCleanFile(path.join(appTemplateFolder, 'exportOptions.plist'), path.join(appFolder, 'exportOptions.plist'), [
        { pattern: '{{TEAM_ID}}', override: tId },
    ]);

    const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
    const xcodeProj = xcode.project(projectPath);
    xcodeProj.parse(() => {
        const appId = getAppId(c, platform);
        if (tId) {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', tId);
        } else {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
        }

        const provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
        xcodeProj.addTargetAttribute('ProvisioningStyle', provisioningStyle);
        xcodeProj.addBuildProperty('CODE_SIGN_STYLE', provisioningStyle);
        xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

        resolve();
    });
});

VALUES = {
    provisioningStyle: {
        allowedValues: ['Automatic', 'Manual'],
        defaultValue: 'Automatic'
    }
};

const _preConfigureProject = (c, platform, appFolderName, ip = 'localhost', port = 8081) => new Promise((resolve, reject) => {
    logTask(`_preConfigureProject:${platform}:${appFolderName}:${ip}:${port}`);

    const appFolder = getAppFolder(c, platform);
    const tId = getConfigProp(c, platform, 'teamID');


    // ASSETS
    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolderName}/images`));


    // PROJECT
    const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
    const xcodeProj = xcode.project(projectPath);
    const embeddedFonts = [];
    xcodeProj.parse(() => {
        const appId = getAppId(c, platform);
        if (tId) {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', tId);
        } else {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
        }
        const provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
        xcodeProj.addTargetAttribute('ProvisioningStyle', provisioningStyle);
        xcodeProj.addBuildProperty('CODE_SIGN_STYLE', provisioningStyle);
        xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

        const systemCapabilities = getConfigProp(c, platform, 'systemCapabilities');


        if (systemCapabilities) {
            const sysCapObj = {};
            for (const sk in systemCapabilities) {
                const val = systemCapabilities[sk];
                sysCapObj[sk] = { enabled: val === true ? 1 : 0 };
            }
            // const var1 = xcodeProj.getFirstProject().firstProject.attributes.TargetAttributes['200132EF1F6BF9CF00450340'];
            xcodeProj.addTargetAttribute('SystemCapabilities', sysCapObj);
        }


        if (c.files.appConfigFile) {
            if (fs.existsSync(c.paths.fontsConfigFolder)) {
                fs.readdirSync(c.paths.fontsConfigFolder).forEach((font) => {
                    if (font.includes('.ttf') || font.includes('.otf')) {
                        const key = font.split('.')[0];
                        const { includedFonts } = c.files.appConfigFile.common;
                        if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
                            const fontSource = path.join(c.paths.projectConfigFolder, 'fonts', font);
                            if (fs.existsSync(fontSource)) {
                                const fontFolder = path.join(appFolder, 'fonts');
                                mkdirSync(fontFolder);
                                const fontDest = path.join(fontFolder, font);
                                copyFileSync(fontSource, fontDest);
                                xcodeProj.addResourceFile(fontSource);
                                embeddedFonts.push(font);
                            } else {
                                logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                            }
                        }
                    }
                });
            }
        }

        // PLUGINS
        parsePlugins(c, (plugin, pluginPlat, key) => {
            if (pluginPlat.xcodeproj) {
                if (pluginPlat.xcodeproj.resourceFiles) {
                    pluginPlat.xcodeproj.resourceFiles.forEach((v) => {
                        xcodeProj.addResourceFile(path.join(appFolder, v));
                    });
                }
                if (pluginPlat.xcodeproj.sourceFiles) {
                    pluginPlat.xcodeproj.sourceFiles.forEach((v) => {
                        // const group = xcodeProj.hash.project.objects.PBXGroup['200132F21F6BF9CF00450340'];
                        xcodeProj.addSourceFile(v, null, '200132F21F6BF9CF00450340');
                    });
                }
                if (pluginPlat.xcodeproj.headerFiles) {
                    pluginPlat.xcodeproj.headerFiles.forEach((v) => {
                        xcodeProj.addHeaderFile(v, null, '200132F21F6BF9CF00450340');
                    });
                }
            }
        });

        fs.writeFileSync(projectPath, xcodeProj.writeSync());
        _parsePodFile(c, platform);
        _parseEntitlements(c, platform);
        _parsePlist(c, platform, embeddedFonts);
        resolve();
    });
});

const _parsePodFile = (c, platform) => {
    logTask(`_parsePodFile:${platform}`);

    const appFolder = getAppFolder(c, platform);
    let pluginSubspecs = '';
    let pluginInject = '';

    // PLUGINS
    parsePlugins(c, (plugin, pluginPlat, key) => {
        const isNpm = plugin['no-npm'] !== true;
        if (pluginPlat.podName) {
            if (isNpm) {
                const podPath = pluginPlat.path ? `../../${pluginPlat.path}` : `../../node_modules/${key}`;
                pluginInject += `  pod '${pluginPlat.podName}', :path => '${podPath}'\n`;
            } else if (pluginPlat.git) {
                const commit = pluginPlat.commit ? `, :commit => '${pluginPlat.commit}'` : '';
                pluginInject += `  pod '${pluginPlat.podName}', :git => '${pluginPlat.git}'${commit}\n`;
            } else if (pluginPlat.version) {
                pluginInject += `  pod '${pluginPlat.podName}', '${pluginPlat.version}'\n`;
            } else {
                pluginInject += `  pod '${pluginPlat.podName}'\n`;
            }
        }

        if (pluginPlat.reactSubSpecs) {
            pluginPlat.reactSubSpecs.forEach((v) => {
                if (!pluginSubspecs.includes(`'${v}'`)) {
                    pluginSubspecs += `  '${v}',\n`;
                }
            });
        }
    });

    // SUBSPECS
    const reactCore = c.files.pluginConfig ? c.files.pluginConfig.reactCore : c.files.pluginTemplatesConfig.reactCore;
    if (reactCore) {
        if (reactCore.ios.reactSubSpecs) {
            reactCore.ios.reactSubSpecs.forEach((v) => {
                if (!pluginSubspecs.includes(`'${v}'`)) {
                    pluginSubspecs += `  '${v}',\n`;
                }
            });
        }
    }

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), 'Podfile'), path.join(appFolder, 'Podfile'), [
        { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        { pattern: '{{PLUGIN_SUBSPECS}}', override: pluginSubspecs }
    ]);
};

const _parseEntitlements = (c, platform) => {
    logTask(`_parseEntitlements:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = _getAppFolderName(c, platform);
    const entitlementsPath = path.join(appFolder, `${appFolderName}/RNVApp.entitlements`);
    // PLUGIN ENTITLEMENTS
    let pluginsEntitlementsObj = getConfigProp(c, platform, 'entitlements');
    if (!pluginsEntitlementsObj) {
        pluginsEntitlementsObj = readObjectSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/entitlements.json'));
    }

    saveObjToPlistSync(entitlementsPath, pluginsEntitlementsObj);
};

const _parsePlist = (c, platform, embeddedFonts) => {
    logTask(`_parsePlist:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = _getAppFolderName(c, platform);
    const { permissions, orientationSupport, urlScheme, plistExtra } = c.files.appConfigFile.platforms[platform];
    const plistPath = path.join(appFolder, `${appFolderName}/Info.plist`);

    // PLIST
    let plistObj = readObjectSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/info.plist.json'));
    plistObj.CFBundleDisplayName = getAppTitle(c, platform);
    plistObj.CFBundleShortVersionString = getAppVersion(c, platform);
    // FONTS
    if (embeddedFonts.length) {
        plistObj.UIAppFonts = embeddedFonts;
    }
    // PERMISSIONS
    const pluginPermissions = '';
    if (permissions) {
        permissions.forEach((v) => {
            if (c.files.permissionsConfig) {
                const plat = c.files.permissionsConfig.permissions[platform] ? platform : 'ios';
                const pc = c.files.permissionsConfig.permissions[plat];
                if (pc[v]) {
                    // pluginPermissions += `  <key>${pc[v].key}</key>\n  <string>${pc[v].desc}</string>\n`;
                    plistObj[pc[v].key] = pc[v].desc;
                }
            }
        });
    }
    // ORIENATATIONS
    if (orientationSupport) {
        if (orientationSupport.phone) {
            plistObj.UISupportedInterfaceOrientations = orientationSupport.phone;
        } else {
            plistObj.UISupportedInterfaceOrientations = ['UIInterfaceOrientationPortrait'];
        }
        if (orientationSupport.tab) {
            plistObj['UISupportedInterfaceOrientations~ipad'] = orientationSupport.tab;
        } else {
            plistObj['UISupportedInterfaceOrientations~ipad'] = ['UIInterfaceOrientationPortrait'];
        }
    }
    // URL_SCHEMES
    if (urlScheme) {
        plistObj.CFBundleURLTypes.push({
            CFBundleTypeRole: 'Editor',
            CFBundleURLName: urlScheme,
            CFBundleURLSchemes: [urlScheme]
        });
    }
    // PLIST EXTRAS
    if (plistExtra) {
        plistObj = mergeObjects(plistObj, plistExtra);
    }
    // PLUGINS
    parsePlugins(c, (plugin, pluginPlat, key) => {
        if (pluginPlat.plist) {
            plistObj = mergeObjects(plistObj, pluginPlat.plist);
        }
    });
    saveObjToPlistSync(plistPath, plistObj);
};

const _getAppFolderName = (c, platform) => {
    const projectFolder = getConfigProp(c, platform, 'projectFolder');
    if (projectFolder) {
        return projectFolder;
    }
    return platform === IOS ? 'RNVApp' : 'RNVAppTVOS';
};

const listAppleDevices = (c, platform) => new Promise((resolve) => {
    logTask(`listAppleDevices:${platform}`);

    const devicesArr = _getAppleDevices(c, platform);
    let devicesString = '\n';
    devicesArr.forEach((v, i) => {
        devicesString += `-[${i + 1}] ${chalk.white(v.name)} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(v.udid)}${
            v.isDevice ? chalk.red(' (device)') : ''
        }\n`;
    });
    console.log(devicesString);
});

const launchAppleSimulator = (c, platform, target) => new Promise((resolve) => {
    logTask(`launchAppleSimulator:${platform}:${target}`);

    const devicesArr = _getAppleDevices(c, platform, true);
    let selectedDevice;
    for (let i = 0; i < devicesArr.length; i++) {
        if (devicesArr[i].name === target) {
            selectedDevice = devicesArr[i];
        }
    }
    if (selectedDevice) {
        _launchSimulator(selectedDevice);
        resolve(selectedDevice.name);
    } else {
        logWarning(`Your specified simulator target ${chalk.white(target)} doesn't exists`);
        const readlineInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        let devicesString = '\n';
        devicesArr.forEach((v, i) => {
            devicesString += `-[${i + 1}] ${chalk.white(v.name)} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(
                v.udid,
            )}${v.isDevice ? chalk.red(' (device)') : ''}\n`;
        });
        readlineInterface.question(getQuestion(`${devicesString}\nType number of the simulator you want to launch`), (v) => {
            const chosenDevice = devicesArr[parseInt(v, 10) - 1];
            if (chosenDevice) {
                _launchSimulator(chosenDevice);
                resolve(chosenDevice.name);
            } else {
                logError(`Wrong choice ${v}! Ingoring`);
            }
        });
    }
});

const _launchSimulator = (selectedDevice) => {
    try {
        child_process.spawnSync('xcrun', ['instruments', '-w', selectedDevice.udid]);
    } catch (e) {
        // instruments always fail with 255 because it expects more arguments,
        // but we want it to only launch the simulator
    }
};

const _getAppleDevices = (c, platform, ignoreDevices, ignoreSimulators) => {
    logTask(`_getAppleDevices:${platform},ignoreDevices:${ignoreDevices},ignoreSimulators${ignoreSimulators}`);
    const devices = child_process.execFileSync('xcrun', ['instruments', '-s'], {
        encoding: 'utf8',
    });

    const devicesArr = _parseIOSDevicesList(devices, platform, ignoreDevices, ignoreSimulators);
    return devicesArr;
};

const _parseIOSDevicesList = (text, platform, ignoreDevices = false, ignoreSimulators = false) => {
    const devices = [];
    text.split('\n').forEach((line) => {
        const s1 = line.match(/\[.*?\]/);
        const s2 = line.match(/\(.*?\)/g);
        const s3 = line.substring(0, line.indexOf('(') - 1);
        const s4 = line.substring(0, line.indexOf('[') - 1);
        let isSim = false;
        if (s2 && s1) {
            if (s2[s2.length - 1] === '(Simulator)') {
                isSim = true;
                s2.pop();
            }
            const version = s2.pop();
            const name = `${s4.substring(0, s4.lastIndexOf('(') - 1)}`;
            const udid = s1[0].replace(/\[|\]/g, '');
            const isDevice = !isSim;

            if ((isDevice && !ignoreDevices) || (!isDevice && !ignoreSimulators)) {
                switch (platform) {
                case IOS:
                    if (name.includes('iPhone') || name.includes('iPad') || name.includes('iPod') || isDevice) {
                        let icon = 'Phone 📱';
                        if (name.includes('iPad')) icon = 'Tablet 💊';
                        devices.push({ udid, name, version, isDevice, icon });
                    }
                    break;
                case TVOS:
                    if (name.includes('Apple TV') || isDevice) {
                        devices.push({ udid, name, version, isDevice, icon: 'TV 📺' });
                    }
                    break;
                default:
                    devices.push({ udid, name, version, isDevice });
                    break;
                }
            }
        }
    });

    return devices;
};

// Resolve or reject will not be called so this will keep running
const runAppleLog = c => new Promise(() => {
    const filter = c.program.filter || 'RNV';
    const child = child_process.execFile(
        'xcrun',
        ['simctl', 'spawn', 'booted', 'log', 'stream', '--predicate', `eventMessage contains \"${filter}\"`],
        { stdio: 'inherit', customFds: [0, 1, 2] },
    );
        // use event hooks to provide a callback to execute when data are available:
    child.stdout.on('data', (data) => {
        const d = data.toString();
        if (d.toLowerCase().includes('error')) {
            console.log(chalk.red(d));
        } else if (d.toLowerCase().includes('success')) {
            console.log(chalk.green(d));
        } else {
            console.log(d);
        }
    });
});

export {
    runPod,
    copyAppleAssets,
    configureXcodeProject,
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    listAppleDevices,
    launchAppleSimulator,
    runAppleLog,
    prepareXcodeProject,
};
