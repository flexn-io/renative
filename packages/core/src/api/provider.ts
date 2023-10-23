import type { RnvApi } from './types';

export const getApi = (): RnvApi => {
    return global.RNV_API;
};
