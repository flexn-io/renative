import { Linking } from 'react-native';
import { isPlatformIos, isPlatformAndroid, isPlatformMacos } from '../is';

export function useOpenURL() {
    function openURL(url) {
        if (isPlatformIos || isPlatformAndroid || isPlatformMacos) {
            Linking.openURL(url).catch(err =>
                console.error('An error occurred', err)
            );
        } else {
            // Not supported
        }
    }
    return openURL;
}
