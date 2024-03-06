import { logDebug } from '../Logger';

const SplashScreen = {
    hide: () => {
        logDebug('SplashScreen.hide not supported on this platform');
    },
    show: () => {
        logDebug('SplashScreen.show not supported on this platform');
    },
};

export { SplashScreen };
