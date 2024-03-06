import { request, PERMISSIONS } from 'react-native-permissions';
import { logDebug } from '../Logger';

export const requestPermissions = () => {
    request(PERMISSIONS.IOS.CONTACTS).then((result) => {
        logDebug(result);
    });
};
