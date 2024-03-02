import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles';

const App = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>ReNative Harness</Text>
            <Text style={styles.text}>{`hermes: ${
                typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'
            }`}</Text>
        </View>
    );
};

export default App;
