import { Linking } from 'react-native';

export function useOpenURL() {
    function openURL(url) {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }
    return openURL;
}
