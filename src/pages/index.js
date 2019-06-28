import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, Button } from 'react-native';
import packageJson from '../../package.json';
import Theme from '../theme';
/**
 * This for server side rendering.
 */


class ScreenHome extends React.Component {
    constructor() {
        super();
        this.state = { bgColor: Theme.color1 };
    }

    static getInitialProps() {
        return {
            title: 'Hello Renative!',
            platform: 'platform: NEXT.js',
            image: require('/static/logo.png')
        };
    }

    render() {
        const selectedStyle = styles.appContainerView;
        const styleButton = styles.button;
        const { title, platform } = this.props;
        return (
            <View
                style={[selectedStyle, { backgroundColor: this.state.bgColor }]}
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <TouchableOpacity style={{ alignSelf: 'stretch', height: 1 }} />
                <Image style={styles.image} source={this.props.image} />
                <Text style={styles.textH2}>
                    {this.props.title}
                </Text>
                <Text style={styles.textH2}>
                        v
                    {packageJson.version}
                </Text>
                <Text style={styles.textH3}>
                    {this.props.platform}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ bgColor: this.state.bgColor === '#666666' ? Theme.color1 : '#666666' });
                    }}
                    style={styleButton}
                >
                    <Text style={styles.buttonText}>
                      Try Me!
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styleButton}>
                    <Text style={styles.buttonText}>
                    Now Try Me!
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    appContainerScroll: {
        flex: 1,
        paddingTop: 50
    },
    appContainerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    textH2: {
        fontFamily: 'TimeBurner',
        fontSize: 20,
        marginHorizontal: 20,
        color: Theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    textH3: {
        fontFamily: 'TimeBurner',
        fontSize: 15,
        marginHorizontal: 20,
        marginTop: 5,
        color: Theme.color2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    image: {
        marginBottom: 30,
        width: 83,
        height: 97,
    },
    buttonWear: {
        minWidth: 130
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
        flexDirection: 'row'
    },
    buttonText: {
        fontFamily: 'TimeBurner',
        color: '#62DBFB',
        fontSize: 20,
    },
});

const stylesObbj = {
    icon: {
        width: 40,
        height: 40,
        margin: 10,
    }
};

export default ScreenHome;
