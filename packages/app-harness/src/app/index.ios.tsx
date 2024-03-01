import React, { useEffect} from 'react';
import { Button, Text, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { request, PERMISSIONS } from 'react-native-permissions';

const App = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
      
        PushNotificationIOS.requestPermissions();
        PushNotificationIOS.addEventListener('notification', onRemoteNotification);
        PushNotificationIOS.addEventListener('register', onRegistered);
        PushNotificationIOS.addEventListener('registrationError', onError);

        return () => {
            PushNotificationIOS.removeEventListener('notification');
            PushNotificationIOS.removeEventListener('register');
            PushNotificationIOS.removeEventListener('registrationError');
        };
    });

    const requestPermission = () => {
        request(PERMISSIONS.IOS.CONTACTS).then((result) => {
            console.log(result);
        });
    };

    const onRegistered = (deviceToken) => {
        console.log(`Device Token: ${deviceToken}`);
    };

    const onError = (error) => {
        console.log(`Error on notification register: ${error}`);
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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ReNative Harness !!</Text>
            <Text>{`hermes: ${typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'}`}</Text>
            <Button onPress={requestPermission} title="Request permissions" />
        </View>
    );
};

export default App;
