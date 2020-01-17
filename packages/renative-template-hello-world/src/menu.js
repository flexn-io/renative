import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Api, Button, getScaledValue } from 'renative';
import { isTopMenuBased } from './nav';
import Theme from './theme';

let isTop;

const styles = StyleSheet.create({
    containerVertical: {
        paddingTop: getScaledValue(40),
        paddingLeft: getScaledValue(20),
        width: '100%',
        height: '100%',
        backgroundColor: Theme.color1,
        alignItems: 'center',
        borderRightWidth: getScaledValue(1),
        borderRightColor: '#AAAAAA',
        flexDirection: 'column'
    },
    containerHorizontal: {
        paddingLeft: getScaledValue(40),
        width: '100%',
        height: '100%',
        backgroundColor: Theme.color1,
        alignItems: 'center',
        borderBottomWidth: getScaledValue(1),
        borderBottomColor: '#AAAAAA',
        flexDirection: 'row'
    },
    text: {
        fontFamily: Theme.primaryFontFamily,
        color: Theme.color4,
        fontSize: getScaledValue(20),
        marginTop: getScaledValue(10),
        textAlign: 'left',
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: getScaledValue(20),
        maxWidth: getScaledValue(400),
        minWidth: getScaledValue(50),
        borderWidth: 0,
    },
});

class Menu extends React.Component {
    constructor(props) {
        super(props);
        isTop = isTopMenuBased();
    }

    render() {
        return (
            <View style={[isTop ? styles.containerHorizontal : styles.containerVertical, this.props.style]}>
                <Text style={styles.text}>
                    Menu
                </Text>
                <Button
                    title="Home"
                    iconFont="ionicons"
                    className="focusable"
                    iconName="md-home"
                    iconColor={Theme.color3}
                    style={styles.button}
                    onPress={() => {
                        Api.navigation.navigate('Home', {
                            onSuccess: () => {

                            }
                        });
                    }}
                />
                <Button
                    title="My Page"
                    iconFont="ionicons"
                    iconName="md-book"
                    className="focusable"
                    iconColor={Theme.color3}
                    style={styles.button}
                    onPress={() => {
                        Api.navigation.navigate('MyPage');
                    }}
                />
                <Button
                    title="My Modal"
                    iconFont="ionicons"
                    className="focusable"
                    iconName="ios-albums"
                    iconColor={Theme.color3}
                    style={styles.button}
                    onPress={() => {
                        Api.navigation.navigate('MyModal');
                    }}
                />
            </View>
        );
    }
}

export default Menu;
