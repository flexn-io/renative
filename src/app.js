import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Api from './api';
import packageJson from '../package.json';

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: 'red',
    },
    appContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textH2: {
        fontSize: 20,
        marginHorizontal: 20,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textH3: {
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
    button: {
        marginTop: 30,
        marginHorizontal: 20,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: '#62DBFB',
        height: 50,
        minWidth: 150,
        maxWidth: 200,
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
            <View style={[styles.app, styles.appContainer, { backgroundColor: this.state.bgColor }]}>
                <Image style={styles.image} source={require('../platformAssets/runtime/logo.png')} />
                <Text style={styles.textH2}>
Hello from React Native Vanilla!
                </Text>
                <Text style={styles.textH2}>
v
                    {packageJson.version}
                </Text>
                <Text style={styles.textH3}>
                    {`platform: ${Api.platform}`}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setState({ bgColor: this.state.bgColor === '#888888' ? '#222222' : '#888888' });
                    }}
                >
                    <Text style={styles.buttonText}>
Try Me!
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setState({ bgColor: this.state.bgColor === '#888888' ? '#222222' : '#888888' });
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
