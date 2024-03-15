import { doResolve, getConfigProp, getContext, getRelativePath, parsePlugins } from '@rnv/core';
import { getAppId } from '@rnv/sdk-utils';

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
        const newArchEnabled = getConfigProp('newArchEnabled', false);

        if (newArchEnabled) {
            return { RCT_NEW_ARCH_ENABLED: 1 };
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
