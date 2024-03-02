import { request, PERMISSIONS } from 'react-native-permissions';

export const requestPermissions = () => {
    request(PERMISSIONS.IOS.CONTACTS).then((result) => {
        console.log(result);
    });
};
