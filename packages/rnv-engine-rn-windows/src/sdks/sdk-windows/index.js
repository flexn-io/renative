

import { Common, Exec, Logger, Resolver, ProjectManager } from 'rnv';

const { logTask } = Logger;
const { executeAsync } = Exec;
const { getAppFolder } = Common;
const { doResolve } = Resolver;
const { copyBuildsFolder } = ProjectManager;

export const ruWindowsProject = async (c) => {
    logTask('runWindowsProject');
    const appPath = getAppFolder(c, c.platform);

    const cmd = `node ${doResolve(
        '@react-native-windows/cli'
    )}/lib-commonjs/index.js run-windows --proj ${appPath} --logging`;

    await executeAsync(c, cmd);
    return true;
};

export const configureWindowsProject = async (c) => {
    logTask('configureXcodeProject');
    // const { device } = c.program;
    const { platform } = c;
    // const bundlerIp = device ? getIP() : 'localhost';
    const appFolder = getAppFolder(c);
    c.runtime.platformBuildsProjectPath = `${appFolder}/RNVApp.xcworkspace`;
    // const appFolderName = getAppFolderName(c, platform);
    // const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    // INJECTORS
    c.pluginConfigiOS = {
        podfileInject: '',
        podPostInstall: '',
        staticPodExtraConditions: '',
        staticFrameworks: [],
        staticPodDefinition: '',
        exportOptions: '',
        embeddedFonts: [],
        embeddedFontSources: [],
        ignoreProjectFonts: [],
        pluginAppDelegateImports: '',
        pluginAppDelegateMethods: '',
        appDelegateMethods: {
            application: {
                didFinishLaunchingWithOptions: [],
                applicationDidBecomeActive: [],
                open: [],
                supportedInterfaceOrientationsFor: [],
                didReceiveRemoteNotification: [],
                didFailToRegisterForRemoteNotificationsWithError: [],
                didReceive: [],
                didRegister: [],
                didRegisterForRemoteNotificationsWithDeviceToken: [],
                continue: []
            },
            userNotificationCenter: {
                willPresent: []
            }
        },
        podfileSources: []
    };

    // FONTS
    // parsePlugins(c, platform, (plugin, pluginPlat) => {
    //     // const ignoreProjectFonts = getFlavouredProp(
    //     //     c,
    //     //     pluginPlat,
    //     //     'ignoreProjectFonts'
    //     // );
    //
    //     // TODO: enable this once mmoved to modular_headers Podfile
    //     // if (ignoreProjectFonts) {
    //     //     ignoreProjectFonts.forEach((v) => {
    //     //         if (!c.pluginConfigiOS.ignoreProjectFonts.includes(v)) {
    //     //             logDebug(`Igonoring font: ${v}`);
    //     //             c.pluginConfigiOS.ignoreProjectFonts.push(v);
    //     //         }
    //     //     });
    //     // }
    // });

    // await copyAssetsFolder(c, platform, platform === TVOS ? 'RNVAppTVOS' : 'RNVApp');
    // await copyAppleAssets(c, platform, appFolderName);
    // await parseAppDelegate(
    //     c,
    //     platform,
    //     appFolder,
    //     appFolderName,
    //     bundleAssets,
    //     bundlerIp
    // );
    // await parseExportOptionsPlist(c, platform);
    // await parseXcscheme(c, platform);
    // await parsePodFile(c, platform);
    // await parseEntitlementsPlist(c, platform);
    // await parseInfoPlist(c, platform);
    await copyBuildsFolder(c, platform);
    // await runCocoaPods(c);
    // await parseXcodeProject(c, platform);
    return true;
};
