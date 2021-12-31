/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */

import React, { useEffect, useRef, useContext } from 'react';
import { Text, Image, View, ScrollView, PixelRatio } from 'react-native';
import { Api, Button, useNavigate, useOpenURL } from 'renative';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { hasWebFocusableUI, ICON_LOGO, CONFIG, ROUTES, ThemeContext } from '../config';
import packageJson from '../../package.json';

const FocusableView = hasWebFocusableUI ? withFocusable()(View) : View;

const ScreenHome = (props) => {
    const navigate = useNavigate(props);
    const openURL = useOpenURL();
    let scrollRef;
    let handleFocus;
    let handleUp;

    const { theme, toggle } = useContext(ThemeContext);

    if (hasWebFocusableUI) {
        scrollRef = useRef(null);
        const { setFocus } = props;
        handleFocus = ({ y }) => {
            scrollRef.current.scrollTo({ y });
        };
        handleUp = (direction) => {
            if (direction === 'up') scrollRef.current.scrollTo({ y: 0 });
        };
        useEffect(() => function cleanup() {
            setFocus('menu');
        }, []);
    }
    return (
        <View style={theme.styles.screen}>
            <ScrollView
                style={{ backgroundColor: theme.static.color1 }}
                ref={scrollRef}
                contentContainerStyle={theme.styles.container}
            >
                <Image style={theme.styles.image} source={ICON_LOGO} />
                <Text style={theme.styles.textH2}>
                    {CONFIG.welcomeMessage}
                </Text>
                <Text style={theme.styles.textH2}>v {packageJson.version}</Text>
                <Text style={theme.styles.textH3}>
                    {`platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
                </Text>
                <Text style={theme.styles.textH3}>
                    {`hermes: ${global.HermesInternal === undefined ? 'no' : 'yes'}`}
                </Text>
                <Text style={theme.styles.textH3}>
                    {`pixelRatio: ${PixelRatio.get()}, ${PixelRatio.getFontScale()}`}
                </Text>
                <Button
                    style={theme.styles.button}
                    textStyle={theme.styles.buttonText}
                    title="Try Me!"
                    className="focusable"
                    onPress={toggle}
                    onEnterPress={toggle}
                    onBecameFocused={handleFocus}
                    onArrowPress={handleUp}
                    testID="try-me-button"
                />
                <Button
                    style={theme.styles.button}
                    textStyle={theme.styles.buttonText}
                    title="Now Try Me!"
                    className="focusable"
                    onPress={() => {
                        navigate(ROUTES.MY_PAGE, '/[slug]', { replace: false });
                    }}
                    onEnterPress={() => {
                        navigate(ROUTES.MY_PAGE, '/[slug]', { replace: false });
                    }}
                    onBecameFocused={handleFocus}
                />
                <Text style={[theme.styles.textH3, { marginTop: 20 }]}>
                    Explore more
                </Text>
                <FocusableView style={{ marginTop: 10, flexDirection: 'row' }} onBecameFocused={handleFocus}>
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        focusKey="github"
                        iconName="github"
                        iconColor={theme.static.colorBrand}
                        iconSize={theme.static.buttonSize}
                        style={theme.styles.icon}
                        onPress={() => {
                            openURL('https://github.com/renative-org/renative');
                        }}
                    />
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        iconName="chrome"
                        focusKey="chrome"
                        iconColor={theme.static.colorBrand}
                        iconSize={theme.static.buttonSize}
                        style={theme.styles.icon}
                        onPress={() => {
                            openURL('https://renative.org');
                        }}
                    />
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        iconName="twitter"
                        focusKey="twitter"
                        iconColor={theme.static.colorBrand}
                        iconSize={theme.static.buttonSize}
                        style={theme.styles.icon}
                        onPress={() => {
                            openURL('https://twitter.com/renative');
                        }}
                    />

                </FocusableView>
            </ScrollView>
        </View>

    );
};

export default hasWebFocusableUI ? withFocusable()(ScreenHome) : ScreenHome;
