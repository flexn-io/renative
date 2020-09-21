import { Logger } from 'rnv';

export const publishPackagesProd = async (c) => {
    Logger.logHook('publishPackagesProd');
    return true;
};

export const publishPackagesAlpha = async (c) => {
    Logger.logHook('publishPackagesAlpha');
    return true;
};

export const publishPackagesFeat = async (c) => {
    Logger.logHook('publishPackagesFeat');
    return true;
};
