import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import config from '../platformAssets/config.json';
import packageJson from '../package.json';
import { Icon, Button, Api } from './renative';

const colors = {
    primary: '#FB8D62',
};

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textH2: {
        fontFamily: 'TimeBurner',
        fontSize: 20,
        marginHorizontal: 20,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textH3: {
        fontFamily: 'TimeBurner',
        fontSize: 15,
        marginHorizontal: 20,
        marginTop: 5,
        color: '#62DBFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginBottom: 30,
        width: 83,
        height: 97,
    },
    icon: {
        width: 40,
        height: 40,
        margin: 10,
    },
});

class ScreenHome extends React.Component {
    constructor() {
        super();
        this.state = { bgColor: '#222222' };
    }

    render() {
        const title = `Hello from ${config.common.title}!`;
        return (
            <View style={[styles.appContainer, { backgroundColor: this.state.bgColor }]}>
                <Image style={styles.image} source={require('../platformAssets/runtime/logo.png')} />
                <Text style={styles.textH2}>
                    {title}
                </Text>
                <Text style={styles.textH2}>
v
                    {packageJson.version}
                </Text>
                <Text style={styles.textH3}>
                    {`platform: ${Api.platform}`}
                </Text>
                <Button
                    title="Try Me!"
                    onPress={() => {
                        this.setState({ bgColor: this.state.bgColor === '#888888' ? '#222222' : '#888888' });
                    }}
                />
                <Button
                    title="Now Try Me!"
                    onPress={() => {
                        Api.navigation.navigate('MyPage2');
                    }}
                />
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                    <Icon iconFont="fontAwesome" iconName="github" iconColor={colors.primary} style={styles.icon} />
                    <Icon iconFont="fontAwesome" iconName="twitter" iconColor={colors.primary} style={styles.icon} />
                </View>
            </View>
        );
    }
}

export default ScreenHome;
