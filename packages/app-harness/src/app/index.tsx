import React, { useEffect, useState, useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Api, isPlatformIos, isWebBased, isFactorTv, isTizenwatch, isAndroidwear } from '@rnv/renative';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from '../components/OrientationLocker';
import { NewModuleButton } from '../components/NewModuleButton';
import { useSplashScreen } from '../components/SplashScreen';
import { ICON_LOGO, testProps } from '../config';
import styles from '../styles';
import { addNotificationListeners, removeNotificationListeners } from '../components/Notifications';
import { requestPermissions } from '../components/Permissions';
import { TestCase } from '../components/TestCase';
import { CastComponent } from '../components/CastButton';
import config from '../../package.json';
import { LoggerProvider, useLoggerContext } from '../context';
import { NotificationCallback } from '../components/types';
import { SafeAreaProvider } from '../components/SafeArea';
import { PhotoEditorButton } from '../components/PhotoEditor';
import { Player } from '../components/Player';

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
    const orientationBtnRef = useRef<TouchableOpacity>(null);
    const permissionBtnRef = useRef<TouchableOpacity>(null);
    const splashBtnRef = useRef<TouchableOpacity>(null);
    const photoEditorBtnRef = useRef<TouchableOpacity>(null);
    const nativeModuleBtnRef = useRef<TouchableOpacity>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [logsFocused, setLogsFocused] = useState(false);
    const { logDebug, logs } = useLoggerContext();
    const { SplashScreen } = useSplashScreen();
    const focusableRefs = [nativeModuleBtnRef, orientationBtnRef, permissionBtnRef, splashBtnRef, photoEditorBtnRef];
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    useEffect(() => {
        SplashScreen.hide();
        addNotificationListeners(handleNotification);
        if (isWebBased && isFactorTv && focusableRefs[0]?.current) {
            focusableRefs[0].current.focus();
            setFocusedIndex(0);
        }
        return () => {
            removeNotificationListeners(handleNotification);
        };
    }, []);

    useEffect(() => {
        if (!isFactorTv || !isWebBased) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            const currentIndex = focusableRefs.findIndex((ref) => ref.current === document.activeElement);

            if (currentIndex === -1) return;
            const moveFocus = (newIndex: number) => {
                const newFocusedRef = focusableRefs[newIndex]?.current;
                if (newFocusedRef) {
                    newFocusedRef.focus();
                    setFocusedIndex(newIndex);
                }
            };
            const keyActions: { [key: string]: () => void } = {
                ArrowUp: () => currentIndex > 0 && moveFocus(currentIndex - 1),
                ArrowDown: () => currentIndex < focusableRefs.length - 1 && moveFocus(currentIndex + 1),
            };
            const action = keyActions[event.key];

            if (action) {
                action();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [focusableRefs]);

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
                    {...testProps('app-harness-home-screen-renative-image')}
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
                    onTouchStart={() => {
                        setLogsFocused(false);
                    }}
                >
                    <TestCase id={1} title="Hermes support ">
                        <Text style={styles.text}>{`hermes: ${
                            typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'
                        }`}</Text>
                    </TestCase>
                    <TestCase id={2} title="Native call">
                        <NewModuleButton
                            ref={nativeModuleBtnRef}
                            onFocus={() => setFocusedIndex(0)}
                            onBlur={() => setFocusedIndex(null)}
                            style={[
                                styles.button,
                                { backgroundColor: '#841584' },
                                focusedIndex === 0 && styles.buttonFocused,
                                isWebBased && isFactorTv && { outline: 'none' },
                            ]}
                        />
                    </TestCase>
                    <TestCase id={3} title="Orientation support ">
                        <OrientationLocker
                            orientation={PORTRAIT}
                            onChange={(orientation) => logDebug(`onChange ${orientation}`)}
                            onDeviceChange={(orientation) => logDebug(`onDeviceChange ${orientation}`)}
                        />
                        <TouchableOpacity
                            ref={orientationBtnRef}
                            onPress={() => setShowVideo(!showVideo)}
                            style={[
                                styles.button,
                                focusedIndex === 1 && styles.buttonFocused,
                                isWebBased && isFactorTv && { outline: 'none' },
                            ]}
                            onFocus={() => setFocusedIndex(1)}
                            onBlur={() => setFocusedIndex(null)}
                        >
                            <Text style={styles.buttonTitle}>Toggle Video</Text>
                        </TouchableOpacity>
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
                        <TouchableOpacity
                            ref={permissionBtnRef}
                            onPress={handleRequestPermissions}
                            style={[
                                styles.button,
                                focusedIndex === 2 && styles.buttonFocused,
                                isWebBased && isFactorTv && { outline: 'none' },
                            ]}
                            onFocus={() => setFocusedIndex(2)}
                            onBlur={() => setFocusedIndex(null)}
                        >
                            <Text style={styles.buttonTitle}>Request permissions</Text>
                        </TouchableOpacity>
                    </TestCase>
                    <TestCase id={5} title="Image Support">
                        <Image source={ICON_LOGO} style={{ width: 100, height: 100 }} />
                    </TestCase>
                    <TestCase id={6} title="Cast Support">
                        <CastComponent />
                    </TestCase>
                    {/* 
                        on iOS Splash screen does not work, package issue
                        https://github.com/crazycodeboy/react-native-splash-screen/issues/610
                    */}
                    <TestCase id={7} title="Splash Screen">
                        {isPlatformIos && (
                            <Text style={styles.text}>
                                On iOS there is a package issue that prevents splash screen from showing
                            </Text>
                        )}
                        <TouchableOpacity
                            ref={splashBtnRef}
                            onPress={() => SplashScreen.show()}
                            style={[
                                styles.button,
                                focusedIndex === 3 && styles.buttonFocused,
                                isWebBased && isFactorTv && { outline: 'none' },
                            ]}
                            onFocus={() => setFocusedIndex(3)}
                            onBlur={() => setFocusedIndex(null)}
                        >
                            <Text style={styles.buttonTitle}>Show SplashScreen</Text>
                        </TouchableOpacity>
                    </TestCase>
                    <TestCase id={8} title="PhotoEditor">
                        <PhotoEditorButton
                            ref={photoEditorBtnRef}
                            onFocus={() => setFocusedIndex(4)}
                            onBlur={() => setFocusedIndex(null)}
                            style={[
                                styles.button,
                                focusedIndex === 4 && styles.buttonFocused,
                                isWebBased && isFactorTv && { outline: 'none' },
                            ]}
                        />
                    </TestCase>
                    <TestCase id={9} title="Player">
                        <Player />
                    </TestCase>
                </ScrollView>
            </View>
            <ScrollView
                style={{
                    backgroundColor: '#EEEEEE',
                    maxHeight: (isTizenwatch() || isAndroidwear()) && logsFocused ? '50%' : '20%',
                    width: '100%',
                    borderTopWidth: 1,
                    borderTopColor: 'black',
                    padding: 10,
                }}
                contentContainerStyle={{
                    paddingBottom: 10,
                }}
                onTouchStart={() => {
                    setLogsFocused(true);
                }}
            >
                <Text style={[styles.dynamicText, { fontWeight: 'bold', paddingHorizontal: 25 }]}>{`Logs: `}</Text>
                {logs
                    ? logs.map((it, idx) => (
                          <Text
                              key={idx}
                              style={[
                                  styles.dynamicText,
                                  { paddingHorizontal: 25 },
                                  idx === logs.length - 1 && { paddingBottom: 80 },
                              ]}
                          >
                              {it}
                          </Text>
                      ))
                    : null}
            </ScrollView>
        </View>
    );
};

export default App;
