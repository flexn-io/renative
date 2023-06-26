import React, { createContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    getScaledValue,
    isPlatformMacos,
    isPlatformIos,
    isPlatformTvos,
    isPlatformWeb,
} from '@rnv/renative';
import CONFIG from '../platformAssets/renative.runtime.json';
import '../platformAssets/runtime/fontManager';
//@ts-ignore
import ICON_LOGO from '../platformAssets/runtime/logo.png';

import {
    
} from '@rnv/renative';

export function testProps(testId: string | undefined) {
    if (!testId) {
        return;
    }
    const isApplePlatform = isPlatformIos || isPlatformTvos || isPlatformMacos;
    if (isApplePlatform || isPlatformWeb) {
        return { testID: testId };
    }
    return { accessibilityLabel: testId, accessible: true };
}




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
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: getScaledValue(50),
        minHeight: getScaledValue(300),
        alignSelf: 'stretch',
        flex: 1,
        width: '100%'
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
    image: {
        marginBottom: getScaledValue(30),
        width: getScaledValue(93),
        height: getScaledValue(90)
    },
});


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
