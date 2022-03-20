import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Menu from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';

const ModalStack = createStackNavigator();
const TabStack = createStackNavigator();

const TabNavigator = props => (
    <>
        <Menu {...props} />
        <TabStack.Navigator
            headerMode="none"
            mode="modal"
            screenOptions={{ animationEnabled: false }}
        >
            <TabStack.Screen name="/" component={ScreenHome} />
            <TabStack.Screen name="my-page" component={ScreenMyPage} />
        </TabStack.Navigator>
    </>);

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
