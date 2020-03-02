
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ScreenHome from '../screenHome';
import ScreenMyPage from '../screenMyPage';
import ScreenModal from '../screenModal';
import Menu from '../menu';

const ModalStack = createStackNavigator();
const TabStack = createMaterialTopTabNavigator();
console.disableYellowBox = true;

const TabNavigator = () => (
    <TabStack.Navigator tabBar={props => <Menu {...props} />} removeClippedSubviews swipeEnabled={false} animationEnabled={false}>
        <TabStack.Screen name="home" component={ScreenHome} />
        <TabStack.Screen name="my-page" component={ScreenMyPage} />
    </TabStack.Navigator>
);

const App = () => (
    <NavigationContainer>
        <ModalStack.Navigator headerMode="none" mode="modal" screenOptions={{ animationEnabled: false }}>
            <ModalStack.Screen name="stack" component={TabNavigator} />
            <ModalStack.Screen name="modal" component={ScreenModal} />
        </ModalStack.Navigator>
    </NavigationContainer>

);

export default App;
