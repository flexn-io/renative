
import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useIsFocused, useLinking, useNavigationState, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeModules } from 'react-native';
import { getScaledValue, Icon } from 'renative';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import Theme from './theme';


const Stack = createStackNavigator();
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
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
        borderBottomWidth: 1,
        height: getScaledValue(70),
    }
});


const StackNavigator = ({ navigation }) => (
    <Stack.Navigator screenOptions={{
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.header,
        headerTintColor: Theme.color3,
        headerTitleStyle: styles.headerTitle
    }}
    >
        <Stack.Screen
            name="home"
            component={ScreenHome}
            options={{
                headerLeft: n => (
                    <Icon
                        iconFont="ionicons"
                        iconName="md-menu"
                        iconColor={Theme.color3}
                        style={styles.menuIcon}
                        onPress={() => {
                            navigation.dispatch(DrawerActions.openDrawer());
                        }}
                    />
                )
            }}
        />
        <Stack.Screen name="my-page" component={ScreenMyPage} />
    </Stack.Navigator>
);

const ModalNavigator = () => (
    <ModalStack.Navigator headerMode="none" mode="modal">
        <ModalStack.Screen name="stack" component={StackNavigator} />
        <ModalStack.Screen name="my-modal" component={ScreenModal} />
    </ModalStack.Navigator>
);


const App = props => (
    <NavigationContainer>
        <Drawer.Navigator drawerContent={Menu}>
            <Drawer.Screen name="drawer" component={ModalNavigator} />
        </Drawer.Navigator>
    </NavigationContainer>

);

export default App;


// import React from 'react';
// import { createApp, registerFocusManger, registerServiceWorker } from 'renative';
// import { navStructure } from './nav';
// import ScreenHome from './screenHome';
// import ScreenMyPage from './screenMyPage';
// import ScreenModal from './screenModal';
// import Menu from './menu';
//
// import '../platformAssets/runtime/fontManager';
//
// registerFocusManger({ focused: 'opacity: 0.4' });
// registerServiceWorker();
//
// // Flag to enable yellow warnings
// console.disableYellowBox = true;
//
//
// let AppContainer;
//
// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         AppContainer = createApp(navStructure, { ScreenHome, ScreenMyPage, ScreenModal, Menu });
//     }
//
//     render() {
//         return AppContainer;
//     }
// }
//
// export default App;
