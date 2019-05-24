import React from 'react';
import { View } from 'react-native';
import {
    createNavigation,
    createNavigator,
    createNavigatorView,
    createApp,
    Icon,
    Api,
    IOS,
    ANDROID,
    WEB,
    WEBOS,
    TIZEN,
    MACOS,
    ANDROID_TV,
    WINDOWS,
    TVOS,
} from './renative';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import Menu from './menu';
import Theme from './theme';
import Fonts from '../platformAssets/runtime/fontManager';

const navStructure = {
    root: {
        menus: {
            drawerMenu: {
                position: 'left',
                isVisibleIn: [IOS, ANDROID],
                component: Menu,
                navigationOptions: {},
            },
            sideMenu: {
                position: 'left',
                isVisibleIn: [WEB, MACOS, WINDOWS],
                component: Menu,
                navigationOptions: {},
            },
            topMenu: {
                isVisibleIn: [TVOS, ANDROID_TV, TIZEN],
                component: Menu,
                navigationOptions: {},
            },
            tabMenu: {
                position: 'bottom',
                isVisibleIn: [TVOS, ANDROID_TV, TIZEN],
                component: Menu,
                navigationOptions: {},
            },
        },
        screens: {
            Home: {
                screen: ScreenHome,
                navigationOptions: {},
                stacks: ['stacks.MyPage2', 'stacks.MyPage3'],
            },
            MyPage: {
                screen: ScreenMyPage,
                tabMenu: {
                    position: 'top',
                    isVisibleIn: [IOS, ANDROID],
                    screens: ['root.MyPage2', 'root.MyPage', 'stacks.MyPage2', 'stacks.MyPage3'],
                },
                navigationOptions: {},
                stacks: ['stacks.MyPage2'],
            },
        },
        navigationOptions: {
            headerTitleStyle: {
                color: Theme.header.primaryColor,
                fontFamily: Theme.primaryFontFamily,
            },
            headerStyle: {
                backgroundColor: '#222222',
                color: Theme.header.primaryColor,
            },
            headerLeft: (n) => {
                if (![IOS, ANDROID].includes(Api.platform)) return null;
                return (
                    <Icon
                        iconFont="ionicons"
                        iconName="md-menu"
                        iconColor={Theme.header.primaryColor}
                        style={{ width: 40, height: 40, marginLeft: 10 }}
                        onPress={() => {
                            Api.navigation.openDrawer();
                        }}
                    />
                );
            },
        },
    },
    stacks: {
        screens: {
            MyPage2: {
                screen: ScreenMyPage,
                navigationOptions: {
                    title: 'My Page 2',
                },
            },
            MyPage3: {
                screen: ScreenMyPage,
                navigationOptions: {
                    title: 'My Page 3',
                },
            },
        },
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#000000',
                color: 'white',
            },
        },
    },
    modals: {
        screens: {
            MyModal: {
                screen: ScreenMyPage,
                navigationOptions: {
                    title: 'My Modal',
                },
            },
        },
        navigationOptions: {
            header: null,
        },
    },
};

let AppContainer;

class App extends React.Component {
    constructor(props) {
        super(props);

        AppContainer = createApp(navStructure);
    }

    render() {
        return AppContainer;
    }
}

export default App;
