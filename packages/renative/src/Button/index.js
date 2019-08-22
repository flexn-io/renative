import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import Api from '../Api';
import Icon from '../Icon';

const hasFocus = Api.formFactor === 'tv' && Api.platform !== 'tvos';

const styles = StyleSheet.create({
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

const parallax = {
    enabled: true,
    shiftDistanceY: 2,
    shiftDistanceX: 2,
    tiltAngle: 0.05,
    pressMagnification: 1,
    magnification: 1.1,
};

class Button extends React.Component {
    constructor() {
        super();
        this.state = { currentStyle: this.blurState };
    }

    blurState = {
        borderColor: '#62DBFB',
    };

    focusState = {
        borderColor: '#CC0000',
    };

    render() {
        const { iconName, iconFont, iconColor, className, testID } = this.props;
        const hasIcon = iconName && iconFont;
        return (
            <TouchableOpacity
                testID={testID}
                tvParallaxProperties={parallax}
                className={className}
                style={[styles.button, this.props.style, this.state.currentStyle]}
                onPress={() => {
                    this.props.onPress();
                }}
                onFocus={() => {
                    if (hasFocus) this.setState({ currentStyle: this.focusState });
                }}
                onBlur={() => {
                    if (hasFocus) this.setState({ currentStyle: this.blurState });
                }}
            >
                {hasIcon ? (
                    <Icon iconFont={iconFont} iconName={iconName} iconColor={iconColor} style={{ width: 30, marginRight: 10 }} />
                ) : undefined}
                <Text style={styles.buttonText}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>
        );
    }
}

export default Button;
