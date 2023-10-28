import React from 'react';
import { View, Text } from 'react-native';
import { themeStyles } from '../config';

export default function Page() {
    return (
        <View style={themeStyles.container}>
            <Text style={themeStyles.textH2}>This is custom 404!</Text>
        </View>
    );
}
