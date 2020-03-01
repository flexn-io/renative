import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, PixelRatio } from 'react-native';
import { Icon, Api, getScaledValue, useNavigate, isEngineWeb } from 'renative';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import Theme, { themeStyles, hasWebFocusableUI } from './theme';
import config from '../platformAssets/renative.runtime.json';
import packageJson from '../package.json';
import icon from '../platformAssets/runtime/logo.png';
import Button from './button';

const styles = StyleSheet.create({
    appContainerScroll: {
        paddingTop: getScaledValue(50),
        flex: 1
    },
    image: {
        marginBottom: getScaledValue(30),
        width: getScaledValue(83),
        height: getScaledValue(97),
    }
});

const ScreenHome = (props) => {
    const [bgColor, setBgColor] = useState(Theme.color1);
    const navigate = useNavigate(props);
    if (hasWebFocusableUI) {
        useEffect(() => function cleanup() {
            props.setFocus('menu');
        }, []);
    }
    return (
        <View style={themeStyles.screen}>
            <ScrollView
                style={{ backgroundColor: bgColor }}
                contentContainerStyle={themeStyles.container}
            >
                <Image style={styles.image} source={icon} />
                <Text style={themeStyles.textH2}>
                    {config.welcomeMessage}
                </Text>
                <Text style={themeStyles.textH2}>
v
                    {packageJson.version}
                </Text>
                <Text style={themeStyles.textH3}>
                    {`platform: ${Api.platform}, factor: ${Api.formFactor}`}
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
                />
                <Button
                    style={themeStyles.button}
                    textStyle={themeStyles.buttonText}
                    title="Now Try Me!"
                    className="focusable"
                    onPress={() => {
                        navigate('my-page', { replace: false });
                    }}
                    onEnterPress={() => {
                        navigate('my-page', { replace: false });
                    }}
                />
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        iconName="github"
                        iconColor={Theme.color3}
                        iconSize={Theme.iconSize}
                        style={themeStyles.icon}
                    />
                    <Button
                        iconFont="fontAwesome"
                        className="focusable"
                        iconName="twitter"
                        iconColor={Theme.color3}
                        iconSize={Theme.iconSize}
                        style={themeStyles.icon}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default hasWebFocusableUI ? withFocusable()(ScreenHome) : ScreenHome;
