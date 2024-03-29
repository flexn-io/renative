import { doResolve, getAppId, getConfigProp, getContext, getRelativePath, parsePlugins } from '@rnv/core';
import RNPermissionsMap from './rnPermissionsMap';

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
    REACT_NATIVE_PERMISSIONS_REQUIRED: () => {
        const ctx = getContext();

        const permissions = ctx.platform === 'ios' ? ctx.buildConfig.permissions?.[ctx.platform] : {};

        let requiredPodPermissions = permissions
            ? Object.keys(permissions).map((key) => RNPermissionsMap[key]?.podPermissionKey)
            : '';

        // remove duplicates
        if (requiredPodPermissions?.length > 0) {
            requiredPodPermissions = Array.from(new Set(requiredPodPermissions));
            return { REACT_NATIVE_PERMISSIONS_REQUIRED: requiredPodPermissions };
        }

        return {};
    },
    RCT_NEW_ARCH_ENABLED: () => {
        const ctx = getContext();

        // new arch support
        const newArchEnabled = getConfigProp(ctx, ctx.platform, 'newArchEnabled', false);

        if (newArchEnabled) {
            return { RCT_NEW_ARCH_ENABLED: 1 };
        }
        return {};
    },
    RNV_SKIP_LINKING: () => {
        const ctx = getContext();

        const skipPlugins: string[] = [];
        parsePlugins(
            ctx,
            ctx.platform,
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
