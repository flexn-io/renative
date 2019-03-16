import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Button from './button';

const styles = StyleSheet.create({
    container: {
        width: 200,
    },
});

class Menu extends React.Component {
    render() {
        return (
            <View style={styles.container}>
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
