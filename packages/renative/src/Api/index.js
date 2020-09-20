import platform from './platform';
import factor from './factor';
import engine from './engine';
import {
    isPlatformTizenmobile,
    isPlatformTizenwatch,
    isPlatformTvos,
    isPlatformTizen,
    isPlatformWebos
} from '../is';

export { factor, engine, platform };

export const getScaledValue = (v) => {
    if (isPlatformTizenmobile) return v * 3;
    if (isPlatformTizenwatch) return v * 2;
    if (isPlatformTvos) return v * 2;
    if (isPlatformTizen) return v * 2;
    if (isPlatformWebos) return v * 2;
    return v;
};

export default {
    platform,
    formFactor: factor,
    factor,
    engine
};
