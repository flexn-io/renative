import { NotificationCallback } from '../types';

const SplashScreen = (callback: NotificationCallback) => ({
    hide: () => {
        callback('SplashScreen.hide not supported on this platform');
    },
    show: () => {
        callback('SplashScreen.show not supported on this platform');
    },
});

export { SplashScreen };
