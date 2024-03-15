import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View } from 'react-native';
import { Api } from '@rnv/renative';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from '../components/OrientationLocker';
import { NewModuleButton } from '../components/NewModuleButton';
import { useSplashScreen } from '../components/SplashScreen';
import { ICON_LOGO, testProps } from '../config';
import styles from '../styles';
import { addNotificationListeners, removeNotificationListeners } from '../components/Notifications';
import { requestPermissions } from '../components/Permissions';
import { TestCase } from '../components/TestCase';
import config from '../../package.json';
import { LoggerProvider, useLoggerContext } from '../context';
import { NotificationCallback } from '../components/types';
import { SafeAreaProvider } from '../components/SafeArea';
import { PhotoEditorButton } from '../components/PhotoEditor';

// import { observe as observeLogBoxLogs, symbolicateLogNow } from 'react-native/Libraries/LogBox/Data/LogBoxData';

// LogBox keeps all logs that you have not viewed yet.
// When a new log comes in, we only want to print out the new ones.
// let lastCount = 0;

// observeLogBoxLogs((data) => {
//     const logs = Array.from(data.logs);
//     const symbolicatedLogs = logs.filter((log) => log.symbolicated.stack?.length);
//     for (let i = lastCount; i < symbolicatedLogs.length; i++) {
//         // use log instead of warn/error to prevent resending error to LogBox
//         console.log(formatLog(symbolicatedLogs[i]));
//     }
//     lastCount = symbolicatedLogs.length;

//     // Trigger symbolication on remaining logs because
//     // logs do not symbolicate until you click on LogBox
//     logs.filter((log) => log.symbolicated.status === 'NONE').forEach((log) => symbolicateLogNow(log));
// });

// function formatLog(log) {
//     const stackLines = (log.symbolicated.stack || [])
//         .filter((line) => !line.collapse)
//         .map((line) => `    at ${line.methodName} (${line.file}:${line.lineNumber}:${line.column})`)
//         .join('\n');
//     return `Error has been symbolicated\nError: ${log.message.content}\n${stackLines}`;
// }

const App = () => (
    <SafeAreaProvider>
        <LoggerProvider>
            <AppContent />
        </LoggerProvider>
    </SafeAreaProvider>
);

const AppContent = () => {
    const [showVideo, setShowVideo] = useState(false);
    const { logDebug, logs } = useLoggerContext();
    const { SplashScreen } = useSplashScreen();

    useEffect(() => {
        SplashScreen.hide();
        addNotificationListeners(handleNotification);

        return () => {
            removeNotificationListeners(handleNotification);
        };
    }, []);

    const handleNotification: NotificationCallback = (message) => logDebug(message);

    const handleRequestPermissions = async () => {
        try {
            const permission = await requestPermissions();
            logDebug(`Permissions: ${permission}`);
        } catch (error) {
            logDebug(`${error}`);
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={ICON_LOGO}
                    {...testProps('template-starter-home-screen-renative-image')}
                />
                <Text style={styles.introText} {...testProps('app-harness-home-screen-intro-text')}>
                    ReNative Harness
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.dynamicText}>
                        {`v${config.version}, platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
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
                        <NewModuleButton />
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
                    <TestCase id={6} title="Splash Screen">
                        <Button onPress={() => SplashScreen.show()} title="Show SplashScreen" />
                    </TestCase>
                    <TestCase id={7} title="PhotoEditor">
                        <PhotoEditorButton />
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
                <Text style={[styles.dynamicText, { fontWeight: 'bold' }]}>{`Logs: `}</Text>
                {logs
                    ? logs.map((it, idx) => (
                          <Text key={idx} style={styles.dynamicText}>
                              {it}
                          </Text>
                      ))
                    : null}
            </ScrollView>
        </View>
    );
};

export default App;
