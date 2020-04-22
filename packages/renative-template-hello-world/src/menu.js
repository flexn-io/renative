import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Icon, Button, getScaledValue, useNavigate, useOpenDrawer, StyleSheet } from 'renative';
import { initNavigation, withFocusable } from '@noriginmedia/react-spatial-navigation';
import Theme, { themeStyles, hasHorizontalMenu, hasWebFocusableUI } from './theme';

if (hasWebFocusableUI) {
    initNavigation({
        debug: false,
        visualDebug: false,
        nativeMode: false
    });
}

export const DrawerButton = (props) => {
    const openDrawer = useOpenDrawer(props);
    return (
        <Icon
            iconFont="ionicons"
            iconName="md-menu"
            iconColor={Theme.color3}
            size={Theme.iconSize}
            style={themeStyles.icon}
            onPress={() => {
                openDrawer('Drawer');
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: getScaledValue(hasHorizontalMenu ? 20 : 40),
        paddingLeft: getScaledValue(hasHorizontalMenu ? 40 : 40),
        width: Theme.menuWidth,
        height: Theme.menuHeight,
        backgroundColor: Theme.color1,
        alignItems: 'flex-start',
        borderRightWidth: getScaledValue(hasHorizontalMenu ? 0 : 1),
        borderBottomWidth: getScaledValue(hasHorizontalMenu ? 1 : 0),
        borderColor: Theme.color5,
        flexDirection: hasHorizontalMenu ? 'row' : 'column'
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: hasHorizontalMenu ? getScaledValue(20) : 0,
        marginTop: hasHorizontalMenu ? 0 : getScaledValue(20),
        maxWidth: getScaledValue(400),
        minWidth: getScaledValue(50),
        borderWidth: 0
    },
    buttonText: {
        fontFamily: 'TimeBurner',
        color: '#62DBFB',
        fontSize: getScaledValue(20)
    }
});

const Menu = (props) => {
    const navigate = useNavigate(props);
    if (hasWebFocusableUI) {
        useEffect(() => {
            props.setFocus();
        }, []);
    }

    return (
        <View style={styles.container}>
            <Text style={themeStyles.text}>
Menu
            </Text>
            <Button
                to="/"
                title="Home"
                iconFont="ionicons"
                className="focusable"
                iconName="md-home"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate('home');
                }}
                onEnterPress={() => {
                    navigate('/');
                }}
            />
            <Button
                to="my-page"
                title="My Page"
                iconFont="ionicons"
                iconName="md-book"
                className="focusable"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate('my-page');
                }}
                onEnterPress={() => {
                    navigate('my-page');
                }}
            />
            <Button
                to="modal"
                title="My Modal"
                iconFont="ionicons"
                className="focusable"
                iconName="ios-albums"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate('modal');
                }}
                onEnterPress={() => {
                    navigate('modal');
                }}
            />
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(Menu) : Menu);
