import {
    getConfigProp
} from '../common';


export const getEngineByPlatform = (c, platform) => {
    const selectedEngineKey = getConfigProp(c, platform, 'engine');
    const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];

    return selectedEngine;
};
