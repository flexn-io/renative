
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getScaledValue, Icon } from 'renative';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import Theme, { themeStyles } from './theme';


const Stack = createStackNavigator();
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
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
        headerTintColor: Theme.color3
    }}
    >
        <Stack.Screen
            name="home"
            component={ScreenHome}
            options={{
                headerLeft: () => (
                    <Icon
                        iconFont="ionicons"
                        iconName="md-menu"
                        iconColor={Theme.color3}
                        style={themeStyles.icon}
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


const App = () => (
    <NavigationContainer>
        <Drawer.Navigator drawerContent={Menu}>
            <Drawer.Screen name="drawer" component={ModalNavigator} />
        </Drawer.Navigator>
    </NavigationContainer>

);

export default App;
