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

export const Tasks = [
    taskTargetLaunch,
    taskTargetList,
    taskCryptoInstallCerts,
    taskCryptoUpdateProfile,
    taskCryptoUpdateProfiles,
    taskCryptoInstallProfiles,
];
