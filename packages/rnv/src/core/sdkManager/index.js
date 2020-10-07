/* eslint-disable import/no-cycle */
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
    ANDROID_WEAR,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    SDK_PLATFORMS,
    USER_HOME_DIR
} from '../constants';
import { isSystemWin } from '../utils';
import { getRealPath, writeFileSync, fsExistsSync } from '../systemManager/fileutils';
import {
    chalk,
    logTask,
    logWarning,
    logSuccess,
    logError
} from '../systemManager/logger';
import PlatformSetup from '../setupManager';
import { generateBuildConfig } from '../configManager/configParser';

const SDK_LOACTIONS = {
    android: [
        path.join('/usr/local/android-sdk'),
        path.join(USER_HOME_DIR, 'Library/Android/sdk'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/android-sdk'),
        path.join(USER_HOME_DIR, 'AppData/Local/Android/sdk'),
        path.join('Program Files (x86)/Android/android-sdk')
    ],
    tizen: [
        path.join('usr/local/tizen-studio'),
        path.join(USER_HOME_DIR, 'tizen-studio'),
        path.join('C:\\tizen-studio')
    ],
    webos: [path.join('/opt/webOS_TV_SDK')]
};

const _logSdkWarning = (c) => {
    logWarning(
        `Your ${c.paths.workspace.config} is missing SDK configuration object`
    );
};

export const checkAndConfigureAndroidSdks = async (c) => {
    const sdk = c.buildConfig?.sdks?.ANDROID_SDK;
    logTask('checkAndConfigureAndroidSdks', `(${sdk})`);

    if (sdk) {
        c.cli[CLI_ANDROID_EMULATOR] = getRealPath(
            c,
            path.join(sdk, `emulator/emulator${isSystemWin ? '.exe' : ''}`)
        );
        c.cli[CLI_ANDROID_ADB] = getRealPath(
            c,
            path.join(sdk, `platform-tools/adb${isSystemWin ? '.exe' : ''}`)
        );
        c.cli[CLI_ANDROID_AVDMANAGER] = getRealPath(
            c,
            path.join(sdk, `tools/bin/avdmanager${isSystemWin ? '.bat' : ''}`)
        );
        c.cli[CLI_ANDROID_SDKMANAGER] = getRealPath(
            c,
            path.join(sdk, `tools/bin/sdkmanager${isSystemWin ? '.bat' : ''}`)
        );
    } else {
        _logSdkWarning(c);
    }
};

export const checkAndConfigureTizenSdks = async (c) => {
    logTask(`checkAndConfigureTizenSdks:${c.platform}`);
    const sdk = c.buildConfig?.sdks?.TIZEN_SDK;
    if (sdk) {
        c.cli[CLI_TIZEN_EMULATOR] = getRealPath(
            c,
            path.join(
                sdk,
                `tools/emulator/bin/em-cli${isSystemWin ? '.bat' : ''}`
            )
        );
        c.cli[CLI_TIZEN] = getRealPath(
            c,
            path.join(sdk, `tools/ide/bin/tizen${isSystemWin ? '.bat' : ''}`)
        );
        c.cli[CLI_SDB_TIZEN] = getRealPath(
            c,
            path.join(sdk, `tools/sdb${isSystemWin ? '.exe' : ''}`)
        );
    } else {
        _logSdkWarning(c);
    }
};

export const checkAndConfigureWebosSdks = async (c) => {
    logTask(`checkAndConfigureWebosSdks:${c.platform}`);
    const sdk = c.buildConfig?.sdks?.WEBOS_SDK;
    if (sdk) {
        c.cli[CLI_WEBOS_ARES] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares${isSystemWin ? '.cmd' : ''}`)
        );
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
            path.join(
                sdk,
                `CLI/bin/ares-setup-device${isSystemWin ? '.cmd' : ''}`
            )
        );
        c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = getRealPath(
            c,
            path.join(
                sdk,
                `CLI/bin/ares-device-info${isSystemWin ? '.cmd' : ''}`
            )
        );
        c.cli[CLI_WEBOS_ARES_NOVACOM] = getRealPath(
            c,
            path.join(sdk, `CLI/bin/ares-novacom${isSystemWin ? '.cmd' : ''}`)
        );
    } else {
        _logSdkWarning(c);
    }
};

export const checkAndConfigureSdks = async (c) => {
    logTask('checkAndConfigureSdks');

    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
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

const _getCurrentSdkPath = c => c.buildConfig?.sdks?.[SDK_PLATFORMS[c.platform]];

const _isSdkInstalled = (c) => {
    logTask('_isSdkInstalled');

    if (!SDK_PLATFORMS[c.platform]) return true;

    const sdkPath = _getCurrentSdkPath(c, c.platform);

    return fsExistsSync(getRealPath(c, sdkPath));
};

const _attemptAutoFix = async (c, sdkPlatform) => {
    logTask('_attemptAutoFix');
    const result = SDK_LOACTIONS[sdkPlatform].find(v => fsExistsSync(v));
    if (result) {
        logSuccess(
            `Found existing ${c.platform} SDK location at ${chalk().white(
                result
            )}`
        );
        let confirmSdk = true;
        if (!c.program.ci) {
            const { confirm } = await inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to use it?'
            });
            confirmSdk = confirm;
        }

        if (confirmSdk) {
            try {
                c.files.workspace.config.sdks[
                    SDK_PLATFORMS[c.platform]
                ] = result;
                if (sdkPlatform === 'android') {
                    c.files.workspace.config.sdks.ANDROID_NDK = `${path.join(result, 'ndk-bundle')}`;
                }
                writeFileSync(
                    c.paths.workspace.config,
                    c.files.workspace.config
                );
                generateBuildConfig(c);
                await checkAndConfigureSdks(c);
            } catch (e) {
                logError(e);
            }

            return true;
        }
    }

    logTask(`_attemptAutoFix: no sdks found. searched at: ${SDK_LOACTIONS[sdkPlatform].join(', ')}`);

    const setupInstance = PlatformSetup(c);
    await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig(c);
    return true;
};

export const checkSdk = async (c) => {
    logTask('checkSdk');
    if (!_isSdkInstalled(c)) {
        logWarning(
            `${
                c.platform
            } requires SDK to be installed. Your SDK path in ${chalk().white(
                c.paths.workspace.config
            )} does not exist: ${chalk().white(_getCurrentSdkPath(c))}`
        );

        switch (c.platform) {
            case ANDROID:
            case ANDROID_TV:
            case ANDROID_WEAR:
                return _attemptAutoFix(c, 'android');
            case TIZEN:
            case TIZEN_MOBILE:
            case TIZEN_WATCH:
                return _attemptAutoFix(c, 'tizen');
            case WEBOS:
                return _attemptAutoFix(c, 'webos');
            default:
                return true;
        }
    }
    return true;
};
