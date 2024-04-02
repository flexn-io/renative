import { getContext } from '../context/provider';
import type { CreateRnvSdkOpts, RnvSdk } from './types';

export const createRnvSDK = <OKey extends string>(opts: CreateRnvSdkOpts<OKey>) => {
    const sdk: RnvSdk<OKey> = { ...opts, getContext: () => getContext<any, OKey>() };

    return sdk;
};
