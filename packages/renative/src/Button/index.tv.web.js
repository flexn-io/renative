/* eslint-disable react/prop-types */

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Link } from '@reach/router';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';

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
    to,
    title,
    iconFont,
    iconName,
    iconColor,
    iconSize,
    style,
    textStyle,
    testID,
    activeOpacity
}) => {
    const Btn = () => (
        <View
            style={[styles.button, style, focused ? { opacity: activeOpacity ?? 0.4 } : null]}
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
        </View>
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

export default withFocusable()(Button);
