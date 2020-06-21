import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Icon, getScaledValue } from 'renative';
import { Link } from '@reach/router';

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
    onPress,
    activeOpacity,
    testID
}) => {
    const Btn = () => (
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
                    style={styles.icon}
                />
            ) : null}
            {title ? (
                <Text style={textStyle}>
                    {title}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
    if (to) {
        return (
            <Link
                to={to}
                getProps={({ isCurrent }) => ({
                    style: {
                        color: isCurrent ? 'white' : 'transparent'
                    }
                })}
            >
                <Btn />
            </Link>
        );
    }
    return <Btn />;
};

export default Button;
