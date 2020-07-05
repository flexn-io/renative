/* eslint-disable import/no-cycle */
import {
    getConfigProp
} from '../common';

import EngineRn from './engine-rn';
import EngineRnWeb from './engine-rn-web';
import EngineRnElectron from './engine-rn-electron';
import EngineRnNext from './engine-rn-next';

const ENGINES = {
    'engine-rn': EngineRn,
    'engine-rn-web': EngineRnWeb,
    'engine-rn-electront': EngineRnElectron,
    'engine-rn-next': EngineRnNext
};


export const getEngineByPlatform = (c, platform) => {
    let selectedEngineKey;
    if (c.buildConfig) {
        selectedEngineKey = getConfigProp(c, platform, 'engine');
        const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];

        return selectedEngine;
    }
    return null;
};


export const getEngineRunner = (c) => {
    const selectedEngine = getEngineByPlatform(c, c.platform);
    return ENGINES[selectedEngine.id];
};
