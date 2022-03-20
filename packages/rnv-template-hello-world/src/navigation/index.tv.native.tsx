import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Menu from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';

const ModalStack = createStackNavigator();
const TabStack = createMaterialTopTabNavigator();

const TabNavigator = () => (
    <TabStack.Navigator
        tabBar={props => <Menu {...props} />}
        removeClippedSubviews
        swipeEnabled={false}
        timingConfig={{ duration: 0.001 }}
    >
        <TabStack.Screen name="home" component={ScreenHome} />
        <TabStack.Screen name="my-page" component={ScreenMyPage} />
    </TabStack.Navigator>
);

const App = () => (
    <NavigationContainer>
        <ModalStack.Navigator
            headerMode="none"
            mode="modal"
            screenOptions={{ animationEnabled: false }}
        >
            <ModalStack.Screen name="stack" component={TabNavigator} />
            <ModalStack.Screen name="modal" component={ScreenModal} />
        </ModalStack.Navigator>
    </NavigationContainer>
);

export default App;
