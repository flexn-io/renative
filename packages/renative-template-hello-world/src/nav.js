import React from 'react';
import {
    Icon,
    Api,
    IOS,
    ANDROID,
    WEB,
    WEBOS,
    TIZEN,
    MACOS,
    ANDROID_TV,
    ANDROID_WEAR,
    FIREFOX_TV,
    WINDOWS,
    TVOS,
    TIZEN_WATCH,
    KAIOS,
    TIZEN_MOBILE,
    getScaledValue,
} from 'renative';
import Theme from './theme';

const isDrawerMenuBased = () => navStructure.root.menus.drawerMenu.isVisibleIn.includes(Api.platform);
const isTopMenuBased = () => navStructure.root.menus.topMenu.isVisibleIn.includes(Api.platform);

const styles = {
  menuIcon: {
    width: getScaledValue(40),
    height: getScaledValue(40),
    marginLeft: getScaledValue(10),
  },
  headerTitle: {
      color: Theme.color3,
      fontFamily: Theme.primaryFontFamily,
      fontSize: getScaledValue(18)
  },
  header: {
      backgroundColor: Theme.color1,
      borderBottomWidth: isTopMenuBased ? 0 : 1,
      height: getScaledValue(50),
  }
}

const navStructure = {
    root: {
        menus: {
            drawerMenu: {
                position: 'left',
                isVisibleIn: [IOS, ANDROID, TIZEN_MOBILE],
                component: 'Menu',
                options: {
                    drawerBackgroundColor: Theme.color1,
                    drawerWidth: getScaledValue(250)
                },
                navigationOptions: {},
            },
            sideMenu: {
                position: 'left',
                isVisibleIn: [MACOS, WINDOWS],
                component: 'Menu',
                options: {
                    menuWidth: getScaledValue(250)
                },
                navigationOptions: {},
            },
            topMenu: {
                isVisibleIn: [TVOS, ANDROID_TV, TIZEN, FIREFOX_TV, WEB, WEBOS],
                component: 'Menu',
                options: {
                    menuHeight: getScaledValue(100)
                },
                navigationOptions: {},
            },
            tabMenu: {
                position: 'bottom',
                isVisibleIn: [TVOS, ANDROID_TV, TIZEN],
                component: 'Menu',
                navigationOptions: {},
            },
            modalMenu: {
                position: 'hidden',
                isVisibleIn: [KAIOS],
                component: 'Menu',
                navigationOptions: {},
            },
            swipeMenu: {
                isVisibleIn: [ANDROID_WEAR, TIZEN_WATCH],
            },
        },
        screens: {
            Home: {
                screen: 'ScreenHome',
                navigationOptions: {
                    title: 'Home',
                },
                stacks: ['stacks.MyPage2', 'stacks.MyPage3'],
            },
            MyPage: {
                screen: 'ScreenMyPage',
                tabMenu: {
                    position: 'bottom',
                    isVisibleIn: [IOS, ANDROID],
                    screens: ['root.MyPage2', 'root.MyPage', 'stacks.MyPage2', 'stacks.MyPage3'],
                },
                navigationOptions: {
                    title: 'My Page'
                },
                stacks: ['stacks.MyPage2'],
            },
        },
        navigationOptions: {
            headerTitleStyle: styles.headerTitle,
            headerStyle: styles.header,
            headerLeft: (n) => {
                if (!isDrawerMenuBased()) return null;
                return (
                    <Icon
                        iconFont="ionicons"
                        iconName="md-menu"
                        iconColor={Theme.color3}
                        style={styles.menuIcon}
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
                screen: 'ScreenMyPage',
                navigationOptions: {
                    title: 'My Page 2',
                },
            },
            MyPage3: {
                screen: 'ScreenMyPage',
                navigationOptions: {
                    title: 'My Page 3',
                },
            },
        },
        navigationOptions: {
            headerStyle: styles.header,
            headerTintColor: Theme.color3,
            headerTitleStyle: styles.headerTitle,
        },
    },
    modals: {
        screens: {
            MyModal: {
                screen: 'ScreenModal',
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

export { navStructure, isDrawerMenuBased, isTopMenuBased };
