import platform from './platform';
import factor from './factor';
import engine from './engine';
import { isTizenmobile, isTizenwatch, isTvos, isTizen, isWebos } from '../is';

export default {
    platform,
    formFactor: factor,
    factor,
    engine
};

export const getScaledValue = (v) => {
    if (isTizenmobile()) return v * 3;
    if (isTizenwatch()) return v * 2;
    if (isTvos()) return v * 2;
    if (isTizen()) return v * 2;
    if (isWebos()) return v * 2;
    return v;
};
