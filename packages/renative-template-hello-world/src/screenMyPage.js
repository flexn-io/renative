import React from 'react';
import { Text, View } from 'react-native';
import { themeStyles } from './theme';

const ScreenMyPage = () => (
    <View style={themeStyles.container}>
        <Text style={themeStyles.textH2}>
            This is my Page!
        </Text>
    </View>
);

export default ScreenMyPage;
