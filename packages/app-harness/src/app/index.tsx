import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import NewModuleButton from './NewModuleButton';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from 'react-native-orientation-locker';
import { isPlatformAndroid } from '@rnv/renative';


const App = () => {
    const [showVideo, setShowVideo] = useState(false);
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ReNative Harness !!</Text>
            <Text>{`hermes: ${typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'}`}</Text>
            {isPlatformAndroid ? (
                <>
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
                                <Text>Landscape video goes here</Text>
                            </View>
                        </View>
                    )}
                </>
            ) : null}
        </View>
    );
};

export default App;
