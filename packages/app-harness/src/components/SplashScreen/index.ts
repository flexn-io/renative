import { useEffect } from 'react';
import { NotificationCallback } from '../types';
import { useLoggerContext } from '../../context';

const SplashScreen = (callback: NotificationCallback) => ({
    hide: () => {
        callback('SplashScreen.hide not supported on this platform');
    },
    show: () => {
        callback('SplashScreen.show not supported on this platform');
    },
});

export function useSplashScreen() {
    const { logDebug } = useLoggerContext();
    useEffect(() => {
        //TODO: We could also cache SplashScreen here
    }, []);
    return { SplashScreen: SplashScreen(logDebug) };
}
