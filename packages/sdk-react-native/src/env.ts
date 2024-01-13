import { doResolve, getAppId, getConfigProp, getContext, getRelativePath } from '@rnv/core';
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
    RNV_SKIP_LINKING:()=>{
        const ctx = getContext();
        const {platform, buildConfig:{plugins}} = ctx;
        const platformsToCheck = ['ios', 'tvos', 'android', 'androidwear', 'androidtv', 'firetv', 'macos'];

        if(platform && plugins ){
            const platformToPush = platform === 'tvos'? 'ios': platform;

            const filteredPlugins = Object.entries(plugins).filter(([_, pluginConfig]) => {
               return typeof pluginConfig !== 'string' && Object.keys(pluginConfig).some(key => platformsToCheck.includes(key))
               
            })
            .reduce((acc:any, [pluginName, pluginConfig]) => {
                if(!Object.keys(pluginConfig).includes(platform)){
                    acc.push(pluginName);
                }
                
                return acc
            },[platformToPush]);

            const resultString = `${filteredPlugins.join(', ')}`;
            return { RNV_SKIP_LINKING: resultString };
        }
        return {};
    }
};
