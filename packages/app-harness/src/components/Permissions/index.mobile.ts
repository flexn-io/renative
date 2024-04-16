import { request, PERMISSIONS } from 'react-native-permissions';
import { isPlatformIos } from '@rnv/renative';

export const requestPermissions = () => {
    return isPlatformIos ? request(PERMISSIONS.IOS.CONTACTS) : request(PERMISSIONS.ANDROID.WRITE_CONTACTS);
};
