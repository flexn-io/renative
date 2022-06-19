import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { getScaledValue } from '@rnv/renative';
import Menu, { DrawerButton } from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';
import Theme from '../config';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();

const styles = StyleSheet.create({
    headerTitle: {
        color: Theme.colorTextPrimary,
        fontFamily: Theme.primaryFontFamily,
        fontSize: getScaledValue(18)
    },
    header: {
        backgroundColor: Theme.colorBgPrimary,
        borderBottomWidth: 1,
        height: getScaledValue(70)
    }
});

const StackNavigator = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            headerStyle: styles.header
        }}
    >
        <Stack.Screen
            name="home"
            component={ScreenHome}
            options={{
                headerLeft: () => <DrawerButton navigation={navigation} />
            }}
        />
        <Stack.Screen name="my-page" component={ScreenMyPage} />
    </Stack.Navigator>
);

const App = () => (
    <NavigationContainer>
        <ModalStack.Navigator headerMode="none" mode="modal">
            <ModalStack.Screen name="stack" component={StackNavigator} />
            <ModalStack.Screen name="modal" component={ScreenModal} />
            <ModalStack.Screen name="Drawer" component={Menu} />
        </ModalStack.Navigator>
    </NavigationContainer>
);

export default App;
