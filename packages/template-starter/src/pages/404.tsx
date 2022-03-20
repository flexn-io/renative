/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { themeStyles } from '../config';

export default function Page() {
    return (
        <View style={themeStyles.screen}>
            <ScrollView contentContainerStyle={themeStyles.container}>
                <Text style={themeStyles.textH2}>This is custom 404!</Text>
            </ScrollView>
        </View>
    );
}
