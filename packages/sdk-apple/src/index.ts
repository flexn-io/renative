export * from './deviceManager';
export * from './runner';
export * from './ejector';
export * from './fastlane';
import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';
import taskCryptoInstallCerts from './tasks/taskCryptoInstallCerts';
import taskCryptoUpdateProfile from './tasks/taskCryptoUpdateProfile';
import taskCryptoUpdateProfiles from './tasks/taskCryptoUpdateProfiles';
import taskCryptoInstallProfiles from './tasks/taskCryptoInstallProfiles';
import taskLog from './tasks/taskLog';
import taskExport from './tasks/taskExport';
import taskPackage from './tasks/taskPackage';
import taskConfigure from './tasks/taskConfigure';
import taskRun from './tasks/taskRun';
import taskBuild from './tasks/taskBuild';
import { GetContextType, createRnvModule } from '@rnv/core';
import { Payload } from './types';

const RnvModule = createRnvModule({
    tasks: [
        taskTargetLaunch,
        taskTargetList,
        taskCryptoInstallCerts,
        taskCryptoUpdateProfile,
        taskCryptoUpdateProfiles,
        taskCryptoInstallProfiles,
        taskLog,
        taskExport,
        taskPackage,
        taskConfigure,
        taskRun,
        taskBuild,
    ],
    name: '@rnv/sdk-apple',
    type: 'internal',
    contextPayload: {
        pluginConfigiOS: {
            podfileHeader: '',
            podfileNodeRequire: '',
            podfileInject: '',
            podPostInstall: '',
            staticFrameworks: [],
            exportOptions: '',
            embeddedFonts: [],
            embeddedFontSources: [],
            ignoreProjectFonts: [],
            pluginAppDelegateHImports: '',
            pluginAppDelegateHMethods: '',
            pluginAppDelegateHExtensions: '',
            pluginAppDelegateMmImports: '',
            pluginAppDelegateMmMethods: '',
            appDelegateMmMethods: {
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
                    continue: [],
                    didConnectCarInterfaceController: [],
                    didDisconnectCarInterfaceController: [],
                },
                userNotificationCenter: {
                    willPresent: [],
                    didReceiveNotificationResponse: [],
                },
            },
            podfileSources: '',
            deploymentTarget: '',
        },
    } as Payload,
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
