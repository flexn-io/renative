import path from 'path';
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
    CLI_WEBOS_ARES_DEVICE_INFO
} from '../constants';
import {
    getRealPath
} from './fileutils';
import {
    logTask, logWarning
} from './logger';

export const checkAndConfigureSdks = async (c) => {
    logTask('checkAndConfigureSdks');
    const { sdks } = c.files.workspace.config;
    const isRunningOnWindows = process.platform === 'win32';

    if (sdks) {
        if (sdks.ANDROID_SDK) {
            c.cli[CLI_ANDROID_EMULATOR] = getRealPath(c, path.join(sdks.ANDROID_SDK, `emulator/emulator${isRunningOnWindows ? '.exe' : ''}`));
            c.cli[CLI_ANDROID_ADB] = getRealPath(c, path.join(sdks.ANDROID_SDK, `platform-tools/adb${isRunningOnWindows ? '.exe' : ''}`));
            c.cli[CLI_ANDROID_AVDMANAGER] = getRealPath(c, path.join(sdks.ANDROID_SDK, `tools/bin/avdmanager${isRunningOnWindows ? '.bat' : ''}`));
            c.cli[CLI_ANDROID_SDKMANAGER] = getRealPath(c, path.join(sdks.ANDROID_SDK, `tools/bin/sdkmanager${isRunningOnWindows ? '.bat' : ''}`));
        }
        if (sdks.TIZEN_SDK) {
            c.cli[CLI_TIZEN_EMULATOR] = getRealPath(c, path.join(sdks.TIZEN_SDK, `tools/emulator/bin/em-cli${isRunningOnWindows ? '.bat' : ''}`));
            c.cli[CLI_TIZEN] = getRealPath(c, path.join(sdks.TIZEN_SDK, `tools/ide/bin/tizen${isRunningOnWindows ? '.bat' : ''}`));
            c.cli[CLI_SDB_TIZEN] = getRealPath(c, path.join(sdks.TIZEN_SDK, `tools/sdb${isRunningOnWindows ? '.exe' : ''}`));
        }
        if (sdks.WEBOS_SDK) {
            c.cli[CLI_WEBOS_ARES] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares${isRunningOnWindows ? '.cmd' : ''}`));
            c.cli[CLI_WEBOS_ARES_PACKAGE] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-package${isRunningOnWindows ? '.cmd' : ''}`));
            c.cli[CLI_WEBOS_ARES_INSTALL] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-install${isRunningOnWindows ? '.cmd' : ''}`));
            c.cli[CLI_WEBOS_ARES_LAUNCH] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-launch${isRunningOnWindows ? '.cmd' : ''}`));
            c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-setup-device${isRunningOnWindows ? '.cmd' : ''}`));
            c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-device-info${isRunningOnWindows ? '.cmd' : ''}`));
            c.cli[CLI_WEBOS_ARES_NOVACOM] = getRealPath(c, path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-novacom${isRunningOnWindows ? '.cmd' : ''}`));
        }
    } else {
        logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
    }
};
