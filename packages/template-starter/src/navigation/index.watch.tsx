import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScreenHome from '../screens/Home';
import ScreenMyPage from '../screens/MyPage';

const Stack = createStackNavigator();

const App = () => (
    <NavigationContainer>
        <Stack.Navigator headerMode="none" mode="modal">
            <Stack.Screen name="home" component={ScreenHome} />
            <Stack.Screen name="my-page" component={ScreenMyPage} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default App;
