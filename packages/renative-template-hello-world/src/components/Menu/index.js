/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */

import React, { useEffect, useContext } from 'react';
import { View } from 'react-native';
import { initNavigation, withFocusable } from '@noriginmedia/react-spatial-navigation';
import { ThemeContext, hasWebFocusableUI, ROUTES } from '../../config';
import { testProps } from '../../utils/index.ts';
import Button from '../Button';
import Icon from '../Icon';
import { useNavigate, useOpenDrawer } from '../../hooks/navigation';

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
            {...testProps('template-hello-world-menu-drawer-icon')}
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
                {...testProps('template-hello-world-menu-home-button')}
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
                {...testProps('template-hello-world-menu-my-page-button')}
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
                {...testProps('template-hello-world-menu-my-modal-button')}
            />
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(Menu) : Menu);
