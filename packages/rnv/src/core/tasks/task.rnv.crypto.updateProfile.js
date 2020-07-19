/* eslint-disable import/no-cycle */
import { updateProfile } from '../../sdk-xcode/fastlane';

export const rnvCryptoUpdateProfile = async (c) => {
    await updateProfile(c);
};
