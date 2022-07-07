import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { isFactorDesktop } from '@rnv/renative';
import Menu, { DrawerButton } from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';
import { ThemeContext } from '../config';
import { CastButton } from '../components/CastButton';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = ({ navigation }) => {
    const { theme }: any = useContext(ThemeContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: theme.styles.headerTitle,
                headerStyle: theme.styles.header,
                // headerTintColor: theme.static.colorTextPrimary
            }}
        >
            <Stack.Screen
                name="home"
                component={ScreenHome}
                options={{
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerRight: () => {
                        if (!isFactorDesktop) {
                            return (
                                <CastButton style={{
                                    width: theme.static.iconSize, height: theme.static.iconSize, tintColor: theme.static.color3
                                }}
                                />
                            );
                        }
                    }
                }}
            />
            <Stack.Screen name="my-page" component={ScreenMyPage} />
        </Stack.Navigator>
    );
};

const ModalNavigator = () => (
    <ModalStack.Navigator headerMode="none" mode="modal">
        <ModalStack.Screen name="stack" component={StackNavigator} />
        <ModalStack.Screen name="modal" component={ScreenModal} />
    </ModalStack.Navigator>
);

const App = () => {
    const { theme }: any = useContext(ThemeContext);
    React.useEffect(() => {
        StatusBar.setBarStyle(theme.static.statusBar);
    }, []);
    return (
        <NavigationContainer>
            {/* TODO: [macOS] fix the issue where drawer buttons just closes the drawer */}
            <Drawer.Navigator drawerContent={props => <Menu {...props} />}>
                <Drawer.Screen name="drawer" component={ModalNavigator} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default App;
