import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from '../components/OrientationLocker';
import { NewModuleButton } from '../components/NewModuleButton';
import { SplashScreen } from '../components/SplashScreen';
import { testProps } from '../config';
import styles from '../styles';
import { addNotificationListeners, removeNotificationListeners } from '../components/Notifications';
import { requestPermissions } from '../components/Permissions';

const App = () => {
    const [showVideo, setShowVideo] = useState(false);
    useEffect(() => {
        SplashScreen.hide();
        addNotificationListeners();

        return () => {
            removeNotificationListeners();
        };
    }, []);

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
            <Button onPress={requestPermissions} title="Request permissions" />
        </View>
    );
};

export default App;
