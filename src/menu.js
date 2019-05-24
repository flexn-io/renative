import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Api, Button, Icon } from './renative';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#222222',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#AAAAAA',
    },
    text: {
        fontFamily: 'TimeBurner',
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
    },
    button: {
        alignSelf: 'stretch',
        marginHorizontal: 20,
        maxWidth: 400,
    },
});

class Menu extends React.Component {
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
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
