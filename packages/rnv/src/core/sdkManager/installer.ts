import path from 'path';
import inquirer from 'inquirer';
import {
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
    ANDROID,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    SDK_PLATFORMS,
    ANDROID_SDK,
    TIZEN_SDK,
    WEBOS_SDK,
    ANDROID_NDK,
    USER_HOME_DIR,
} from '../constants';
import { isSystemWin } from '../systemManager/utils';
import { getRealPath, writeFileSync, fsExistsSync, fsReaddirSync, fsLstatSync } from '../systemManager/fileutils';
import { chalk, logTask, logWarning, logSuccess, logError, logInfo } from '../systemManager/logger';
import PlatformSetup from '../setupManager';
import { generateBuildConfig } from '../configManager';
import { RnvConfig } from '../configManager/types';

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
    tizen: [
        path.join('usr/local/tizen-studio'),
        path.join(USER_HOME_DIR, 'tizen-studio'),
        path.join('C:\\tizen-studio'),
    ],
    webos: [path.join('/opt/webOS_TV_SDK'), path.join('C:\\webOS_TV_SDK')],
};

const _logSdkWarning = (c: RnvConfig) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureAndroidSdks = async (c: RnvConfig) => {
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

export const checkAndConfigureTizenSdks = async (c: RnvConfig) => {
    logTask(`checkAndConfigureTizenSdks:${c.platform}`);
    const sdk = c.buildConfig?.sdks?.TIZEN_SDK;
    if (sdk) {
        c.cli[CLI_TIZEN_EMULATOR] = getRealPath(
            c,
            path.join(sdk, `tools/emulator/bin/em-cli${isSystemWin ? '.bat' : ''}`)
        );
        c.cli[CLI_TIZEN] = getRealPath(c, path.join(sdk, `tools/ide/bin/tizen${isSystemWin ? '.bat' : ''}`));
        c.cli[CLI_SDB_TIZEN] = getRealPath(c, path.join(sdk, `tools/sdb${isSystemWin ? '.exe' : ''}`));
    } else {
        _logSdkWarning(c);
    }
};

export const checkAndConfigureWebosSdks = async (c: RnvConfig) => {
    logTask(`checkAndConfigureWebosSdks:${c.platform}`);
    const sdk = c.buildConfig?.sdks?.WEBOS_SDK;
    if (sdk) {
        c.cli[CLI_WEBOS_ARES] = getRealPath(c, path.join(sdk, `CLI/bin/ares${isSystemWin ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_PACKAGE] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-package${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_INSTALL] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-install${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_LAUNCH] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-launch${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-setup-device${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-device-info${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_NOVACOM] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-novacom${isSystemWin ? '.cmd' : ''}`)
        );
    } else {
        _logSdkWarning(c);
    }
};

export const checkAndConfigureSdks = async (c: RnvConfig) => {
    logTask('checkAndConfigureSdks');

    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return checkAndConfigureAndroidSdks(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return checkAndConfigureTizenSdks(c);
        case WEBOS:
            return checkAndConfigureWebosSdks(c);
        default:
            return true;
    }
};

const _getCurrentSdkPath = (c: RnvConfig) => c.buildConfig?.sdks?.[SDK_PLATFORMS[c.platform]];

const _isSdkInstalled = (c: RnvConfig) => {
    logTask('_isSdkInstalled');

    if (!SDK_PLATFORMS[c.platform]) return true;

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

const _attemptAutoFix = async (c: RnvConfig, sdkPlatform: string, sdkKey: string, traverseUntilFoundFile?: string) => {
    logTask('_attemptAutoFix');

    if (c.program.hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    let locations: Array<string | undefined> = SDK_LOCATIONS[sdkPlatform];

    // try common Android SDK env variables
    if (sdkKey === ANDROID_SDK) {
        const { ANDROID_SDK_HOME, ANDROID_SDK_ROOT, ANDROID_HOME, ANDROID_SDK: ANDROID_SDK_ENV } = process.env;
        locations = locations.concat([ANDROID_SDK_HOME, ANDROID_SDK_ROOT, ANDROID_HOME, ANDROID_SDK_ENV]);
    }

    if (sdkKey === ANDROID_NDK) {
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
            const { confirm } = await inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to use it?',
            });
            confirmSdk = confirm;
        }

        if (confirmSdk) {
            try {
                if (!c.files.workspace.config.sdks) c.files.workspace.config.sdks = {};
                c.files.workspace.config.sdks[sdkKey] = result;
                writeFileSync(c.paths.workspace.config, c.files.workspace.config);
                generateBuildConfig(c);
                await checkAndConfigureSdks(c);
            } catch (e: any) {
                logError(e);
            }

            return true;
        }
    }

    logTask(`_attemptAutoFix: no sdks found. searched at: ${SDK_LOCATIONS[sdkPlatform].join(', ')}`);

    const setupInstance = PlatformSetup(c);
    await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig(c);
    return true;
};

export const checkSdk = async (c: RnvConfig) => {
    logTask('checkSdk');
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
                await _attemptAutoFix(c, 'android', ANDROID_SDK);
                return _attemptAutoFix(c, 'android-ndk', ANDROID_NDK, 'source.properties');
            case TIZEN:
            case TIZEN_MOBILE:
            case TIZEN_WATCH:
                return _attemptAutoFix(c, 'tizen', TIZEN_SDK);
            case WEBOS:
                return _attemptAutoFix(c, 'webos', WEBOS_SDK);
            default:
                return true;
        }
    } else {
        await checkAndConfigureAndroidSdks(c);
    }
    return true;
};
