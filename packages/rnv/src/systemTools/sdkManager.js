import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
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
    SDK_PLATFORMS
} from '../constants';
import { isWin } from '../common';
import {
    getRealPath
} from './fileutils';
import {
    logTask, logWarning
} from './logger';

const _logSdkWarning = (c) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureAndroidSdks = async (c) => {
    const sdk = c.files.workspace.config?.sdks?.ANDROID_SDK;
    const isWindows = isWin(c);
    if (sdk) {
        c.cli[CLI_ANDROID_EMULATOR] = getRealPath(c, path.join(sdk, `emulator/emulator${isWindows ? '.exe' : ''}`));
        c.cli[CLI_ANDROID_ADB] = getRealPath(c, path.join(sdk, `platform-tools/adb${isWindows ? '.exe' : ''}`));
        c.cli[CLI_ANDROID_AVDMANAGER] = getRealPath(c, path.join(sdk, `tools/bin/avdmanager${isWindows ? '.bat' : ''}`));
        c.cli[CLI_ANDROID_SDKMANAGER] = getRealPath(c, path.join(sdk, `tools/bin/sdkmanager${isWindows ? '.bat' : ''}`));
    } else {
    // TODO: FIX
    }
};

export const checkAndConfigureTizenSdks = async (c) => {
    const sdk = c.files.workspace.config?.sdks?.TIZEN_SDK;
    const isWindows = isWin(c);
    if (sdk) {
        c.cli[CLI_TIZEN_EMULATOR] = getRealPath(c, path.join(sdk, `tools/emulator/bin/em-cli${isWindows ? '.bat' : ''}`));
        c.cli[CLI_TIZEN] = getRealPath(c, path.join(sdk, `tools/ide/bin/tizen${isWindows ? '.bat' : ''}`));
        c.cli[CLI_SDB_TIZEN] = getRealPath(c, path.join(sdk, `tools/sdb${isWindows ? '.exe' : ''}`));
    } else {
    // TODO: FIX
    }
};

export const checkAndConfigureWebosSdks = async (c) => {
    const sdk = c.files.workspace.config?.sdks?.WEBOS_SDK;
    const isWindows = isWin(c);
    if (sdk) {
        c.cli[CLI_WEBOS_ARES] = getRealPath(c, path.join(sdk, `CLI/bin/ares${isWindows ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_PACKAGE] = getRealPath(c, path.join(sdk, `CLI/bin/ares-package${isWindows ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_INSTALL] = getRealPath(c, path.join(sdk, `CLI/bin/ares-install${isWindows ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_LAUNCH] = getRealPath(c, path.join(sdk, `CLI/bin/ares-launch${isWindows ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = getRealPath(c, path.join(sdk, `CLI/bin/ares-setup-device${isWindows ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = getRealPath(c, path.join(sdk, `CLI/bin/ares-device-info${isWindows ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_NOVACOM] = getRealPath(c, path.join(sdk, `CLI/bin/ares-novacom${isWindows ? '.cmd' : ''}`));
    } else {
    // TODO: FIX
    }
};

export const checkAndConfigureSdks = async (c) => {
    logTask(`checkAndConfigureSdks:${c.platform}`);

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

const _getCurrentSdkPath = c => c.files.workspace?.config?.sdks?.[SDK_PLATFORMS[c.platform]];

const _isSdkInstalled = (c) => {
    logTask(`_isSdkInstalled: ${c.platform}`);

    const sdkPath = _getCurrentSdkPath(c, c.platform);

    return fs.existsSync(getRealPath(c, sdkPath));
};

export const checkSdk = (c, reject) => {
    if (!_isSdkInstalled(c)) {
        const err = `${c.platform} requires SDK to be installed. check your ${chalk.white(c.paths.workspace.config)} file if you SDK path is correct. current value is ${chalk.white(_getCurrentSdkPath(c))}`;
        if (reject) {
            reject(err);
        } else {
            throw new Error(err);
        }
        return false;
    }
    return true;
};

// usr/local/android-sdk
// ~/Library/Android/sdk
// ~\AppData\Local\Android\android-sdk
// ~\AppData\Local\Android\sdk
// C:\Program Files (x86)\Android\android-sdk
