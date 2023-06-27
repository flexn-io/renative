import platform from './platform';
import factor from './factor';
import engine from './engine';
import {
    isPlatformTizenmobile,
    isPlatformTizenwatch,
    isPlatformTvos,
    isPlatformTizen,
    isPlatformWebos,
    isPlatformXbox,
} from '../is';

import isWebBased from './isWebBased';

export { factor, engine, platform, isWebBased };

export const getScaledValue = (v: number) => {
    if (isPlatformTizenmobile) return v * 3;
    if (isPlatformTizenwatch) return v * 2;
    if (isPlatformTvos) return v * 2;
    if (isPlatformTizen) return v * 2;
    if (isPlatformWebos) return v * 2;
    if (isPlatformXbox) return v * 1.5;
    return v;
};

export default {
    platform,
    formFactor: factor,
    factor,
    engine,
    isWebBased,
};
