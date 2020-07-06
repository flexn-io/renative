/* eslint-disable import/no-cycle */
import { logError, logRaw } from '../systemTools/logger';
import {
    getConfigProp
} from '../common';

import EngineRn from './engine-rn';
import EngineRnWeb from './engine-rn-web';
import EngineRnElectron from './engine-rn-electron';
import EngineRnNext from './engine-rn-next';
import EngineRnElectronNext from './engine-rn-electron-next';

const ENGINES = {
    'engine-rn': EngineRn,
    'engine-rn-web': EngineRnWeb,
    'engine-rn-electron': EngineRnElectron,
    'engine-rn-next': EngineRnNext,
    'engine-rn-electron-next': EngineRnElectronNext
};


export const getEngineByPlatform = (c, platform, ignoreMissingError) => {
    let selectedEngineKey;
    if (c.buildConfig) {
        selectedEngineKey = getConfigProp(c, platform, 'engine');
        const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];
        if (!selectedEngine && !ignoreMissingError) {
            logError(`Engine: ${selectedEngineKey} does not exists or is not registered`);
            logRaw(new Error());
        }
        return selectedEngine;
    }
    return null;
};


export const getEngineRunner = (c) => {
    const selectedEngine = getEngineByPlatform(c, c.platform);
    const engine = ENGINES[selectedEngine?.id];
    if (!engine) {
        logError(`Cound not find active engine with id ${selectedEngine?.id}. Available engines:
${Object.keys(ENGINES).join(', ')}`);
    }
    return engine;
};
