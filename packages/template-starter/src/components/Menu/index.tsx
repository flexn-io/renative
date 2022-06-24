

import React, { useEffect, useContext } from 'react';
import { View } from 'react-native';
import { initNavigation, withFocusable } from '@noriginmedia/react-spatial-navigation';
import { ThemeContext, hasWebFocusableUI, ROUTES } from '../../config';
import { testProps } from '../../utils/index';
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

export const DrawerButton = ({ navigation }) => {
    const openDrawer = useOpenDrawer(navigation);
    const { theme }: any = useContext(ThemeContext);
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
            {...testProps('template-starter-menu-drawer-icon')}
        />
    );
};

const Menu = ({ setFocus, navigation }) => {
    const navigate = useNavigate(navigation);
    const { theme }: any = useContext(ThemeContext);

    if (hasWebFocusableUI) {
        useEffect(() => {
            setFocus();
        }, []);
    }

    return (
        <View style={theme.styles.menuContainer}>
            <Button
                onPress={() => { navigate(ROUTES.HOME); }}
                onEnterPress={() => { navigate(ROUTES.HOME); }}
                title="Home"
                iconFont="ionicons"
                className="focusable"
                iconName="md-home"
                iconColor={theme.static.colorBrand}
                iconSize={theme.static.iconSize}
                style={theme.styles.menuButton}
                textStyle={theme.styles.menuButtonText}
                {...testProps('template-starter-menu-home-button')}
            />
            <Button
                onPress={() => { navigate(ROUTES.MY_PAGE); }}
                onEnterPress={() => { navigate(ROUTES.MY_PAGE); }}
                title="My Page"
                iconFont="ionicons"
                iconName="md-rocket"
                className="focusable"
                iconColor={theme.static.colorBrand}
                iconSize={theme.static.iconSize}
                style={theme.styles.menuButton}
                textStyle={theme.styles.menuButtonText}
                {...testProps('template-starter-menu-my-page-button')}
            />
            <Button
                onPress={() => { navigate(ROUTES.MODAL); }}
                onEnterPress={() => { navigate(ROUTES.MODAL); }}
                title="My Modal"
                iconFont="ionicons"
                className="focusable"
                iconName="ios-albums"
                iconColor={theme.static.colorBrand}
                iconSize={theme.static.iconSize}
                style={theme.styles.menuButton}
                textStyle={theme.styles.menuButtonText}
                {...testProps('template-starter-menu-my-modal-button')}
            />
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(Menu) : Menu);
