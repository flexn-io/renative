import React from 'react';
import { View, Text } from 'react-native';
import { Api } from 'renative';

const App = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>
            {'This is blank app'}
        </Text>
        <Text>
            {`platform: ${Api.platform}`}
        </Text>
        <Text>
            {`factor: ${Api.formFactor}`}
        </Text>
    </View>
);

export default App;
