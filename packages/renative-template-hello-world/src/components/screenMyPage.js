/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { ThemeContext, hasWebFocusableUI } from '../config';

const ScreenMyPage = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={theme.styles.screen}>
            <ScrollView contentContainerStyle={theme.styles.container}>
                <Text style={theme.styles.textH2}>This is my Page!</Text>
            </ScrollView>
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(ScreenMyPage) : ScreenMyPage);
