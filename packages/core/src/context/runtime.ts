import { getEngineRunnerByPlatform } from '../engines';
import { isSystemWin } from '../system/isSystem';
import { getRealPath } from '../system/fs';
import { logTask } from '../logger';
import { RnvContext, RnvContextPlatform } from './types';
import { generateRuntimePropInjects } from '../system/injectors';
import { getConfigProp } from '../configs/configProp';

export const configureRuntimeDefaults = async (c: RnvContext) => {
    c.runtime.appId = c.files.project?.configLocal?._meta?.currentAppConfigId;

    logTask('configureRuntimeDefaults', `appId:${c.runtime.appId}`);

    // TODO:
    // version
    // title
    let port: number | undefined;
    let defaultTarget: string | undefined;
    if (c.platform) {
        c.runtime.currentEngine = c.runtime.enginesByPlatform?.[c.platform];
        c.runtime.currentPlatform = c.runtime.currentEngine?.platforms?.[c.platform];
        port = c.buildConfig?.defaults?.ports?.[c.platform];
        defaultTarget = c.buildConfig?.defaultTargets?.[c.platform];
    }

    const defaultHost = isSystemWin ? '127.0.0.1' : '0.0.0.0';

    const portString = c.program.port || port || c.runtime.currentPlatform?.defaultPort; //  PLATFORMS[c.platform]?.defaultPort;

    const portOffset = c.buildConfig?.defaults?.portOffset || 0;

    c.runtime.port = Number(portString) + portOffset;

    if (c.program.target !== true) {
        c.runtime.target = c.program.target || defaultTarget;
    } else c.runtime.isTargetTrue = c.program.target;
    c.runtime.scheme = c.program.scheme || 'debug';
    c.runtime.localhost = c.program.hostIp || defaultHost;
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    c.configPropsInjects = c.configPropsInjects || [];
    c.systemPropsInjects = c.systemPropsInjects || [];
    c.runtimePropsInjects = [];

    generateRuntimePropInjects();
    if (c.buildConfig) {
        c.runtime.bundleAssets = getConfigProp(c, c.platform, 'bundleAssets') || false;
        const { hosted } = c.program;
        c.runtime.hosted = hosted && c.runtime.currentPlatform?.isWebHosted;

        if (c.buildConfig.defaults?.supportedPlatforms) {
            c.runtime.supportedPlatforms = [];
            c.buildConfig.defaults.supportedPlatforms.forEach((platform) => {
                //TODO: migrate to singular platform engine
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
