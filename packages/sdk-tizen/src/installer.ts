import path from 'path';
import inquirer from 'inquirer';
import {
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
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
    PlatformSetup,
    generateBuildConfig,
    RnvContext,
} from 'rnv';

const SDK_LOCATIONS: Record<string, Array<string>> = {
    tizen: [
        path.join('usr/local/tizen-studio'),
        path.join(USER_HOME_DIR, 'tizen-studio'),
        path.join('C:\\tizen-studio'),
    ],
    webos: [path.join('/opt/webOS_TV_SDK'), path.join('C:\\webOS_TV_SDK')],
};

const _logSdkWarning = (c: RnvContext) => {
    logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
};

export const checkAndConfigureTizenSdks = async (c: RnvContext) => {
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

export const checkSdk = async (c: RnvContext) => {
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
