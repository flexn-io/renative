import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textH2: {
        fontFamily: 'TimeBurner',
        fontSize: 20,
        marginHorizontal: 20,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

class ScreenMyPage extends React.Component {
    static path = 'mypage';

    static navigationOptions = {
        title: 'My Page',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textH2}>
This is my Page!
                </Text>
            </View>
        );
    }
}

export default ScreenMyPage;
