/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { themeStyles, ICON_LOGO } from '../config';

const ScreenMyPage = () => (
    <View>
        <ScrollView contentContainerStyle={themeStyles.container}>
            <Image style={themeStyles.image} source={ICON_LOGO} />
            <Text style={themeStyles.textH2}>This is cast Page!</Text>
        </ScrollView>
    </View>
);

export default ScreenMyPage;
