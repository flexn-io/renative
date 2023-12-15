import { getConfigProp, getContext } from '@rnv/core';
import RNPermissionsMap from './rnPermissionsMap';

export const EnvVars = {
    REACT_NATIVE_PERMISSIONS_REQUIRED: () => {
        const ctx = getContext();

        const permissions = ctx.platform === 'ios' ? ctx.buildConfig.permissions?.[ctx.platform] : {};

        let requiredPodPermissions = permissions
            ? Object.keys(permissions).map((key) => RNPermissionsMap[key]?.podPermissionKey)
            : '';

        // remove duplicates
        if (requiredPodPermissions) {
            requiredPodPermissions = Array.from(new Set(requiredPodPermissions));
        }

        return { REACT_NATIVE_PERMISSIONS_REQUIRED: requiredPodPermissions };
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
};
