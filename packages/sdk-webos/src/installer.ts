import path from 'path';
import inquirer from 'inquirer';
import {
    WEBOS,
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
    RnvContext,
} from 'rnv';

import {
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
    WEBOS_SDK,
    SDK_PLATFORMS,
} from './constants';

const SDK_LOCATIONS: Record<string, Array<string>> = {
    webos: [path.join('/opt/webOS_TV_SDK'), path.join('C:\\webOS_TV_SDK')],
};

const _logSdkWarning = (c: RnvContext) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureWebosSdks = async (c: RnvContext) => {
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

const _getCurrentSdkPath = (c: RnvContext) => c.buildConfig?.sdks?.[SDK_PLATFORMS[c.platform]];

const _isSdkInstalled = (c: RnvContext) => {
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

const _attemptAutoFix = async (c: RnvContext, sdkPlatform: string, sdkKey: string, traverseUntilFoundFile?: string) => {
    logTask('_attemptAutoFix');

    if (c.program.hosted) {
        logInfo('HOSTED Mode. Skipping SDK checks');
        return true;
    }

    const locations: Array<string | undefined> = SDK_LOCATIONS[sdkPlatform];

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
                await checkAndConfigureWebosSdks(c);
            } catch (e: any) {
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

export const checkWebosSdk = async (c: RnvContext) => {
    logTask('checkWebosSdk');
    if (!_isSdkInstalled(c)) {
        logWarning(
            `${c.platform} requires SDK to be installed. Your SDK path in ${chalk().white(
                c.paths.workspace.config
            )} does not exist: ${chalk().white(_getCurrentSdkPath(c))}`
        );

        switch (c.platform) {
            case WEBOS:
                return _attemptAutoFix(c, 'webos', WEBOS_SDK);
            default:
                return true;
        }
    }
    return true;
};
