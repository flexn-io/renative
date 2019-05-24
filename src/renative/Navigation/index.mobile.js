import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { Icon } from '../index';
import Theme from '../../theme';

const createApp = navigator => createAppContainer(navigator);
let _currentNavigation;

const getNavigation = () => _currentNavigation;

const createNavigator = (screens, menu) => createDrawerNavigator(
    {
        INIT: {
            screen: createStackNavigator(screens, {
                navigationOptions: {
                    drawerIcon: ({ tintColor }) => (
                        <Icon
                            iconFont="fontAwesome"
                            iconName="navicon"
                            iconColor={Theme.header.primaryColor}
                            style={{ width: 40, height: 40 }}
                        />
                    ),
                },
            }),
        },
    },
    {
        contentComponent: menu,
        drawerIcon: ({ tintColor }) => (
            <Icon
                iconFont="fontAwesome"
                iconName="navicon"
                iconColor={Theme.header.primaryColor}
                style={{ width: 40, height: 40 }}
            />
        ),
    },
);
const createNavigatorView = (Navigator, navigation) => {
    _currentNavigation = navigation;

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
            <Navigator navigation={navigation} />
        </View>
    );
};

export default { createNavigator, createNavigatorView, getNavigation, createApp };
