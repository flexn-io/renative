import path from 'path';
import {
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    USER_HOME_DIR,
    isSystemWin,
    getRealPath,
    writeFileSync,
    fsExistsSync,
    fsReaddirSync,
    fsLstatSync,
    chalk,
    logTask,
    logWarning,
    logSuccess,
    logError,
    logInfo,
    generateBuildConfig,
    inquirerPrompt,
    ConfigFileWorkspace,
} from '@rnv/core';

import { CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_ANDROID_AVDMANAGER, CLI_ANDROID_SDKMANAGER } from './constants';
import { Context } from './types';

type SDKKey = keyof Required<ConfigFileWorkspace>['sdks'];

const SDK_LOCATIONS: Record<string, Array<string>> = {
    android: [
        path.join('/usr/local/android-sdk'),
        path.join(USER_HOME_DIR, 'Library/Android/sdk'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/android-sdk'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/sdk'),
        path.join('Program Files (x86)/Android/android-sdk'),
    ],
    'android-ndk': [
        path.join('/usr/local/android-sdk/ndk'),
        path.join(USER_HOME_DIR, 'Library/Android/sdk/ndk'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/android-sdk/ndk'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/sdk/ndk'),
        path.join('Program Files (x86)/Android/android-sdk/ndk'),
        path.join('/usr/local/android-sdk/ndk-bundle'),
        path.join(USER_HOME_DIR, 'Library/Android/sdk/ndk-bundle'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/android-sdk/ndk-bundle'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/sdk/ndk-bundle'),
        path.join('Program Files (x86)/Android/android-sdk/ndk-bundle'),
    ],
};

const _logSdkWarning = (c: Context) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureAndroidSdks = async (c: Context) => {
    const sdk = c.buildConfig?.sdks?.ANDROID_SDK;
    logTask('checkAndConfigureAndroidSdks', `(${sdk})`);

    if (!sdk) return _logSdkWarning(c);

    let sdkManagerPath = getRealPath(
        c,
        path.join(sdk, `cmdline-tools/latest/bin/sdkmanager${isSystemWin ? '.bat' : ''}`)
    );

    if (!fsExistsSync(sdkManagerPath)) {
        sdkManagerPath = getRealPath(c, path.join(sdk, `tools/bin/sdkmanager${isSystemWin ? '.bat' : ''}`));
    }

    let avdManagerPath = getRealPath(
        c,
        path.join(sdk, `cmdline-tools/latest/bin/avdmanager${isSystemWin ? '.bat' : ''}`)
    );

    if (!fsExistsSync(avdManagerPath)) {
        avdManagerPath = getRealPath(c, path.join(sdk, `tools/bin/avdmanager${isSystemWin ? '.bat' : ''}`));
    }

    c.cli[CLI_ANDROID_EMULATOR] = getRealPath(c, path.join(sdk, `emulator/emulator${isSystemWin ? '.exe' : ''}`));
    c.cli[CLI_ANDROID_ADB] = getRealPath(c, path.join(sdk, `platform-tools/adb${isSystemWin ? '.exe' : ''}`));
    c.cli[CLI_ANDROID_AVDMANAGER] = avdManagerPath;
    c.cli[CLI_ANDROID_SDKMANAGER] = sdkManagerPath;
};

const _getCurrentSdkPath = (c: Context) => (c.platform ? c.buildConfig?.sdks?.ANDROID_SDK : undefined);

const _isSdkInstalled = (c: Context) => {
    logTask('_isSdkInstalled');

    if (!c.platform) return false;

    const sdkPath = _getCurrentSdkPath(c);

    return fsExistsSync(getRealPath(c, sdkPath));
};

const _findFolderWithFile = (dir: string, fileToFind: string) => {
    const opt = path.join(dir, fileToFind);
    if (fsExistsSync(opt)) {
        return dir;
    }
    let foundDir;
    fsReaddirSync(dir).forEach((subDirName) => {
        // not a directory check
        if (!fsLstatSync(subDirName).isDirectory()) return;
        const subDir = path.join(dir, subDirName);
        const foundSubDir = _findFolderWithFile(subDir, fileToFind);
        if (foundSubDir) {
            foundDir = foundSubDir;
        }
    });
    return foundDir;
};

const _attemptAutoFix = async (c: Context, sdkPlatform: string, sdkKey: SDKKey, traverseUntilFoundFile?: string) => {
    logTask('_attemptAutoFix');

    if (c.program.hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    let locations: Array<string | undefined> = SDK_LOCATIONS[sdkPlatform];

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
        logSuccess(`Found existing ${c.platform} SDK location at ${chalk().white(result)}`);
        let confirmSdk = true;
        if (!c.program.ci) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to use it?',
            });
            confirmSdk = confirm;
        }

        if (confirmSdk && c.files.workspace.config) {
            try {
                if (!c.files.workspace.config?.sdks) c.files.workspace.config.sdks = {};
                c.files.workspace.config.sdks[sdkKey] = result;
                writeFileSync(c.paths.workspace.config, c.files.workspace.config);
                generateBuildConfig(c);
                await checkAndConfigureAndroidSdks(c);
            } catch (e) {
                logError(e);
            }

            return true;
        }
    }

    logTask(`_attemptAutoFix: no sdks found. searched at: ${SDK_LOCATIONS[sdkPlatform].join(', ')}`);

    // const setupInstance = PlatformSetup(c);
    // await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig(c);
    return true;
};

export const checkAndroidSdk = async (c: Context) => {
    logTask('checkAndroidSdk');
    if (!_isSdkInstalled(c)) {
        logWarning(
            `${c.platform} requires SDK to be installed. Your SDK path in ${chalk().white(
                c.paths.workspace.config
            )} does not exist: ${chalk().white(_getCurrentSdkPath(c))}`
        );

        switch (c.platform) {
            case ANDROID:
            case ANDROID_TV:
            case FIRE_TV:
            case ANDROID_WEAR:
                await _attemptAutoFix(c, 'android', 'ANDROID_SDK');
                return _attemptAutoFix(c, 'android-ndk', 'ANDROID_NDK', 'source.properties');
            default:
                return true;
        }
    } else {
        await checkAndConfigureAndroidSdks(c);
    }
    return true;
};
