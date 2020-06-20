/* eslint-disable import/no-cycle */
import {
    getConfigProp
} from '../common';


export const getEngineByPlatform = (c, platform) => {
    let selectedEngineKey;
    if (c.buildConfig) {
        selectedEngineKey = getConfigProp(c, platform, 'engine');
        const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];

        return selectedEngine;
    }
    return null;
};
