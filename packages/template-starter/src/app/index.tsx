import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, Image, View, PixelRatio, TouchableOpacity, StatusBar, ScrollView, findNodeHandle } from 'react-native';
import { Api, isFactorTv, isWebBased } from '@rnv/renative';
import { ICON_LOGO, CONFIG, ThemeProvider, ThemeContext, testProps } from '../config';
import packageJson from '../../package.json';

const App = () => (
    <ThemeProvider>
        <AppThemed />
    </ThemeProvider>
);

const AppThemed = () => {
    const buttonRef = useRef<TouchableOpacity>(null);
    const { theme, toggle, dark } = useContext(ThemeContext);
    const [pixelRatio, setPixelRatio] = useState(1);
    const [fontScale, setFontScale] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const onPressLong = () => {
        toggle();
        if (isWebBased && isFactorTv && buttonRef?.current) {
            sessionStorage.setItem('theme', String(!dark));
            window.location.reload();
        }
    };

    useEffect(() => {
        setPixelRatio(PixelRatio.get());
        setFontScale(PixelRatio.getFontScale());
        setIsClient(true);
        if (isWebBased && isFactorTv && buttonRef?.current) {
            const currentTheme = sessionStorage.getItem('theme');
            if (!currentTheme) {
                sessionStorage.setItem('theme', dark.toString());
            } else if (dark.toString() !== currentTheme) {
                toggle();
            }
            buttonRef?.current.focus();
        }
    }, []);

    return (
        <View style={theme.styles.wrapper}>
            <ScrollView style={theme.styles.scrollView} contentContainerStyle={theme.styles.container}>
                <StatusBar
                    backgroundColor={theme.styles.container.backgroundColor}
                    barStyle={dark ? 'light-content' : 'dark-content'}
                />
                <Image
                    style={theme.styles.image}
                    source={ICON_LOGO}
                    {...testProps('template-starter-home-screen-renative-image')}
                />
                <Text style={theme.styles.textH2} {...testProps('template-starter-home-screen-welcome-message-text')}>
                    {CONFIG.welcomeMessage}
                </Text>
                <Text style={theme.styles.textH2} {...testProps('template-starter-home-screen-version-number-text')}>
                    v {packageJson.version}
                </Text>
                {isClient ? (
                    <Text style={theme.styles.textH3}>
                        {`platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
                    </Text>
                ) : null}
                <Text style={theme.styles.textH3}>{`hermes: ${
                    typeof HermesInternal === 'object' && HermesInternal !== null ? 'yes' : 'no'
                }`}</Text>
                <Text style={theme.styles.textH3}>{`pixelRatio: ${pixelRatio}, ${fontScale}`}</Text>
                <TouchableOpacity
                    ref={buttonRef}
                    onPress={toggle}
                    onLongPress={() => onPressLong()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[theme.styles.button, isFocused && { ...theme.styles.focusedButton, outline: 'none' }]}
                    hasTVPreferredFocus
                    nextFocusUp={findNodeHandle(buttonRef.current) || undefined}
                    {...testProps('template-starter-home-screen-try-my-button')}
                >
                    <Text style={theme.styles.buttonText}>Try me!</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default App;
