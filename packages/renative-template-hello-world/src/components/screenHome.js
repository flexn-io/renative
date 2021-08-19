/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */

import React, { useState, useEffect, useRef } from 'react';
import { Text, Image, View, ScrollView, PixelRatio } from 'react-native';
import { Api, Button, useNavigate, useOpenURL } from 'renative';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import Theme, { themeStyles, hasWebFocusableUI, ICON_LOGO, CONFIG, ROUTES } from '../config';
import packageJson from '../../package.json';

const FocusableView = withFocusable()(View);

const ScreenHome = (props) => {
    const [bgColor, setBgColor] = useState(Theme.color1);
    const navigate = useNavigate(props);
    const openURL = useOpenURL();
    let scrollRef;
    let handleFocus;
    let handleUp;

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
        <View style={themeStyles.screen}>
            <ScrollView
                style={{ backgroundColor: bgColor }}
                ref={scrollRef}
                contentContainerStyle={themeStyles.container}
            >
                <Image style={themeStyles.image} source={ICON_LOGO} />
                <Text style={themeStyles.textH2}>
                    {CONFIG.welcomeMessage}
                </Text>
                <Text style={themeStyles.textH2}>v {packageJson.version}</Text>
                <Text style={themeStyles.textH3}>
                    {`platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
                </Text>
                <Text style={themeStyles.textH3}>
                    {`hermes: ${global.HermesInternal === undefined ? 'no' : 'yes'}`}
                </Text>
                <Text style={themeStyles.textH3}>
                    {`pixelRatio: ${PixelRatio.get()}, ${PixelRatio.getFontScale()}`}
                </Text>
                <Button
                    style={themeStyles.button}
                    textStyle={themeStyles.buttonText}
                    title="Try Me!"
                    className="focusable"
                    onPress={() => {
                        setBgColor(bgColor === '#666666' ? Theme.color1 : '#666666');
                    }}
                    onEnterPress={() => {
                        setBgColor(bgColor === '#666666' ? Theme.color1 : '#666666');
                    }}
                    onBecameFocused={handleFocus}
                    onArrowPress={handleUp}
                    testID="try-me-button"
                />
                <Button
                    style={themeStyles.button}
                    textStyle={themeStyles.buttonText}
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
                <FocusableView style={{ marginTop: 20, flexDirection: 'row' }} onBecameFocused={handleFocus}>
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        focusKey="github"
                        iconName="github"
                        iconColor={Theme.color3}
                        iconSize={Theme.iconSize}
                        style={themeStyles.icon}
                        onPress={() => {
                            openURL('https://github.com/pavjacko/renative');
                        }}
                    />
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        iconName="twitter"
                        focusKey="twitter"
                        iconColor={Theme.color3}
                        iconSize={Theme.iconSize}
                        style={themeStyles.icon}
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
