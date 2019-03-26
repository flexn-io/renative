import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Button from './button';

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
                    onPress={() => {
                        this.props.navigation.navigate('ScreenHome');
                    }}
                />
                <Button
                    title="MyPage"
                    onPress={() => {
                        this.props.navigation.navigate('ScreenMyPage');
                    }}
                />
            </View>
        );
    }
}

export default Menu;
