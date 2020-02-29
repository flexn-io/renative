
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useIsFocused, useLinking, useNavigationState } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeModules } from 'react-native';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const DrawerNavigator = () => (
    <Drawer.Navigator drawerContent={() => <Menu />}>
        <Drawer.Screen name="Home" component={ScreenHome} />
        <Drawer.Screen name="MyPage" component={ScreenMyPage} />
    </Drawer.Navigator>
);

const App = props => (
    <NavigationContainer>
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Stack" component={DrawerNavigator} />
        </Stack.Navigator>
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
