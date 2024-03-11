import path from 'path';
import {
    executeAsync,
    getAppFolder,
    getConfigProp,
    isSystemWin,
    chalk,
    logDefault,
    logInfo,
    logSuccess,
    RnvContext,
    DEFAULTS,
    RnvPlatform,
    CoreEnvVars,
    ExecOptionsPresets,
} from '@rnv/core';
import { EnvVars } from './env';
import { getEntryFile } from '@rnv/sdk-utils';

export const packageReactNativeAndroid = async (c: RnvContext) => {
    logDefault('packageAndroid');
    const { platform } = c;

    if (!c.platform) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets', false) === true;

    if (!bundleAssets && platform !== 'androidwear') {
        logInfo(`bundleAssets in scheme ${chalk().bold(c.runtime.scheme)} marked false. SKIPPING PACKAGING...`);
        return true;
    }

    const outputFile = getEntryFile(c, platform);

    const appFolder = getAppFolder();
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

        await executeAsync(cmd, {
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
    logDefault('_runGradleApp');

    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');
    const appFolder = getAppFolder();

    const udid = device?.udid;

    let command = `npx react-native run-android --mode=${signingConfig} --no-packager --main-activity=${
        platform === 'androidwear' ? 'MainActivity' : 'SplashActivity'
    }`;

    if (udid) {
        command += ` --deviceId=${udid}`;
    }

    return executeAsync(command, {
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
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
    logDefault('buildAndroid');
    const { platform } = c;

    const appFolder = getAppFolder();
    const signingConfig = getConfigProp(c, platform, 'signingConfig') || DEFAULTS.signingConfig;
    const outputAab = getConfigProp(c, platform, 'aab', false);
    const extraGradleParams = getConfigProp(c, platform, 'extraGradleParams', '');

    let command = `npx react-native build-android --mode=${signingConfig} --tasks ${
        outputAab ? 'bundle' : 'assemble'
    }${signingConfig}`;

    if (extraGradleParams) {
        command += ` --extra-params ${extraGradleParams}`;
    }

    await executeAsync(command, {
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
