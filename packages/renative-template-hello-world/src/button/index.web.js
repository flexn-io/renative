import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon, getScaledValue, isFactorTv } from 'renative';
import { Link } from '@reach/router';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';

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
    focused, stealFocus, to, title, iconFont, iconName,
    iconColor, iconSize, style, textStyle, selectedStyle
}) => {
    const Btn = () => (
        <View
            style={[styles.button, style, focused ? { opacity: 0.4 } : null]}
        >
            { iconName ? (
                <Icon
                    iconFont={iconFont}
                    iconName={iconName}
                    iconColor={iconColor}
                    size={iconSize}
                    style={styles.icon}
                />
            ) : null}
            { title ? (
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
    return (<Btn />);
};

export default isFactorTv ? withFocusable()(Button) : Button;
