import React from 'react';
import { Text, View, StyleSheet, getScaledValue } from 'react-native';
import Theme from './theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.color1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textH2: {
        fontFamily: Theme.primaryFontFamily,
        fontSize: getScaledValue(20),
        marginHorizontal: getScaledValue(20),
        color: Theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const ScreenMyPage = () => (
    <View style={styles.container}>
        <Text style={styles.textH2}>
            This is my Page!
        </Text>
    </View>
);

export default ScreenMyPage;
