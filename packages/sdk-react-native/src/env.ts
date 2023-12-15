import { doResolve, getAppId, getContext, getRelativePath } from '@rnv/core';

export const printableEnvKeys = [
    'RNV_REACT_NATIVE_PATH',
    'RNV_APP_ID',
    'RNV_PROJECT_ROOT',
    'RNV_APP_BUILD_DIR',
    'RNV_ENGINE_PATH',
    'RCT_METRO_PORT',
    'RCT_NO_LAUNCH_PACKAGER',
];

export const EnvVars = {
    RCT_METRO_PORT: () => {
        const ctx = getContext();
        return { RCT_METRO_PORT: ctx.runtime.port };
    },
    RNV_REACT_NATIVE_PATH: () => {
        const ctx = getContext();
        return {
            RNV_REACT_NATIVE_PATH: getRelativePath(
                ctx.paths.project.dir,
                doResolve(ctx.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native')!
            ),
        };
    },
    RCT_NO_LAUNCH_PACKAGER: () => {
        //TODO: make this configurable
        return { RCT_NO_LAUNCH_PACKAGER: 1 };
    },
    RNV_APP_ID: () => {
        const ctx = getContext();

        return { RNV_APP_ID: getAppId(ctx, ctx.platform) };
    },
};
