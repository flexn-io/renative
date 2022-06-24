import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { StatusBar, View } from 'react-native';
import { isFactorDesktop } from '@rnv/renative';
import Menu from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';
import { ThemeContext, themeStyles } from '../config';
import { CastButton } from '../components/CastButton';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
    const { theme }: any = useContext(ThemeContext);

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
    const { theme }: any = useContext(ThemeContext);
    React.useEffect(() => {
        StatusBar.setBarStyle(theme.static.statusBar);
    }, []);
    return (
        <View style={themeStyles.app}>
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
