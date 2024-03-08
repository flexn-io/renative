import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View } from 'react-native';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from '../components/OrientationLocker';
import { NewModuleButton } from '../components/NewModuleButton';
import { SplashScreen } from '../components/SplashScreen';
import { ICON_LOGO, testProps } from '../config';
import styles from '../styles';
import { addNotificationListeners, removeNotificationListeners } from '../components/Notifications';
import { requestPermissions } from '../components/Permissions';
import { TestCase } from '../components/TestCase';

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
        <View style={styles.screen}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={ICON_LOGO}
                    {...testProps('template-starter-home-screen-renative-image')}
                />
                <Text
                    style={{ color: 'black', fontWeight: 'bold', marginHorizontal: 10 }}
                    {...testProps('app-harness-home-screen-intro-text')}
                >
                    ReNative Harness
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ color: 'black' }}>v1.0.0-rc.12, platform: macos, formFactor: desktop</Text>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 10,
                    }}
                >
                    <TestCase id={1} title="Hermes support ">
                        <Text style={styles.text}>{`hermes: ${
                            typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'
                        }`}</Text>
                    </TestCase>
                    <TestCase id={2} title="Native call">
                        <NewModuleButton />
                    </TestCase>
                    <TestCase id={3} title="Orientation support ">
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
                    </TestCase>
                    <TestCase id={4} title="Permissions">
                        <Button onPress={requestPermissions} title="Request permissions" />
                    </TestCase>
                    <TestCase id={5} title="Image Support">
                        <Image source={ICON_LOGO} style={{ width: 100, height: 100 }} />
                    </TestCase>
                </ScrollView>
            </View>
            <View
                style={{
                    backgroundColor: '#EEEEEE',
                    height: 100,
                    width: '100%',
                    borderTopWidth: 1,
                    borderTopColor: 'black',
                    padding: 10,
                }}
            >
                <Text style={{ color: 'black' }}>Logs:</Text>
            </View>
        </View>
    );
};

export default App;
