import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { Icon, Api } from '../index';

const createSideMenuNavigator = require('react-navigation-side-menu').createSideMenuNavigator;

let _currentNavigation;

const getNavigation = () => _currentNavigation;

const handleNavigationChange = (n) => {
    console.log('LDKJLKD', n);
};

const shouldUse = (menu) => {
    if (menu && menu.isVisibleIn.includes(Api.platform)) {
        console.log('YEEES');
        return true;
    }
    return false;
};

const createFilteredStackNavigator = (rootRoute, rootScreen, rootNavOptions, allStacks, filter) => {
    const stacks = {};
    stacks[rootRoute] = {
        screen: rootScreen.screen,
        navigationOptions: Object.assign({}, rootNavOptions, rootScreen.navigationOptions),
    };

    for (stackKey in allStacks.screens) {
        if (filter.includes(`stacks.${stackKey}`)) {
            stacks[stackKey] = {
                screen: allStacks.screens[stackKey].screen,
                navigationOptions: Object.assign({}, allStacks.navigationOptions, allStacks.screens[stackKey].navigationOptions),
            };
        }
    }
    console.log('SAAAAAA', stacks);
    return createStackNavigator(stacks);
};

const createApp = (c, navigation) => {
    console.log('KDJKDJDL', c, Api.platform, navigation);
    _currentNavigation = navigation;

    const root = c.root;
    let rootNav;
    let stackNav;

    const roots = {};
    for (rootKey in root.screens) {
        const rootConfig = root.screens[rootKey];
        roots[rootKey] = {
            screen: createFilteredStackNavigator(rootKey, rootConfig, root.navigationOptions, c.stacks, rootConfig.stacks),
            navigationOptions: Object.assign(root.navigationOptions, rootConfig.navigationOptions),
        };
    }

    if (root.menus) {
        // ROOT CONTENT IS WRAPPED IN MENU
        if (shouldUse(root.menus.drawerMenu)) {
            rootNav = createDrawerNavigator(roots, {
                contentComponent: root.menus.drawerMenu.component,
                navigationOptions: {},
            });
        } else if (shouldUse(root.menus.sideMenu)) {
            rootNav = createSideMenuNavigator(roots, {
                tabBarComponent: root.menus.sideMenu.component,
                navigationOptions: {},
            });
        }
    } else {
        // ROOT CONTENT HAS NO MENU
    }

    const Navigator = createAppContainer(rootNav);

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
            <Navigator
                ref={(nav) => {
                    _currentNavigation = nav._navigation;
                }}
                onNavigationStateChange={handleNavigationChange}
                uriPrefix="/app"
            />
        </View>
    );
};

export { createApp, getNavigation };
