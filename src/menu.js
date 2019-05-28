import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Api, Button, Icon } from './renative';
import { isTopMenuBased } from './nav';

let isTop;

const styles = StyleSheet.create({
    containerVertical: {
        paddingTop: 40,
        width: '100%',
        height: '100%',
        backgroundColor: '#222222',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#AAAAAA',
        flexDirection: 'column'
    },
    containerHorizontal: {
        paddingLeft: 40,
        width: '100%',
        height: '100%',
        backgroundColor: '#222222',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#AAAAAA',
        flexDirection: 'row'
    },
    text: {
        fontFamily: 'TimeBurner',
        color: '#FFFFFF',
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
    },
    button: {
        alignSelf: isTop ? 'flex-start' : 'stretch',
        marginHorizontal: 20,
        maxWidth: 400,
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
                    style={styles.button}
                    onPress={() => {
                        Api.navigation.navigate('MyPage');
                    }}
                />
                <Button
                    title="My Modal"
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
