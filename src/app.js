import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import packageJson from '../package.json';

const styles = StyleSheet.create({
    app: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginBottom: 50,
        width: 83,
        height: 97,
    },
    button: {
        marginTop: 50,
        borderWidth: 2,
        borderColor: '#62DBFB',
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#62DBFB',
        fontSize: 20,
    },
});

class App extends React.Component {
    constructor() {
        super();
        this.state = { bgColor: '#222222' };
    }

    render() {
        return (
            <View style={[styles.app, { backgroundColor: this.state.bgColor }]}>
                <Image style={styles.image} source={require('../platformAssets/runtime/logo.png')} />
                <Text style={styles.text}>
Hello from React Native Vanilla!
                </Text>
                <Text style={styles.text}>
v
                    {packageJson.version}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setState({ bgColor: '#888888' });
                    }}
                >
                    <Text style={styles.buttonText}>
Try Me!
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setState({ bgColor: '#222222' });
                    }}
                >
                    <Text style={styles.buttonText}>
Now Try Me!
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default App;
