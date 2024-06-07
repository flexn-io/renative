import path from 'path';
import _ from 'lodash';
import { isSystemWin } from '../system/is';
import { fsExistsSync, fsReadFileSync } from '../system/fs';
import { RnvContext } from './types';
import { generateRuntimePropInjects } from '../system/injectors';
import { getConfigProp } from './contextProps';
import { logDebug, logDefault } from '../logger';
import { getContext } from './provider';

export const configureRuntimeDefaults = async () => {
    const c = getContext();

    c.runtime.appId = c.files.project?.configLocal?._meta?.currentAppConfigId || _getAppId(c);
    if (c.runtime.appId) {
        c.runtime.appConfigDir = path.join(c.paths.project.appConfigsDir, c.runtime.appId);
    }
    logDefault('configureRuntimeDefaults', `appId:${c.runtime.appId}`);

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

    const portString = c.program.opts().port || port || c.runtime.currentPlatform?.defaultPort; //  PLATFORMS[c.platform]?.defaultPort;

    const portOffset = c.buildConfig?.defaults?.portOffset || 0;

    c.runtime.port = Number(portString) + portOffset;

    if (_.isString(c.program.opts().target)) {
        c.runtime.target = c.program.opts().target;
    } else {
        c.runtime.target = defaultTarget;
    }
    c.runtime.isTargetTrue = !!c.program.opts().target;
    c.runtime.scheme = c.program.opts().scheme || 'debug';
    c.runtime.localhost = c.program.opts().hostIp || defaultHost;
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    c.configPropsInjects = c.configPropsInjects || [];
    c.systemPropsInjects = c.systemPropsInjects || [];
    c.runtimePropsInjects = [];

    generateRuntimePropInjects();
    if (c.buildConfig) {
        c.runtime.bundleAssets = getConfigProp('bundleAssets') || false;
        const { hosted } = c.program.opts();
        c.runtime.hosted = hosted && c.runtime.currentPlatform?.isWebHosted;

        if (c.buildConfig.defaults?.supportedPlatforms) {
            // c.runtime.supportedPlatforms = [];
            c.runtime.availablePlatforms = c.buildConfig.defaults?.supportedPlatforms || [];
            // c.buildConfig.defaults.supportedPlatforms.forEach((platform) => {
            //     //TODO: migrate to singular platform engine
            //     const engine = getEngineRunnerByPlatform(platform);
            //     if (engine) {
            //         const dir = engine.originalTemplatePlatformsDir;

            //         let isConnected = false;
            //         let isValid = false;
            //         const pDir = c.paths.project.platformTemplatesDirs?.[platform];
            //         if (pDir) {
            //             isValid = true;
            //             isConnected = pDir?.includes?.(getRealPath(dir) || 'UNDEFINED');
            //         }
            //         const port = c.buildConfig.defaults?.ports?.[platform] || c.runtime.currentPlatform?.defaultPort;
            //         const cp: RnvContextPlatform = {
            //             engine,
            //             platform,
            //             isConnected,
            //             port,
            //             isValid,
            //         };
            //         c.runtime.supportedPlatforms.push(cp);
            //     }
            // });
        }
    }
    return true;
};

const _getAppId = (c: RnvContext) => {
    logDebug(`_getAppId`);
    const localConfigPath = path.join(c.paths.project.dir, 'renative.local.json');
    if (!fsExistsSync(localConfigPath)) return undefined;
    try {
        const fileAsString = fsReadFileSync(localConfigPath).toString();
        if (!fileAsString) return undefined;

        const appId = JSON.parse(fileAsString)?._meta?.currentAppConfigId;
        return appId;
    } catch (error) {
        return undefined;
    }
};
