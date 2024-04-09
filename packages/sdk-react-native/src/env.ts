import {
    CoreEnvVars,
    doResolve,
    fsWriteFileSync,
    getAppFolder,
    getConfigProp,
    getContext,
    getRelativePath,
    parsePlugins,
} from '@rnv/core';
import { getAppId } from '@rnv/sdk-utils';
import path from 'path';

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
        return { RNV_APP_ID: getAppId() };
    },
    RCT_NEW_ARCH_ENABLED: () => {
        // new arch support
        const newArchEnabled = getConfigProp('newArchEnabled');

        if (newArchEnabled) {
            return { RCT_NEW_ARCH_ENABLED: 1 };
        }
        return {};
    },
    RNV_FLIPPER_ENABLED: () => {
        const enableFlipper = getConfigProp('flipperEnabled') || true;
        if (!enableFlipper) {
            return { NO_FLIPPER: '1' };
        }
        return {};
    },
    RNV_SKIP_LINKING: () => {
        const skipPlugins: string[] = [];
        parsePlugins(
            (plugin, pluginPlat, key) => {
                if (pluginPlat.disabled || plugin.disabled) {
                    skipPlugins.push(key);
                }
            },
            false,
            true
        );

        if (skipPlugins.length > 0) {
            return { RNV_SKIP_LINKING: skipPlugins.join(',') };
        }

        return {};
    },
};

export const generateEnvVarsFile = async () => {
    const destDir = getAppFolder();
    const destPath = path.join(destDir, '.env');
    const envVars: Record<string, any> = {
        ...CoreEnvVars.BASE(),
        RNV_EXTENSIONS: CoreEnvVars.RNV_EXTENSIONS().RNV_EXTENSIONS.join(', '),
        ...EnvVars.RCT_METRO_PORT(),
        ...EnvVars.RNV_REACT_NATIVE_PATH(),
        ...EnvVars.RCT_NO_LAUNCH_PACKAGER(),
        ...EnvVars.RNV_APP_ID(),
        ...EnvVars.RCT_NEW_ARCH_ENABLED(),
        ...EnvVars.RNV_FLIPPER_ENABLED(),
        ...EnvVars.RNV_SKIP_LINKING(),
    };
    let env = '';
    Object.keys(envVars).forEach((key) => {
        env += `${key}=${envVars[key]}\n`;
    });

    fsWriteFileSync(destPath, env);
};
