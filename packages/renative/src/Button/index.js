import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getScaledValue } from '../Api';
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
    stealFocus,
    to,
    title,
    iconFont,
    iconName,
    iconColor,
    iconSize,
    style,
    textStyle,
    selectedStyle,
    onPress
}) => (
    <TouchableOpacity
        style={[styles.button, style, focused ? { opacity: 0.4 } : null]}
        onPress={onPress}
    >
        {iconName ? (
            <Icon
                iconFont={iconFont}
                iconName={iconName}
                iconColor={iconColor}
                size={iconSize}
                style={[
                    styles.icon,
                    {
                        width: iconSize,
                        height: iconSize,
                        marginRight: title ? getScaledValue(20) : 0
                    }
                ]}
            />
        ) : null}
        {title ? <Text style={textStyle}>{title}</Text> : null}
    </TouchableOpacity>
);

export default Button;
