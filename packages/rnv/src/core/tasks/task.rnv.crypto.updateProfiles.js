/* eslint-disable import/no-cycle */
import {
    chalk,
    logTask
} from '../systemManager/logger';
import {
    listAppConfigsFoldersSync,
    setAppConfig
} from '../configManager/configParser';
import { IOS, TVOS } from '../constants';
import { updateProfile } from '../../sdk-xcode/fastlane';

const _updateProfile = (c, v) => new Promise((resolve, reject) => {
    logTask(`_updateProfile:${v}`, chalk().grey);
    updateProfile(c, v)
        .then(() => resolve())
        .catch(e => reject(e));
});

const _updateProfiles = (c) => {
    logTask('_updateProfiles', chalk().grey);
    const acList = listAppConfigsFoldersSync(c, true);

    return acList.reduce(
        (previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)),
        Promise.resolve()
    );
};

export const rnvCryptoUpdateProfiles = async (c) => {
    logTask('rnvCryptoUpdateProfiles');
    switch (c.platform) {
        case IOS:
        case TVOS:
            await _updateProfiles(c);
            await setAppConfig(c, c.runtime?.appId);
            break;
        default:
            return true;
    }
    return Promise.reject(
        `updateProfiles: Platform ${c.platform} not supported`
    );
};
