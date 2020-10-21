import { Linking } from 'react-native';
import {
    isPlatformIos,
    isPlatformAndroid,
    isPlatformMacos,
    isPlatformWeb
} from '../is';

export function useOpenURL() {
    function openURL(url) {
        if (
            isPlatformIos
            || isPlatformAndroid
            || isPlatformMacos
            || isPlatformWeb
        ) {
            // eslint-disable-next-line no-console
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        } else {
            // Not supported
        }
    }
    return openURL;
}
