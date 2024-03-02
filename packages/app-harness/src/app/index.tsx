import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from '../components/OrientationLocker';
import { NewModuleButton } from '../components/NewModuleButton';
import { SplashScreen } from '../components/SplashScreen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { request, PERMISSIONS } from 'react-native-permissions';
import { testProps } from '../config';
import styles from '../styles';

const App = () => {
    const [showVideo, setShowVideo] = useState(false);
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
        <View style={styles.container}>
            <Text style={styles.text} {...testProps('app-harness-home-screen-intro-text')}>
                ReNative Harness
            </Text>
            <Text style={styles.text}>{`hermes: ${
                typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'
            }`}</Text>

            <NewModuleButton />
            <OrientationLocker
                orientation={PORTRAIT}
                onChange={(orientation) => console.log('onChange', orientation)}
                onDeviceChange={(orientation) => console.log('onDeviceChange', orientation)}
            />
            <Button title="Toggle Video" onPress={() => setShowVideo(!showVideo)} />
            {showVideo && (
                <View>
                    <OrientationLocker orientation={LANDSCAPE} />
                    <View style={{ width: 320, height: 180, backgroundColor: '#ccc' }}>
                        <Text style={styles.text}>Landscape video goes here</Text>
                    </View>
                </View>
            )}
            <Button onPress={requestPermission} title="Request permissions" />
        </View>
    );
};

export default App;
