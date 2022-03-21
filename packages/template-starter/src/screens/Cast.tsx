/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { themeStyles, hasWebFocusableUI, ICON_LOGO } from '../config';
import { testProps } from '../utils';

const ScreenMyPage = () => (
    <View style={themeStyles.screen}>
        <ScrollView contentContainerStyle={themeStyles.container} {...testProps('template-starter-cast-screen-container')}>
            <Image style={themeStyles.image} source={ICON_LOGO} />
            <Text style={themeStyles.textH2}>This is cast Page!</Text>
        </ScrollView>
    </View>
);

export default (hasWebFocusableUI ? withFocusable()(ScreenMyPage) : ScreenMyPage);
