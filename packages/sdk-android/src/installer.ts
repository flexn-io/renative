import path from 'path';
import {
    isSystemWin,
    getRealPath,
    writeFileSync,
    fsExistsSync,
    fsReaddirSync,
    fsLstatSync,
    chalk,
    logDefault,
    logWarning,
    logSuccess,
    logError,
    logInfo,
    generateBuildConfig,
    RnvContext,
    inquirerPrompt,
    ConfigFileWorkspace,
    getContext,
} from '@rnv/core';

import { CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_ANDROID_AVDMANAGER, CLI_ANDROID_SDKMANAGER } from './constants';

type SDKKey = keyof Required<Required<ConfigFileWorkspace>['workspace']>['sdks'];

const getSdkLocations = () => {
    const ctx = getContext();
    const { homeDir } = ctx.paths.user;
    const SDK_LOCATIONS: Record<string, Array<string>> = {
        android: [
            path.join('/usr/local/android-sdk'),
            path.join(homeDir, 'Library/Android/sdk'),
            path.join(homeDir, 'AppData/Local/Android/android-sdk'),
            path.join(homeDir, 'AppData/Local/Android/sdk'),
            path.join('Program Files (x86)/Android/android-sdk'),
        ],
        'android-ndk': [
            path.join('/usr/local/android-sdk/ndk'),
            path.join(homeDir, 'Library/Android/sdk/ndk'),
            path.join(homeDir, 'AppData/Local/Android/android-sdk/ndk'),
            path.join(homeDir, 'AppData/Local/Android/sdk/ndk'),
            path.join('Program Files (x86)/Android/android-sdk/ndk'),
            path.join('/usr/local/android-sdk/ndk-bundle'),
            path.join(homeDir, 'Library/Android/sdk/ndk-bundle'),
            path.join(homeDir, 'AppData/Local/Android/android-sdk/ndk-bundle'),
            path.join(homeDir, 'AppData/Local/Android/sdk/ndk-bundle'),
            path.join('Program Files (x86)/Android/android-sdk/ndk-bundle'),
        ],
    };
    return SDK_LOCATIONS;
};

const _logSdkWarning = (c: RnvContext) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureAndroidSdks = async () => {
    const c = getContext();
    const sdk = c.buildConfig?.sdks?.ANDROID_SDK;
    logDefault('checkAndConfigureAndroidSdks', `(${sdk})`);

    if (!sdk) return _logSdkWarning(c);

    let sdkManagerPath = getRealPath(path.join(sdk, `cmdline-tools/latest/bin/sdkmanager${isSystemWin ? '.bat' : ''}`));

    if (!fsExistsSync(sdkManagerPath)) {
        sdkManagerPath = getRealPath(path.join(sdk, `tools/bin/sdkmanager${isSystemWin ? '.bat' : ''}`));
    }

    let avdManagerPath = getRealPath(path.join(sdk, `cmdline-tools/latest/bin/avdmanager${isSystemWin ? '.bat' : ''}`));

    if (!fsExistsSync(avdManagerPath)) {
        avdManagerPath = getRealPath(path.join(sdk, `tools/bin/avdmanager${isSystemWin ? '.bat' : ''}`));
    }

    c.cli[CLI_ANDROID_EMULATOR] = getRealPath(path.join(sdk, `emulator/emulator${isSystemWin ? '.exe' : ''}`));
    c.cli[CLI_ANDROID_ADB] = getRealPath(path.join(sdk, `platform-tools/adb${isSystemWin ? '.exe' : ''}`));
    c.cli[CLI_ANDROID_AVDMANAGER] = avdManagerPath;
    c.cli[CLI_ANDROID_SDKMANAGER] = sdkManagerPath;
};

const _getCurrentSdkPath = (c: RnvContext) => (c.platform ? c.buildConfig?.sdks?.ANDROID_SDK : undefined);

const _isSdkInstalled = (c: RnvContext) => {
    logDefault('_isSdkInstalled');

    if (!c.platform) return false;

    const sdkPath = _getCurrentSdkPath(c);

    return fsExistsSync(getRealPath(sdkPath));
};

const _findFolderWithFile = (dir: string, fileToFind: string) => {
    const opt = path.join(dir, fileToFind);
    if (fsExistsSync(opt)) {
        return dir;
    }
    let foundDir;
    fsReaddirSync(dir).forEach((subDirName: string) => {
        // not a directory check
        const subDir = path.join(dir, subDirName);
        if (!fsLstatSync(subDir).isDirectory()) return;
        const foundSubDir = _findFolderWithFile(subDir, fileToFind);
        if (foundSubDir) {
            foundDir = foundSubDir;
        }
    });
    return foundDir;
};

const _attemptAutoFix = async (c: RnvContext, sdkPlatform: string, sdkKey: SDKKey, traverseUntilFoundFile?: string) => {
    logDefault('_attemptAutoFix');

    if (c.program.opts().hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    let locations: Array<string | undefined> = getSdkLocations()[sdkPlatform];

    // try common Android SDK env variables
    if (sdkKey === 'ANDROID_SDK') {
        const { ANDROID_SDK_HOME, ANDROID_SDK_ROOT, ANDROID_HOME, ANDROID_SDK: ANDROID_SDK_ENV } = process.env;
        locations = locations.concat([ANDROID_SDK_HOME, ANDROID_SDK_ROOT, ANDROID_HOME, ANDROID_SDK_ENV]);
    }

    if (sdkKey === 'ANDROID_NDK') {
        const { ANDROID_NDK_HOME } = process.env;
        locations.push(ANDROID_NDK_HOME);
    }

    let result = locations.find((v) => fsExistsSync(v));

    if (result && traverseUntilFoundFile) {
        const subResult = _findFolderWithFile(result, traverseUntilFoundFile);
        if (subResult) {
            result = subResult;
        } else {
            // result = null;
        }
    }

    if (result) {
        logSuccess(`Found existing ${chalk().bold.white(sdkKey)} location at ${chalk().bold.white(result)}`);
        let confirmSdk = true;
        if (!c.program.opts().ci) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to use it?',
            });
            confirmSdk = confirm;
        }

        if (confirmSdk && c.files.workspace.config) {
            try {
                if (!c.files.workspace.config?.workspace?.sdks) {
                    c.files.workspace.config.workspace.sdks = {};
                }
                c.files.workspace.config.workspace.sdks[sdkKey] = result;
                writeFileSync(c.paths.workspace.config, c.files.workspace.config);
                generateBuildConfig();
                await checkAndConfigureAndroidSdks();
            } catch (e) {
                logError(e);
            }

            return true;
        }
    }

    logDefault(`_attemptAutoFix: no sdks found. searched at: ${getSdkLocations()[sdkPlatform].join(', ')}`);

    // const setupInstance = PlatformSetup(c);
    // await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig();
    return true;
};

export const checkAndroidSdk = async () => {
    const c = getContext();
    logDefault('checkAndroidSdk');

    if (!_isSdkInstalled(c)) {
        logWarning(
            `${c.platform} platform requires Android SDK to be installed. Your SDK path in ${chalk().bold.white(
                c.paths.workspace.config
            )} does not exist: ${chalk().bold.white(_getCurrentSdkPath(c))}`
        );

        await _attemptAutoFix(c, 'android', 'ANDROID_SDK');
        return _attemptAutoFix(c, 'android-ndk', 'ANDROID_NDK', 'source.properties');
    } else {
        await checkAndConfigureAndroidSdks();
    }
    return true;
};
