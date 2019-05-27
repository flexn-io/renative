import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Icon, Api } from '../index';

const createSideMenuNavigator = require('react-navigation-side-menu').createSideMenuNavigator;

let _currentNavigation;

const getNavigation = () => _currentNavigation;

const handleNavigationChange = (n) => {
};

const shouldUse = (menu) => {
    if (menu && menu.isVisibleIn.includes(Api.platform)) {
        return true;
    }
    return false;
};

const createFilteredStackNavigator = (c, componentMap, rootRoute, rootScreen, rootNavOptions, allStacks, filter) => {
    const stacks = {};
    stacks[rootRoute] = {
        screen: componentMap[rootScreen.screen],
        navigationOptions: Object.assign({}, rootNavOptions, rootScreen.navigationOptions),
    };

    for (stackKey in allStacks.screens) {
        if (filter.includes(`stacks.${stackKey}`)) {
            stacks[stackKey] = {
                screen: componentMap[allStacks.screens[stackKey].screen],
                navigationOptions: Object.assign({}, allStacks.navigationOptions, allStacks.screens[stackKey].navigationOptions),
            };
        }
    }

    for (stackKey in allStacks.screens) {
        if (filter.includes(`stacks.${stackKey}`)) {
            stacks[stackKey] = {
                screen: componentMap[allStacks.screens[stackKey].screen],
                navigationOptions: Object.assign({}, allStacks.navigationOptions, allStacks.screens[stackKey].navigationOptions),
            };
        }
    }
    return createStackNavigator(stacks);
};

const createApp = (c, componentMap) => {
    const root = c.root;
    let rootNav;
    let stackNav;
    const roots = {};
    const rootWrappersStacks = {};
    let rootWrapper;

    // MODALS SCREENS
    for (modalKey in c.modals.screens) {
        rootWrappersStacks[modalKey] = {
            screen: componentMap[c.modals.screens[modalKey].screen],
            navigationOptions: Object.assign({}, c.modals.navigationOptions, c.modals.screens[modalKey].navigationOptions),
        };
    }

    // ROOT SCREENS
    for (rootKey in root.screens) {
        const rootConfig = root.screens[rootKey];
        roots[rootKey] = {
            screen: createFilteredStackNavigator(c, componentMap, rootKey, rootConfig, root.navigationOptions, c.stacks, rootConfig.stacks),
            navigationOptions: Object.assign(root.navigationOptions, rootConfig.navigationOptions),
        };
    }

    if (root.menus) {
        // ROOT CONTENT IS WRAPPED IN MENU
        if (shouldUse(root.menus.drawerMenu)) {
            rootNav = createDrawerNavigator(roots, {
                contentComponent: componentMap[root.menus.drawerMenu.component],
                ...root.menus.drawerMenu.options,
            });
        } else if (shouldUse(root.menus.sideMenu)) {
            rootNav = createSideMenuNavigator(roots, {
                tabBarComponent: componentMap[root.menus.sideMenu.component],
                tabBarOptions: {
                    position: 'left',
                    style: {
                        width: root.menus.sideMenu.options.menuWidth || 250
                    }
                },
                navigationOptions: {},
            });
        } else if (shouldUse(root.menus.topMenu)) {
            rootNav = createSideMenuNavigator(roots, {
                tabBarComponent: componentMap[root.menus.topMenu.component],
                tabBarOptions: {
                    position: 'top',
                    style: {
                        height: root.menus.topMenu.options.menuHeight || 50
                    }
                },
                navigationOptions: {
                    tabStyle: {}
                },
            });
        }
    } else {
        // ROOT CONTENT HAS NO MENU

    }

    if (rootNav) {
        rootWrappersStacks.ROOT = rootNav;

        rootWrapper = createStackNavigator(rootWrappersStacks, {
            initialRouteName: 'ROOT',
            mode: 'modal',
            defaultNavigationOptions: {
                header: null
            }
        });
    } else {
        rootWrapper = createSwitchNavigator(roots);
    }


    const Navigator = createAppContainer(rootWrapper);

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
