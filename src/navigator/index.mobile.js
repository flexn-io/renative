import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

const createApp = navigator => createAppContainer(navigator);

const createNavigator = (screens, menu) => createDrawerNavigator(screens, {
    contentComponent: menu,
});

const createNavigatorView = (Navigator, navigation) => (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
        <Navigator navigation={navigation} />
    </View>
);

export default { createNavigator, createNavigatorView, createApp };
