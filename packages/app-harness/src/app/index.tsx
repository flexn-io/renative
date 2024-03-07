import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View } from 'react-native';
import { Api } from '@rnv/renative';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from '../components/OrientationLocker';
import { NewModuleButton } from '../components/NewModuleButton';
import { SplashScreen } from '../components/SplashScreen';
import { ICON_LOGO, testProps } from '../config';
import styles from '../styles';
import { addNotificationListeners, removeNotificationListeners } from '../components/Notifications';
import { requestPermissions } from '../components/Permissions';
import { TestCase } from '../components/TestCase';
import { useLogger } from '../hooks/useLogger';

const App = () => {
    const [showVideo, setShowVideo] = useState(false);
    const { logDebug, logs } = useLogger();

    useEffect(() => {
        if (typeof SplashScreen === 'function') {
            SplashScreen(logDebug).hide();
        } else {
            (SplashScreen as any)?.hide();
        }
        addNotificationListeners(logDebug);

        return () => {
            removeNotificationListeners(logDebug);
        };
    }, []);

    const handleRequestPermissions = async () => {
        try {
            const permission = await requestPermissions();
            logDebug(`Permissions: ${permission}`);
        } catch (error) {
            logDebug(`${error}`);
        }
    };

    return (
        <View style={{ flex: 1 }}>
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
                    <Text style={{ color: 'black' }}>
                        {`v1.0.0-rc.12, platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
                    </Text>
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
                        <NewModuleButton handleLogs={logDebug} />
                    </TestCase>
                    <TestCase id={3} title="Orientation support ">
                        <OrientationLocker
                            orientation={PORTRAIT}
                            onChange={(orientation) => logDebug(`onChange ${orientation}`)}
                            onDeviceChange={(orientation) => logDebug(`onDeviceChange ${orientation}`)}
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
                        <Button onPress={handleRequestPermissions} title="Request permissions" />
                    </TestCase>
                    <TestCase id={5} title="Image Support">
                        <Image source={ICON_LOGO} style={{ width: 100, height: 100 }} />
                    </TestCase>
                </ScrollView>
            </View>
            <ScrollView
                style={{
                    backgroundColor: '#EEEEEE',
                    maxHeight: '20%',
                    width: '100%',
                    borderTopWidth: 1,
                    borderTopColor: 'black',
                    padding: 10,
                }}
                contentContainerStyle={{
                    paddingBottom: 10,
                }}
            >
                <Text style={{ color: 'black' }}>{`Logs: `}</Text>
                {logs.length
                    ? logs.map((it, idx) => (
                          <Text key={idx} style={{ color: 'black' }}>
                              {`${idx + 1}. ${it}`}
                          </Text>
                      ))
                    : null}
            </ScrollView>
        </View>
    );
};

export default App;
