import React, { useState } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, PixelRatio } from 'react-native';
import { Icon, Button, Api, getScaledValue, useNavigate, isWeb } from 'renative';
import Theme, { themeStyles } from './theme';
import config from '../platformAssets/renative.runtime.json';
import packageJson from '../package.json';
import icon from '../platformAssets/runtime/logo.png';

const styles = StyleSheet.create({
    appContainerScroll: {
        paddingTop: getScaledValue(50),
        height: isWeb() ? '90vh' : '100%'
    },
    image: {
        marginBottom: getScaledValue(30),
        width: getScaledValue(83),
        height: getScaledValue(97),
    },
    button: {
        minWidth: getScaledValue(150)
    }
});

const ScreenHome = (props) => {
    const [bgColor, setBgColor] = useState(Theme.color1);
    const navigate = useNavigate(props);
    return (
        <ScrollView
            style={[styles.appContainerScroll, { backgroundColor: bgColor }]}
            contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center'
            }}
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
                style={styles.button}
                title="Try Me!"
                className="focusable"
                onPress={() => {
                    setBgColor(bgColor === '#666666' ? Theme.color1 : '#666666');
                }}
            />
            <Button
                style={styles.button}
                title="Now Try Me!"
                className="focusable"
                onPress={() => {
                    navigate('my-page', { replace: false });
                }}
            />
            <View style={{ marginTop: 20, flexDirection: 'row' }}>
                <Icon iconFont="fontAwesome" className="focusable" iconName="github" iconColor={Theme.color3} size={Theme.iconSize} style={themeStyles.icon} />
                <Icon iconFont="fontAwesome" className="focusable" iconName="twitter" iconColor={Theme.color3} size={Theme.iconSize} style={themeStyles.icon} />
            </View>
        </ScrollView>
    );
};

export default ScreenHome;
