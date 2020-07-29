import React from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { getScaledValue, StyleSheet } from 'renative';
import { themeStyles, hasWebFocusableUI, ICON_LOGO } from './theme';

const styles = StyleSheet.create({
    image: {
        marginBottom: getScaledValue(30),
        width: getScaledValue(83),
        height: getScaledValue(97),
    }
});

const ScreenMyPage = () => (
    <View style={themeStyles.screen}>
        <ScrollView contentContainerStyle={themeStyles.container}>
            <Image style={styles.image} source={ICON_LOGO} />
            <Text style={themeStyles.textH2}>
This is cast Page!
            </Text>
        </ScrollView>
    </View>
);

export default (hasWebFocusableUI ? withFocusable()(ScreenMyPage) : ScreenMyPage);
