import { NotificationCallback } from '../types';

export const addNotificationListeners = (callback: NotificationCallback) => {
    callback('addNotificationListeners not supported on this platform');
};

export const removeNotificationListeners = (callback: NotificationCallback) => {
    callback('removeNotificationListeners not supported on this platform');
};
