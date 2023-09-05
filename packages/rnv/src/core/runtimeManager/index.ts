import { INJECTABLE_RUNTIME_PROPS } from '../constants';
import { getEngineRunnerByPlatform } from '../engineManager';
import { isSystemWin } from '../systemManager/utils';
import { getRealPath } from '../systemManager/fileutils';
import { getConfigProp } from '../common';
import { logTask } from '../systemManager/logger';
import { loadPluginTemplates } from '../pluginManager';
import { parseRenativeConfigs } from '../configManager/index';
import { RnvContext, RnvContextPlatform } from '../context/types';

export const updateRenativeConfigs = async (c: RnvContext) => {
    await loadPluginTemplates(c);
    await parseRenativeConfigs(c);
    return true;
};

export const configureRuntimeDefaults = async (c: RnvContext) => {
    c.runtime.appId = c.files.project?.configLocal?._meta?.currentAppConfigId || null;
    // c.runtime.appConfigDir = c.files.project?.configLocal?._meta?.currentAppConfigDir || null;

    logTask('configureRuntimeDefaults', `appId:${c.runtime.appId}`);

    // TODO:
    // version
    // title
    c.runtime.currentEngine = c.runtime.enginesByPlatform?.[c.platform];
    c.runtime.currentPlatform = c.runtime.currentEngine?.platforms?.[c.platform];
    const defaultHost = isSystemWin ? '127.0.0.1' : '0.0.0.0';

    const portString =
        c.program.port || c.buildConfig?.defaults?.ports?.[c.platform] || c.runtime.currentPlatform?.defaultPort; //  PLATFORMS[c.platform]?.defaultPort;

    const portOffset = c.buildConfig?.defaults?.portOffset || 0;

    c.runtime.port = Number(portString) + portOffset;

    if (c.program.target !== true) {
        c.runtime.target = c.program.target || c.buildConfig?.defaultTargets?.[c.platform];
    } else c.runtime.isTargetTrue = c.program.target;
    c.runtime.scheme = c.program.scheme || 'debug';
    c.runtime.localhost = c.program.hostIp || defaultHost;
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    c.configPropsInjects = c.configPropsInjects || [];
    c.systemPropsInjects = c.systemPropsInjects || [];
    c.runtimePropsInjects = [];

    const rt: any = c.runtime;
    INJECTABLE_RUNTIME_PROPS.forEach((key) => {
        c.runtimePropsInjects.push({
            pattern: `{{runtimeProps.${key}}}`,
            override: rt[key],
        });
    });
    if (c.buildConfig) {
        c.runtime.bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
        const { hosted } = c.program;
        c.runtime.hosted = hosted && c.runtime.currentPlatform?.isWebHosted;

        // c.runtime.devServer = `http://${ip.address()}:${c.runtime.port}`;
        if (c.buildConfig.defaults?.supportedPlatforms) {
            c.runtime.supportedPlatforms = [];
            c.buildConfig.defaults.supportedPlatforms.forEach((platform) => {
                const engine = getEngineRunnerByPlatform(c, platform);
                if (engine) {
                    const dir = engine.originalTemplatePlatformsDir;

                    let isConnected = false;
                    let isValid = false;
                    const pDir = c.paths.project.platformTemplatesDirs?.[platform];
                    if (pDir) {
                        isValid = true;
                        isConnected = pDir?.includes?.(getRealPath(c, dir) || 'UNDEFINED');
                    }
                    const port = c.buildConfig.defaults?.ports?.[platform] || c.runtime.currentPlatform?.defaultPort;
                    const cp: RnvContextPlatform = {
                        engine,
                        platform,
                        isConnected,
                        port,
                        isValid,
                    };
                    c.runtime.supportedPlatforms.push(cp);
                }
            });
        }
    }
    return true;
};
