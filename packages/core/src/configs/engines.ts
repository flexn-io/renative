import { RnvContext } from '../context/types';
import { RnvEngineTemplate, RnvEngineTemplateMap } from '../engines/types';
import { logWarning } from '../logger';
import { RnvPlatform } from '../types';
import { getConfigProp } from '../context/contextProps';
import { getContext } from '../context/provider';

const _getMergedEngineConfigs = (c: RnvContext) => {
    const engines = c.buildConfig?.engines;
    const engineTemplates = c.buildConfig?.engineTemplates || {};
    const mergedEngineConfigs: RnvEngineTemplateMap = {};
    Object.keys(engineTemplates).forEach((packageName) => {
        const engTemplate = engineTemplates[packageName];
        mergedEngineConfigs[packageName] = {
            packageName,
            ...engTemplate,
        };
    });

    const engineTemplatesKeys = Object.keys(engineTemplates);
    if (engines) {
        Object.keys(engines).forEach((enginePackageName) => {
            const engineVal = engines[enginePackageName];
            if (engineVal === 'source:rnv') {
                if (!engineTemplatesKeys.includes(enginePackageName)) {
                    logWarning(`Engine ${enginePackageName} not found in default engineTemplates`);
                }
            }
            // else {
            //     mergedEngineConfigs[enginePackageName] = engineVal;
            // }
        });
    }
    return mergedEngineConfigs;
};

export const getEngineTemplateByPlatform = (platform: RnvPlatform): RnvEngineTemplate | null => {
    const c = getContext();
    const mergedEngineConfigs = _getMergedEngineConfigs(c);
    if (!platform) return null;
    const engineId =
        c.program.engine ||
        getConfigProp('engine') ||
        //Adding this as default engines moved from platforms into platformTemplates
        c.files.rnv.projectTemplates.config?.platformTemplates?.[platform]?.engine;
    let selectedEngineConfig: RnvEngineTemplate | null = null;

    Object.values(mergedEngineConfigs).forEach((engineConfig) => {
        if (engineConfig.id === engineId) {
            selectedEngineConfig = engineConfig;
        }
    });

    return selectedEngineConfig;
};
