import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import packageJson from '../package.json';

const styles = StyleSheet.create({
    app: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        marginHorizontal: 20,
        color: '#FFFFFF',
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
            <ScrollView style={[styles.app, { backgroundColor: this.state.bgColor }]}>
                <Image style={styles.image} source={require('../assets/images/logo.png')} />
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
            </ScrollView>
        );
    }
}

export default App;
