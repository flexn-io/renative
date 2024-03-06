import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { logDebug } from '../Logger';

export const addNotificationListeners = () => {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener('registrationError', onError);
};

export const removeNotificationListeners = () => {
    PushNotificationIOS.removeEventListener('notification');
    PushNotificationIOS.removeEventListener('register');
    PushNotificationIOS.removeEventListener('registrationError');
};

const onRegistered = (deviceToken) => {
    logDebug(`Device Token: ${deviceToken}`);
};

const onError = (error) => {
    logDebug(`Error on notification register: ${error}`);
};

const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
        // Navigate user to another screen
    } else {
        // Do something else with push notification
    }
    // Use the appropriate result based on what you needed to do for this notification
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
};
