import React, { useEffect, useRef, useContext, useState } from 'react';
import { Text, Image, View, ScrollView, PixelRatio } from 'react-native';
import { Api } from '@rnv/renative';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { hasWebFocusableUI, ICON_LOGO, CONFIG, ROUTES, ThemeContext } from '../config';
import { testProps } from '../utils';
import packageJson from '../../package.json';
import Button from '../components/Button';
import { useNavigate } from '../hooks/navigation';
import { useOpenURL } from '../hooks/linking';


const FocusableView = hasWebFocusableUI ? withFocusable()(View) : View;

const ScreenHome = ({ navigation, setFocus }) => {
    const navigate = useNavigate(navigation);
    const openURL = useOpenURL();
    const [pixelRatio, setPixelRatio] = useState(1);
    const [fontScale, setFontScale] = useState(1)
    let scrollRef;
    let handleFocus;
    let handleUp;

    const { theme, toggle }: any = useContext(ThemeContext);

    useEffect(() => {
        setPixelRatio(PixelRatio.get())
        setFontScale(PixelRatio.getFontScale())
    }, []);

    if (hasWebFocusableUI) {
        scrollRef = useRef(null);
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
                <Image style={theme.styles.image} source={ICON_LOGO} {...testProps('template-starter-home-screen-renative-icon')} />
                <Text style={theme.styles.textH2} {...testProps('template-starter-home-screen-welcome-message')}>
                    {CONFIG.welcomeMessage}
                </Text>
                <Text style={theme.styles.textH2} {...testProps('template-starter-home-screen-version-number')}>v {packageJson.version}</Text>
                <Text style={theme.styles.textH3}>
                    {`platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
                </Text>
                <Text style={theme.styles.textH3}>
                    {
                        //@ts-ignore
                        `hermes: ${global.HermesInternal === undefined ? 'no' : 'yes'}`
                    }
                </Text>
                <Text style={theme.styles.textH3}>
                    {`pixelRatio: ${pixelRatio}, ${fontScale}`}
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
                    {...testProps('template-starter-try-my-button')}
                />
                <Button
                    style={theme.styles.button}
                    textStyle={theme.styles.buttonText}
                    title="Now Try Me!"
                    className="focusable"
                    onPress={() => { navigate(ROUTES.MY_PAGE); }}
                    onEnterPress={() => { navigate(ROUTES.MY_PAGE); }}
                    onBecameFocused={handleFocus}
                    {...testProps('template-starter-now-try-my-button')}
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
                        {...testProps('template-starter-github-button')}
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
                        {...testProps('template-starter-renative-button')}
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
                        {...testProps('template-starter-twitter-button')}
                    />

                </FocusableView>
            </ScrollView>
        </View>

    );
};

export default hasWebFocusableUI ? withFocusable()(ScreenHome) : ScreenHome;
