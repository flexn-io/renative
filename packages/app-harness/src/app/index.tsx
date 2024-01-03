import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {

    useEffect(() => {
        SplashScreen.hide();
    }, []);
    return (
        <View>
            <Text>ReNative Harness</Text>
            <Text>{`hermes: ${typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'}`}</Text>
        </View>
    );
};

export default App;
