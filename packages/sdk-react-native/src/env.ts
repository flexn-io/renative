import {
    CoreEnvVars,
    doResolve,
    executeAsync,
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
        const { platform } = getContext();
        const skipPlugins: string[] = [];
        if (platform) {
            parsePlugins(
                (plugin, pluginPlat, key) => {
                    if (
                        pluginPlat.disabled ||
                        plugin.disabled ||
                        (plugin.supportedPlatforms && !plugin.supportedPlatforms.includes(platform))
                    ) {
                        skipPlugins.push(key);
                    }
                },
                false,
                true
            );
        }
        if (skipPlugins.length > 0) {
            return { RNV_SKIP_LINKING: skipPlugins.join(',') };
        }

        return {};
    },
};

export const generateEnvVarsFile = async () => {
    const c = getContext();
    if (!c.platform) return;

    const isApplePlatform = c.platform === 'ios' || c.platform === 'tvos';
    const fileName = isApplePlatform ? '.xcode.env.local' : '.env';
    const destDir = getAppFolder();
    const destPath = path.join(destDir, fileName);

    const envVars: Record<string, any> = {
        ...CoreEnvVars.BASE(),
        RNV_EXTENSIONS: CoreEnvVars.RNV_EXTENSIONS().RNV_EXTENSIONS.join(','),
        ...EnvVars.RCT_METRO_PORT(),
        ...EnvVars.RNV_REACT_NATIVE_PATH(),
        ...EnvVars.RCT_NO_LAUNCH_PACKAGER(),
        ...EnvVars.RNV_APP_ID(),
        ...EnvVars.RCT_NEW_ARCH_ENABLED(),
        ...EnvVars.RNV_FLIPPER_ENABLED(),
        ...EnvVars.RNV_SKIP_LINKING(),
        ...(isApplePlatform
            ? {
                  NODE_BINARY: await executeAsync(`which node`, {
                      cwd: c.paths.project.dir,
                  }),
              }
            : {}),
    };
    let env = '';
    Object.keys(envVars).forEach((key) => {
        env += ` ${isApplePlatform ? 'export' : ''} ${key}=${envVars[key]}\n`;
    });

    fsWriteFileSync(destPath, env);
};
