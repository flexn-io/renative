import React from 'react';
import { View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

let Menu;

const createApp = navigator => createAppContainer(navigator);

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

export default { createNavigator, createNavigatorView, createApp };
