import { request, PERMISSIONS } from 'react-native-permissions';

export const requestPermissions = () => {
    return request(PERMISSIONS.IOS.CONTACTS);
};
