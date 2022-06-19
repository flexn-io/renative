import React, { createContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    getScaledValue,
    isFactorDesktop, isFactorMobile, isFactorTv, isPlatformMacos, isWebBased
} from '@rnv/renative';
import CONFIG from '../platformAssets/renative.runtime.json';
import '../platformAssets/runtime/fontManager';
//@ts-ignore
import ICON_LOGO from '../platformAssets/runtime/logo.png';

export const hasMobileWebUI = isFactorMobile && isWebBased;
export const hasHorizontalMenu = !isFactorMobile && !isFactorDesktop && !hasMobileWebUI;
export const hasFullScreenMenu = hasMobileWebUI;
export const hasVerticalMenu = !hasHorizontalMenu && !hasFullScreenMenu;
export const hasWebFocusableUI = isWebBased && isFactorTv;
const isNativeMacos: boolean = (isPlatformMacos && !isWebBased) ? true : false;

console.disableYellowBox = true; // eslint-disable-line

if (!global.performance) {
    //@ts-ignore
    global.performance = {};
}

if (typeof global.performance.now !== 'function') {
    global.performance.now = function () {
        const performanceNow = global.nativePerformanceNow || Date.now;
        return performanceNow();
    };
}

const staticTheme = {
    primaryFontFamily: 'Inter-Light',
    iconSize: getScaledValue(20),
    buttonSize: getScaledValue(30),
    menuWidth: hasHorizontalMenu || hasFullScreenMenu ? '100%' : getScaledValue(280),
    menuHeight: hasHorizontalMenu ? getScaledValue(80) : '100%',
    colorLight: '#FFFFFF',
    colorBrand: '#0A74E6'
};

const staticThemes = {
    dark: {
        colorBgPrimary: '#000000',
        colorTextPrimary: '#FFFFFF',
        colorTextSecondary: '#AAAAAA',
        colorBorder: '#111111',
        statusBar: 'light-content',
        ...staticTheme
    },
    light: {
        colorBgPrimary: '#FFFFFF',
        colorTextPrimary: '#000000',
        colorTextSecondary: '#333333',
        colorBorder: '#EEEEEE',
        statusBar: 'dark-content',
        ...staticTheme
    }

};

const createStyleSheet = currentTheme => StyleSheet.create({
    app: {
        flexDirection: isFactorDesktop ? 'row' : 'column', top: isNativeMacos ? 35 : 0, right: 0, left: 0, bottom: 0, flex: 1
    },
    appContainer: {
        position: 'absolute',
        left: hasVerticalMenu ? getScaledValue(280) : 0,
        right: 0,
        top: hasHorizontalMenu ? getScaledValue(80) : 0,
        bottom: 0
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: getScaledValue(50),
        minHeight: getScaledValue(300),
        alignSelf: 'stretch',
        flex: 1,
        width: '100%'
    },
    modalContainer: isWebBased ? {
        position: 'absolute',
        backgroundColor: currentTheme.colorBgPrimary,
        zIndex: 100,
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%'
    } : {
        flex: 1,
        backgroundColor: currentTheme.colorBgPrimary
    },
    textH2: {
        fontFamily: currentTheme.primaryFontFamily,
        fontSize: getScaledValue(20),
        marginHorizontal: getScaledValue(20),
        color: currentTheme.colorTextPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    textH3: {
        fontFamily: currentTheme.primaryFontFamily,
        fontSize: getScaledValue(15),
        marginHorizontal: getScaledValue(20),
        marginTop: getScaledValue(5),
        color: currentTheme.colorTextSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    text: {
        fontFamily: currentTheme.primaryFontFamily,
        color: currentTheme.colorTextPrimary,
        fontSize: getScaledValue(20),
        marginTop: getScaledValue(10),
        textAlign: 'left',
    },
    icon: {
        width: getScaledValue(40),
        height: getScaledValue(40),
        margin: getScaledValue(10)
    },
    button: {
        marginHorizontal: getScaledValue(20),
        borderRadius: getScaledValue(10),
        height: getScaledValue(50),
        minWidth: getScaledValue(150),
        maxWidth: getScaledValue(200),
        marginTop: getScaledValue(20),
        backgroundColor: currentTheme.colorBrand

    },
    buttonText: {
        fontFamily: currentTheme.primaryFontFamily,
        color: currentTheme.colorLight,
        fontSize: getScaledValue(20),
    },
    screen: {
        backgroundColor: currentTheme.colorBgPrimary,
        flex: 1
    },
    screenModal: {
        flex: 1,
        backgroundColor: currentTheme.colorBgPrimary,
        top: hasHorizontalMenu && isWebBased ? -currentTheme.menuHeight : 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    headerTitleStyle: {
        backgroundColor: 'red'
    },
    headerTitle: {
        color: currentTheme.colorTextPrimary,
        fontFamily: currentTheme.primaryFontFamily,
        fontSize: getScaledValue(18)
    },
    header: {
        backgroundColor: currentTheme.colorBgPrimary,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colorBorder,
        height: getScaledValue(70)
    },
    modalHeader: {
        width: '100%',
        height: getScaledValue(80),
        alignItems: 'flex-end',
        paddingTop: getScaledValue(20)
    },
    image: {
        marginBottom: getScaledValue(30),
        width: getScaledValue(93),
        height: getScaledValue(90)
    },
    menuContainer: {
        paddingTop: getScaledValue(hasHorizontalMenu ? 20 : 40),
        paddingLeft: getScaledValue(hasHorizontalMenu ? 40 : 40),
        width: currentTheme.menuWidth,
        height: currentTheme.menuHeight,
        backgroundColor: currentTheme.colorBgPrimary,
        alignItems: 'flex-start',
        borderRightWidth: getScaledValue(hasHorizontalMenu ? 0 : 1),
        borderBottomWidth: getScaledValue(hasHorizontalMenu ? 1 : 0),
        borderColor: currentTheme.colorBorder,
        flexDirection: hasHorizontalMenu ? 'row' : 'column'
    },
    menuButton: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: hasHorizontalMenu ? getScaledValue(20) : 0,
        marginTop: hasHorizontalMenu ? getScaledValue(10) : getScaledValue(20),
        maxWidth: getScaledValue(400),
        minWidth: getScaledValue(50),
        borderWidth: 0
    },
    menuButtonText: {
        fontFamily: currentTheme.primaryFontFamily,
        color: currentTheme.colorTextPrimary,
        fontSize: getScaledValue(20)
    }
});


export const ROUTES = {
    HOME: isWebBased ? '/' : 'home',
    MY_PAGE: 'my-page',
    MODAL: 'modal'
};

const themes = {
    light: {
        static: { ...staticThemes.light },
        styles: createStyleSheet(staticThemes.light)
    },
    dark: {
        static: { ...staticThemes.dark },
        styles: createStyleSheet(staticThemes.dark)
    }
};


interface ThemeContextInterface {

}

export const ThemeContext = createContext<ThemeContextInterface | null>(
    themes.dark // default value
);

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false);

    const toggle = () => {
        const isDark = !dark;
        setDark(isDark);
    };

    const theme = dark ? themes.dark : themes.light;

    return (
        <ThemeContext.Provider value={{ theme, dark, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const themeStyles = themes.dark.styles;

export {
    CONFIG,
    ICON_LOGO
};

export default staticThemes.dark;
