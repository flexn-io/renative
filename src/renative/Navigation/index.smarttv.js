import React from 'react';
import { View } from 'react-native';

let Menu;
let Screens;

const createApp = navigator => navigator;

const createNavigator = (screens, menu) => {
    Menu = menu;
    Screens = screens;
    return {
        router: {},
    };
};

const createNavigatorView = (Navigator, navigation) => {
    const Screen = Screens.ScreenHome;
    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
            <Menu navigation={navigation} style={{ flex: undefined, width: 200 }} />
            <Screen />
        </View>
    );
};

export { createNavigator, createNavigatorView, createApp };
