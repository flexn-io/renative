/* eslint-disable react/prop-types */

import React, { useContext } from 'react';
import { StatusBar, View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CastButton } from 'react-native-google-cast';
import { isFactorDesktop } from 'renative';
import ScreenHome from '../components/screenHome';
import ScreenMyPage from '../components/screenMyPage';
import ScreenModal from '../components/screenModal';
import Menu from '../components/menu';
import { ThemeContext } from '../config';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
            <Menu navigation={navigation} />
            <Stack.Navigator
                screenOptions={{
                    headerTitleStyle: theme.styles.headerTitle,
                    headerStyle: theme.styles.header,
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                }}
            >
                <Stack.Screen
                    name="home"
                    component={ScreenHome}
                    options={{
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

        </View>

    );
};

const App = () => {
    const { theme } = useContext(ThemeContext);
    React.useEffect(() => {
        StatusBar.setBarStyle(theme.static.statusBar);
    }, []);
    return (
        <View style={{ marginTop: 36, flex: 1 }}>
            <NavigationContainer>
                <ModalStack.Navigator
                    headerMode="none"
                    mode="modal"
                    screenOptions={{
                        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                    }}
                >
                    <ModalStack.Screen name="stack" component={StackNavigator} />
                    <ModalStack.Screen name="modal" component={ScreenModal} />
                </ModalStack.Navigator>
            </NavigationContainer>
        </View>

    );
};

export default App;
