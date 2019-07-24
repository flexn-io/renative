/* eslint-disable import/no-cycle */
// @todo fix circular dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';
import { executeAsync } from '../systemTools/exec';
import { isObject } from '../systemTools/objectUtils';
import { createPlatformBuild } from '../cli/platform';
import { launchAppleSimulator, getAppleDevices } from './apple/deviceManager';
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
        if (rejectOnFail) return reject(`Location ${cwd} does not exists!`);
        logError(`Location ${cwd} does not exists!`);
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
                if (rejectOnFail) {
                    logWarning(e);
                    return reject(e);
                }
                logError(e);
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
        const devicesArr = getAppleDevices(c, platform, false, true);
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
            const run = (selectedDevice) => {
                logDebug(`Selected device: ${JSON.stringify(selectedDevice, null, 3)}`);
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

                logDebug(`RN params: ${p}`);

                if (bundleAssets) {
                    logDebug('Assets will be bundled');
                    packageBundleForXcode(c, platform, bundleIsDev)
                        .then(v => executeAsync('react-native', p))
                        .then(() => resolve())
                        .catch(e => reject(e));
                } else {
                    executeAsync('react-native', p)
                        .then(() => resolve())
                        .catch(e => reject(e));
                }
            };

            if (c.program.target) {
                const selectedDevice = devicesArr.find(d => d.name === c.program.target);
                if (selectedDevice) {
                    run(selectedDevice);
                } else {
                    reject(`Could not find device ${c.program.target}`);
                }
                return;
            }

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
                    run(selectedDevice);
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
    const runScheme = getConfigProp(c, platform, 'runScheme', 'Debug');
    let sdk = getConfigProp(c, platform, 'sdk');
    if (!sdk) {
        sdk = platform === IOS ? 'iphoneos' : 'tvos';
    }
    // else if (sdk === 'iphonesimulator') {
    //     sdk += ' ONLY_ACTIVE_ARCH=NO';
    // }
    const sdkArr = [sdk];
    // if (sdk === 'iphonesimulator') {
    //     sdkArr.push('ONLY_ACTIVE_ARCH=NO');
    // }

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    const scheme = getConfigProp(c, platform, 'scheme');
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const exportPathArchive = `${exportPath}/${scheme}.xcarchive`;
    const p = [
        '-workspace',
        `${appPath}/${appFolderName}.xcworkspace`,
        '-scheme',
        scheme,
        '-sdk',
        ...sdkArr,
        '-configuration',
        runScheme,
        'archive',
        '-archivePath',
        exportPathArchive
    ];

    if (allowProvisioningUpdates) p.push('-allowProvisioningUpdates');
    if (ignoreLogs) p.push('-quiet');
    // if (sdk === 'iphonesimulator') p.push('ONLY_ACTIVE_ARCH=NO', "-destination='name=iPhone 7,OS=10.2'");


    logDebug('running', p);

    logTask('archiveXcodeProject: STARTING xcodebuild ARCHIVE...');


    _workerTimer = setInterval(_archiveLogger, 30000);

    if (c.files.appConfigFile.platforms[platform].runScheme === 'Release') {
        packageBundleForXcode(c, platform, bundleIsDev)
            .then(() => executeAsync('xcodebuild', p))
            .then(() => {
                logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
                clearInterval(_workerTimer);
                resolve();
            })
            .catch((e) => {
                clearInterval(_workerTimer);
                reject(e);
            });
    } else {
        executeAsync('xcodebuild', p)
            .then(() => {
                logSuccess(`Your Archive is located in ${chalk.white(exportPath)} .`);
                clearInterval(_workerTimer);
                resolve();
            })
            .catch((e) => {
                clearInterval(_workerTimer);
                reject(e);
            });
    }
});

let _workerTimer;
const _archiveLogger = () => {
    console.log(`ARCHIVING .... ${(new Date()).toLocaleString()}`);
};

const exportXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`exportXcodeProject:${platform}`);

    const appPath = getAppFolder(c, platform);
    const exportPath = path.join(appPath, 'release');

    const scheme = getConfigProp(c, platform, 'scheme');
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const ignoreLogs = getConfigProp(c, platform, 'ignoreLogs');
    const p = [
        '-exportArchive',
        '-archivePath',
        `${exportPath}/${scheme}.xcarchive`,
        '-exportOptionsPlist',
        `${appPath}/exportOptions.plist`,
        '-exportPath',
        `${exportPath}`,
    ];
    if (allowProvisioningUpdates) p.push('-allowProvisioningUpdates');
    if (ignoreLogs) p.push('-quiet');
    logDebug('running', p);

    logTask('exportXcodeProject: STARTING xcodebuild EXPORT...');

    executeAsync('xcodebuild', p)
        .then(() => {
            logSuccess(`Your IPA is located in ${chalk.white(exportPath)} .`);
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

    // INJECTORS
    c.pluginConfigiOS = {
        podfileInject: ''
    };

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

const _postConfigureProject = (c, platform, appFolder, appFolderName, isBundled = false, ip = 'localhost', port = 8081) => new Promise((resolve) => {
    logTask(`_postConfigureProject:${platform}:${ip}:${port}`);
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

    writeCleanFile(path.join(appTemplateFolder, 'exportOptions.plist'), path.join(appFolder, 'exportOptions.plist'), [
        { pattern: '{{TEAM_ID}}', override: tId },
    ]);

    // XCSCHEME
    const poisxSpawn = runScheme === 'Release' && !allowProvisioningUpdates && provisioningStyle === 'Manual';

    const debuggerId = poisxSpawn ? '' : 'Xcode.DebuggerFoundation.Debugger.LLDB';
    const launcherId = poisxSpawn ? 'Xcode.IDEFoundation.Launcher.PosixSpawn' : 'Xcode.DebuggerFoundation.Launcher.LLDB';
    const schemePath = `${appFolderName}.xcodeproj/xcshareddata/xcschemes/${appFolderName}.xcscheme`;
    writeCleanFile(path.join(appTemplateFolder, schemePath), path.join(appFolder, schemePath), [
        { pattern: '{{PLUGIN_DEBUGGER_ID}}', override: debuggerId },
        { pattern: '{{PLUGIN_LAUNCHER_ID}}', override: launcherId },
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

        const provisionProfileSpecifier = getConfigProp(c, platform, 'provisionProfileSpecifier');
        if (provisionProfileSpecifier) {
            xcodeProj.updateBuildProperty('PROVISIONING_PROFILE_SPECIFIER', `"${provisionProfileSpecifier}"`);
        }

        const codeSignIdentity = getConfigProp(c, platform, 'codeSignIdentity');
        if (codeSignIdentity) {
            const runScheme = getConfigProp(c, platform, 'runScheme');
            const bc = xcodeProj.pbxXCBuildConfigurationSection();

            // xcodeProj.updateBuildProperty('CODE_SIGN_IDENTITY', `"${codeSignIdentity}"`, runScheme);
            // xcodeProj.updateBuildProperty('"CODE_SIGN_IDENTITY[sdk=iphoneos*]"', `"${codeSignIdentity}"`, runScheme);
            const cs1 = 'CODE_SIGN_IDENTITY';
            const cs2 = '"CODE_SIGN_IDENTITY[sdk=iphoneos*]"';
            for (const configName in bc) {
                const config = bc[configName];
                if ((runScheme && config.name === runScheme) || (!runScheme)) {
                    if (config.buildSettings[cs1]) config.buildSettings[cs1] = `"${codeSignIdentity}"`;
                    if (config.buildSettings[cs2]) config.buildSettings[cs2] = `"${codeSignIdentity}"`;
                }
            }
        }


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
        parsePlugins(c, platform, (plugin, pluginPlat, key) => {
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

const _injectPod = (podName, pluginPlat, plugin, key) => {
    let pluginInject = '';
    const isNpm = plugin['no-npm'] !== true;
    if (isNpm) {
        const podPath = pluginPlat.path ? `../../${pluginPlat.path}` : `../../node_modules/${key}`;
        pluginInject += `  pod '${podName}', :path => '${podPath}'\n`;
    } else if (pluginPlat.git) {
        const commit = pluginPlat.commit ? `, :commit => '${pluginPlat.commit}'` : '';
        pluginInject += `  pod '${podName}', :git => '${pluginPlat.git}'${commit}\n`;
    } else if (pluginPlat.version) {
        pluginInject += `  pod '${podName}', '${pluginPlat.version}'\n`;
    } else {
        pluginInject += `  pod '${podName}'\n`;
    }
    return pluginInject;
};

const _parsePodFile = (c, platform) => {
    logTask(`_parsePodFile:${platform}`);

    const appFolder = getAppFolder(c, platform);
    let pluginSubspecs = '';
    let pluginInject = '';

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        if (pluginPlat.podName) {
            pluginInject += _injectPod(pluginPlat.podName, pluginPlat, plugin, key);
        }
        if (pluginPlat.podNames) {
            pluginPlat.podNames.forEach((v) => {
                pluginInject += _injectPod(v, pluginPlat, plugin, key);
            });
        }

        if (pluginPlat.reactSubSpecs) {
            pluginPlat.reactSubSpecs.forEach((v) => {
                if (!pluginSubspecs.includes(`'${v}'`)) {
                    pluginSubspecs += `  '${v}',\n`;
                }
            });
        }

        if (pluginPlat.Podfile) {
            const injectLines = pluginPlat.Podfile.injectLines;
            if (injectLines) {
                injectLines.forEach((v) => {
                    console.log('SJHSKJSHKJ', v);
                    c.pluginConfigiOS.podfileInject += `${v}\n`;
                });
            }
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

    // WARNINGS
    const ignoreWarnings = getConfigProp(c, platform, 'ignoreWarnings');
    const podWarnings = ignoreWarnings ? 'inhibit_all_warnings!' : '';

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), 'Podfile'), path.join(appFolder, 'Podfile'), [
        { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        { pattern: '{{PLUGIN_SUBSPECS}}', override: pluginSubspecs },
        { pattern: '{{PLUGIN_WARNINGS}}', override: podWarnings },
        { pattern: '{{PLUGIN_PODFILE_INJECT}}', override: c.pluginConfigiOS.podfileInject },
    ]);
};

const _parseEntitlements = (c, platform) => {
    logTask(`_parseEntitlements:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = _getAppFolderName(c, platform);
    const entitlementsPath = path.join(appFolder, `${appFolderName}/${appFolderName}.entitlements`);
    // PLUGIN ENTITLEMENTS
    let pluginsEntitlementsObj = getConfigProp(c, platform, 'entitlements');
    if (!pluginsEntitlementsObj) {
        pluginsEntitlementsObj = readObjectSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/supportFiles/entitlements.json'));
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
    let plistObj = readObjectSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/supportFiles/info.plist.json'));
    plistObj.CFBundleDisplayName = getAppTitle(c, platform);
    plistObj.CFBundleShortVersionString = getAppVersion(c, platform);
    // FONTS
    if (embeddedFonts.length) {
        plistObj.UIAppFonts = embeddedFonts;
    }
    // PERMISSIONS
    const pluginPermissions = '';
    if (permissions) {
        if (permissions.length && permissions[0] === '*') {
            if (c.files.permissionsConfig) {
                const plat = c.files.permissionsConfig.permissions[platform] ? platform : 'ios';
                const pc = c.files.permissionsConfig.permissions[plat];
                for (const v in pc) {
                    plistObj[pc[v].key] = pc[v].desc;
                }
            }
        } else {
            permissions.forEach((v) => {
                if (c.files.permissionsConfig) {
                    const plat = c.files.permissionsConfig.permissions[platform] ? platform : 'ios';
                    const pc = c.files.permissionsConfig.permissions[plat];
                    if (pc[v]) {
                        plistObj[pc[v].key] = pc[v].desc;
                    }
                }
            });
        }
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
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
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

    const devicesArr = getAppleDevices(c, platform);
    let devicesString = '\n';
    devicesArr.forEach((v, i) => {
        devicesString += `-[${i + 1}] ${chalk.white(v.name)} | ${v.icon} | v: ${chalk.green(v.version)} | udid: ${chalk.blue(v.udid)}${
            v.isDevice ? chalk.red(' (device)') : ''
        }\n`;
    });
    console.log(devicesString);
});

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
