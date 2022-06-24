import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getScaledValue } from '@rnv/renative';

import Icon from '../Icon';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        opacity: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        marginRight: getScaledValue(20)
    }
});

const Button = ({
    focused,
    to,
    title,
    iconFont,
    iconName,
    iconColor,
    iconSize,
    style,
    textStyle,
    onPress,
    activeOpacity,
    testID
}: any) => (
    <TouchableOpacity
        style={[styles.button, style, focused ? { opacity: activeOpacity ?? 0.4 } : null]}
        onPress={onPress}
        testID={testID}
    >
        {iconName ? (
            <Icon
                iconFont={iconFont}
                iconName={iconName}
                iconColor={iconColor}
                size={iconSize}
                style={[styles.icon, {
                    marginRight: title ? getScaledValue(20) : 0
                }]}
            />
        ) : null}
        {title ? (
            <Text style={textStyle}>
                {title}
            </Text>
        ) : null}
    </TouchableOpacity>
);

export default Button;
