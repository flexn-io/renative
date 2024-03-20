import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NotificationCallback, NotificationError } from '../types';

export const addNotificationListeners = (callback: NotificationCallback) => {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener('register', onRegistered(callback));
    PushNotificationIOS.addEventListener('registrationError', onError(callback));
};

export const removeNotificationListeners = () => {
    PushNotificationIOS.removeEventListener('notification');
    PushNotificationIOS.removeEventListener('register');
    PushNotificationIOS.removeEventListener('registrationError');
};

const onRegistered = (callback: NotificationCallback) => (deviceToken: string) => {
    callback(`Device Token: ${deviceToken}`);
};

const onError = (callback: NotificationCallback) => (error: NotificationError) => {
    callback(`Error on notification register: ${error.message}`);
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
