import { getScaledValue, isEngineWeb, isFactorMobile, isFactorDesktop, isFactorTv } from 'renative';
import { StyleSheet } from 'react-native';

const theme = {
    color1: '#222222',
    color2: '#62DBFB',
    color3: '#FB8D62',
    color4: '#FFFFFF',
    color5: '#AAAAAA',
    primaryFontFamily: 'TimeBurner',
    iconSize: getScaledValue(40),
    menuHeight: getScaledValue(80)
};

export const hasHorizontalMenu = !isFactorMobile && !isFactorDesktop;
export const hasWebFocusableUI = isEngineWeb && isFactorTv;

export const themeStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: getScaledValue(50),
        minHeight: getScaledValue(300),
        alignSelf: 'stretch',
        width: '100%'
    },
    textH2: {
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(20),
        marginHorizontal: getScaledValue(20),
        color: theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    textH3: {
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(15),
        marginHorizontal: getScaledValue(20),
        marginTop: getScaledValue(5),
        color: theme.color2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    text: {
        fontFamily: theme.primaryFontFamily,
        color: theme.color4,
        fontSize: getScaledValue(20),
        marginTop: getScaledValue(10),
        textAlign: 'left',
    },
    icon: {
        width: getScaledValue(40),
        height: getScaledValue(40),
        margin: getScaledValue(10),
    },
    button: {
        marginHorizontal: getScaledValue(20),
        borderWidth: getScaledValue(2),
        borderRadius: getScaledValue(25),
        borderColor: '#62DBFB',
        height: getScaledValue(50),
        minWidth: getScaledValue(150),
        maxWidth: getScaledValue(200),
        marginTop: getScaledValue(20)

    },
    buttonText: {
        fontFamily: 'TimeBurner',
        color: '#62DBFB',
        fontSize: getScaledValue(20),
    },
    screen: {
        position: 'absolute', backgroundColor: theme.color1, top: 0, left: 0, right: 0, bottom: 0
    },
    screenModal: {
        position: 'absolute', backgroundColor: theme.color1, top: -theme.menuHeight, left: 0, right: 0, bottom: 0
    }
});

export default theme;
