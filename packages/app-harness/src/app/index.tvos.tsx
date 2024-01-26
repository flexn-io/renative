import React from 'react';
import { Text, View } from 'react-native';

const App = () => {
    return (
        <View>
            <Text>ReNative Harness</Text>
            <Text>{`hermes: ${typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'}`}</Text>
        </View>
    );
};

export default App;
