import {
    PLATFORMS,
    INJECTABLE_RUNTIME_PROPS,
    WEB_HOSTED_PLATFORMS
} from '../constants';
import { getEngineConfigByPlatform, getEngineRunnerByPlatform } from '../engineManager';
import { isSystemWin } from '../utils';
import {
    getRealPath,
} from '../systemManager/fileutils';
import { getConfigProp } from '../common';
import {
    logTask,
} from '../systemManager/logger';


export const configureRuntimeDefaults = async (c) => {
    c.runtime.appId = c.files.project?.configLocal?._meta?.currentAppConfigId || null;

    logTask('configureRuntimeDefaults', `appId:${c.runtime.appId}`);

    // TODO:
    // version
    // title

    c.runtime.port = c.program.port
  || c.buildConfig?.defaults?.ports?.[c.platform]
  || PLATFORMS[c.platform]?.defaultPort;
    if (c.program.target !== true) {
        c.runtime.target = c.program.target
      || c.files.workspace.config?.defaultTargets?.[c.platform];
    } else c.runtime.target = c.program.target;
    c.runtime.scheme = c.program.scheme || 'debug';
    c.runtime.localhost = isSystemWin ? '127.0.0.1' : '0.0.0.0';
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    // c.runtime.engine = getEngineConfigByPlatform(c, c.platform);

    c.configPropsInjects = c.configPropsInjects || [];
    c.systemPropsInjects = c.systemPropsInjects || [];
    c.runtimePropsInjects = [];

    INJECTABLE_RUNTIME_PROPS.forEach((key) => {
        c.runtimePropsInjects.push({
            pattern: `{{runtimeProps.${key}}}`,
            override: c.runtime[key]
        });
    });
    if (c.buildConfig) {
        c.runtime.bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
        const { hosted } = c.program;
        c.runtime.hosted = (hosted || !c.runtime.scheme.bundleAssets) && WEB_HOSTED_PLATFORMS.includes(c.platform);

        // c.runtime.devServer = `http://${ip.address()}:${c.runtime.port}`;
        if (c.buildConfig.defaults?.supportedPlatforms) {
            c.runtime.supportedPlatforms = c.buildConfig.defaults.supportedPlatforms.map((platform) => {
                const engine = getEngineConfigByPlatform(c, platform);
                const engineRunner = getEngineRunnerByPlatform(c, platform);
                if (engineRunner) {
                    const dir = getEngineRunnerByPlatform(c, platform).getOriginalPlatformTemplatesDir(c);

                    let isConnected = false;
                    let isValid = false;
                    const pDir = c.paths.project.platformTemplatesDirs?.[platform];
                    if (pDir) {
                        isValid = true;
                        isConnected = pDir?.includes?.(getRealPath(c, dir));
                    }
                    const port = c.buildConfig.defaults?.[platform] || PLATFORMS[platform]?.defaultPort;
                    return {
                        engine,
                        platform,
                        isConnected,
                        port,
                        isValid
                    };
                }
                return null;
            }).filter(v => v);
        }
    }
    return true;
};
