/* eslint-disable import/no-cycle */
import { updateProfile } from '../../sdk-xcode/fastlane';

export const taskRnvCryptoUpdateProfile = async (c) => {
    await updateProfile(c);
};
