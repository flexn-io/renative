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

import {
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
} from './constants';

import { exec as execCb } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execCb);

const SDK_LOCATIONS = [path.join('/opt/webOS_TV_SDK'), path.join('C:\\webOS_TV_SDK')];

const _logSdkWarning = (c: RnvContext) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureWebosSdks = async () => {
    const c = getContext();
    logDefault(`checkAndConfigureWebosSdks:${c.platform}`);
    const sdk = c.buildConfig?.sdks?.WEBOS_SDK;

    const clipath = await getCliPath();

    if (sdk && clipath) {
        c.cli[CLI_WEBOS_ARES] = getRealPath(path.join(clipath, `ares${isSystemWin ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_PACKAGE] = getRealPath(path.join(clipath, `ares-package${isSystemWin ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_INSTALL] = getRealPath(path.join(clipath, `ares-install${isSystemWin ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_LAUNCH] = getRealPath(path.join(clipath, `ares-launch${isSystemWin ? '.cmd' : ''}`));
        c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = getRealPath(
            path.join(clipath, `ares-setup-device${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = getRealPath(
            path.join(clipath, `ares-device-info${isSystemWin ? '.cmd' : ''}`)
        );
        c.cli[CLI_WEBOS_ARES_NOVACOM] = getRealPath(path.join(clipath, `ares-novacom${isSystemWin ? '.cmd' : ''}`));
    } else {
        _logSdkWarning(c);
    }
};

const _getCurrentSdkPath = (c: RnvContext) => (c.platform ? c.buildConfig?.sdks?.WEBOS_SDK : undefined);

const _isSdkInstalled = (c: RnvContext) => {
    logDefault('_isSdkInstalled');

    if (!c.platform) return;

    const sdkPath = _getCurrentSdkPath(c);

    return fsExistsSync(getRealPath(sdkPath));
};

const getCliPath = async () => {
    try {
        const { stdout } = await exec('which ares');
        return stdout.slice(0, -5); // cutting out the 'ares' part, so I can get ares, ares-package, ares-launch, ...
    } catch (error) {
        throw new Error(`Couldn't ares with the command 'which ares'. Make sure webos cli is installed.`);
    }
};

const _attemptAutoFix = async (c: RnvContext) => {
    logDefault('_attemptAutoFix');

    if (c.program.opts().hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    const result = SDK_LOCATIONS.find((v) => fsExistsSync(v));

    if (result) {
        logSuccess(`Found existing ${c.platform} SDK location at ${chalk().bold(result)}`);
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
            const cnf = c.files.workspace.config;
            if (!cnf) return false;
            try {
                if (!cnf.sdks) cnf.sdks = {};
                cnf.sdks.WEBOS_SDK = result;
                writeFileSync(c.paths.workspace.config, cnf);
                generateBuildConfig();
                await checkAndConfigureWebosSdks();
            } catch (e) {
                logError(e);
            }

            return true;
        }
    }

    logError(`_attemptAutoFix: no sdks found. searched at: ${SDK_LOCATIONS.join(', ')}`);

    // const setupInstance = PlatformSetup(c);
    // await setupInstance.askToInstallSDK(sdkPlatform);
    generateBuildConfig();
    return true;
};

export const checkWebosSdk = async () => {
    const c = getContext();

    logDefault('checkWebosSdk');
    if (!_isSdkInstalled(c)) {
        logWarning(
            `${c.platform} platform requires WebOS SDK to be installed. Your SDK path in ${chalk().bold(
                c.paths.workspace.config
            )} does not exist: ${chalk().bold(_getCurrentSdkPath(c))}`
        );
        return _attemptAutoFix(c);
    }
    return true;
};
