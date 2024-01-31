import path from 'path';
import {
    executeAsync,
    getAppFolder,
    getConfigProp,
    getEntryFile,
    isSystemWin,
    chalk,
    logTask,
    logInfo,
    logSuccess,
    ANDROID_WEAR,
    RnvContext,
    DEFAULTS,
    RnvPlatform,
    CoreEnvVars,
    ExecOptionsPresets,
} from '@rnv/core';
import { EnvVars } from './env';

export const packageReactNativeAndroid = async (c: RnvContext) => {
    logTask('packageAndroid');
    const { platform } = c;

    if (!c.platform) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets', false) === true;

    if (!bundleAssets && platform !== ANDROID_WEAR) {
        logInfo(`bundleAssets in scheme ${chalk().white(c.runtime.scheme)} marked false. SKIPPING PACKAGING...`);
        return true;
    }

    const outputFile = getEntryFile(c, platform);

    const appFolder = getAppFolder(c);
    let reactNative = c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native';

    if (isSystemWin) {
        reactNative = path.normalize(`${process.cwd()}/node_modules/.bin/react-native.cmd`);
    }

    logInfo('ANDROID PACKAGE STARTING...');

    try {
        let cmd = `${reactNative} bundle --platform android --dev false --assets-dest ${path.join(
            appFolder,
            'app',
            'src',
            'main',
            'res'
        )} --entry-file ${c.buildConfig.platforms?.[c.platform]?.entryFile}.js --bundle-output ${path.join(
            appFolder,
            'app',
            'src',
            'main',
            'assets',
            `${outputFile}.bundle`
        )} --config=metro.config.js`;

        if (getConfigProp(c, c.platform, 'enableSourceMaps', false)) {
            cmd += ` --sourcemap-output ${path.join(
                appFolder,
                'app',
                'src',
                'main',
                'assets',
                `${outputFile}.bundle.map`
            )}`;
        }

        await executeAsync(c, cmd, {
            env: {
                ...CoreEnvVars.BASE(),
                ...CoreEnvVars.RNV_EXTENSIONS(),
                ...EnvVars.RNV_REACT_NATIVE_PATH(),
                ...EnvVars.RNV_APP_ID(),
            },
        });

        logInfo('ANDROID PACKAGE FINISHED');
        return true;
    } catch (e) {
        logInfo('ANDROID PACKAGE FAILED');
        return Promise.reject(e);
    }
};

export const runReactNativeAndroid = async (
    c: RnvContext,
    platform: RnvPlatform,
    device: { udid?: string } | undefined
) => {
    logTask('_runGradleApp');

    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');
    const appFolder = getAppFolder(c);

    const udid = device?.udid;

    let command = `npx react-native run-android --mode=${signingConfig} --no-packager --main-activity=MainActivity`;

    if (udid) {
        command += ` --deviceId=${udid}`;
    }

    return executeAsync(c, command, {
        env: {
            ...CoreEnvVars.BASE(),
            ...EnvVars.RCT_METRO_PORT(),
            ...EnvVars.RNV_REACT_NATIVE_PATH(),
            ...EnvVars.RNV_APP_ID(),
        },
        cwd: appFolder,
        //This is required to make rn cli logs visible in rnv executed terminal
        ...ExecOptionsPresets.INHERIT_OUTPUT_NO_SPINNER,
    });
};

export const buildReactNativeAndroid = async (c: RnvContext) => {
    logTask('buildAndroid');
    const { platform } = c;

    const appFolder = getAppFolder(c);
    const signingConfig = getConfigProp(c, platform, 'signingConfig') || DEFAULTS.signingConfig;
    const outputAab = getConfigProp(c, platform, 'aab', false);
    const extraGradleParams = getConfigProp(c, platform, 'extraGradleParams', '');

    let command = `npx react-native build-android --mode=${signingConfig} --no-packager --tasks ${
        outputAab ? 'bundle' : 'assemble'
    }${signingConfig}`;

    if (extraGradleParams) {
        command += ` --extra-params ${extraGradleParams}`;
    }

    await executeAsync(c, command, {
        cwd: appFolder,
        env: {
            ...CoreEnvVars.BASE(),
            //NOTE: we need extensions here because rn will trigger packaging step in release mode
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.RNV_REACT_NATIVE_PATH(),
            ...EnvVars.RNV_APP_ID(),
        },
    });

    logSuccess(
        `Your APK is located in ${chalk().cyan(
            path.join(appFolder, `app/build/outputs/${outputAab ? 'bundle' : 'apk'}/${signingConfig.toLowerCase()}`)
        )} .`
    );
    return true;
};
