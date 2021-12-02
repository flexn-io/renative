/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */

import React, { useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Icon, Button, useNavigate, useOpenDrawer } from 'renative';
import { initNavigation, withFocusable } from '@noriginmedia/react-spatial-navigation';
import { ThemeContext, hasWebFocusableUI, ROUTES } from '../config';

if (hasWebFocusableUI) {
    initNavigation({
        debug: false,
        visualDebug: false,
        nativeMode: false
    });
}

export const DrawerButton = (props) => {
    const openDrawer = useOpenDrawer(props);
    const { theme } = useContext(ThemeContext);
    return (
        <Icon
            iconFont="ionicons"
            iconName="md-menu"
            iconColor={theme.static.colorTextPrimary}
            size={theme.static.buttonSize}
            style={theme.styles.menuIcon}
            onPress={() => {
                openDrawer('Drawer');
            }}
        />
    );
};

const Menu = (props) => {
    const { setFocus } = props;
    const navigate = useNavigate(props);
    const { theme } = useContext(ThemeContext);

    if (hasWebFocusableUI) {
        useEffect(() => {
            setFocus();
        }, []);
    }

    return (
        <View style={theme.styles.menuContainer}>
            <Button
                // to={ROUTES.HOME}
                title="Home"
                iconFont="ionicons"
                className="focusable"
                iconName="md-home"
                iconColor={theme.static.colorBrand}
                iconSize={theme.static.iconSize}
                style={theme.styles.menuButton}
                textStyle={theme.styles.menuButtonText}
                onPress={() => {
                    navigate(ROUTES.HOME, '/');
                }}
                onEnterPress={() => {
                    navigate(ROUTES.HOME, '/');
                }}
            />
            <Button
                title="My Page"
                iconFont="ionicons"
                iconName="md-rocket"
                className="focusable"
                iconColor={theme.static.colorBrand}
                iconSize={theme.static.iconSize}
                style={theme.styles.menuButton}
                textStyle={theme.styles.menuButtonText}
                onPress={() => {
                    navigate(ROUTES.MY_PAGE, '/[slug]');
                }}
                onEnterPress={() => {
                    navigate(ROUTES.MY_PAGE, '/[slug]');
                }}
            />
            <Button
                // to={ROUTES.MODAL}
                title="My Modal"
                iconFont="ionicons"
                className="focusable"
                iconName="ios-albums"
                iconColor={theme.static.colorBrand}
                iconSize={theme.static.iconSize}
                style={theme.styles.menuButton}
                textStyle={theme.styles.menuButtonText}
                onPress={() => {
                    navigate(ROUTES.MODAL, '/[slug]');
                }}
                onEnterPress={() => {
                    navigate(ROUTES.MODAL, '/[slug]');
                }}
            />
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(Menu) : Menu);
