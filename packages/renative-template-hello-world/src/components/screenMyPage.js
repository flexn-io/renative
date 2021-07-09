/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { themeStyles, hasWebFocusableUI } from '../config';

const ScreenMyPage = () => (
    <View style={themeStyles.screen}>
        <ScrollView contentContainerStyle={themeStyles.container}>
            <Text style={themeStyles.textH2}>This is my Page!</Text>
        </ScrollView>
    </View>
);

export default (hasWebFocusableUI ? withFocusable()(ScreenMyPage) : ScreenMyPage);
