import React from 'react';
import { View } from 'react-native';
import { createSwitchNavigator } from '@react-navigation/core';
import { createBrowserApp } from '@react-navigation/web';

let Menu;

const createApp = navigator => createBrowserApp(navigator);

const createNavigator = (screens, menu) => {
    Menu = menu;
    return createSwitchNavigator(screens);
};

const createNavigatorView = (Navigator, navigation) => (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
        <Menu navigation={navigation} style={{ flex: undefined, width: 200 }} />
        <Navigator navigation={navigation} />
    </View>
);

export { createNavigator, createNavigatorView, createApp };
