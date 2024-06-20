import path from 'path';
import {
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
    getContext,
} from '@rnv/core';
import { CLI_SDB_TIZEN, CLI_TIZEN, CLI_TIZEN_EMULATOR } from './constants';

const getSdkLocations = () => {
    const ctx = getContext();
    const sdkLocations = [
        path.join('usr/local/tizen-studio'),
        path.join(ctx.paths.user.homeDir, 'tizen-studio'),
        path.join('C:\\tizen-studio'),
    ];
    return sdkLocations;
};

const _logSdkWarning = (c: RnvContext) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureTizenSdks = async () => {
    const c = getContext();
    logDefault(`checkAndConfigureTizenSdks:${c.platform}`);
    const sdk = c.buildConfig?.sdks?.TIZEN_SDK;
    if (sdk) {
        c.cli[CLI_TIZEN_EMULATOR] = getRealPath(
            path.join(sdk, `tools/emulator/bin/em-cli${isSystemWin ? '.bat' : ''}`)
        );
        c.cli[CLI_TIZEN] = getRealPath(path.join(sdk, `tools/ide/bin/tizen${isSystemWin ? '.bat' : ''}`));
        c.cli[CLI_SDB_TIZEN] = getRealPath(path.join(sdk, `tools/sdb${isSystemWin ? '.exe' : ''}`));
    } else {
        _logSdkWarning(c);
    }
};

const _getCurrentSdkPath = (c: RnvContext) => (c.platform ? c.buildConfig?.sdks?.TIZEN_SDK : undefined);

const _isSdkInstalled = (c: RnvContext) => {
    logDefault('_isSdkInstalled');

    if (!c.platform) return false;

    const sdkPath = _getCurrentSdkPath(c);

    return fsExistsSync(getRealPath(sdkPath));
};

const _attemptAutoFix = async (c: RnvContext) => {
    logDefault('_attemptAutoFix');

    if (!c.files.workspace.config) return;

    if (c.program.opts().hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    const result = getSdkLocations().find((v) => fsExistsSync(v));

    if (result) {
        logSuccess(`Found existing ${c.platform} SDK location at ${chalk().bold.white(result)}`);
        let confirmSdk = true;
        if (!c.program.opts().ci) {
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
                generateBuildConfig();
                await checkAndConfigureTizenSdks();
            } catch (e) {
                logError(e);
            }

            return true;
        }
    }

    logDefault(`_attemptAutoFix: no sdks found. searched at: ${getSdkLocations().join(', ')}`);

    // const setupInstance = PlatformSetup(c);
    // await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig();
    return true;
};

export const checkTizenSdk = async () => {
    const c = getContext();

    logDefault('checkTizenSdk');
    if (!_isSdkInstalled(c)) {
        logWarning(
            `${c.platform} platform requires Tizen SDK to be installed. Your SDK path in ${chalk().bold.white(
                c.paths.workspace.config
            )} does not exist: ${chalk().bold.white(_getCurrentSdkPath(c))}`
        );
        return _attemptAutoFix(c);
    }
    return true;
};
