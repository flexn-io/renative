import path from 'path';
import {
    USER_HOME_DIR,
    isSystemWin,
    getRealPath,
    writeFileSync,
    fsExistsSync,
    chalk,
    logDefault,
    logWarning,
    logSuccess,
    logError,
    logInfo,
    generateBuildConfig,
    RnvContext,
    inquirerPrompt,
} from '@rnv/core';
import { CLI_SDB_TIZEN, CLI_TIZEN, CLI_TIZEN_EMULATOR } from './constants';

const SDK_LOCATIONS = [
    path.join('usr/local/tizen-studio'),
    path.join(USER_HOME_DIR, 'tizen-studio'),
    path.join('C:\\tizen-studio'),
];

const _logSdkWarning = (c: RnvContext) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureTizenSdks = async (c: RnvContext) => {
    logDefault(`checkAndConfigureTizenSdks:${c.platform}`);
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

const _getCurrentSdkPath = (c: RnvContext) => (c.platform ? c.buildConfig?.sdks?.TIZEN_SDK : undefined);

const _isSdkInstalled = (c: RnvContext) => {
    logDefault('_isSdkInstalled');

    if (!c.platform) return false;

    const sdkPath = _getCurrentSdkPath(c);

    return fsExistsSync(getRealPath(c, sdkPath));
};

const _attemptAutoFix = async (c: RnvContext) => {
    logDefault('_attemptAutoFix');

    if (!c.files.workspace.config) return;

    if (c.program.hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    const result = SDK_LOCATIONS.find((v) => fsExistsSync(v));

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

        if (confirmSdk) {
            try {
                if (!c.files.workspace.config?.sdks) c.files.workspace.config.sdks = {};
                c.files.workspace.config.sdks.TIZEN_SDK = result;
                //TODO: use config_original here?
                writeFileSync(c.paths.workspace.config, c.files.workspace.config);
                generateBuildConfig(c);
                await checkAndConfigureTizenSdks(c);
            } catch (e) {
                logError(e);
            }

            return true;
        }
    }

    logDefault(`_attemptAutoFix: no sdks found. searched at: ${SDK_LOCATIONS.join(', ')}`);

    // const setupInstance = PlatformSetup(c);
    // await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig(c);
    return true;
};

export const checkTizenSdk = async (c: RnvContext) => {
    logDefault('checkTizenSdk');
    if (!_isSdkInstalled(c)) {
        logWarning(
            `${c.platform} requires SDK to be installed. Your SDK path in ${chalk().white(
                c.paths.workspace.config
            )} does not exist: ${chalk().white(_getCurrentSdkPath(c))}`
        );

        switch (c.platform) {
            case 'tizen':
            case 'tizenmobile':
            case 'tizenwatch':
                return _attemptAutoFix(c);
            default:
                return true;
        }
    }
    return true;
};
